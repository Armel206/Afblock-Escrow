// ✅ AcceptOrder.jsx
import { useState } from "react";
import { getContract } from "@/services/contract";
import { CheckCircle, Loader2 } from "lucide-react";
import { ethers } from "ethers";

export default function AcceptOrder() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    try {
      setStatus("Acceptation en cours...");
      setIsLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.acceptOrder(orderId);
      await tx.wait();

      setStatus("✅ Ordre accepté avec succès !");
    } catch (err) {
      console.error(err);
      setStatus("❌ Erreur lors de l'acceptation de l'ordre.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section">
      <h2 className="font-semibold mb-2">Accepter un ordre</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          placeholder="Order ID"
          className="input"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          onClick={handleAccept}
          className="btn"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          Accepter
        </button>
      </div>
      {status && <p className="status">{status}</p>}
    </div>
  );
}
