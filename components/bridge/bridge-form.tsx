"use client";

import { config } from "@/app/providers";
import { useApprove } from "@/hooks/useApprove";
import { useBridge } from "@/hooks/useBridge";
import useCurrentChainInfo from "@/hooks/useCurrentChainInfo";
import { convertNumberToBigInt } from "@/utils/number";
import { Button, IconButton } from "@mochi-ui/core";
import { ArrowUpDownLine, Spinner } from "@mochi-ui/icons";
import { ConnectKitButton } from "connectkit";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  useAccount,
  useAccountEffect,
  useBalance,
  useSwitchChain,
} from "wagmi";
import { getChainId } from "wagmi/actions";
import BridgeToast from "../toast";
import { BridgeFromInput, BridgeToInput } from "./bridge-input";

export type FormFieldValues = {
  fromChain: number;
  fromAddress: string;
  fromAmount: string;
  toChain: number;
  toAddress: string;
  toAmount: string;
  hasOther: boolean;
};

export default function BridgeForm() {
  const { address } = useAccount();

  const currentChainId = getChainId(config);

  const {
    tokenDFG,
    bridgeContractAddress,
    decimalsConvertNumber,
    defaultToChain,
  } = useCurrentChainInfo(currentChainId);

  const { data, refetch } = useBalance({
    token: tokenDFG as `0x${string}`,
    address,
  });

  const { chains, switchChain } = useSwitchChain();

  const {
    control,
    setValue,
    reset,
    getValues,
    watch,
    handleSubmit,
    register,
    formState: { isDirty, isValid },
  } = useForm<FormFieldValues>();

  const watchFields = watch([
    "hasOther",
    "fromAddress",
    "toAddress",
    "fromAmount",
  ]);

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
    defaultValues.toChain = defaultToChain;

    reset({ ...defaultValues });
  }, [address, currentChainId, defaultToChain, reset]);

  const { approve, isApproved, confirmingApprove, isApproving } = useApprove(
    tokenDFG,
    bridgeContractAddress,
    address,
    convertNumberToBigInt(Number(watchFields[3] ?? 0), 0)
  );
 
  const fromChainInfo = useMemo(
    () =>
      chains?.find((c) => {
        return c.id === getValues().fromChain;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chains, getValues().fromChain, getValues]
  );

  const toChainInfo = useMemo(
    () => chains?.find((c) => c.id === getValues().toChain),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chains, getValues().fromChain, getValues]
  );

  const bridgeAmount = convertNumberToBigInt(
    Number(watchFields[3] ?? 0),
    decimalsConvertNumber
  );

  const receiver = useMemo(
    () => (getValues().hasOther ? watchFields[2] : watchFields[1]),
    [getValues, watchFields]
  );

  const { bridge, isBridging, confirmingBridge, hash } = useBridge(
    bridgeContractAddress,
    receiver as `0x${string}`,
    bridgeAmount,
    isApproved,
    refetch
  );

  const loading =
    confirmingApprove || isApproving || isBridging || confirmingBridge;

  const onSubmit = async (data: any) => {
    console.log(JSON.stringify(data));
    try {
      if (!isApproved) {
        await approve();
      } else {
        await bridge();

        reset({
          ...getValues(),
          fromAmount: "",
          toAmount: "",
          hasOther: false,
        });
      }
    } catch (error) {
      console.log("error", (error as { shortMessage: string })?.shortMessage);

      new BridgeToast().danger(
        (error as { shortMessage: string })?.shortMessage ?? "Something error!"
      );
    }
  };

  useAccountEffect({
    onDisconnect() {
      setValue("fromAddress", "");
      setValue("toAddress", "");
    },
  });
  return (
    <div className="rounded-2xl relative bg-background-surface flex flex-col border border-[#23242614] p-6 w-full max-w-[530px] overflow-clip mx-auto shadow-xl">
      <form
        autoComplete="off"
        className="space-y-3 max-w-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <div className="pb-3 space-y-3">
            <BridgeFromInput
              {...{ control, fromChainInfo, data, setValue, register }}
            />

            <div className="w-full flex justify-center items-center my-3">
              <IconButton
                type="button"
                onClick={() => {
                  const toChain = chains?.filter(
                    (c) => c.id !== currentChainId
                  );
                  const chainId = toChain[0]?.id;

                  switchChain({ chainId });
                }}
                label="switch-chain"
                color="primary"
                size="sm"
                variant="soft"
                id="switch-other-chain"
                name="switch-other-chain"
              >
                <ArrowUpDownLine height={20} width={20} />
              </IconButton>
            </div>

            <BridgeToInput
              {...{
                control,
                toChainInfo,
                data,
                setValue,
                watchFields,
                register,
              }}
            />
          </div>

          <div id="connect-button" className="w-full flex justify-center">
            {!address ? (
              <ConnectKitButton />
            ) : isApproved ? (
              <div className="flex flex-col w-full">
                <Button
                  className="w-full"
                  size="lg"
                  type="submit"
                  disabled={!isValid}
                  loading={loading}
                  loadingIndicator={<Spinner height="24px" color="#36d7b7" />}
                >
                  Bridge
                </Button>

                {hash && (
                  <div className="mt-1 w-full flex items-end">
                    <p className="">Your latest tx:</p>
                    <a
                      href={`${fromChainInfo?.blockExplorers?.default?.url}/tx/${hash}`}
                      className="group rounded-lg border border-transparent transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {hash?.substring(0, 10)}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <Button
                className="w-full"
                size="lg"
                type="submit"
                disabled={!isValid}
                loading={loading}
                loadingIndicator={<Spinner height="24px" color="#36d7b7" />}
              >
                Approve
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
