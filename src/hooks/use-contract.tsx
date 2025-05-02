import {
  useReadContract,
  // useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { contractABI } from "@/ABI/migrationABI";

const TOKEN_ADDRESS = "0xEB039EF227Da932A1bA95B9C964300eEaa280131";

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

  const isReadingContracts = readingOwner || readingTime;
  const {
    data: writeContractResult,
    writeContract: writeContractFunc,
    error: writingError,
    isPending,
  } = useWriteContract();
  const {
    data: writeContractData,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash: writeContractResult,
  });

  const writeContract = ({
    args,
    functionName,
  }: {
    args?: unknown[];
    functionName: string;
  }) => {
    writeContractFunc({
      abi: contractABI,
      args,
      functionName,
      address: TOKEN_ADDRESS,
    });
  };

  return {
    owner,
    isReadingContracts,
    remainingTime,
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
