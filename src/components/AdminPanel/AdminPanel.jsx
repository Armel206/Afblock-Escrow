import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/services/contract";
import ResolveDispute from "@/components/ResolveDispute";
import WithdrawCommission from "@/components/WithdrawCommission";

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);

        const contract = getContract(signer);
        const adminAddress = await contract.admin();
        setIsAdmin(userAddress.toLowerCase() === adminAddress.toLowerCase());
      } catch (err) {
        console.error("Erreur admin:", err);
      }
    };
    checkAdmin();
  }, []);

  if (!isAdmin) {
    return (
      <div className="section">
        <h2 className="font-semibold">Accès refusé</h2>
        <p className="text-red-600 text-sm">
          Cette section est réservée à l’administrateur du contrat.
        </p>
        <p className="text-xs text-gray-500 mt-1">Adresse connectée : {address}</p>
      </div>
    );
  }

  return (
    <div className="section">
      <h2 className="text-xl font-bold mb-4">Espace Admin</h2>
      <ResolveDispute />
      <WithdrawCommission />
    </div>
  );
}
