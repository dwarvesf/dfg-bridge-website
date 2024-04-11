import { Base, Eth } from "@mochi-ui/icons";

export default function getChainIcon({ id }: { id: number }) {
  switch (id) {
    // TESTNET
    case 84532:
      return "Base";

    case 11155111:
      return (
        <div className="flex items-center text-sm">
          <Eth width={16} height={16} className="mr-2" />
        </div>
      );

    // MAINNET
    case 8453:
      return (
        <div className="flex items-center text-sm">
          <Base width={16} height={16} className="mr-2" />
        </div>
      );

    case 1:
      return (
        <div className="flex items-center text-sm">
          <Eth width={16} height={16} className="mr-2" />
        </div>
      );
    default:
      break;
  }
}
