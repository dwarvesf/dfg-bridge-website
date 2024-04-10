import BridgeForm from "@/components/bridge/bridge-form";
import { Typography } from "@mochi-ui/core";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-6xl py-16 px-4 mx-auto space-y-14">
      <div className="flex gap-8 flex-col-reverse lg:flex-row items-center lg:items-start">
        <div className="pt-12">
          <Image src="/DFG.png" color="#787e85" alt="" width={64} height={64} />{" "}
          <p className="flex-1 my-6 leading-loose md:text-5xl text-4xl font-semibold text-left">
            Bridge DFG from ETH to Base to stake DFG{" "}
          </p>
        </div>

        <BridgeForm />
      </div>
    </div>
  );
}
