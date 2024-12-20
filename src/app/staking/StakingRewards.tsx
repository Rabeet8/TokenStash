'use client';
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
    
  
      // Get the address of the current user (signer)
      const address = signer.account.address;
      console.log(`Claiming rewards for address: ${address}`);
  
      // Fetch the earned rewards for the user to ensure they are eligible
      const earnedRewards = await contracts.stakingContract.earned(address);
      
  

      console.log(`Earned rewards: ${earnedRewards.toString()}`);
  
      // Estimate gas for the transaction
      const tx= await contracts.stakingContract.getReward();
    
  
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
  
      if (receipt.status === 1) {
        console.log('Rewards successfully claimed.');
        // You can update the state or UI based on the claim's success
        fetchEarnedAndStakedBalance();
      } else {
        console.error('Transaction failed.');
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


// return (
//   <div className="max-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden mt-10">
//     <div className="absolute inset-0 pointer-events-none overflow-hidden">
//       {[...Array(100)].map((_, i) => (
//         <div 
//           key={i} 
//           className="absolute bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 animate-[float_10s_infinite]"
//           style={{
//             width: `${Math.random() * 10 + 2}px`,
//             height: `${Math.random() * 10 + 2}px`,
//             left: `${Math.random() * 120 - 10}%`,
//             top: `${Math.random() * 120 - 10}%`,
//             animationDelay: `${Math.random() * 10}s`,
//             transform: `rotate(${Math.random() * 360}deg)`
//           }}
//         />
//       ))}
//     </div>

//     <Card 
//       ref={cardRef}
//       className="w-full max-w-md z-10 shadow-2xl border-2 border-gray-100 rounded-3xl overflow-hidden relative"
//     >
//       <div 
//         className="absolute -inset-1 bg-gradient-to-r opacity-20 blur-2xl animate-pulse"
//         style={{
//           backgroundPosition: `${mousePosition.x}px ${mousePosition.y}px`
//         }}
//       ></div>
      
//       <Tabs 
//         defaultValue="stake" 
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="relative"
//       >
//         <div className="relative z-10">
//           <TabsList className="grid grid-cols-2 bg-transparent p-0 relative">
//             <TabsTrigger 
//               ref={tabRefStake}
//               value="stake" 
//               className={`relative py-4 font-bold text-lg z-10 ${activeTab === 'stake' ? 'text-black' : 'text-gray-400'} transition-colors duration-300`}
//             >
//               <Flame className="mr-2 animate-[wiggle_1s_ease-in-out_infinite]" />
//               Stake Token
//             </TabsTrigger>
//             <TabsTrigger 
//               ref={tabRefWithdraw}
//               value="withdraw" 
//               className={`relative py-4 font-bold text-lg z-10 ${activeTab === 'withdraw' ? 'text-black' : 'text-gray-400'} transition-colors duration-300`}
//             >
//               <ArrowUpDown className="mr-2 animate-[wiggle_1s_ease-in-out_infinite]" />
//               Withdrawal
//             </TabsTrigger>
//           </TabsList>

//           <div 
//             className="absolute bottom-0 h-1 bg-blue-500 transition-all duration-300" 
//             style={tabUnderlineStyle}
//           />
//         </div>

//         <TabsContent value="stake" className="p-6 relative z-10 rounded-2xl">
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Token Approval
//               </label>
//               <Input 
//                 type="number" 
//                 placeholder="Enter approval amount"
//                 value={tokenApproval}
//                 onChange={(e) => setTokenApproval(e.target.value)}
//                 className="border-2 border-gray-200 rounded-lg p-3"
//               />
//               <Button 
//                 onClick={handleApproveTokens} 
//                 disabled={loading || !tokenApproval}
//                 className="mt-4"
//               >
//                 {loading ? 'Approving...' : 'Approve Tokens'}
//               </Button>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Stake Amount
//               </label>
//               <Input 
//                 type="number" 
//                 placeholder="Enter stake amount"
//                 value={stakeAmount}
//                 onChange={(e) => setStakeAmount(e.target.value)}
//                 className="border-2 border-gray-200 rounded-lg p-3"
//               />
//               <Button 
//                 onClick={handleStake} 
//                 disabled={loading || !stakeAmount || !isApproved}
//                 className="mt-4"
//               >
//                 {loading ? 'Staking...' : 'Stake Tokens'}
//               </Button>
//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="withdraw" className="p-6 relative z-10 rounded-2xl">
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Withdraw Amount
//               </label>
//               <Input 
//                 type="number" 
//                 placeholder="Enter withdrawal amount"
//                 value={withdrawalAmount}
//                 onChange={(e) => setWithdrawalAmount(e.target.value)}
//                 className="border-2 border-gray-200 rounded-lg p-3"
//               />
//               <Button 
//                 onClick={handleWithdraw} 
//                 disabled={loading || !withdrawalAmount}
//                 className="mt-4"
//               >
//                 {loading ? 'Withdrawing...' : 'Withdraw Tokens'}
//               </Button>
//             </div>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </Card>
//   </div>
// );