import { useState } from "react";
import { getContract } from "@/services/contract";
import { ethers } from "ethers";
import { Banknote } from "lucide-react";

export default function WithdrawCommission() {
  const [status, setStatus] = useState("");

  const handleWithdraw = async () => {
    try {
      setStatus("Retrait en cours...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.withdrawCommission();
      await tx.wait();

      setStatus("✅ Commissions retirées avec succès.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Erreur lors du retrait des commissions.");
    }
  };

  return (
    <div className="section">
      <h2 className="font-semibold mb-2">Retirer les commissions (Admin)</h2>
      <button
        onClick={handleWithdraw}
        className="bg-black text-white px-4 py-1 rounded flex items-center gap-2"
      >
        <Banknote className="w-4 h-4" /> Retirer
      </button>
      {status && <p className="text-sm mt-2 text-gray-700">{status}</p>}
    </div>
  );
}
