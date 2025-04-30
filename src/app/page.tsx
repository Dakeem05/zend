"use client";
import Image from "next/image";
import { useState } from "react";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
export default function Home() {
  const [isAdmin, setIsAdmin] = useState(true);

  const [tab, setTab] = useState("migrate");
  const handleTabChange = (newTab: string) => {
    setTab(newTab);
  };
  const handleAdminToggle = () => {
    setIsAdmin((prev) => !prev);
  };

  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();
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
            className="bg-blue-900 text-white px-6 py-2 rounded-full font-bold"
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 w-full max-w-xl">
          {isAdmin && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className="col-span-1 cursor-pointer"
                onClick={() => handleTabChange("migrate")}
              >
                <div
                  className={`border border-gray-200 text-gray-700 p-4 rounded-lg ${
                    tab === "migrate" ? "bg-blue-900 text-white" : ""
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
                    tab === "fund" ? "bg-blue-900 text-white" : ""
                  }`}
                >
                  <span className="block text-center">Fund</span>
                </div>
              </div>
            </div>
          )}

          {tab == "migrate" ? (
            <div className="space-y-6">
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

              <div>
                <label className="block text-gray-600 mb-2">
                  Enter the amount you want to migrate.
                </label>
                <div className="flex items-center border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">$</span>
                    </div>
                    {/* <span className="font-medium">Base USDC</span> */}
                  </div>
                  <input
                    type="text"
                    className="flex-1 outline-none "
                    placeholder=""
                  />
                </div>
              </div>

              <button className="w-full bg-blue-900 text-white py-4 rounded-lg font-medium mt-6">
                {isConnected ? "Migrate" : "Connect Wallet"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="border-b border-black pb-2">
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
                    type="text"
                    className="flex-1 outline-none "
                    placeholder=""
                  />
                </div>
                <button className="w-full bg-blue-900 text-white py-4 rounded-lg font-medium mt-6">
                  {isConnected ? "Fund" : "Connect Wallet"}
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
                    type="text"
                    className="flex-1 outline-none "
                    placeholder=""
                  />
                </div>
                <button className="w-full bg-blue-900 text-white py-4 rounded-lg font-medium mt-6">
                  {isConnected ? "Extend" : "Connect Wallet"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
