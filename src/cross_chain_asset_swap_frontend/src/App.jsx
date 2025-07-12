import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Swap from "./pages/Swap";
import History from "./pages/History";
import Profile from "./pages/Profile";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [principal, setPrincipal] = useState("");
  const navigate = useNavigate();

  const handleDisconnect = async () => {
    try {
      if (window.ic?.plug?.disconnect) {
        await window.ic.plug.disconnect();
        console.log("Disconnected from Plug Wallet");
      }

      localStorage.removeItem("identity");
      setIsWalletConnected(false);
      setPrincipal("");
      navigate("/");
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };


 return (
    <>
      <Header
        isWalletConnected={isWalletConnected}
        userProfile={principal}
        onDisconnect={handleDisconnect}
      />
      <Routes>
        <Route
          path="/"
          element={
            isWalletConnected ? (
              <Navigate to="/swap" replace />
            ) : (
              <Landing
                setIsWalletConnected={setIsWalletConnected}
                setPrincipal={setPrincipal}
                principal={principal}
              />
            )
          }
        />
        <Route
          path="/swap"
          element={
            <ProtectedRoute isWalletConnected={isWalletConnected}>
              <Swap
                principal={principal}
                isWalletConnected={isWalletConnected}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute isWalletConnected={isWalletConnected}>
              <History 
                 principal={principal}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isWalletConnected={isWalletConnected}>
              <Profile 
                principal={principal}
              />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
