import { useState } from "react";
import { Search } from "lucide-react";
import { getContract } from "@/services/contract";

export default function ViewOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");

  const handleView = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = getContract(provider);
      const orderData = await contract.orders(orderId);
      setOrder(orderData);
      setStatus("");
    } catch (err) {
      console.error(err);
      setOrder(null);
      setStatus("Erreur lors de la récupération de l'ordre.");
    }
  };

  const isEmptyAddress = (address) =>
    address === "0x0000000000000000000000000000000000000000";

  return (
    <div className="section">
      <h2 className="font-semibold mb-2">Consulter un ordre</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          placeholder="Order ID"
          className="input"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button
          onClick={handleView}
          className="bg-black text-white px-4 py-1 rounded flex items-center gap-2"
        >
          <Search className="w-4 h-4" /> Voir détails
        </button>
      </div>

      {status && <p className="text-red-500 text-sm flex items-center gap-2">❌ {status}</p>}

      {order && (
        <div className="space-y-1">
          <p>
            <strong>👤 Vendeur :</strong>{" "}
            {isEmptyAddress(order.seller) ? "Non défini" : order.seller}
          </p>
          <p>
            <strong>💰 Montant :</strong>{" "}
            {order.amount > 0
              ? `${ethers.formatEther(order.amount)} BNB`
              : "Indisponible"}
          </p>
          <p>
            <strong>🕒 Créé à :</strong> {order.createdAt.toString()}
          </p>
          <p>
            <strong>👤 Acheteur :</strong>{" "}
            {isEmptyAddress(order.buyer) ? "Non défini" : order.buyer}
          </p>
          <p>
            <strong>✅ Terminé :</strong> {order.completed ? "Oui" : "Non"}
          </p>
          <p>
            <strong>⚠️ Litige :</strong> {order.disputed ? "Oui" : "Non"}
          </p>
        </div>
      )}
    </div>
  );
}
