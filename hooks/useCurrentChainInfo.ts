import {
  BASE_BRIDGE_CA,
  BASE_DFG_ADDRESS,
  BASE_DFG_DECIMALS,
  BASE_ENDPOINT_ID,
  ETH_BRIDGE_CA,
  ETH_DFG_ADDRESS,
  ETH_DFG_DECIMALS,
  ETH_ENDPOINT_ID,
  IS_MAINNET,
} from "@/envs";
import { useMemo } from "react";
import { base, baseSepolia, mainnet, sepolia } from "viem/chains";

function useCurrentChainInfo(currentChainId: number) {
  const isMainnet = Boolean(IS_MAINNET);

  const tokenDFG = useMemo(() => {
    if (isMainnet === false || isMainnet === undefined) {
      return currentChainId === baseSepolia.id
        ? BASE_DFG_ADDRESS
        : currentChainId === sepolia.id
        ? ETH_DFG_ADDRESS
        : "0x";
    } else {
      return currentChainId === base.id
        ? BASE_DFG_ADDRESS
        : currentChainId === mainnet.id
        ? ETH_DFG_ADDRESS
        : "0x";
    }
  }, [currentChainId, isMainnet]);

  const bridgeContractAddress = useMemo(() => {
    if (isMainnet === false || isMainnet === undefined) {
      return currentChainId === baseSepolia.id
        ? BASE_BRIDGE_CA
        : currentChainId === sepolia.id
        ? ETH_BRIDGE_CA
        : "0x";
    } else {
      return currentChainId === base.id
        ? BASE_BRIDGE_CA
        : currentChainId === mainnet.id
        ? ETH_BRIDGE_CA
        : "0x";
    }
  }, [currentChainId, isMainnet]);

  const decimalsConvertNumber = useMemo(() => {
    if (isMainnet === false || isMainnet === undefined) {
      return currentChainId === baseSepolia.id
        ? Number(BASE_DFG_DECIMALS)
        : Number(ETH_DFG_DECIMALS);
    } else {
      return currentChainId === base.id
        ? Number(BASE_DFG_DECIMALS)
        : Number(ETH_DFG_DECIMALS);
    }
  }, [currentChainId, isMainnet]);

  const defaultFromChain = useMemo(() => {
    if (isMainnet === false || isMainnet === undefined) {
      return currentChainId === sepolia.id
        ? sepolia.id
        : currentChainId === baseSepolia.id
        ? baseSepolia.id
        : sepolia.id;
    } else {
      return currentChainId === mainnet.id
        ? mainnet.id
        : currentChainId === base.id
        ? base.id
        : mainnet.id;
    }
  }, [currentChainId, isMainnet]);

  const defaultToChain = useMemo(() => {
    if (isMainnet === false || isMainnet === undefined) {
      return currentChainId === sepolia.id
        ? baseSepolia.id
        : currentChainId === baseSepolia.id
        ? sepolia.id
        : baseSepolia.id;
    } else {
      return currentChainId === mainnet.id
        ? base.id
        : currentChainId === base.id
        ? mainnet.id
        : base.id;
    }
  }, [currentChainId, isMainnet]);

  const dstEid = useMemo(() => {
    if (isMainnet === false || isMainnet === undefined) {
      return currentChainId === baseSepolia.id
        ? Number(ETH_ENDPOINT_ID)
        : currentChainId === sepolia.id
        ? Number(BASE_ENDPOINT_ID)
        : 0;
    } else {
      return currentChainId === base.id
        ? Number(ETH_ENDPOINT_ID)
        : currentChainId === mainnet.id
        ? Number(BASE_ENDPOINT_ID)
        : 0;
    }
  }, [currentChainId, isMainnet]);
  return {
    tokenDFG,
    bridgeContractAddress,
    decimalsConvertNumber,
    defaultFromChain,
    defaultToChain,
    dstEid,
  };
}

export default useCurrentChainInfo;
