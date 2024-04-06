import { parseEther, zeroAddress } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { abi as ethDfgBridgeAbi } from "../contract/abi/EthBridge.json";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Options } from "@layerzerolabs/lz-v2-utilities";

import { config } from "@/app/providers";
import { getChainId } from "wagmi/actions";
import { baseSepolia, sepolia } from "viem/chains";

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
  // sepolia la 40161

  const gaslimit = 60000;
  const options = Options.newOptions()
    .addExecutorLzReceiveOption(gaslimit, 0)
    .toHex()
    .toString();

  // base sepolia la` 40245
  // eth sepolia la 40161
  let { data: gasData } = useReadContract({
    address: bridgeContractAddress as `0x${string}`,
    abi: ethDfgBridgeAbi,
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
      toast("Bridging...please confirm on your wallet!");

      await writeContractAsync({
        address: bridgeContractAddress as `0x${string}`,
        abi: ethDfgBridgeAbi,
        functionName: "bridgeToken",
        args: [dstEid, receiver, value, BigInt(0), options],
        value: parseEther(gasInEther.toString()),
      }).then((data: any) => {
        toast.success("Waiting for your tx finalized!");

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
      toast.success("Bridge successful!");
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
