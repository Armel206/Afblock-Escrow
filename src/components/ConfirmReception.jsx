import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/services/contract";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

export default function ConfirmReception() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setStatus("Confirmation en cours...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.confirmPaymentReceived(orderId);
      await tx.wait();

      setStatus("✅ Paiement confirmé, fonds libérés au vendeur.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Erreur lors de la confirmation du paiement.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section">
      <h2 className="font-semibold mb-2">Confirmer réception du paiement</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          placeholder="Order ID"
          className="input"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          onClick={handleConfirm}
          className="bg-black text-white px-4 py-1 rounded flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Confirmer
        </button>
      </div>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
