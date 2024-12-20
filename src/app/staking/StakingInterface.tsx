"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast"
import { Flame, ArrowUpDown, Check, Zap, Sparkles } from 'lucide-react';
import { ethers } from 'ethers';
import {StakeTokenABI} from "../../ABI/StakeTokenABI";
import {StakingContractABI} from "../../ABI/StakingContractABI";


  const STAKING_CONTRACT_ADDRESS = "0x240CbABDBaff70D9a1113697031d19e07CdeC068";
  const STAKING_TOKEN_ADDRESS = "0xa911093Ff62E7378b6Acb22D8abc61D13E927c97";


const StakingInterface = ({ contracts, isConnected, signer,connectionStatus }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('stake');
  const [tokenApproval, setTokenApproval] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [tabUnderlineStyle, setTabUnderlineStyle] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [stakedTokens, setStakedTokens] = useState('0');
  const [allowanceAmount, setAllowanceAmount] = useState('0');

  const tabRefStake = useRef(null);
  const tabRefWithdraw = useRef(null);
  const cardRef = useRef(null);
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

   

  // Dynamic tab underline animation
  useEffect(() => {
    const updateUnderline = () => {
      const activeTabElement = activeTab === 'stake' ? tabRefStake.current : tabRefWithdraw.current;
      if (activeTabElement) {
        const width = activeTabElement.offsetWidth;
        const left = activeTabElement.offsetLeft;
        setTabUnderlineStyle({
          width: `${width}px`,
          transform: `translateX(${left}px)`
        });
      }
    };
    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeTab]);


  const handleApproveTokens = async () => {
    if (!isConnected) {
      toast({ title: 'Connect Wallet', description: 'Please connect your wallet first!', variant: 'destructive' });
      return;
    }
  
    console.log(isConnected, "connection");
    console.log(signer, "Signer object");
  
    try {
      setLoading(true);
  
      // Create ethers signer from wallet client
      const provider = new ethers.BrowserProvider(signer.transport);
      const ethersSigner = await provider.getSigner();
      
      // Connect the contract with the ethers signer
      const tokenContract = new ethers.Contract(STAKING_TOKEN_ADDRESS, StakeTokenABI, ethersSigner);
  
      // Parse the token amount (assumes 18 decimals)
      const amount = ethers.parseUnits(tokenApproval, 18);
      console.log("Approval amount:", amount);
  
      // Send the approve transaction
      const tx = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, amount);
      if (!tx) {
        toast({ title: 'Error', description: 'Transaction failed to send!', variant: 'destructive' });
        return;
      }
  
      console.log('Transaction Sent:', tx);
  
      // Wait for transaction confirmation
      const txReceipt = await tx.wait();
      console.log('Transaction confirmed:', txReceipt);
  
      setIsApproved(true);
      toast({ title: 'Tokens Approved', description: 'You can now stake your tokens!', variant: 'success' });
    } catch (error) {
      console.error('Approval error:', error);
      toast({ title: 'Error', description: 'Token approval failed!', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleStake = async () => {
    if (!isApproved) {
      toast({ title: 'Approval Needed', description: 'Please approve tokens before staking!', variant: 'destructive' });
      return;
    }
  
    const stakeAmountNum = Number(stakeAmount);
    if (!stakeAmount || isNaN(stakeAmountNum) || stakeAmountNum <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid stake amount.', variant: 'destructive' });
      return;
    }
  
    try {
      setLoading(true);
      
      const provider = new ethers.BrowserProvider(signer.transport);
      const ethersSigner = await provider.getSigner();
      
      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS, 
        StakingContractABI, 
        ethersSigner
      );
      
      const amount = ethers.parseUnits(stakeAmount, 18);
  
      // Fix for gas estimation
      try {
        const estimatedGas = await stakingContract.stake.estimateGas(amount);
        console.log("Estimated gas:", estimatedGas.toString());
  
        // Convert to BigInt and add 20% buffer
        const gasLimit = BigInt(Math.floor(Number(estimatedGas) * 1.2));
        
        const tx = await stakingContract.stake(amount, {
          gasLimit: gasLimit
        });
        
        console.log("Transaction sent:", tx.hash);
        
        const txReceipt = await tx.wait();
        console.log("Transaction confirmed:", txReceipt);
  
        toast({ 
          title: 'Staked Successfully', 
          description: `You have staked ${stakeAmount} tokens!`, 
          variant: 'success' 
        });
        setStakeAmount('');
      } catch (error) {
        if (error.message.includes("insufficient funds")) {
          toast({ 
            title: 'Error', 
            description: 'Insufficient funds for gas', 
            variant: 'destructive' 
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Staking error:', error);
      toast({ 
        title: 'Error', 
        description: 'Staking failed!', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };
  const handleWithdraw = async () => {
    const withdrawAmountNum = Number(withdrawalAmount);
    if (!withdrawalAmount || isNaN(withdrawAmountNum) || withdrawAmountNum <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid withdrawal amount.', variant: 'destructive' });
      return;
    }
   
    try {
      setLoading(true);
   
      const provider = new ethers.BrowserProvider(signer.transport);
      const ethersSigner = await provider.getSigner();
      
      const stakingContract = new ethers.Contract(
        STAKING_CONTRACT_ADDRESS,
        StakingContractABI, 
        ethersSigner
      );
   
      const amount = ethers.parseUnits(withdrawalAmount, 18);
   
      // Check staked balance
      const stakedBalance = await stakingContract.stakedBalance(await ethersSigner.getAddress());
      if (stakedBalance < amount) {
        toast({
          title: 'Insufficient Staked Balance',
          description: 'You don\'t have enough tokens staked to withdraw this amount',
          variant: 'destructive'
        });
        return;
      }
   
      try {
        const estimatedGas = await stakingContract.withdrawStakedTokens.estimateGas(amount);
        console.log("Estimated gas:", estimatedGas.toString());
   
        const gasLimit = BigInt(Math.floor(Number(estimatedGas) * 1.2));
   
        const tx = await stakingContract.withdrawStakedTokens(amount, {
          gasLimit: gasLimit
        });
        
        console.log("Transaction sent:", tx.hash);
        
        const txReceipt = await tx.wait();
        console.log("Transaction confirmed:", txReceipt);
   
        toast({ 
          title: 'Withdrawn Successfully', 
          description: `You have withdrawn ${withdrawalAmount} tokens!`, 
          variant: 'success' 
        });
        setWithdrawalAmount('');
   
      } catch (error) {
        if (error.message.includes("insufficient funds")) {
          toast({
            title: 'Error',
            description: 'Insufficient funds for gas',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      let errorMessage = 'Withdrawal failed!';
   
      if (error.message.includes("execution reverted")) {
        try {
          const data = error.data;
          if (data.includes("InsufficientBalance")) {
            errorMessage = "Insufficient staked balance";
          } else if (data.includes("WithdrawalPaused")) {
            errorMessage = "Withdrawals are currently paused";
          } else if (data.includes("LockPeriodNotEnded")) {
            errorMessage = "Lock period has not ended yet";
          }
        } catch (e) {
          errorMessage = "Transaction reverted. Please check your input and try again.";
        }
      }
   
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
   };


  return (
    <div className="max-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden mt-10">
      {/* Magical Particle Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full opacity-20 animate-[float_10s_infinite]"
            style={{
              width: `${Math.random() * 10 + 2}px`,
              height: `${Math.random() * 10 + 2}px`,
              left: `${Math.random() * 120 - 10}%`,
              top: `${Math.random() * 120 - 10}%`,
              animationDelay: `${Math.random() * 10}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      <Card 
        ref={cardRef}
        className="w-full max-w-md z-10 shadow-2xl border-2 border-gray-100 rounded-3xl overflow-hidden relative"
      >
        {/* Magic Glow Effect */}
        <div 
          className="absolute -inset-1 bg-gradient-to-r opacity-20 blur-2xl animate-pulse"
          style={{
            backgroundPosition: `${mousePosition.x}px ${mousePosition.y}px`
          }}
        ></div>
        
        <Tabs 
          defaultValue="stake" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="relative"
        >
          {/* Unique Tab Navigation */}
          <div className="relative z-10">
            <TabsList className="grid grid-cols-2 bg-transparent p-0 relative">
              <TabsTrigger 
                ref={tabRefStake}
                value="stake" 
                className={`
                  relative py-4 font-bold text-lg z-10
                  ${activeTab === 'stake' ? 'text-black' : 'text-gray-400'}
                  transition-colors duration-300
                `}
              >
                <Flame className="mr-2 animate-[wiggle_1s_ease-in-out_infinite]" />
                Stake Token
              </TabsTrigger>
              <TabsTrigger 
                ref={tabRefWithdraw}
                value="withdraw" 
                className={`
                  relative py-4 font-bold text-lg z-10
                  ${activeTab === 'withdraw' ? 'text-black' : 'text-gray-400'}
                  transition-colors duration-300
                `}
              >
                <ArrowUpDown className="mr-2 animate-[wiggle_1s_ease-in-out_infinite]" />
                Withdrawal
              </TabsTrigger>
            </TabsList>
            
            {/* Animated Underline */}
            <div 
              className="absolute bottom-0 h-1 bg-blue-500 transition-all duration-300" 
              style={tabUnderlineStyle}
            />
          </div>

          {/* Stake Token Tab */}
          <TabsContent value="stake" className="p-6 relative z-10 rounded-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token Approval
                </label>
                <Input 
                  type="number" 
                  placeholder="Enter approval amount"
                  value={tokenApproval}
                  onChange={(e) => setTokenApproval(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 mb-4"
                />
                <Button 
                  onClick={handleApproveTokens}
                  className="
                    w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white">
                  {/* Magic Sparkle Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>
                  
                  {isApproved ? (
                    <>
                      <Check className="mr-2" />
                      Approved
                      <Sparkles className="ml-2 text-yellow-300 animate-pulse" />
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 group-hover:animate-pulse" />
                      Approve Tokens
                      <Sparkles className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </>
                  )}
                </Button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stake Token
                </label>
                <Input 
                  type="number" 
                  placeholder="Enter stake amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="border-gray-300 focus:border-blue-500"
                  // disabled={!isApproved}
                />
              </div>
              
              <Button 
                onClick={handleStake} 
                // disabled={!isApproved}
                // className={`
                //   w-full group relative overflow-hidden 
                //   ${!isApproved ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}
                // `}
                className= "w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white  "
                  
                  // ${!isApproved ? 'opacity-50 cursor-not-allowed' : ''}
                
              >
                {/* Magic Sparkle Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>
                
                <Flame className="mr-2 group-hover:animate-pulse" />
                Stake Tokens
                <Sparkles className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          </TabsContent>

          {/* Withdrawal Tab */}
          <TabsContent value="withdraw" className="p-6 relative z-10 rounded-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount
                </label>
                <Input 
                  type="number" 
                  placeholder="Enter withdrawal amount"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>
              
              <Button 
                onClick={handleWithdraw} 
                className="w-full group relative overflow-hidden  text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500"
              >
                {/* Magic Sparkle Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_2s_infinite]"></div>
                
                <ArrowUpDown className="mr-2 group-hover:animate-pulse" />
                Withdraw Tokens
                <Sparkles className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default StakingInterface;