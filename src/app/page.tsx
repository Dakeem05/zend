"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Loader } from "lucide-react";
import { useMigrationContract } from "@/hooks/use-contract";
import { toast } from "sonner";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [fundAmount, setFundAmount] = useState<number | undefined>();
  const [extendDays, setExtendDays] = useState<number | undefined>();
  const [newAdminWallet, setNewAdminWallet] = useState<string | undefined>();
  const [tab, setTab] = useState("migrate");

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
  };
  // const handleAdminToggle = () => {
  //   setIsAdmin((prev) => !prev);
  // };

  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();
  const {
    owner,
    isReadingContracts,
    isPending,
    remainingTime,
    remainingTimeError,
    writeContract,
    isPaused,
  } = useMigrationContract();

  useEffect(() => {
    if (address && owner) {
      setIsAdmin(address === owner);
    }
  }, [address, owner]);

  const fundWallet = async () => {
    const amount = fundAmount ? fundAmount * 10 ** 18 : 0;
    if (amount == 0) return;
    writeContract({
      functionName: "fundNewTokens",
      args: [amount],
    });
  };

  const formatRemainingTime = (timestamp: number) => {
    const days = Math.floor(timestamp / (24 * 60 * 60));
    const hours = Math.floor((timestamp % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timestamp % (60 * 60)) / 60);
    const seconds = Math.floor(timestamp % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [countdown, setCountdown] = useState(
    formatRemainingTime(Number(remainingTime) || 0)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (
          prev.days === 0 &&
          prev.hours === 0 &&
          prev.minutes === 0 &&
          prev.seconds === 0
        ) {
          clearInterval(interval);
          return prev;
        }

        let { days, hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              hours = 23;
              if (days > 0) {
                days -= 1;
              }
            }
          }
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  useEffect(() => {
    if (remainingTime !== undefined) {
      setCountdown(formatRemainingTime(Number(remainingTime) || 0));
    }
  }, [remainingTime]);

  const handleExtendDays = () => {
    console.log("called");
    writeContract({
      functionName: "extendMigration",
      args: [extendDays],
    });
  };

  const handleMigrate = () => {
    writeContract({
      functionName: "migrate",
    });
  };

  const handleWithdraw = () => {
    writeContract({
      functionName: "withdraw",
    });
  };

  const handleSetNewAdmin = () => {
    if (!newAdminWallet) return;
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethereumAddressRegex.test(newAdminWallet)) {
      toast("Invalid Ethereum wallet address");
      return;
    }
    writeContract({
      functionName: "transferOwnership",
      args: [newAdminWallet],
    });
  };

  const handleSetPaused = () => {
    writeContract({
      functionName: "setPaused",
    });
  };

  // console.log("looking for me?", isPaused);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50">
      <header className=" bg-[#5631AD] w-full px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/slogo4.png"
            className="w-32"
            alt="logo"
            width={500}
            height={500}
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => open()}
            className="bg-black text-white px-6 py-2 rounded-full font-bold"
          >
            {isConnected
              ? address?.slice(0, 4) + "...." + address?.slice(-4)
              : "Connect"}
          </button>
          {/* <button className="p-1 rounded-full">
            <MoonIcon className="h-5 w-5" />
          </button> */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex justify-center">
        <div className="bg-white  min-h-[150px]  rounded-lg shadow-sm border border-gray-100 p-8 w-full max-w-xl">
          {isAdmin && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className="col-span-1 cursor-pointer"
                onClick={() => handleTabChange("migrate")}
              >
                <div
                  className={`border border-gray-200 text-gray-700 p-4 rounded-lg ${
                    tab === "migrate" ? "bg-black text-white" : ""
                  }`}
                >
                  <span className="block text-center">Migrate</span>
                </div>
              </div>
              <div
                className="col-span-1 cursor-pointer"
                onClick={() => handleTabChange("fund")}
              >
                <div
                  className={`border border-gray-200 text-gray-700 p-4 rounded-lg ${
                    tab === "fund" ? "bg-black text-white" : ""
                  }`}
                >
                  <span className="block text-center">Admin</span>
                </div>
              </div>
            </div>
          )}

          {isReadingContracts ? (
            <div className="w-full h-full flex justify-center items-center">
              <Loader className="w-5 h-5 animate-spin text-black" />
            </div>
          ) : tab == "migrate" ? (
            <div className="space-y-6 text-black">
              {/* <div>
              <label className="block text-gray-600 mb-2">
                Recipient&apos;s email address.
              </label>
              <input
                type="email"
                placeholder="e.g vokpukpan@gmail.com"
                className="w-full p-4 border border-gray-200 rounded-lg"
              />
            </div> */}

              <h2 className="text-2xl font-semibold">Migration</h2>
              <p className="font-medium">
                Migrate your old tokens to the new tokens
              </p>
              {/* <div className="flex justify-center w-full">
                <p className="text-black text-md">
                  <span className="text-2xl">
                    {countdown.days.toString().padStart(2, "0")}
                  </span>
                  d{" "}
                  <span className="text-2xl">
                    {countdown.hours.toString().padStart(2, "0")}
                  </span>
                  h{" "}
                  <span className="text-2xl">
                    {countdown.minutes.toString().padStart(2, "0")}
                  </span>
                  m{" "}
                  <span className="text-2xl">
                    {countdown.seconds.toString().padStart(2, "0")}
                  </span>
                  s
                </p>
              </div> */}

              <button
              disabled={isPending}
                onClick={isConnected ? () => handleMigrate() : () => open()}
                className="w-full bg-black text-white py-4 rounded-lg font-medium mt-6"
              >
                {isConnected ? "Migrate" : "Connect Wallet"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <button
              disabled={isPending}
                onClick={handleSetPaused}
                className="w-full bg-black text-white py-2 rounded-lg font-medium mt-6"
              >
                {isPending
                  ? "Pending"
                  : isConnected
                  ? isPaused
                    ? "Continue Migration"
                    : "Pause Migration"
                  : "Connect Wallet"}
              </button>
              <div className="border-b pb-2">
                <h2 className="text-xl font-bold text-black">Fund</h2>
                <label className="block text-gray-600 mb-2">
                  Enter the amount you want to fund
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">$</span>
                    </div>
                    {/* <span className="font-medium">Base USDC</span> */}
                  </div>
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(Number(e.target.value))}
                    className="flex-1 outline-none "
                    placeholder=""
                  />
                </div>
                <button
                disabled={isPending}
                  onClick={fundWallet}
                  className="w-full bg-black text-white py-4 rounded-lg font-medium mt-6"
                >
                  {isPending
                    ? "Pending"
                    : isConnected
                    ? "Fund"
                    : "Connect Wallet"}
                </button>
              </div>
              <div className="">
                <h2 className="text-xl font-bold text-black">Extend</h2>
                <label className="block text-gray-600 mb-2">
                  Enter the days you want to extend by
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">$</span>
                    </div>
                    {/* <span className="font-medium">Base USDC</span> */}
                  </div>
                  <input
                    value={extendDays}
                    onChange={(e) => setExtendDays(Number(e.target.value))}
                    type="text"
                    className="flex-1 outline-none "
                    placeholder=""
                  />
                </div>
                <button
                disabled={isPending}
                  onClick={handleExtendDays}
                  className="w-full bg-black text-white py-4 rounded-lg font-medium mt-6"
                >
                  {isPending
                    ? "Pending"
                    : isConnected
                    ? "Extend"
                    : "Connect Wallet"}
                </button>
              </div>
              <div className="">
                <h2 className="text-xl font-bold text-black">
                  Transfer Ownership
                </h2>
                <label className="block text-gray-600 mb-2">
                  Transfer Admin rights to a new wallet address
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center">
                    {/* <span className="font-medium">Base USDC</span> */}
                  </div>
                  <input
                    value={newAdminWallet}
                    onChange={(e) => setNewAdminWallet(e.target.value)}
                    type="text"
                    className="flex-1 outline-none "
                    placeholder=""
                  />
                </div>
                <button
                disabled={isPending}
                  onClick={handleSetNewAdmin}
                  className="w-full bg-black text-white py-4 rounded-lg font-medium mt-6"
                >
                  {isPending
                    ? "Pending"
                    : isConnected
                    ? "Change Admin"
                    : "Connect Wallet"}
                </button>
              </div>
              <div className="">
                <h2 className="text-xl font-bold text-black">Withdraw</h2>
                <label className="block text-gray-600 mb-2">
                  Withdraw tokens to your wallet
                </label>

                <button
                disabled={isPending}
                  onClick={handleWithdraw}
                  className="w-full bg-black text-white py-4 rounded-lg font-medium mt-6"
                >
                  {isPending
                    ? "Pending"
                    : isConnected
                    ? "Withdraw"
                    : "Connect Wallet"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
