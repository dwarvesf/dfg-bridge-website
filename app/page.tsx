import BridgeForm from "@/components/bridge/bridge-form";

export default function Home() {
  return (
    <div className="max-w-6xl py-10 px-4 mx-auto h-full flex justify-center items-center">
      <div className="flex gap-8 flex-col-reverse lg:flex-row items-center lg:items-start">
        <BridgeForm />
      </div>
    </div>
  );
}
