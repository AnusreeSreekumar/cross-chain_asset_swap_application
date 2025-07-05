import React from "react";
import "../styles/Landing.css";

/**
 * Landing page.
 * TODO: Connect wallet logic (button) should be triggered from backend/wallet integration.
 */
export default function Landing() {
  return (
    <div className="landing-root">
      <div className="landing-box animate-zoom">
        <div className="landing-header">
          <span className="landing-logo">⇄</span>
          <h1>ChainSwap</h1>
        </div>
        <h2 className="landing-title">Seamless Cross-Chain Asset Swaps</h2>
        <p className="landing-summary">
          <span className="glow">Your gateway to secure, fast, and trustless swaps between BTC, ICP, and ETH.</span>
          <br /><br />
          <b>Our mission:</b> Enable freedom and interoperability for digital assets.<br />
          <b>Our vision:</b> Unifying blockchains, one swap at a time.
        </p>
        {/* 
          // TODO: 
          // The Connect Wallet button below should trigger your backend/wallet connection logic.
          // Remove this button and replace with your backend wallet trigger.
        */}
        <button className="landing-connect-btn" disabled>
          Connect Wallet (Handled by Backend)
        </button>
        <div className="landing-footer">
          Powered by Internet Computer Protocol
        </div>
      </div>
    </div>
  );
}