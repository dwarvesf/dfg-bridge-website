import { Base, Eth } from "@mochi-ui/icons";

export default function getChainIcon({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  switch (id) {
    // TESTNET
    case 84532:
      return (
        <div className="flex items-center text-sm">
          <Base width={16} height={16} className="mr-2" />
          {name}
        </div>
      );

    case 11155111:
      return (
        <div className="flex items-center text-sm">
          <Eth width={16} height={16} className="mr-2" />
          {name}
        </div>
      );

    // MAINNET

    case 8453:
      return (
        <div className="flex items-center text-sm">
          <Base width={16} height={16} className="mr-2" />
          {name}
        </div>
      );

    case 1:
      return (
        <div className="flex items-center text-sm">
          <Eth width={16} height={16} className="mr-2" />
          {name}
        </div>
      );
    default:
      break;
  }
}
