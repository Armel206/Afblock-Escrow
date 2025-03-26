import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./abi";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);

  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [releaseToBuyer, setReleaseToBuyer] = useState(true);
  const [adminAddress, setAdminAddress] = useState("");

  // Connexion Metamask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        setProvider(provider);
        setContract(contract);
      } catch (err) {
        console.error("Erreur de connexion :", err);
      }
    } else {
      alert("Veuillez installer Metamask !");
    }
  };

  // Créer un ordre
  const createOrder = async () => {
    if (!contract || !amount) return;
    try {
      const tx = await contract.createOrder({ value: ethers.parseEther(amount) });
      await tx.wait();
      alert("Ordre créé !");
    } catch (err) {
      console.error("Erreur création ordre :", err);
    }
  };

  // Accepter un ordre
  const acceptOrder = async () => {
    if (!contract || !orderId) return;
    try {
      const tx = await contract.acceptOrder(orderId);
      await tx.wait();
      alert("Ordre accepté !");
    } catch (err) {
      console.error("Erreur acceptation ordre :", err);
    }
  };

  // Voir les détails
  const fetchOrderDetails = async () => {
    if (!contract || !orderId) return;
    try {
      const order = await contract.orders(orderId);
      setOrderDetails(order);
    } catch (err) {
      console.error("Erreur lecture ordre :", err);
    }
  };

  // Confirmer paiement reçu
  const confirmPayment = async () => {
    if (!contract || !orderId) return;
    try {
      const tx = await contract.confirmPaymentReceived(orderId);
      await tx.wait();
      alert("Paiement confirmé !");
    } catch (err) {
      console.error("Erreur confirmation paiement :", err);
    }
  };

  // Ouvrir un litige
  const openDispute = async () => {
    if (!contract || !orderId) return;
    try {
      const tx = await contract.openDispute(orderId);
      await tx.wait();
      alert("Litige ouvert !");
    } catch (err) {
      console.error("Erreur ouverture litige :", err);
    }
  };

  // Résoudre un litige
  const resolveDispute = async () => {
    if (!contract || !orderId) return;
    try {
      const tx = await contract.resolveDispute(orderId, releaseToBuyer);
      await tx.wait();
      alert("Litige résolu !");
    } catch (err) {
      console.error("Erreur résolution litige :", err);
    }
  };

  // Retirer les commissions
  const withdrawCommission = async () => {
    if (!contract) return;
    try {
      const tx = await contract.withdrawCommission();
      await tx.wait();
      alert("Commissions retirées !");
    } catch (err) {
      console.error("Erreur retrait commission :", err);
    }
  };

  // Voir admin
  const fetchAdmin = async () => {
    if (!contract) return;
    try {
      const admin = await contract.admin();
      setAdminAddress(admin);
    } catch (err) {
      console.error("Erreur admin :", err);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Afblock Escrow (Testnet)</h1>

      {!walletAddress ? (
        <button onClick={connectWallet}>Connecter Metamask</button>
      ) : (
        <p>Connecté : {walletAddress}</p>
      )}

      <hr />

      <h2>Créer un ordre</h2>
      <input
        type="text"
        placeholder="Montant en BNB"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={createOrder}>Créer</button>

      <hr />
      <h2>Order ID</h2>
      <input
        type="text"
        placeholder="Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />

      <h2>Accepter un ordre</h2>
      <button onClick={acceptOrder}>Accepter</button>

      <h2>Voir les détails d’un ordre</h2>
      <button onClick={fetchOrderDetails}>Voir détails</button>
      {orderDetails && (
        <div>
          <p><strong>Vendeur :</strong> {orderDetails.seller}</p>
          <p><strong>Acheteur :</strong> {orderDetails.buyer}</p>
          <p><strong>Montant :</strong> {ethers.formatEther(orderDetails.amount)} BNB</p>
          <p><strong>Créé le :</strong> {new Date(orderDetails.createdAt * 1000).toLocaleString()}</p>
          <p><strong>Complété :</strong> {orderDetails.completed ? "Oui" : "Non"}</p>
          <p><strong>Litige :</strong> {orderDetails.disputed ? "Oui" : "Non"}</p>
        </div>
      )}

      <hr />
      <h2>Confirmer réception paiement</h2>
      <button onClick={confirmPayment}>Confirmer</button>

      <h2>Ouvrir un litige</h2>
      <button onClick={openDispute}>Ouvrir un litige</button>

      <h2>Résoudre un litige (admin)</h2>
      <label>
        <input
          type="checkbox"
          checked={releaseToBuyer}
          onChange={(e) => setReleaseToBuyer(e.target.checked)}
        />
        Libérer vers l’acheteur ?
      </label>
      <button onClick={resolveDispute}>Résoudre</button>

      <hr />
      <h2>Admin : Retirer les commissions</h2>
      <button onClick={withdrawCommission}>Retirer</button>

      <h2>Admin du contrat</h2>
      <button onClick={fetchAdmin}>Voir l’admin</button>
      {adminAddress && <p><strong>Admin :</strong> {adminAddress}</p>}
    </div>
  );
}

export default App;
