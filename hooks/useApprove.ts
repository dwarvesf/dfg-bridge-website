import BridgeToast from "@/components/toast";
import { useEffect } from "react";
import { erc20Abi, zeroAddress } from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export function useApprove(
  token: `0x${string}`,
  bridgeContractAddress: `0x${string}`,
  owner: `0x${string}` = zeroAddress,
  value: bigint
) {
  const { data: allowance = BigInt(0) } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, bridgeContractAddress],
  });

  const {
    data,
    writeContractAsync,
    isPending: confirmingApprove,
    reset,
  } = useWriteContract();

  const { isLoading: isApproving, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const isWithinAllowanceCap = allowance >= value;
  const isApproved =
    (allowance !== BigInt(0) && isWithinAllowanceCap) || isSuccess;

  const approve = async () => {
    new BridgeToast().warning("Approving ... please confirm on your wallet!");

    await writeContractAsync({
      address: token,
      abi: erc20Abi,
      functionName: "approve",
      args: [bridgeContractAddress, value],
    }).then(() => {
      new BridgeToast().success("Waiting for your tx finalized!");
    });
  };

  useEffect(() => {
    if (isSuccess) {
      new BridgeToast().success("Approval successful!");

      // reset();
    }
  }, [isSuccess, reset]);

  return {
    approve,
    isApproved,
    confirmingApprove,
    isApproving,
  };
}
