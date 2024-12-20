"use client";
import React,{useEffect,useState} from "react";
import { ethers } from 'ethers';
import { useToast } from "@/hooks/use-toast"

const StakingRewards = ({ contracts, isConnected, signer,connectionStatus }) => {
    const { toast } = useToast();
  
  const [rewardRate, setRewardRate] = useState("0");
  const [earned, setEarned] = useState("0");
  const [stakedBalance, setStakedBalance] = useState("0");

  const fetchEarnedAndStakedBalance = async () => {
    try {
      if (!contracts || !contracts.stakingContract || !signer) {
        // toast({
        //   title: 'Contract Error',
        //   description: 'Staking contract or signer is not available.',
        //   variant: 'destructive', // Red background for error
        // });
        return;
      }
      // console.log(signer, "signer");
      // console.log("Signer Methods:", Object.keys(signer));

      const address = signer.account.address;
      console.log(address, "address");
      // Fetch earned amount from the staking contract
      const earnedWei = await contracts.stakingContract.earned(address);
      const earnedEth = ethers.formatUnits(earnedWei.toString(), 18);
      console.log(earnedEth);

      // Fetch staked balance from the staking contract
      const stakedWei = await contracts.stakingContract.stakedBalance(address);
      const stakedEth = ethers.formatUnits(stakedWei.toString(), 18);
      console.log(stakedEth);


      setEarned(earnedEth);
      setStakedBalance(stakedEth);

      // Success toast
      // toast({
      //   title: 'Earned & Staked Balance Fetched',
      //   description: `Earned: ${earnedEth} tokens | Staked: ${stakedEth} tokens`,
      //   variant: 'success', // Green background for success
      // });
    } catch (error) {
      // toast({
      //   title: 'Error Fetching Earned and Staked Balances',
      //   description: 'There was an issue retrieving the earned and staked balances.',
      //   variant: 'destructive', // Red background for error
      // });
      console.error('Error fetching earned and staked balances:', error.message);
    }
  };

  useEffect(() => {
    if (contracts && contracts.stakingContract) {
      console.log('Staking Contract Instance:', contracts.stakingContract);
    }

    const fetchRewardRate = async () => {
      try {
        if (!contracts || !contracts.stakingContract) {
          // toast({
          //   title: 'Contract Error',
          //   description: 'Staking contract is not initialized.',
          //   variant: 'destructive', // Red background for error
          // });
          // return;
        }

        // Fetch the reward rate from the contract
        const rewardRateWei = await contracts.stakingContract.REWARD_RATE();
        const rewardRateEth = ethers.formatUnits(rewardRateWei.toString(), 18);

        setRewardRate(rewardRateEth);

        // Success toast
        // toast({
        //   title: 'Reward Rate Fetched',
        //   description: `Current reward rate is ${rewardRateEth} tokens per second.`,
        //   variant: 'success', // Green background for success
        // });
      } catch (error) {
        // toast({
        //   title: 'Error Fetching Reward Rate',
        //   description: 'There was an issue retrieving the reward rate.',
        //   variant: 'destructive', // Red background for error
        // });
        // console.error('Error fetching reward rate:', error.message);
      }
    };


      fetchRewardRate();
      fetchEarnedAndStakedBalance();
    
  },  [contracts, signer, isConnected]);
  const claimRewards = async () => {
    
    const loadingToast = toast({
      title: 'Claiming Rewards',
      description: 'Please wait while your transaction is being processed...',
    });
      // Get the address of the current user (signer)
      const address = signer.account.address;
      console.log(`Claiming rewards for address: ${address}`);
  
      // Fetch the earned rewards for the user to ensure they are eligible
      const earnedRewards = await contracts.stakingContract.earned(address);
      
  

      console.log(`Earned rewards: ${earnedRewards.toString()}`);
  
      // Estimate gas for the transaction
      const tx= await contracts.stakingContract.getReward();
    
      loadingToast.dismiss();
      toast({
        title: 'Transaction Submitted',
        description: 'Waiting for confirmation...',
      });
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
  
      if (receipt.status === 1) {
        console.log('Rewards successfully claimed.');
        // You can update the state or UI based on the claim's success
        fetchEarnedAndStakedBalance();
        toast({
          title: 'Success',
          description: 'Rewards successfully claimed!',
          variant: 'success',
        });
      } else {
        console.error('Transaction failed.');
        toast({
          title: 'Error',
          description: 'Transaction failed',
          variant: 'destructive',
        });
      }
    // } catch (error) {
    //   if (error.code === 'CALL_EXCEPTION') {
    //     console.error('Contract call failed:', error.message);
    //   } else if (error.message.includes('execution reverted')) {
    //     console.error('Transaction reverted: Possible reason - user is not eligible for rewards.');
    //   } else {
    //     console.error('Unexpected error:', error.message);
    //   }
    // }
  };
  


  return (
    <div
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl p-4 space-y-2 border border-gray-200 mt-10"
    >
      {/* Section Header */}
      <h2 className="text-xl font-bold text-gray-800 text-center">
        Staking Rewards
      </h2>

      {/* Reward Information */}
      <div className="space-y-4 text-gray-600">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Staked Amount:</span>
          <span className="text-lg font-semibold text-gray-800">{stakedBalance} tokens</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-md font-medium">Reward Rate:</span>
          <span className="text-md font-semibold text-gray-800">
            {rewardRate} token/sec
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-md font-medium">Earned Reward:</span>
          <span className="text-md font-semibold text-gray-800">{earned} tokens</span>
        </div>
      </div>

      {/* Claim Reward Button */}
      <div className="pt-4">
        <button
        onClick={claimRewards}
          className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2 text-md shadow-lg transform transition-all hover:scale-105"
        >
          Claim Reward
        </button>
      </div>
    </div>
  );
};

export default StakingRewards;


