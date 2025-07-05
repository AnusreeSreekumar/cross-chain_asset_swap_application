import React from "react";
import "../styles/About.css";

/**
 * About page.
 * Static content.
 */
export default function About() {
  return (
    <main className="about-root fadeInUp">
      <h2 className="about-title">About ChainSwap</h2>
      <section className="about-section">
        <h3>Summary</h3>
        <p>
          ChainSwap is a decentralized protocol enabling trustless, cross-chain swaps between Bitcoin, Internet Computer, and Ethereum.<br />
          Our platform brings seamless interoperability, low fees, and robust security to digital asset trading.
        </p>
      </section>
      <section className="about-section">
        <h3>Vision</h3>
        <p>
          To unify all blockchains and make decentralized finance accessible, secure, and efficient for everyone.
        </p>
      </section>
      <section className="about-section">
        <h3>Mission</h3>
        <p>
          Empower users to move and swap their assets freely across different blockchains, without intermediaries or trust assumptions.
        </p>
      </section>
    </main>
  );
}