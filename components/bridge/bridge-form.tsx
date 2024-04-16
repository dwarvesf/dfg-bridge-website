"use client";

import { config } from "@/app/providers";
import { useApprove } from "@/hooks/useApprove";
import { useBridge } from "@/hooks/useBridge";
import useCurrentChainInfo from "@/hooks/useCurrentChainInfo";
import { convertNumberToBigInt } from "@/utils/number";
import {
  Button,
  IconButton,
  Modal,
  ModalContent,
  ModalDescription,
  ModalOverlay,
  ModalPortal,
  ModalTitle,
  ModalTrigger,
  Stepper,
  Step,
  StepIndicator,
  StepContent,
  StepTitle,
  StepDescription,
  StepSeparator,
} from "@mochi-ui/core";
import { ArrowUpDownLine, Spinner } from "@mochi-ui/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAccount,
  useAccountEffect,
  useBalance,
  useChains,
  useSwitchChain,
} from "wagmi";
import { getChainId } from "wagmi/actions";
import BridgeToast from "../toast";
import { BridgeFromInput, BridgeToInput } from "./bridge-input";
import { useModal } from "connectkit";

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
  const { address, chain } = useAccount();
  const debounceRef = useRef<number>();
  const [isFlowStarted, setIsFlowStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const currentChainId = getChainId(config);
  const supportedChains = useChains();
  const { open: connectKitOpen, setOpen: setConnectKitOpen } = useModal();

  useEffect(() => {
    if (supportedChains.every((sc) => sc.id !== chain?.id) || !connectKitOpen)
      return;
    setConnectKitOpen(false);
  }, [chain?.id, connectKitOpen, setConnectKitOpen, supportedChains]);

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
    formState: { isValid },
  } = useForm<FormFieldValues>({
    defaultValues: {
      toAddress: "",
      fromAmount: "0",
    },
  });

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

  const { bridge, isBridging, confirmingBridge, hash, isBridgeTxSuccess } =
    useBridge(
      bridgeContractAddress,
      receiver as `0x${string}`,
      bridgeAmount,
      isApproved,
      refetch
    );

  const loading =
    confirmingApprove || isApproving || isBridging || confirmingBridge;

  const onSubmit = async () => {
    setError(null);
    setIsFlowStarted(true);
    setIsDone(false);
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
    } catch (error: any) {
      const msg = error.shortMessage || error.message || "Something went wrong";
      console.error("error", msg);

      BridgeToast.danger(msg);

      setError(msg);
    }
  };

  const currentStep = useMemo(() => {
    if (!isApproved) return 1;
    if (!isDone) return 2;
    return 3;
  }, [isApproved, isDone]);

  const step1Content = useMemo(() => {
    if (currentStep === 1 && error) return error;
    if (confirmingApprove) return "Please open your wallet and confirm";
    if (isApproving)
      return "Approve request sent, should be done anytime now...";

    if (currentStep > 1) return "Approved";

    return "Approve the contract to transfer asset on your behalf";
  }, [currentStep, error, confirmingApprove, isApproving]);

  const step2Content = useMemo(() => {
    if (currentStep === 2 && error) return error;
    if (confirmingBridge) return "Please open your wallet and confirm";
    if (isBridging)
      return (
        <>
          Tx:
          <a
            href={`${fromChainInfo?.blockExplorers?.default?.url}/tx/${hash}`}
            className="text-blue-500 underline rounded-lg"
            target="_blank"
          >
            {hash?.substring(0, 10)}
          </a>
          , finalizing...
        </>
      );

    if (currentStep > 2) return "Asset bridged, you can now close this dialog";

    return "Bridging will transfer your asset across chains";
  }, [
    currentStep,
    error,
    confirmingBridge,
    isBridging,
    fromChainInfo?.blockExplorers?.default?.url,
    hash,
  ]);

  useAccountEffect({
    onDisconnect() {
      setValue("fromAddress", "");
      setValue("toAddress", "");
    },
  });

  useEffect(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      if (!isFlowStarted || !isApproved) return;

      bridge()
        .catch((error) => {
          const msg =
            error.shortMessage || error.message || "Something went wrong";
          setError(msg);
        })
        .finally(() => {
          setIsFlowStarted(false);
        });
    }, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproved]);

  useEffect(() => {
    if (!isBridgeTxSuccess) return;
    setIsDone(true);
  }, [isBridgeTxSuccess]);

  return (
    <div className="rounded-2xl relative bg-background-surface flex flex-col border border-[#23242614] p-6 w-full max-w-[530px] overflow-hidden mx-auto shadow-xl">
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

            <div className="flex justify-center items-center my-3 w-full">
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

          <div id="connect-button" className="flex justify-center w-full">
            <Modal modal>
              <ModalTrigger asChild>
                <div className="flex flex-col w-full">
                  {isApproved ? (
                    <Button
                      className="w-full"
                      size="lg"
                      type="submit"
                      disabled={!isValid}
                      loading={loading}
                      loadingIndicator={
                        <Spinner height="24px" color="#36d7b7" />
                      }
                    >
                      Bridge
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      type="submit"
                      disabled={!isValid}
                      loading={loading}
                      loadingIndicator={
                        <Spinner height="24px" color="#36d7b7" />
                      }
                    >
                      Approve
                    </Button>
                  )}
                </div>
              </ModalTrigger>
              <ModalPortal>
                <ModalOverlay />
                <ModalContent showCloseBtn className="w-[500px]">
                  <ModalTitle>Bridge</ModalTitle>
                  <ModalDescription>With just 2 easy steps!</ModalDescription>
                  <Stepper
                    isError={!!error}
                    isLoading={loading}
                    className="mt-5"
                    currentStep={currentStep}
                  >
                    <Step>
                      <StepIndicator />
                      <StepContent>
                        <StepTitle>Increase the spending cap</StepTitle>
                        <StepDescription>{step1Content}</StepDescription>
                      </StepContent>
                      <StepSeparator />
                    </Step>
                    <Step>
                      <StepIndicator />
                      <StepContent>
                        <StepTitle>Bridge</StepTitle>
                        <StepDescription>{step2Content}</StepDescription>
                      </StepContent>
                    </Step>
                  </Stepper>
                  {error && (
                    <Button
                      type="button"
                      variant="soft"
                      color="primary"
                      className="mt-3 w-full"
                      onClick={onSubmit}
                    >
                      Retry
                    </Button>
                  )}
                </ModalContent>
              </ModalPortal>
            </Modal>
          </div>
        </div>
      </form>
    </div>
  );
}
