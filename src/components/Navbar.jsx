import { useEffect, useState } from "react";
import { ethers } from "ethers";
import logo from "@/assets/favicon_32x32.png";

export default function Navbar() {
  const [address, setAddress] = useState("");

  useEffect(() => {
    const getAddress = async () => {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAddress(addr);
    };
    getAddress();
  }, []);

  return (
    <div className="flex items-center gap-4 mb-4">
      <img src={logo} alt="Afblock Logo" className="w-8 h-8 rounded" />
      <div className="bg-gray-100 text-sm text-black px-3 py-1 rounded-lg shadow">
        Connecté : {address.slice(0, 6)}...{address.slice(-4)}
      </div>
    </div>
  );
}
