import React, { useEffect, useState } from "react";
import "../styles/History.css";
import {
  canisterId,
  createActor,
} from "../../../declarations/cross_chain_asset_swap_backend";

export default function History({ principal }) {
  const [swaps, setSwaps] = useState([]);
  const backend = createActor(canisterId);

  const userId = principal?.toText?.() || principal;

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        if (!userId) return;
        const data = await backend.get_user_swaps(userId);
        console.log("Fetched swaps:", data);
        setSwaps(data);
      } catch (error) {
        console.error("Failed to fetch swap history:", error);
      }
    };

    fetchSwaps();
  }, [userId]);

  return (
    <main className="history-root fadeInUp">
      <h2 className="history-title">Transaction History</h2>
      <div className="history-list-box">
        {swaps.length > 0 ? (
          <ul>
            {swaps.map((swap) => (
              <li key={swap.swap_id}>
                <strong>ID:</strong> {swap.swap_id} |{" "}
                <strong>{getTokenName(swap.source_token)}</strong> →{" "}
                <strong>{getTokenName(swap.target_token)}</strong> |{" "}
                <strong>Amount:</strong>{" "}
                {(Number(swap.amount_sats?.toString?.()) / 100_000_000).toFixed(
                  8
                )}{" "}
                {getTokenName(swap.source_token)} | <strong>To:</strong>{" "}
                {swap.recipient_address} | <strong>Status:</strong>{" "}
                {swap.status === "Completed" ? "✔ Completed" : "⌛ Pending"}
              </li>
            ))}
          </ul>
        ) : (
          "No swaps found for this account."
        )}
      </div>
    </main>
  );
}

function getTokenName(token) {
  if (!token || typeof token !== "object") return "?";
  return Object.keys(token)[0];
}

function Stat({ label, value }) {
  return (
    <div className="history-stat-card">
      <div className="history-stat-value">{value}</div>
      <div className="history-stat-label">{label}</div>
    </div>
  );
}
