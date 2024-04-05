import BridgeForm from "@/components/Form";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="z-10 max-w-7xl w-full items-center justify-end mx-auto text-sm lg:flex min-h-12 py-2">
        <ConnectButton />
      </div>

      <div className="flex grow justify-center items-center">
        <BridgeForm />
      </div>
    </main>
  );
}
