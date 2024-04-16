import { parseEther, zeroAddress } from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { Options } from "@layerzerolabs/lz-v2-utilities";
import { useCallback, useEffect, useState } from "react";

import { config } from "@/app/providers";
import { ethBridgeAbi } from "@/contracts/bridge/eth";
import { getChainId } from "wagmi/actions";
import useCurrentChainInfo from "./useCurrentChainInfo";

export function useBridge(
  bridgeContractAddress: `0x${string}`,
  receiver: `0x${string}` = zeroAddress,
  value: bigint,
  isApproved: boolean,
  refetch: () => void
) {
  const currentChainId = getChainId(config);
  const { dstEid } = useCurrentChainInfo(currentChainId);

  const gaslimit = 60000;
  const options = Options.newOptions()
    .addExecutorLzReceiveOption(gaslimit, 0)
    .toHex()
    .toString();

  let { data: gasData } = useReadContract({
    address: bridgeContractAddress as `0x${string}`,
    abi: ethBridgeAbi,
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

  const { isLoading: isBridging, isSuccess: isBridgeTxSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const bridge: () => Promise<void> = useCallback(async () => {
    if (isApproved) {
      await writeContractAsync({
        address: bridgeContractAddress as `0x${string}`,
        abi: ethBridgeAbi,
        functionName: "bridgeToken",
        args: [dstEid, receiver, value, BigInt(0), options],
        value: parseEther(gasInEther.toString()),
      }).then((data: any) => {
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
