import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

/**
 * Header navigation.
 * @param {boolean} isWalletConnected - Whether a wallet is connected.
 * @param {object|null} userProfile - Optional user info.
 * @param {function} onDisconnect - Callback to disconnect wallet or II.
 */
export default function Header({ isWalletConnected, userProfile, onDisconnect }) {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <div className="header-left">
        <span className="logo">⇄</span>
        <span className="title">ChainSwap</span>
      </div>

      <nav className="header-nav">
        {isWalletConnected && (
          <>
            <NavLink to="/swap" label="Swap" active={pathname === "/swap"} />
            <NavLink to="/history" label="History" active={pathname === "/history"} />
            <NavLink to="/profile" label="Profile" active={pathname === "/profile"} />
          </>
        )}
        <NavLink to="/about" label="About Us" active={pathname === "/about"} />
      </nav>

      <div className="header-right">
        {isWalletConnected && (
          <button className="disconnect-button" onClick={onDisconnect}>
            Disconnect
          </button>
        )}
      </div>
    </header>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} className={`header-link${active ? " active" : ""}`}>
      {label}
    </Link>
  );
}
