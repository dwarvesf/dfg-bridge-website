
const BASE_BRIDGE_CA = process.env.NEXT_PUBLIC_BASE_BRIDGE_CA as `0x${string}`;
const BASE_DFG_ADDRESS = process.env.NEXT_PUBLIC_BASE_DFG_ADDRESS as `0x${string}`;
const BASE_DFG_DECIMALS = process.env.NEXT_PUBLIC_BASE_DFG_DECIMALS;
const BASE_ENDPOINT_ID = process.env.NEXT_PUBLIC_BASE_ENDPOINT_ID;

const ETH_BRIDGE_CA = process.env.NEXT_PUBLIC_ETH_BRIDGE_CA as `0x${string}`;
const ETH_DFG_ADDRESS = process.env.NEXT_PUBLIC_ETH_DFG_ADDRESS as `0x${string}`;
const ETH_DFG_DECIMALS = process.env.NEXT_PUBLIC_ETH_DFG_DECIMALS;
const ETH_ENDPOINT_ID = process.env.NEXT_PUBLIC_ETH_ENDPOINT_ID;

export {
  BASE_BRIDGE_CA,
  BASE_DFG_ADDRESS,
  BASE_DFG_DECIMALS,
  BASE_ENDPOINT_ID,
  ETH_BRIDGE_CA,
  ETH_DFG_ADDRESS,
  ETH_DFG_DECIMALS,
  ETH_ENDPOINT_ID,
};
