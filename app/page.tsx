import BridgeForm from "@/components/bridge/bridge-form";
import { Metadata } from "next";
import Image from "next/image";

const title = "DFG Bridge";
const description =
  "The Dwarves Foundation Gem bridge, allow for asset transfer between Ethereum and Base network.";
const url = "https://bridge.d.foundation";
const image = "https://bridge.d.foundation/DFG.png";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    url,
    title,
    description,
    images: image,
  },
  twitter: {
    card: "summary",
    title,
    description,
    images: image,
  },
};

export default function Home() {
  return (
    <div className="flex justify-center items-center py-10 px-4 mx-auto max-w-6xl h-full">
      <div className="flex relative flex-col-reverse gap-8 items-center lg:flex-row lg:items-start">
        <div className="relative z-10">
          <BridgeForm />
        </div>
        <Image
          className="absolute top-4 right-10 rotate-45 -translate-y-full"
          src="/gem.png"
          width={60}
          height={60}
          alt=""
        />
        <Image
          className="absolute bottom-0 right-full translate-x-20 translate-y-6 -rotate-[24deg]"
          src="/gem.png"
          width={200}
          height={200}
          alt=""
        />
      </div>
    </div>
  );
}
