import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import numeral from "numeral";
import { parseUnits } from "viem";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export const formatNum = (num: string, dec = 4) => {
  const number = (parseInt(num) * Math.pow(10, dec)) / 10 ** dec;
  const numStr = number.toString();
  const dotIdx = numStr.indexOf(".");

  if (dotIdx === -1) {
    return numeral(numStr).format("0,0");
  }

  const intPart = numeral(numStr.slice(0, dotIdx)).format("0,0");
  const decPart = numStr.slice(dotIdx + 1, numStr.length);

  return intPart + `${dotIdx === -1 ? "" : `.${decPart}`}`;
};

export const convertNumberToBigInt = (num: number = 0, dec: number = 18) => {
  try {
    return parseUnits(num?.toString(), dec);
  } catch (error) {
    console.error("Error when convert number to BigInt");
    return BigInt(0);
  }
};
