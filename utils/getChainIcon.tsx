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
        <div className="flex">
          {name} <Base width={22} height={22} className="ml-2" />
        </div>
      );

    case 11155111:
      return (
        <div className="flex">
          {name} <Eth width={22} height={22} className="ml-2" />
        </div>
      );

    // MAINNET

    case 8453:
      return (
        <div className="flex">
          {name} <Base width={22} height={22} className="ml-2" />
        </div>
      );

    case 1:
      return (
        <div className="flex">
          {name} <Eth width={22} height={22} className="ml-2" />
        </div>
      );
    default:
      break;
  }
}
