"use client";

import getChainIcon from "@/utils/getChainIcon";
import { formatNum } from "@/utils/number";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Typography,
} from "@mochi-ui/core";
import { Chain } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { formatUnits, isAddress } from "viem";
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
  register?: UseFormRegister<FormFieldValues>;
}

export const BridgeFromInput = ({
  fromChainInfo,
  control,
  data,
  setValue,
  register,
}: BridgeInputProps) => {
  const formatted = formatUnits(data?.value ?? BigInt(0), data?.decimals ?? 0);

  const onMaxAmount = () => {
    setValue("fromAmount", formatNum(formatted).replaceAll(",", ""));
    setValue("toAmount", formatNum(formatted).replaceAll(",", ""));
  };

  return (
    <div className="rounded-xl bg-background-level2 p-3 space-y-3">
      <Controller
        control={control}
        rules={{
          required: "This field is required",
          max: 10 || "This field is required",
        }}
        {...register("fromAmount", {
          required: {
            value: true,
            message: "This field is required",
          },
          max: {
            value: 100,
            message: `This should be lower than 10`,
          },
          min: {
            value: 10,
            message: "This should be greater than 0",
          },
        })}
        render={({ field, fieldState }) => (
          <FormControl error={!!fieldState.error} hideHelperTextOnError>
            <div className="min-h-[34px]">
              <div className="text-sm text-text-tertiary">From </div>
              <div className="flex justify-between items-center w-full">
                {fromChainInfo?.name && (
                  <Typography level="h7" color="primary">
                    <div className="flex">{getChainIcon(fromChainInfo)}</div>
                  </Typography>
                )}
              </div>
            </div>
            <div className="rounded-lg bg-background-surface p-3 space-y-4">
              <div className="flex items-center">
                <input
                  type="number"
                  className="flex-1 min-w-0 outline-none placeholder:text-text-disabled leading-[34px] text-[12px] md:text-[32px] font-semibold text-text-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                  autoComplete="off"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);

                    setValue("toAmount", e.target.value);
                  }}
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
                />
                <Button
                  cursor="none"
                  variant="outline"
                  size="sm"
                  type="button"
                  className="bg-primary-soft pl-2 pr-2 text-text-primary !h-9 !rounded-lg cursor-default"
                >
                  <Image src="/DFG.png" alt="" width={22} height={22} />{" "}
                  {data?.symbol}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Typography className="!text-[13px] text-text-tertiary">
                  ≈ $
                  {field?.value
                    ? (parseFloat(field?.value) * 1.5).toFixed(2)
                    : 0}
                </Typography>
                <Typography className="!text-[13px] text-text-tertiary">
                  Balance:{" "}
                  <button type="button" onClick={() => onMaxAmount()}>
                    {formatNum(formatted)} {data?.symbol}
                  </button>
                </Typography>
              </div>
            </div>
            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
          </FormControl>
        )}
      />
    </div>
  );
};

export const BridgeToInput = ({
  toChainInfo,
  control,
  data,
  setValue,
  watchFields,
  register,
}: BridgeInputProps) => {
  return (
    <div className="rounded-xl bg-background-level2 p-3 space-y-3">
      <Controller
        control={control}
        {...register("toAddress", {
          required: {
            value: true,
            message: "This field is required",
          },
          validate: (value) => isAddress(value) || "Invalid address format",
        })}
        render={({ field, fieldState }) => (
          <FormControl error={!!fieldState.error} hideHelperTextOnError>
            <div className="min-h-[34px]">
              <div className="text-sm text-text-tertiary">To </div>
              <div className="flex justify-between items-center w-full">
                {toChainInfo?.name && (
                  <Typography level="h7" color="primary">
                    <div className="flex">{getChainIcon(toChainInfo)}</div>
                  </Typography>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-background-surface p-3 space-y-4">
              <div className="flex items-center ">
                <input
                  className="flex-1 min-w-0 outline-none placeholder:text-text-disabled [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-md text-text-black disabled:bg-white disabled:text-text-disabled text-[15px]"
                  autoComplete="off"
                  {...field}
                  placeholder="0x9ca..."
                />
              </div>
            </div>
            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
          </FormControl>
        )}
      />
      <Controller
        name="toAmount"
        control={control}
        render={({ field, fieldState }) => (
          <FormControl error={!!fieldState.error} hideHelperTextOnError>
            <div className="rounded-lg bg-background-surface p-3 space-y-4">
              <div className="flex items-center">
                <input
                  className="flex-1 min-w-0 outline-none placeholder:text-text-disabled leading-[34px] text-[12px] md:text-[32px] font-semibold text-text-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:bg-white"
                  placeholder="0"
                  autoComplete="off"
                  disabled
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
                />
                <Button
                  cursor="none"
                  variant="outline"
                  size="sm"
                  type="button"
                  className="bg-primary-soft pl-2 pr-2 text-text-primary !h-9 !rounded-lg cursor-default"
                >
                  <Image src="/DFG.png" alt="" width={22} height={22} />{" "}
                  {data?.symbol}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Typography className="!text-[13px] text-text-tertiary">
                  ≈ ${" "}
                  {field?.value
                    ? (parseFloat(field?.value) * 1.5).toFixed(2)
                    : 0}
                </Typography>
                {/* <Typography className="!text-[13px] text-text-tertiary">
                    Balance:{" "}
                    <button onClick={onMaxAmount}>
                      {utils.formatTokenDigit({
                        value: 123,
                        shorten: false,
                        fractionDigits: 2,
                      })}{" "}
                      DFG
                    </button>
                  </Typography> */}
              </div>
            </div>
            <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
          </FormControl>
        )}
      />
    </div>
  );
};
