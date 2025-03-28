import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminPanel from "./components/AdminPanel/AdminPanel";

export default function App() {
  return (
    <Router>
      <div className="max-w-3xl mx-auto p-4">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adminPanel" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}
