import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/services/contract";

export default function Wallet() {
  const [status, setStatus] = useState("");

  const handleGetBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const balance = await contract.getBalance();
      setStatus(`Solde du vendeur : ${ethers.formatEther(balance)} BNB`);
    } catch (err) {
      console.error(err);
      setStatus("Erreur lors de la récupération du solde.");
    }
  };

  const handleAdminBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const adminBalance = await contract.getAdminBalance();
      setStatus(`Solde de l’administrateur : ${ethers.formatEther(adminBalance)} BNB`);
    } catch (err) {
      console.error(err);
      setStatus("Erreur lors de la récupération du solde admin.");
    }
  };

  return (
    <div className="section">
      <h2 className="font-semibold mb-2">Vérifier les soldes</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <button
          onClick={handleGetBalance}
          className="bg-black text-white px-4 py-1 rounded"
        >
          Solde Vendeur
        </button>
        <button
          onClick={handleAdminBalance}
          className="bg-black text-white px-4 py-1 rounded"
        >
          Solde Admin
        </button>
      </div>
      {status && <p className="text-sm text-gray-700">{status}</p>}
    </div>
  );
}
