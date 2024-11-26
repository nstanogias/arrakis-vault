"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Address, TokenInfo } from "@/types";
import { useAccount } from "wagmi";
import { approveToken, getAllowance } from "@/contracts/erc20";
import { addLiquidity, ROUTER_ADDRESS } from "@/contracts/router";
import { formatTokenBalance } from "@/lib/utils";
import { parseUnits } from "viem";
import { useRouter } from "next/navigation";

interface LiquidityStepsModalProps {
  isOpen: boolean;
  token0Value: number;
  token1Value: number;
  token0Info: TokenInfo;
  token1Info: TokenInfo;
  vaultAddress: Address;
  onClose: () => void;
}

const LiquidityStepsModal = ({
  isOpen,
  token0Value,
  token1Value,
  token0Info,
  token1Info,
  vaultAddress,
  onClose,
}: LiquidityStepsModalProps) => {
  const account = useAccount();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [loadingStep, setLoadingStep] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);

  const steps = [
    {
      label: `Approve token ${token0Info.symbol}`,
      description:
        "A one-time approval to reduce future gas costs and improve security",
      action: async () => {
        const result = await approveToken(ROUTER_ADDRESS, {
          ...token0Info,
          balance: parseUnits(token0Value.toString(), token0Info.decimals),
        });
        if (result.status === "failure" || result.data?.status !== "success") {
          setShowErrorDialog(true);
        }
      },
    },
    {
      label: `Approve token ${token1Info.symbol}`,
      description:
        "A one-time approval to reduce future gas costs and improve security",
      action: async () => {
        const result = await approveToken(ROUTER_ADDRESS, {
          ...token1Info,
          balance: parseUnits(token1Value.toString(), token1Info.decimals),
        });
        if (result.status === "failure" || result.data?.status !== "success") {
          setShowErrorDialog(true);
        }
      },
    },
    {
      label: "Add liquidity",
      description: "Add liquidity to the pool",
      action: async () => {
        if (!account.address) return;
        const result = await addLiquidity(
          {
            ...token0Info,
            balance: parseUnits(token0Value.toString(), token0Info.decimals),
          },
          {
            ...token1Info,
            balance: parseUnits(token1Value.toString(), token1Info.decimals),
          },
          vaultAddress,
          account.address
        );
        if (result.status === "failure") {
          setShowErrorDialog(true);
        }
        setShowSuccessDialog(true);
        onClose();
        return result;
      },
    },
  ];

  // const mockAddLiquidity = async (): Promise<{
  //   status: string;
  //   data: string;
  // }> => {
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       console.log("Liquidity added successfully!");
  //       resolve({
  //         status: "success",
  //         data: "test",
  //       });
  //     }, 3000);
  //   });
  // };

  useEffect(() => {
    const fetchTokenAllowances = async () => {
      if (!account.isConnected || !account.address) return;

      try {
        const [token0Allowance, token1Allowance] = await Promise.all([
          getAllowance(account.address, ROUTER_ADDRESS, token0Info),
          getAllowance(account.address, ROUTER_ADDRESS, token1Info),
        ]);
        if (
          token0Allowance.status === "failure" ||
          token1Allowance.status === "failure"
        ) {
          console.error("Failed to fetch token allowances");
          return;
        }
        const tokenAllowances = [
          formatTokenBalance(
            token0Allowance.data ?? BigInt(0),
            token0Info.decimals
          ),
          formatTokenBalance(
            token1Allowance.data ?? BigInt(0),
            token1Info.decimals
          ),
        ];

        const updatedSteps = [false, false, false];
        let nextStep = 0;

        if (tokenAllowances[0] >= token0Value) {
          updatedSteps[0] = true;
          nextStep = 1;
        }
        if (tokenAllowances[1] >= token1Value) {
          updatedSteps[1] = true;
        }

        if (
          tokenAllowances[0] >= token0Value &&
          tokenAllowances[1] >= token1Value
        ) {
          updatedSteps[0] = true;
          updatedSteps[1] = true;
          nextStep = 2;
        }

        setCompletedSteps(updatedSteps);
        setCurrentStep(nextStep);
      } catch (error) {
        console.error("Error fetching allowances:", error);
      }
    };
    if (isOpen) {
      console.log("Checking allowances");
      fetchTokenAllowances();
    }
  }, [account, isOpen, token0Info, token1Info, token0Value, token1Value]);

  const handleStepExecution = async () => {
    setLoadingStep(currentStep);
    try {
      await steps[currentStep].action();
      const updatedSteps = [...completedSteps];
      updatedSteps[currentStep] = true;
      const firstIncompleteStep = updatedSteps.findIndex(
        (step) => step === false
      );
      if (firstIncompleteStep === -1) {
        onClose();
      }
      setCompletedSteps(updatedSteps);
      setCurrentStep(firstIncompleteStep);
    } catch (error) {
      console.error("Step execution failed:", error);
    } finally {
      setLoadingStep(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Add Liquidity
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-lg ${
                    currentStep === index ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full">
                    {completedSteps[index] ? (
                      <CheckCircle className="text-green-500" />
                    ) : loadingStep === index ? (
                      <Loader2 className="animate-spin text-orange-500" />
                    ) : (
                      <div className="w-4 h-4 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{step.label}</div>
                    <div className="text-sm text-gray-500">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleStepExecution}
              disabled={loadingStep !== null || currentStep >= steps.length}
              className={`w-full ${
                currentStep >= steps.length
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {currentStep >= steps.length
                ? "Liquidity Added"
                : steps[currentStep]?.label}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Liquidity Added Successfully!</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-center mt-4 space-y-4">
            <p>
              Your liquidity has been successfully added to the Arrakis vault.
            </p>
            <AlertDialogAction
              onClick={() => router.push("/")}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              OK
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Something went wrong</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-center mt-4 space-y-4">
            <p>Please try again.</p>
            <AlertDialogAction
              onClick={() => router.push("/")}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              OK
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LiquidityStepsModal;
