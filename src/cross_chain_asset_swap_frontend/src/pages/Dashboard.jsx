import React from "react";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <h1 className={styles.mainTitle}>Cross-Chain Asset Swaps</h1>
        <div className={styles.subTitle}>
          Seamlessly swap Bitcoin and other cryptocurrencies within the Internet Computer ecosystem. Secure, trustless, and powered by Chain-Key cryptography.
        </div>
        <div className={styles.features}>
          <FeatureCard
            icon="🛡️"
            title="Secure"
            desc="Chain-Key cryptography ensures trustless transactions"
            delay={0.2}
          />
          <FeatureCard
            icon="⚡"
            title="Fast"
            desc="Lightning-fast swaps on the Internet Computer"
            delay={0.4}
          />
          <FeatureCard
            icon="📈"
            title="Efficient"
            desc="Low fees and optimal exchange rates"
            delay={0.6}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div className={styles.featureCard} style={{ animationDelay: `${delay}s` }}>
      <div className={styles.cardIcon}>{icon}</div>
      <div className={styles.cardTitle}>{title}</div>
      <div className={styles.cardDesc}>{desc}</div>
    </div>
  );
}