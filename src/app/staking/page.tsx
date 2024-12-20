"use client";
import React, { useEffect, useState } from 'react';
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient } from 'wagmi';
import StakingInterface from './StakingInterface';
import StakingRewards from './StakingRewards';
import { ethers } from 'ethers';
import {StakeTokenABI} from "../../ABI/StakeTokenABI";
import {StakingContractABI} from "../../ABI/StakingContractABI";

const Staking = () => {
  const { data: walletClient } = useWalletClient();
  const { isConnected, address } = useAccount();
  const [contracts, setContracts] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({
    connected: false,
    address: '',
    stakingContract: null,
    tokenContract: null
  });

  
  const STAKING_CONTRACT_ADDRESS = "0x240CbABDBaff70D9a1113697031d19e07CdeC068";
  const STAKING_TOKEN_ADDRESS = "0xa911093Ff62E7378b6Acb22D8abc61D13E927c97";

  useEffect(() => {
    const initializeContracts = async () => {
      if (!walletClient) return;
      
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const stakingContract = new ethers.Contract(
          STAKING_CONTRACT_ADDRESS,
          StakingContractABI,
          signer
        );
        
        const tokenContract = new ethers.Contract(
          STAKING_TOKEN_ADDRESS,
          StakeTokenABI,
          signer
        );
        
        setContracts({ stakingContract, tokenContract });

        // Set connection status with all the details
        setConnectionStatus({
          connected: true,
          address: address,
          stakingContract: stakingContract,
          tokenContract: tokenContract
        });

        console.log("Connection Successful!");
        console.log("Connected Address:", address);
        console.log("Staking Contract:", stakingContract);
        console.log("Token Contract:", tokenContract);

      } catch (error) {
        console.error("Error initializing contracts:", error);
        setConnectionStatus({
          connected: false,
          address: '',
          stakingContract: null,
          tokenContract: null
        });
      }
    };

    if (isConnected && walletClient) {
      initializeContracts();
    } else {
      setConnectionStatus({
        connected: false,
        address: '',
        stakingContract: null,
        tokenContract: null
      });
    }
  }, [walletClient, isConnected, address]);

  return (
    <div>
      <div className="w-full flex justify-between items-center px-8 py-4">
        <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 drop-shadow-md">
          TokenStash
        </div>
        <div className="flex flex-col items-end gap-2">
          <ConnectButton />
         
        </div>
      </div>
      <StakingInterface 
        contracts={contracts}
        isConnected={isConnected}
        signer={walletClient}
        connectionStatus={connectionStatus}
      />
      <StakingRewards 
        contracts={contracts}
        isConnected={isConnected}
        signer={walletClient}
        connectionStatus={connectionStatus}
      />
    </div>
  );
};

export default Staking;