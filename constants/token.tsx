import Image from "next/image";

const supportedToken = [
  {
    symbol: "DFG",
    isActive: true,
    icon: (
      <Image
        src="/DFG.png"
        color="#787e85"
        alt=""
        width={16}
        height={16}
        className="mr-2"
      />
    ),
  },
  {
    symbol: "ICY",
    isActive: false,
    icon: (
      <Image
        src="/ICY.png"
        color="#787e85"
        alt=""
        width={16}
        height={16}
        className="mr-2"
      />
    ),
  },
];

export default supportedToken;
