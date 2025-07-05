// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import styles from "./Header.module.css";

// export default function Header({ isConnected, onConnectWallet, onDisconnectWallet }) {
//   const { pathname } = useLocation();

//   return (
//     <nav className={styles.headerBar}>
//       <div className={styles.logoArea}>
//         <div className={styles.logo}>⇄</div>
//         <span className={styles.title}>ChainSwap</span>
//         <span className={styles.badge}>ICP Powered</span>
//       </div>
//       <div className={styles.navLinks}>
//         <NavTab to="/dashboard" active={pathname === "/dashboard"}>Dashboard</NavTab>
//         <NavTab to="/swap" active={pathname === "/swap"}>Swap</NavTab>
//         <NavTab to="/history" active={pathname === "/history"}>History</NavTab>
//       </div>
//       <div className={styles.walletArea}>
//         {!isConnected ? (
//           <button className={styles.connectBtn} onClick={onConnectWallet}>
//             Connect Wallet
//           </button>
//         ) : (
//           <span className={styles.userProfile}>
//             Wallet Connected
//             <button className={styles.disconnectBtn} onClick={onDisconnectWallet}>Disconnect</button>
//           </span>
//         )}
//       </div>
//     </nav>
//   );
// }

// function NavTab({ to, active, children }) {
//   return (
//     <Link
//       to={to}
//       className={`${styles.navBtn} ${active ? styles.navBtnActive : ""}`}
//     >
//       {children}
//     </Link>
//   );
// }

import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Header.css";

/**
 * Header navigation.
 * @param {boolean} isWalletConnected - Should come from backend/wallet.
 * @param {object|null} userProfile - Should come from backend.
 */
export default function Header({ isWalletConnected, userProfile }) {
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
        {/* 
          // TODO: Show profile info or disconnect/logout here using backend logic.
          // Example: if (userProfile) { ... }
        */}
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