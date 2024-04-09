"use client";

import { config } from "@/app/providers";
import { useApprove } from "@/hooks/useApprove";
import { useBridge } from "@/hooks/useBridge";
import { convertNumberToBigInt } from "@/utils/number";
import { Button, IconButton, Tooltip, Typography } from "@mochi-ui/core";
import { ArrowUpDownLine, Spinner } from "@mochi-ui/icons";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { formatUnits } from "viem";
import { baseSepolia, sepolia } from "viem/chains";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { getChainId } from "wagmi/actions";
import { isDirty } from "zod";
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

  const { data, refetch } = useBalance({
    token: tokenDFG as `0x${string}`,
    address,
  });

  const formatted = formatUnits(data?.value ?? BigInt(0), data?.decimals ?? 0);

  const { chains, switchChain } = useSwitchChain();

  const { control, setValue, reset, getValues, watch, handleSubmit } =
    useForm<FormFieldValues>();

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
    defaultValues.toChain = currentChainId === 11155111 ? 84532 : 11155111;

    reset({ ...defaultValues });
  }, [address, currentChainId, reset]);

  const { approve, isApproved, confirmingApprove, isApproving } = useApprove(
    tokenDFG,
    bridgeContractAddress,
    address,
    convertNumberToBigInt(Number(watchFields[3] ?? 0))
  );

  const fromChainInfo = chains?.find((c) => c.id === getValues().fromChain);
  const toChainInfo = chains?.find((c) => c.id === getValues().toChain);

  const bridgeAmount = convertNumberToBigInt(
    Number(watchFields[3] ?? 0),
    currentChainId === baseSepolia.id ? 18 : 0
  );

  const receiver = useMemo(
    () => (getValues().hasOther ? watchFields[2] : watchFields[1]),
    [getValues, watchFields]
  );

  const { bridge, isBridging, confirmingBridge, isBridgeTxSuccess, hash } =
    useBridge(
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

  return (
    <form
      autoComplete="off"
      className="space-y-6 max-w-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="rounded-2xl relative bg-background-surface flex flex-col border border-[#23242614] p-6 w-full max-w-[530px] overflow-clip mx-auto shadow-xl">
        <Typography level="h5" fontWeight="lg" className="text-center">
          Bridge DFG
        </Typography>

        <p className="text-xs text-text-tertiary text-center my-1">
          Bridge at anytime, bridge to anywhere
        </p>

        <div className="flex flex-col">
          <div className="py-3 space-y-3">
            <BridgeFromInput {...{ control, fromChainInfo, data, setValue }} />

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
                {/* <Tooltip
                  content="Switch chain"
                  className="max-w-xs text-center z-50"
                  arrow="top-center"
                > */}
                <ArrowUpDownLine height={20} width={20} />
                {/* </Tooltip> */}
              </IconButton>
            </div>

            <BridgeToInput
              {...{ control, toChainInfo, data, setValue, watchFields }}
            />
          </div>

          <div className="mt-4 w-full flex justify-center">
            {!address ? (
              <ConnectButton />
            ) : isApproved ? (
              <div className="flex flex-col w-full">
                <Button
                  className="w-full"
                  size="lg"
                  type="submit"
                  disabled={!isDirty}
                  loading={loading}
                  loadingIndicator={<Spinner height="24px" color="#36d7b7" />}
                >
                  Bridge
                </Button>

                {hash && (
                  <div className="mt-3 w-full flex items-end">
                    <p className="mr-2">Your latest tx:</p>
                    <a
                      href={`${fromChainInfo?.blockExplorers?.default?.url}/tx/${hash}`}
                      className="mt-4 group rounded-lg border border-transparent transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
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
                disabled={!isDirty}
                loading={loading}
                loadingIndicator={<Spinner height="24px" color="#36d7b7" />}
              >
                Approve
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
