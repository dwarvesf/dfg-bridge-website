import BridgeForm from "@/components/bridge/bridge-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "🧊 $DFG",
  description:
    "The Dwarves Community Token, use $DFG to claim $USDC, exclusive merch & more benefits later on.",
  openGraph: {
    type: "website",
    url: "https://bridge.d.foundation",
    title: "🧊 $DFG",
    description:
      "The Dwarves Community Token, use $DFG to claim $USDC, exclusive merch & more benefits later on.",
    images: "https://bridge.d.foundation/banner.png",
  },
  twitter: {
    card: "summary",
    title: "🧊 $DFG",
    description:
      "The Dwarves Community Token, use $DFG to claim $USDC, exclusive merch & more benefits later on.",
    images: "https://bridge.d.foundation/banner.png",
  },
};

export default function Home() {
  return (
    <div className="flex justify-center items-center py-10 px-4 mx-auto max-w-6xl h-full">
      <div className="flex flex-col-reverse gap-8 items-center lg:flex-row lg:items-start">
        <BridgeForm />
      </div>
    </div>
  );
}
