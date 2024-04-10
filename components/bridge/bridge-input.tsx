"use client";

import { cn, formatNum } from "@/utils/number";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Switch,
  Typography,
} from "@mochi-ui/core";
import { Chain } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { formatUnits } from "viem";
import { FormFieldValues } from "./bridge-form";
import getChainIcon from "@/utils/getChainIcon";

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
}

export const BridgeFromInput = ({
  fromChainInfo,
  control,
  data,
  setValue,
}: BridgeInputProps) => {
  const formatted = formatUnits(data?.value ?? BigInt(0), data?.decimals ?? 0);

  const onMaxAmount = () => {
    setValue("fromAmount", formatNum(formatted).replaceAll(",", ""));
    setValue("toAmount", formatNum(formatted).replaceAll(",", ""));
  };

  return (
    <div className="rounded-xl bg-background-level2 p-3 space-y-3">
      <Controller
        name="fromAmount"
        control={control}
        rules={{
          required: "This field is required",
          max: "This field is required",
        }}
        render={({ field, fieldState }) => (
          <FormControl error={!!fieldState.error} hideHelperTextOnError>
            <div className="min-h-[34px]">
              <div className="text-sm text-text-tertiary">You bridge from </div>
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
}: BridgeInputProps) => {
  return (
    <div className="rounded-xl bg-background-level2 p-3 space-y-3">
      <Controller
        name="toAddress"
        control={control}
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

                <Controller
                  name="hasOther"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="items-center hidden md:flex">
                        {/* <Tooltip
                          content="Bridge to other wallet address"
                          className="max-w-xs text-center z-50"
                          arrow="top-center"
                        > */}
                        <div className="flex items-center space-x-2">
                          <label
                            htmlFor="switch-other-wallet"
                            className={cn({
                              "text-[13px] text-text-tertiary": field.value,
                              "text-[16px]": !field.value,
                            })}
                          >
                            Connected Wallet
                          </label>
                          <Switch
                            type="button"
                            size="sm"
                            id="switch-other-wallet"
                            className="mx-2"
                            checked={field.value}
                            name={field.name}
                            onClick={(e) => {
                              e.preventDefault();
                              setValue("hasOther", !field.value);
                              if (field.value) {
                                //@ts-ignore
                                setValue("toAddress", watchFields?.[1]);
                              }
                            }}
                          />
                          <label
                            htmlFor="switch-other-wallet"
                            className={cn({
                              "text-[13px] text-text-tertiary": !field.value,
                              "text-[16px]": field.value,
                            })}
                          >
                            Other Wallet
                          </label>
                        </div>
                        {/* </Tooltip> */}
                      </div>
                    </>
                  )}
                />
              </div>
            </div>

            <div className="rounded-lg bg-background-surface p-3 space-y-4">
              <div className="flex items-center ">
                <input
                  className="flex-1 min-w-0 outline-none placeholder:text-text-disabled [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-md text-text-black disabled:bg-white disabled:text-text-disabled"
                  autoComplete="off"
                  {...field}
                  placeholder="0x"
                  disabled={!watchFields?.[0]}
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
