import { useEffect, useMemo } from "react";
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
  const { data: allowance = BigInt(0), refetch } = useReadContract({
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
  const allowanceNumber = Number(allowance.toString());

  const isWithinAllowanceCap = allowanceNumber >= Number(value);
  const isApproved = useMemo(
    () => (allowance !== BigInt(0) && isWithinAllowanceCap) || isSuccess,
    [allowance, isSuccess, isWithinAllowanceCap]
  );

  const approve = async () => {
    await writeContractAsync({
      address: token,
      abi: erc20Abi,
      functionName: "approve",
      args: [bridgeContractAddress, value],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      refetch();
    }
  }, [isSuccess, refetch, reset]);

  return {
    approve,
    isApproved,
    confirmingApprove,
    isApproving,
  };
}
