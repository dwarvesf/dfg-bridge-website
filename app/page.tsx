import BridgeForm from "@/components/bridge/bridge-form";
import { Typography } from "@mochi-ui/core";
import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-6xl py-16 px-4 mx-auto space-y-14">
      <div className="flex gap-8 flex-col-reverse lg:flex-row items-center lg:items-start">
        <div className="pt-12">
          <Image src="/DFG.png" color="#787e85" alt="" width={64} height={64} />{" "}
          <Typography
            level="h2"
            fontWeight="lg"
            className="flex-1 my-6 leading-relaxed md:text-5xl text-4xl"
          >
            Em Đi Qua Cầu Cây
          </Typography>
          <Typography
            level="h3"
            fontWeight="md"
            className="flex-1 mb-3 text-xl md:text-4xl"
          >
            Có chiếc cầu cây,
          </Typography>
          <Typography
            level="h3"
            fontWeight="md"
            className="flex-1 mb-3 text-xl md:text-4xl"
          >
            Bắc ngang qua suối
          </Typography>
          <Typography
            level="h3"
            fontWeight="md"
            className="flex-1 mb-3 text-xl md:text-4xl"
          >
            Cao thật cao, không tay vịn
          </Typography>
          <Typography
            level="h3"
            fontWeight="md"
            className="flex-1 mb-3 text-xl md:text-4xl"
          >
            Em đi qua chiếc cầu rung rinh
          </Typography>
          <Typography
            level="h3"
            fontWeight="md"
            className="flex-1 mb-3 text-xl md:text-4xl"
          >
            Dòng nước lung linh soi bóng em đi
          </Typography>
        </div>

        <BridgeForm />
      </div>
    </div>
  );
}
