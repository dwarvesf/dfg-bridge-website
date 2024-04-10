import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href={ROUTES.HOME}>
      <Image src="/DFG.png" color="#787e85" alt="" width={32} height={32} />{" "}
    </Link>
  );
};
