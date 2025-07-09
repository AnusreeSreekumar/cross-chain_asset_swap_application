import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Landing.css";
import { AuthClient } from "@dfinity/auth-client";

/**
 * Landing page.
 * TODO: Connect wallet logic (button) should be triggered from backend/wallet integration.
 */
export default function Landing({ setIsWalletConnected, setPrincipal, principal }) {
  
  const navigate = useNavigate();

  //Internet Identity Connection
  const connectIdentity = async () => {
    const authClient = await AuthClient.create();
    try {
      await authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principalText = identity.getPrincipal().toText();
          console.log("Principal:", principalText);
          setPrincipal(principalText);
          setIsWalletConnected(true);
          navigate("/swap"); 
        },
      });
    } catch (error) {
      alert("Identity connection failed.");
    }
  };

  // Plug Wallet Connect
  const connectPlug = async () => {
    if (window.ic && window.ic.plug) {
      try {
        const connected = await window.ic.plug.requestConnect();
        if (connected) {
          const principalId = await window.ic.plug.getPrincipal();
          console.log("Principal:", principalId);
          setPrincipal(principalId);
          setIsWalletConnected(true);
          navigate("/swap");  
        }
      } catch (e) {
        alert("Plug connection failed.");
      }
    } else {
      alert("Plug wallet not found. Please install the Plug extension.");
    }
  };

  return (
    <div className="landing-root">
      <div className="landing-box animate-zoom">
        <div className="landing-header">
          <span className="landing-logo">⇄</span>
          <h1>ChainSwap</h1>
        </div>
        <h2 className="landing-title">Seamless Cross-Chain Asset Swaps</h2>
        <p className="landing-summary">
          <span className="glow">
            Your gateway to secure, fast, and trustless swaps between BTC, ICP,
            and ETH.
          </span>
          <br />
          <br />
          <b>Our mission:</b> Enable freedom and interoperability for digital
          assets.
          <br />
          <b>Our vision:</b> Unifying blockchains, one swap at a time.
        </p>
        {/* 
          // TODO: 
          // The Connect Wallet button below should trigger your backend/wallet connection logic.
          // Remove this button and replace with your backend wallet trigger.
        */}
        {/* <button className="landing-connect-btn" disabled>
          Connect Wallet (Handled by Backend)
        </button> */}
        {/* Wallet Connect Buttons */}
        <div style={{ marginBottom: "1rem" }}>
          <button className="landing-connect-btn" onClick={connectIdentity}>
            Connect Internet Identity
          </button>
          <button
            className="landing-connect-btn"
            onClick={connectPlug}
            style={{ marginLeft: "1rem" }}
          >
            Connect Plug Wallet
          </button>
        </div>
        <div className="landing-footer">
          Powered by Internet Computer Protocol
        </div>
      </div>
    </div>
  );
}
