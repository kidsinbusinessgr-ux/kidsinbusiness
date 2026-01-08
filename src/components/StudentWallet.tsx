import React, { useState, useEffect } from 'react';
import { Coins, TrendingUp, ShoppingBag, History } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudentWallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    // 1. Get the reviews from the "Bank" (localStorage)
    const savedReviews = localStorage.getItem('kib_reviews');
    
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews);
      setTransactions(parsedReviews);

      // 2. Calculate Total Wealth
      // Logic: Each point of score = 10 KIB Coins. (Ex: Score 8/10 = 80 Coins)
      const totalCoins = parsedReviews.reduce((acc: number, review: any) => {
        return acc + (review.score * 10);
      }, 0);

      setBalance(totalCoins);
    }
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-100 rounded-full">
          <Coins className="w-8 h-8 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My KIB Wallet</h1>
          <p className="text-slate-500">Manage your earnings and rewards</p>
        </div>
      </div>

      {/* The Big Balance Card */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-slate-400 font-medium mb-1">Total Balance</p>
              <h2 className="text-5xl font-bold text-yellow-400">{balance} <span className="text-2xl text-white">KIB</span></h2>
            </div>
            <TrendingUp className="w-10 h-10 text-green-400 opacity-50" />
          </div>
          <div className="flex gap-3">
             <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
               <ShoppingBag className="w-4 h-4 mr-2" />
               Spend Coins
             </Button>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="bg-white border rounded-2xl p-8 shadow-sm flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-bold mb-2">Next Goal: 1,000 KIB</h3>
            <p className="text-slate-500 mb-6">You are {(balance / 1000) * 100}% of the way there!</p>
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full transition-all duration-1000" 
                  style={{ width: `${Math.min((balance / 1000) * 100, 100)}%` }}
                ></div>
            </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <h3 className="font-bold text-slate-800">Recent Earnings</h3>
        </div>
        
        <div className="divide-y">
            {transactions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No transactions yet. Ask your mentor for a review!</div>
            ) : (
                transactions.map((t) => (
                    <div key={t.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                        <div>
                            <p className="font-bold text-slate-800">Reward: {t.note}</p>
                            <p className="text-xs text-slate-500">{t.date}</p>
                        </div>
                        <div className="text-green-600 font-bold text-lg">
                            +{t.score * 10} KIB
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};

export default StudentWallet;
