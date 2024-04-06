import BridgeForm from "@/components/Form";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="z-10 w-full items-center justify-end mx-auto text-sm flex min-h-12 p-2 bg-slate-300">
        <ConnectButton />
      </div>

      <div className="flex grow justify-center items-center max-w-96 mx-auto">
        <BridgeForm />
      </div>
    </main>
  );
}
