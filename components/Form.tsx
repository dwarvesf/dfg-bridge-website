"use client";

import { config } from "@/app/providers";
import { useApprove } from "@/hooks/useApprove";
import { cn, convertNumberToBigInt, formatNum } from "@/lib/utils";
import {
  Button,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Switch,
  TextFieldDecorator,
  TextFieldInput,
  TextFieldRoot,
  Typography,
} from "@mochi-ui/core";
import { ArrowUpDown, Bitcoin, DollarSign } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { formatUnits } from "viem";
import { baseSepolia, sepolia } from "viem/chains";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { getChainId } from "wagmi/actions";
import { ScaleLoader } from "react-spinners";
import { useBridge } from "@/hooks/useBridge";
import { isDirty } from "zod";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Contract, ContractFactory } from "ethers";

type FormFieldValues = {
  fromChain: number;
  fromAddress: string;
  fromAmount: string;
  toChain: number;
  toAddress: string;
  toAmount: string;
  hasOther: boolean;
};

export default function Form() {
  const { address } = useAccount();

  const currentChainId = getChainId(config);
  const tokenDFG = useMemo(
    () =>
      currentChainId === baseSepolia.id
        ? "0x78a3f816a8e26af8c09F6Da3995Ee19bd69bf7fF"
        : currentChainId === sepolia.id
        ? "0xf289e3b222dd42b185b7e335fa3c5bd6d132441d"
        : "0x",
    [currentChainId]
  );
  const bridgeContractAddress = useMemo(
    () =>
      currentChainId === baseSepolia.id
        ? "0x1b94f7f043547a897057E205dcf8EeaD6dA545d5"
        : currentChainId === sepolia.id
        ? "0xb14E0213fE1c21BA42f0B264e35edb58C9B1f151"
        : "0x",
    [currentChainId]
  );

  const { data } = useBalance({
    token: tokenDFG as `0x${string}`,
    address,
  });
  const formatted = formatUnits(data?.value ?? BigInt(0), data?.decimals ?? 0);

  const { chains, switchChain } = useSwitchChain();

  const {
    control,
    setValue,
    formState,
    reset,
    getValues,
    watch,
    handleSubmit,
  } = useForm<FormFieldValues>();

  const watchFields = watch(["hasOther", "fromAddress"]);

  useEffect(() => {
    let defaultValues = {
      fromChain: 0,
      fromAddress: address,
      fromAmount: "",
      toChain: 0,
      toAddress: address,
      toAmount: "",
      hasOther: false,
    };

    defaultValues.fromAddress = address;
    defaultValues.toAddress = address;
    defaultValues.fromChain = currentChainId;
    defaultValues.toChain = currentChainId === 11155111 ? 84532 : 11155111;

    reset({ ...defaultValues });
  }, [address, currentChainId, reset]);

  const { approve, isApproved, confirmingApprove, isApproving } = useApprove(
    tokenDFG,
    bridgeContractAddress,
    address,
    convertNumberToBigInt(getValues().fromAmount)
  );

  const fromChainInfo = chains?.find((c) => c.id === getValues().fromChain);
  const toChainInfo = chains?.find((c) => c.id === getValues().toChain);

  const { bridge, isBridging, confirmingBridge, isBridgeTxSuccess } = useBridge(
    bridgeContractAddress,
    address,
    convertNumberToBigInt(getValues().fromAmount),
    isApproved
  );

  const loading =
    confirmingApprove || isApproving || isBridging || confirmingBridge;

  const onSubmit = (data: any) => {
    console.log(JSON.stringify(data));
    !isApproved ? approve() : bridge();
  };

  return (
    <form className="space-y-6 max-w-lg" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <div className="grid gap-4 grid-cols-1">
          <div className="flex items-center justify-between">
            <Typography level="h5">Bridge</Typography>
            <Button
              type="button"
              variant="soft"
              color="secondary"
              onClick={() => {
                setValue(
                  "fromAmount",
                  formatNum(formatted).replaceAll(",", "")
                );
                setValue("toAmount", formatNum(formatted).replaceAll(",", ""));
              }}
            >
              Max ≈ {formatNum(formatted)} {data?.symbol}
            </Button>
          </div>

          <Controller
            name="fromAddress"
            control={control}
            rules={
              {
                // required: "This field is required",
              }
            }
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error} hideHelperTextOnError>
                <TextFieldRoot>
                  <TextFieldDecorator>
                    <p>From: </p>
                  </TextFieldDecorator>
                  <TextFieldInput disabled {...field} />
                </TextFieldRoot>
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />

          <Card>
            <Controller
              name="fromAmount"
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error} hideHelperTextOnError>
                  <FormLabel>
                    <div className="flex items-center">
                      <Bitcoin className="w-4 h-4" />
                      {fromChainInfo?.name}
                    </div>
                  </FormLabel>
                  <TextFieldRoot className="">
                    <TextFieldDecorator>
                      <div className="flex items-center">
                        (<DollarSign className="w-4 h-4" />
                        {field?.value
                          ? formatNum((parseInt(field?.value) * 1.5).toString())
                          : 0}
                        )
                      </div>
                    </TextFieldDecorator>
                    <TextFieldInput
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);

                        setValue("toAmount", e.target.value);
                      }}
                      placeholder="0"
                      className="text-right pl-11"
                    />
                    <TextFieldDecorator>
                      <div className="flex items-center">
                        {" "}
                        {/* <Image width={32} height={32} src="/icy.png" alt="" /> */}
                        {data?.symbol}
                      </div>
                    </TextFieldDecorator>
                  </TextFieldRoot>
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
          </Card>

          <div className="flex w-full justify-center items-center">
            <ArrowUpDown
              className="hover:bg-slate-300 w-6 h-6 rounded-lg bg-slate-50 cursor-pointer"
              onClick={() => {
                const toChain = chains?.filter((c) => c.id !== currentChainId);
                const chainId = toChain[0]?.id;

                switchChain({ chainId });
              }}
            />
          </div>

          <Card>
            <Controller
              name="hasOther"
              control={control}
              render={({ field }) => (
                <>
                  {" "}
                  <div className="flex items-center">
                    To:
                    <p
                      className={cn("mx-2", {
                        "font-semibold": !field.value,
                        "font-normal": field.value,
                      })}
                    >
                      Connected address
                    </p>
                    <div className="flex items-center mx-2">
                      <Switch
                        checked={field.value}
                        name={field.name}
                        onClick={() => {
                          setValue("hasOther", !field.value);
                          if (field.value) {
                            setValue("toAddress", watchFields[1]);
                          }
                        }}
                      />
                      <label
                        className={cn("mx-2", {
                          "font-semibold": field.value,
                          "font-normal": !field.value,
                        })}
                        htmlFor="switch"
                      >
                        Other address
                      </label>
                    </div>
                  </div>
                </>
              )}
            />
            <Controller
              name="toAddress"
              control={control}
              rules={
                {
                  // required: "This field is required",
                }
              }
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error} hideHelperTextOnError>
                  <TextFieldRoot className="">
                    <TextFieldInput
                      {...field}
                      placeholder="0x"
                      disabled={!watchFields[0]}
                    />
                  </TextFieldRoot>
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
          </Card>
          <Card>
            <Controller
              name="toAmount"
              control={control}
              rules={{
                required: "This field is required",
              }}
              render={({ field, fieldState }) => (
                <FormControl error={!!fieldState.error} hideHelperTextOnError>
                  <FormLabel>
                    <div className="flex items-center">
                      <Bitcoin className="w-4 h-4" />
                      {toChainInfo?.name}
                    </div>
                  </FormLabel>
                  <TextFieldRoot className="">
                    <TextFieldDecorator>
                      <div className="flex items-center">
                        (<DollarSign className="w-4 h-4" />
                        {field?.value
                          ? formatNum((parseInt(field?.value) * 1.5).toString())
                          : 0}
                        )
                      </div>
                    </TextFieldDecorator>
                    <TextFieldInput
                      disabled
                      {...field}
                      placeholder="0"
                      className="text-right pl-11"
                    />
                    <TextFieldDecorator>
                      <div className="flex items-center">{data?.symbol}</div>
                    </TextFieldDecorator>
                  </TextFieldRoot>
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            />
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <Typography>Fees: 123123 ETH</Typography>
        </div>

        <div className="w-full flex justify-center">
          {!address ? (
            <ConnectButton />
          ) : isApproved ? (
            <Button
              type="submit"
              disabled={!isDirty}
              loading={loading}
              loadingIndicator={<ScaleLoader height={9} color="#36d7b7" />}
            >
              Bridge
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isDirty}
              loading={loading}
              loadingIndicator={<ScaleLoader height={9} color="#36d7b7" />}
            >
              Approve
            </Button>
          )}
        </div>
      </Card>
    </form>
  );
}
