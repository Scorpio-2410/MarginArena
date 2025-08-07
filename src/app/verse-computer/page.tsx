"use client";

import { useEffect, useState } from "react";

// Utility: random float between min and max
function getRandom(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export default function VerseComputerPage() {
  const [userCost, setUserCost] = useState<number | null>(null);
  const [userBid, setUserBid] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [aiBids, setAiBids] = useState<number[]>([]);

  // Hydration-safe client-only init for cost
  useEffect(() => {
    const storedCost = localStorage.getItem("userCost");
    const value = storedCost ? parseFloat(storedCost) : getRandom(70, 100);
    setUserCost(value);
    localStorage.setItem("userCost", value.toString());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCost) return;

    const userBidFloat = parseFloat(userBid);
    const competitors = Array.from({ length: 3 }, () => getRandom(70, 100));
    const allBids = [...competitors, userBidFloat];
    const lowestBid = Math.min(...allBids);
    const winner = lowestBid === userBidFloat ? "You" : "Computer";
    const profit =
      winner === "You" ? (userBidFloat - userCost).toFixed(2) : "0.00";

    setAiBids(competitors);
    setResult(`${winner} won the auction. Your profit: $${profit}`);
    setSubmitted(true);
  };

  const handleReset = () => {
    const newCost = getRandom(70, 100);
    localStorage.setItem("userCost", newCost.toString());
    setUserCost(newCost);
    setUserBid("");
    setSubmitted(false);
    setResult(null);
    setAiBids([]);
  };

  // Show nothing until cost is loaded (hydration-safe)
  if (userCost === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading game...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-2 text-center text-indigo-600">
          Reverse Auction – Vs Computer
        </h1>
        <p className="text-sm mb-4 text-center text-gray-500">
          Try to win the contract by bidding just low enough above your private
          cost.
        </p>

        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 text-center">
          Your private cost: <strong>${userCost}</strong>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="number"
              step="0.01"
              className="border px-4 py-2 rounded"
              placeholder="Enter your bid"
              value={userBid}
              onChange={(e) => setUserBid(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
              Submit Bid
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="mb-2 font-medium">{result}</p>
            <div className="bg-gray-100 p-3 rounded text-sm text-gray-600 mb-3">
              Competitor Bids:
              <ul className="list-disc ml-6 mt-1">
                {aiBids.map((bid, i) => (
                  <li key={i}>
                    Supplier {i + 1}: ${bid.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleReset}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded">
              Play Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
