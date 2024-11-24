"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [msg, setMsg] = useState<string>();

  const handleMint = () => {
    setMsg("Mint Clicked")
  }

  const handleDelegate = () => {
    setMsg("Delegate Clicked")
  }

  const handleTransfer = () => {
    setMsg("Transfer Clicked")
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">

        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Ballot DApp</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-red-500">{msg}</p>
          <p>Ballot DApp token balance: ***</p>
          <p>Voting Power: ***</p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">

            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <p>
                Mint Ballot DApp Token (only for deployer of contract)
              </p>
              <button className="btn" onClick={handleMint}>
                Mint
              </button>
            </div>

            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <p>
                Self Delegate (only needed when Ballot DApp is received for the first time)
              </p>
              <button className="btn" onClick={handleDelegate}>
                Delegate
              </button>
            </div>

            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <p>
                Transfer (Used to transfer Ballot DApp token to another account)
              </p>
              <button className="btn" onClick={handleTransfer}>
                Send
              </button>
            </div>

            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              {/* <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" /> */}
              <p>
                Vote (Only possible when your Ballot DApp is delegated)
              </p>
              <button className="btn">
                Vote
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
