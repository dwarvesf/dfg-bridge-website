import { EthBridgeContract } from "@/services/contracts/abi/EthBridge";

import { parseEther, zeroAddress } from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { Options } from "@layerzerolabs/lz-v2-utilities";
import { useCallback, useEffect, useMemo, useState } from "react";

import { config } from "@/app/providers";
import BridgeToast from "@/components/toast";
import { baseSepolia, sepolia } from "viem/chains";
import { getChainId } from "wagmi/actions";

export function useBridge(
  bridgeContractAddress: `0x${string}`,
  receiver: `0x${string}` = zeroAddress,
  value: bigint,
  isApproved: boolean,
  refetch: () => void
) {
  const currentChainId = getChainId(config);
  const dstEid = useMemo(
    () =>
      currentChainId === baseSepolia.id
        ? 40161
        : currentChainId === sepolia.id
        ? 40245
        : 0,
    [currentChainId]
  );

  // base sepolia la` 40245
  // sepolia la 40161t
  const gaslimit = 60000;
  const options = Options.newOptions()
    .addExecutorLzReceiveOption(gaslimit, 0)
    .toHex()
    .toString();

  // base sepolia la` 40245
  // eth sepolia la 40161
  let { data: gasData } = useReadContract({
    address: bridgeContractAddress as `0x${string}`,
    abi: EthBridgeContract?.abi,
    functionName: "quote",
    args: [dstEid, receiver, value, BigInt(0), options, false],
  });

  const gas = (gasData as { nativeFee: bigint })?.nativeFee;
  const gasInEther = Number(gas) / Math.pow(10, 18);

  const {
    data: hash,
    writeContractAsync,
    isPending: confirmingBridge,
    reset,
  } = useWriteContract();

  const {
    isLoading: isBridging,
    isSuccess: isBridgeTxSuccess,
    status,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const bridge: () => void = useCallback(async () => {
    if (isApproved) {
      new BridgeToast().warning("Bridging ... please confirm on your wallet!");

      await writeContractAsync({
        address: bridgeContractAddress as `0x${string}`,
        abi: EthBridgeContract?.abi,
        functionName: "bridgeToken",
        args: [dstEid, receiver, value, BigInt(0), options],
        value: parseEther(gasInEther.toString()),
      }).then((data: any) => {
        new BridgeToast().success("Waiting for your tx finalized!");

        setTxHash(data);
      });
    }
  }, [
    bridgeContractAddress,
    dstEid,
    gasInEther,
    isApproved,
    options,
    receiver,
    value,
    writeContractAsync,
  ]);

  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (isBridgeTxSuccess) {
      new BridgeToast().success("Bridge successful!");

      refetch();
      reset();
    }
  }, [isBridgeTxSuccess, refetch, reset]);

  return {
    hash: txHash,
    bridge,
    isBridging,
    confirmingBridge,
    isBridgeTxSuccess,
  };
}
