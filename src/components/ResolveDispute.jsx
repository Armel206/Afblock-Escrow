import { useState } from "react";
import { getContract } from "@/services/contract";
import { ethers } from "ethers";
import { Gavel } from "lucide-react";

export default function ResolveDispute() {
  const [orderId, setOrderId] = useState("");
  const [resolution, setResolution] = useState("releaseToBuyer");
  const [status, setStatus] = useState("");

  const handleResolve = async () => {
    try {
      setStatus("Résolution en cours...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.resolveDispute(
        orderId,
        resolution === "releaseToBuyer"
      );
      await tx.wait();
      setStatus("Litige résolu avec succès !");
    } catch (err) {
      console.error(err);
      setStatus("Erreur lors de la résolution du litige.");
    }
  };

  return (
    <div className="section">
      <h2 className="font-semibold mb-2">Résoudre un litige (Admin)</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          placeholder="Order ID"
          className="input"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <select
          className="input"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
        >
          <option value="releaseToBuyer">Libérer les fonds au client</option>
          <option value="refundSeller">Rembourser le vendeur</option>
        </select>
        <button
          onClick={handleResolve}
          className="bg-black text-white px-4 py-1 rounded flex items-center gap-2"
        >
          <Gavel className="w-4 h-4" /> Résoudre
        </button>
      </div>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
