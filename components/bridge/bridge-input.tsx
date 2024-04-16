"use client";

import supportedToken from "@/constants/token";
import getChainIcon from "@/utils/getChainIcon";
import { formatNum } from "@/utils/number";
import {
  Button,
  FormControl,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@mochi-ui/core";
import Image from "next/image";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Chain, formatUnits, isAddress } from "viem";
import { useSwitchChain } from "wagmi";
import { FormFieldValues } from "./bridge-form";

type DataBalance = {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
};

interface BridgeInputProps {
  control: Control<FormFieldValues, any>;
  fromChainInfo?: Chain | undefined;
  toChainInfo?: Chain | undefined;
  data?: DataBalance | undefined;
  setValue: UseFormSetValue<FormFieldValues>;
  watchFields?: (string | boolean | undefined)[];
  register: UseFormRegister<FormFieldValues>;
}

export const BridgeFromInput = ({ fromChainInfo }: BridgeInputProps) => {
  const { chains, switchChain } = useSwitchChain();

  return (
    <div className="p-3 space-y-3 rounded-xl bg-background-level2">
      <div>
        <div className="text-sm text-text-tertiary">From</div>
      </div>
      <div className="p-3 space-y-4 rounded-lg bg-background-surface">
        <div className="flex justify-between items-center">
          <div className="w-2/5 md:w-3/5">
            <div className="ml-3 text-[12px] text-text-tertiary">Token</div>
            <div>
              <Select value={"DFG"}>
                <SelectTrigger
                  className="flex justify-between min-w-full"
                  appearance="form"
                  variant="ghost"
                >
                  <div className="flex items-center">
                    <div className="min-w-4">
                      <Image
                        src="/DFG.png"
                        color="#787e85"
                        alt=""
                        width={22}
                        height={22}
                      />
                    </div>

                    <div className="flex items-center ml-2 text-base">DFG</div>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {supportedToken?.map((token) => (
                    <SelectItem
                      key={token.symbol}
                      value={token.symbol}
                      leftIcon={token.icon}
                      disabled={!token.isActive}
                    >
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-3/5 md:w-2/5">
            <div className="ml-3 text-[12px] text-text-tertiary">Network</div>
            <div>
              <Select
                value={fromChainInfo?.name}
                onChange={(name) => {
                  const destChain = chains?.find((c) => c.name === name);

                  if (destChain?.id && fromChainInfo?.id !== destChain?.id) {
                    switchChain({ chainId: destChain?.id });
                  }
                }}
              >
                <SelectTrigger
                  className="flex justify-between min-w-full"
                  appearance="form"
                  variant="ghost"
                >
                  <div className="flex items-center">
                    <div className="">
                      {fromChainInfo && getChainIcon(fromChainInfo)}
                    </div>

                    <div className="flex items-center ml-2 text-base">
                      {fromChainInfo?.name}
                    </div>
                  </div>
                </SelectTrigger>

                <SelectContent>
                  {chains?.map((chain) => (
                    <SelectItem
                      key={chain.id}
                      value={chain.name}
                      leftIcon={getChainIcon(chain)}
                    >
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BridgeToInput = ({
  toChainInfo,
  control,
  data,
  setValue,
}: BridgeInputProps) => {
  const { chains, switchChain } = useSwitchChain();
  const formatted = formatUnits(data?.value ?? BigInt(0), data?.decimals ?? 0);

  const onMaxAmount = () => {
    setValue("fromAmount", formatNum(formatted).replaceAll(",", ""));
    setValue("toAmount", formatNum(formatted).replaceAll(",", ""));
  };
  return (
    <>
      {/* TO - SECTION */}
      <div className="p-3 space-y-3 rounded-xl bg-background-level2">
        <div>
          <div className="text-sm text-text-tertiary">To </div>
        </div>
        <div className="p-3 space-y-4 rounded-lg bg-background-surface">
          <div className="flex justify-between items-center">
            <div className="w-2/5 md:w-3/5">
              <div className="ml-3 text-[12px] text-text-tertiary">Token</div>
              <div>
                <Select value={"DFG"}>
                  <SelectTrigger
                    className="flex justify-between min-w-full"
                    appearance="form"
                    variant="ghost"
                  >
                    <div className="flex items-center">
                      <div className="min-w-4">
                        <Image
                          src="/DFG.png"
                          color="#787e85"
                          alt=""
                          width={22}
                          height={22}
                        />
                      </div>

                      <div className="flex items-center ml-2 text-base">
                        DFG
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {supportedToken?.map((token) => (
                      <SelectItem
                        key={token.symbol}
                        value={token.symbol}
                        leftIcon={token.icon}
                        disabled={!token.isActive}
                      >
                        {token.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-3/5 md:w-2/5">
              <div className="ml-3 text-[12px] text-text-tertiary">Network</div>
              <div>
                <Select
                  value={toChainInfo?.name}
                  onChange={() => {
                    toChainInfo &&
                      switchChain({
                        chainId: toChainInfo?.id,
                      });
                  }}
                >
                  <SelectTrigger
                    className="flex justify-between min-w-full"
                    appearance="form"
                    variant="ghost"
                  >
                    <div className="flex items-center">
                      <div className="">
                        {toChainInfo && getChainIcon(toChainInfo)}
                      </div>

                      <div className="flex items-center ml-2 text-base">
                        {toChainInfo?.name}
                      </div>
                    </div>
                  </SelectTrigger>

                  <SelectContent>
                    {chains?.map((chain) => (
                      <SelectItem
                        key={chain.id}
                        value={chain.name}
                        leftIcon={getChainIcon(chain)}
                      >
                        {chain.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        {/* TO - SECTION END*/}
        {/* TOTAL AMOUNT - SECTION  */}
        <Controller
          control={control}
          name="fromAmount"
          rules={{
            required: {
              value: true,
              message: "This field is required",
            },
            max: {
              value: formatNum(formatted).replaceAll(",", ""),
              message: `This should be lower than ${formatNum(
                formatted
              ).replaceAll(",", "")} ${data?.symbol}`,
            },
            min: {
              value: 1,
              message: "This should be greater than 0",
            },
          }}
          render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} hideHelperTextOnError>
              <div>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-text-tertiary">Total Amount</div>
                  <div className="text-sm text-text-tertiary">
                    Balance:{" "}
                    <button type="button" onClick={() => onMaxAmount()}>
                      {formatNum(formatted)} DFG
                    </button>
                  </div>
                </div>
                <div className="p-3 mt-2 space-y-4 rounded-lg bg-background-surface">
                  <div className="flex items-center">
                    <input
                      className="flex-1 min-w-0 outline-none placeholder:text-text-disabled text-[16px] md:text-[32px] font-semibold text-text-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-white leading-relaxed"
                      placeholder="0"
                      autoComplete="off"
                      {...field}
                      onKeyDown={(e) => {
                        if (
                          e.key === "e" ||
                          e.key === "-" ||
                          e.key === "." ||
                          e.key === ","
                        ) {
                          e.preventDefault();
                        }
                      }}
                      type="number"
                    />
                    <Button
                      cursor="none"
                      variant="outline"
                      size="sm"
                      type="button"
                      className="bg-primary-soft pl-2 pr-2 text-text-primary !h-9 !rounded-lg cursor-default"
                    >
                      <Image src="/DFG.png" alt="" width={22} height={22} /> DFG
                    </Button>
                  </div>
                </div>
              </div>
            </FormControl>
          )}
        />
        {/* TOTAL AMOUNT - SECTION END*/}
        {/* TO ADDRESS - SECTION */}
        <Controller
          control={control}
          name="toAddress"
          rules={{
            required: {
              value: true,
              message: "This field is required",
            },
            validate: (value) => isAddress(value) || "Invalid address format",
          }}
          render={({ field, fieldState }) => (
            <div>
              <FormControl error={!!fieldState.error} hideHelperTextOnError>
                <div>
                  <div className="text-sm text-text-tertiary">To address </div>
                </div>

                <div className="p-3 space-y-4 rounded-lg bg-background-surface">
                  <div className="flex items-center">
                    <input
                      className="flex-1 min-w-80 outline-none placeholder:text-text-disabled [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-md text-text-black disabled:bg-white disabled:text-text-disabled text-[14px]"
                      autoComplete="off"
                      {...field}
                      placeholder="0x9ca..."
                    />
                  </div>
                </div>
              </FormControl>
            </div>
          )}
        />
        {/* TO ADDRESS - SECTION END*/}
      </div>
    </>
  );
};
