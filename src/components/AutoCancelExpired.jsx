import { useState } from "react";
import { getContract } from "@/services/contract";
import { ethers } from "ethers";
import { Clock, XCircle, CheckCircle } from "lucide-react";

export default function AutoCancelExpired() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");

  const handleAutoCancel = async () => {
    try {
      setStatus("Annulation en cours...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.autoCancelExpired(orderId);
      await tx.wait();

      setStatus("Ordre annulé automatiquement après expiration.");
    } catch (err) {
      console.error(err);
      setStatus("Erreur lors de l'annulation automatique.");
    }
  };

  return (
    <div className="section">
      <h2 className="font-semibold mb-2">Annulation automatique (après 30 min)</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          placeholder="Order ID"
          className="input"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          onClick={handleAutoCancel}
          className="bg-black text-white px-4 py-1 rounded flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Annuler
        </button>
      </div>
      {status && (
        <p className="text-sm flex items-center gap-1">
          {status.includes("Erreur") ? (
            <XCircle className="text-red-500 w-4 h-4" />
          ) : (
            <CheckCircle className="text-green-500 w-4 h-4" />
          )}
          {status}
        </p>
      )}
    </div>
  );
}
