import { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "@/services/contract";
import { Loader2, PlusCircle } from "lucide-react";

export default function CreateOrder() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setStatus("Création en cours...");
      setIsLoading(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.createOrder({
        value: ethers.parseEther(amount),
      });

      await tx.wait();

      setStatus("✅ Ordre créé avec succès !");
    } catch (err) {
      console.error(err);
      setStatus("❌ Erreur lors de la création de l'ordre.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section">
      <h2 className="font-semibold mb-2">Créer un ordre</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <input
          type="text"
          placeholder="Montant en BNB"
          className="input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-1 rounded flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <PlusCircle className="w-4 h-4" />
          )}
          Créer
        </button>
      </div>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </div>
  );
}
