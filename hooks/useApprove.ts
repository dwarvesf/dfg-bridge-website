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
    writeContract,
    isPending: confirmingApprove,
  } = useWriteContract();

  const { isLoading: isApproving, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  });

  const isWithinAllowanceCap = allowance >= value;
  const isApproved =
    (allowance !== BigInt(0) && isWithinAllowanceCap) || isSuccess;

  const approve = () =>
    writeContract({
      address: token,
      abi: erc20Abi,
      functionName: "approve",
      args: [bridgeContractAddress, value],
    });

  return {
    approve,
    isApproved,
    confirmingApprove,
    isApproving,
  };
}
