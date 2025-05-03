import {
  useReadContract,
  // useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { contractABI } from "@/ABI/migrationABI";
import { toast } from "sonner";
import { useEffect } from "react";

const TOKEN_ADDRESS = "0x6d995a435df148eaf0cf735d5975c0ee22294e7a";

export const useMigrationContract = () => {
  const {
    data: owner,
    isPending: readingOwner,
    error,
  } = useReadContract({
    functionName: "owner",
    address: TOKEN_ADDRESS,
    abi: contractABI,
  });

  const {
    data: remainingTime,
    isPending: readingTime,
    error: remainingTimeError,
  } = useReadContract({
    functionName: "remainingTime",
    address: TOKEN_ADDRESS,
    abi: contractABI,
  });

  const {
    data: isPaused,
    isPending: readingIfPaused,
    error: isPausedError,
  } = useReadContract({
    functionName: "getPaused",
    address: TOKEN_ADDRESS,
    abi: contractABI,
  });

  const isReadingContracts = readingOwner || readingTime || readingIfPaused;
  const {
    data: writeContractResult,
    writeContractAsync: writeContractFunc,
    error: writingError,
    isPending,
  } = useWriteContract();
  const {
    data: writeContractData,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: writeContractResult,
    query: { enabled: !!writeContractResult },
  });

  const writeContract = ({
    args,
    functionName,
  }: {
    args?: unknown[];
    functionName: string;
  }) => {
    try {
      const tx = writeContractFunc({
        abi: contractABI,
        args,
        functionName,
        address: TOKEN_ADDRESS,
      });

      toast.promise(tx, {
        loading: "Transaction submitted...",
        success: "Transaction confirmed!",
        error: "Transaction failed.",
      });
    } catch (err: unknown) {
      toast.error(
        `Write failed: ${
          (err as { message: string })?.message || "Unknown error"
        }`
      );
      console.error(err);
    }
  };

  useEffect(() => {
    if (error) toast.error("Failed to fetch contract owner.");
  }, [error]);

  useEffect(() => {
    if (remainingTimeError) toast.error("Failed to fetch remaining time.");
  }, [remainingTimeError]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success("Transaction successfully confirmed!");
    } else if (writingError) {
      toast.error("Transaction failed.");
    }
  }, [isConfirmed, writingError]);

  return {
    owner,
    isReadingContracts,
    remainingTime,
    isPaused,
    isPausedError,
    remainingTimeError,
    error,
    isPending,
    writeContract,
    writeContractData,
    isConfirmed,
    isConfirming,
    writingError,
  };
};
