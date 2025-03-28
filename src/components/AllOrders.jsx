import { useEffect, useState } from "react";
import { getContract } from "@/services/contract";
import { ethers } from "ethers";

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = getContract(provider);

        const nextId = await contract.nextOrderId();
        const orderList = [];

        for (let i = 0; i < Number(nextId); i++) {
          const order = await contract.orders(i);

          // Filtrage des ordres invalides
          const isValidSeller = order.seller !== "0x0000000000000000000000000000000000000000";
          const isValidAmount = order.amount > 0;

          if (isValidSeller && isValidAmount) {
            orderList.push({ id: i, ...order });
          }
        }

        setOrders(orderList);
      } catch (err) {
        console.error("Erreur lors du chargement des ordres :", err);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "completed") return order.completed;
    if (filter === "disputed") return order.disputed;
    if (filter === "active") return !order.completed && !order.disputed;
    return true; // "all"
  });

  return (
    <div className="section">
      <h2 className="font-semibold">Tous les ordres valides</h2>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="input w-auto mt-2"
      >
        <option value="all">Tous</option>
        <option value="active">Actifs</option>
        <option value="completed">Complétés</option>
        <option value="disputed">Litiges</option>
      </select>

      <ul className="mt-4 space-y-4">
        {filteredOrders.length === 0 && (
          <p className="text-gray-500">Aucun ordre disponible.</p>
        )}

        {filteredOrders.map((order) => (
          <li key={order.id} className="border p-4 rounded shadow-sm">
            <p><strong>ID :</strong> {order.id}</p>
            <p>
              <strong>Montant :</strong>{" "}
              {order.amount > 0
                ? `${ethers.formatEther(order.amount)} BNB`
                : "Indisponible"}
            </p>
            <p><strong>Vendeur :</strong> {order.seller}</p>
            <p><strong>Acheteur :</strong> {order.buyer}</p>
            <p><strong>Complété :</strong> {order.completed ? "Oui" : "Non"}</p>
            <p><strong>Litige :</strong> {order.disputed ? "Oui" : "Non"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
