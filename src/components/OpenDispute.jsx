import { useState } from "react";
import { getContract } from "@/services/contract";
import { ethers } from "ethers";
import { AlertTriangle } from "lucide-react";

export default function OpenDispute() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");

  const handleDispute = async () => {
    try {
      setStatus("Litige en cours...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.openDispute(orderId);
      await tx.wait();
      setStatus("✅ Litige ouvert avec succès.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Erreur lors de l'ouverture du litige.");
    }
  };

  return (
    <div className="section">
      <h2 className="font-semibold mb-2">Ouvrir un litige</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          placeholder="Order ID"
          className="input"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          onClick={handleDispute}
          className="bg-black text-white px-4 py-1 rounded flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Ouvrir le litige
        </button>
      </div>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
