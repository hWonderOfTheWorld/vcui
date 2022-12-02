/* eslint-disable react-hooks/exhaustive-deps, @next/next/no-img-element */
// --- React Methods
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// --- Shared data context
import { UserContext } from "../context/userContext";

// --- Components
import { Header } from "../components/Header";

export default function Home() {
  const { handleConnection, address, walletLabel, wallet } = useContext(UserContext);

  const navigate = useNavigate();

  // Route user to dashboard when wallet is connected
  useEffect(() => {
    if (wallet) {
      navigate("/dashboard");
    }
  }, [wallet]);

  return (
    <div className="font-['Satoshi'] min-h-max min-h-default  text-gray-100 md:bg-center">
      <Header />
      <div className="container mx-auto px-5 md:px-10  py-2">
        <div className="mx-auto flex flex-wrap">
          <div className="mt-0 w-full pb-6 text-black sm:mt-40 sm:w-1/2 md:mt-10 md:w-9/12 md:pt-6">
            <div className=" leading-relaxed">
              <h1 className="text-zinc-400 text-2xl font-['SatoshiBlack']">
              The ebpto is a verifiable identity domain registry.
              </h1>
              <p className="text-5xl sm:text-7xl md:text-9xl font-['SatoshiBlack']">
              Dont trust.
              Verify.
              </p>
            </div>
            <div className=" mt-0 text-lg text-gray-400 sm:text-xl md:mt-10 md:pr-20 md:text-xl font-['Satoshi']">
              Pin decentralized identity records with various verifiable credentials about you. 
              Verify assets across multi wallets and various EOA.
            </div>
            <div className="mt-4 hidden w-full sm:mt-10 sm:w-1/2 md:mt-10 md:block md:w-1/2">
              <button
                data-testid="connectWalletButton"
                className="rounded-xl border-2 border-zinc-300 text-zinc-400 py-4 px-6 ml-2 text-2xl font-['SatoshiBlack']"
                onClick={handleConnection}
              >
               {address ? `Disconnect from ${walletLabel || ""}` : "Continue"}
              </button>
            </div>
          </div>
          
          {/* Connect Button on Mobile View */}
          <button
            data-testid="connectWalletButtonMobile"
            className="w-full rounded-xl border-2 border-zinc-300 text-zinc-400 py-4 px-6 ml-2 text-2xl font-['SatoshiBlack'] md:invisible"
            onClick={handleConnection}
          >
            <p className="text-base">{address ? `Disconnect from ${walletLabel || ""}` : "Connect Wallet"}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
