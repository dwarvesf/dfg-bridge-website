import { decodeErrorResult, zeroAddress } from "viem";
import {
  useAccount,
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  address as ethDfgBridgeContractAddress,
  abi as ethDfgBridgeAbi,
} from "../contract/abi/EthBridge.json";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { Options } from "@layerzerolabs/lz-v2-utilities";

export function useBridge(
  // token: `0x${string}`,
  bridgeContractAddress: `0x${string}`,
  // abi: `0x${string}`,
  owner: `0x${string}` = zeroAddress,
  value: bigint,
  isApproved: boolean
) {
  const { address } = useAccount();

  const gaslimit = 60000;
  const options = Options.newOptions()
    .addExecutorLzReceiveOption(gaslimit, 0)
    .toHex()
    .toString();

  // let nativeFee = 0;

  let { data: nativeFee } = useReadContract({
    address: "0xb14E0213fE1c21BA42f0B264e35edb58C9B1f151",
    abi: ethDfgBridgeAbi,
    functionName: "quote",
    args: [40245, address, value, "0", options, false],
  });
  console.log("nativeFee", nativeFee);

  // {    EthBridge = await ethers.getContractFactory("EthBridge");

  //   let nativeFee = 0;
  //   [nativeFee] = await ethBridge.quote(
  //     40245,
  //     address,
  //     value,
  //     "0",
  //     options,
  //     false
  //   );

  //   // bridge tokens from eth to base
  //   await ethBridge
  //     .connect(user)
  //     .bridgeToken(eidB, user.address, amount, assetId, options, {
  //       value: nativeFee.toString(),
  //     });
  // }

  const { error, ...rest } = useSimulateContract({
    address: "0xb14E0213fE1c21BA42f0B264e35edb58C9B1f151",
    abi: [
      {
        inputs: [
          { internalType: "uint32", name: "_dstEid", type: "uint32" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_amount", type: "uint256" },
          { internalType: "uint256", name: "_id", type: "uint256" },
          { internalType: "bytes", name: "_options", type: "bytes" },
        ],
        name: "bridgeToken",
        outputs: [
          {
            components: [
              { internalType: "bytes32", name: "guid", type: "bytes32" },
              { internalType: "uint64", name: "nonce", type: "uint64" },
              {
                components: [
                  {
                    internalType: "uint256",
                    name: "nativeFee",
                    type: "uint256",
                  },
                  {
                    internalType: "uint256",
                    name: "lzTokenFee",
                    type: "uint256",
                  },
                ],
                internalType: "struct MessagingFee",
                name: "fee",
                type: "tuple",
              },
            ],
            internalType: "struct MessagingReceipt",
            name: "receipt",
            type: "tuple",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "uint32", name: "_dstEid", type: "uint32" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_amount", type: "uint256" },
          { internalType: "uint256", name: "_id", type: "uint256" },
          { internalType: "bytes", name: "_options", type: "bytes" },
          { internalType: "bool", name: "_payInLzToken", type: "bool" },
        ],
        name: "quote",
        outputs: [
          {
            components: [
              { internalType: "uint256", name: "nativeFee", type: "uint256" },
              { internalType: "uint256", name: "lzTokenFee", type: "uint256" },
            ],
            internalType: "struct MessagingFee",
            name: "fee",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "bridgeToken",
    args: [40245, owner, value, BigInt(0), options as `0x${string}`],
    query: {
      enabled: BigInt(value) !== BigInt(0) && !!address,
    },
  });
  console.log("useSimulateContract error", error);
  console.log("useSimulateContract rest", rest);
  // base sepolia la` 40245
  // eth sepolia la 40161

  const {
    data,
    writeContractAsync,
    isPending: confirmingBridge,
  } = useWriteContract();

  const { isLoading: isBridging, isSuccess: isBridgeTxSuccess } =
    useWaitForTransactionReceipt({
      hash: data,
    });

  const bridge: () => void = useCallback(() => {
    if (isApproved) {
      // @ts-ignore
      writeContractAsync({
        address: ethDfgBridgeContractAddress as `0x${string}`,
        abi: ethDfgBridgeAbi,
        functionName: "bridgeToken",
        args: [
          40245, // eidA
          owner, // user.address
          value, // amountToWei
          "0", // assetId
          options, // bytes _options
        ],
      })
        .then((data: any) => data.wait())
        .then(async (data: any) => {
          console.log("data", data);
          toast.success("Success");
        })
        .catch(() => null);
      toast("bridging...");
    }
  }, [isApproved, options, owner, value, writeContractAsync]);

  return {
    bridge,
    isBridging,
    confirmingBridge,
    isBridgeTxSuccess,
  };
}
