import { useState } from "react";
import { XCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { getContract } from "@/services/contract";
import { ethers } from "ethers";

export default function CancelOrder() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setStatus("Annulation en cours...");
      setIsLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.cancelOrder(orderId);
      await tx.wait();

      setStatus("✅ Ordre annulé avec succès.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Erreur lors de l'annulation de l'ordre.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section">
      <h2 className="font-semibold mb-2">Annuler un ordre</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          placeholder="Order ID"
          className="input"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          onClick={handleCancel}
          className="bg-black text-white px-4 py-1 rounded flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          Annuler
        </button>
      </div>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
