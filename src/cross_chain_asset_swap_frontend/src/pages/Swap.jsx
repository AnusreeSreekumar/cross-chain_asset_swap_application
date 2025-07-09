import React, { useState, useEffect } from "react";
import "../styles/Swap.css";
import {
  canisterId,
  idlFactory,
} from "../../../declarations/cross_chain_asset_swap_backend";

export default function Swap({ principal, isWalletConnected }) {
  const tokens = ["BTC", "ICP", "ETH"];
  const [inputToken, setInputToken] = useState("BTC");
  const [outputToken, setOutputToken] = useState("ICP");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  useEffect(() => {
    const fetchConvertedAmount = async () => {
      if (!inputAmount || isNaN(inputAmount)) {
        setOutputAmount("");
        return;
      }

      try {
        const backend = await window.ic.plug.createActor({
          canisterId,
          interfaceFactory: idlFactory,
        });

        const result = await backend.swap_tokens(
          { [inputToken]: null },
          { [outputToken]: null },
          parseFloat(inputAmount)
        );

        setOutputAmount(result.toString());
      } catch (e) {
        console.error("Conversion failed:", e);
        setOutputAmount("Error");
      }
    };

    fetchConvertedAmount();
  }, [inputToken, outputToken, inputAmount]);

  async function handleSwap() {
    if (!principal || !isWalletConnected) {
      return window.alert("Wallet not connected.");
    }

    try {
      // Ensure Plug is connected to localhost with the backend in whitelist
      await window.ic.plug.requestConnect({
        whitelist: [canisterId],
        host: "http://127.0.0.1:4943",
      });

      const actor = await window.ic.plug.createActor({
        canisterId,
        interfaceFactory: idlFactory,
      });

      const response = await actor.create_swap(
        principal.toText(),
        BigInt(inputAmount),
        recipientAddress,
        { [inputToken]: null },
        { [outputToken]: null }
      );

      console.log("Swap result:", response);
      window.alert(`Swap successful! Response: ${JSON.stringify(response)}`);
    } catch (error) {
      console.error("Swap failed:", error);
      window.alert(`Swap failed: ${error.message}`);
    }
  }

  return (
    <main className="swap-main fadeInUp">
      <h2 className="swap-title">Swap your Assets</h2>

      <div className="swap-card-row">
        {tokens.map((token) => (
          <TokenCard key={token} name={token} />
        ))}
      </div>

      <form
        className="swap-form-box"
        onSubmit={(e) => {
          e.preventDefault();
          handleSwap();
        }}
      >
        <div className="swap-form-row">
          <select
            className="swap-select"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
          >
            {tokens.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
          <input
            className="swap-input"
            placeholder="Amount"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
          />
        </div>

        <button
          className="swap-switch-btn"
          type="button"
          onClick={() => {
            setInputToken(outputToken);
            setOutputToken(inputToken);
            setInputAmount(outputAmount);
            setOutputAmount(inputAmount);
          }}
        >
          ⇅
        </button>

        <div className="swap-form-row">
          <select
            className="swap-select"
            value={outputToken}
            onChange={(e) => setOutputToken(e.target.value)}
          >
            {tokens.map((token) => (
              <option key={token} value={token}>
                {token}
              </option>
            ))}
          </select>
          <input
            className="swap-input"
            placeholder="Output amount"
            value={outputAmount}
            disabled
          />
        </div>

        <div className="swap-form-row">
          <input
            className="swap-input"
            placeholder="Recipient address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </div>

        <button className="swap-btn" type="submit">
          Swap
        </button>
      </form>
    </main>
  );
}

function TokenCard({ name }) {
  const colors = { BTC: "#FF9900", ICP: "#4bb1ff", ETH: "#627eea" };
  const icons = {
    BTC: "₿",
    ICP: "⛓️",
    ETH: (
      <svg width="20" height="20" viewBox="0 0 32 32" style={{ verticalAlign: "sub" }}>
        <polygon fill="#fff" points="16,3 16,23 27,16.5 " />
        <polygon fill="#627eea" points="16,3 5,16.5 16,23 " />
        <polygon fill="#fff" opacity="0.7" points="16,29 16,23 27,16.5 " />
        <polygon fill="#627eea" opacity="0.7" points="16,29 16,23 5,16.5 " />
      </svg>
    ),
  };

  return (
    <div className="swap-token-card" style={{ borderColor: colors[name] }}>
      <div className="swap-token-icon" style={{ color: colors[name] }}>
        {icons[name]}
      </div>
      <div className="swap-token-title">{name}</div>
      <div className="swap-token-value">0</div>
      <div className="swap-token-usd">≈ $0</div>
    </div>
  );
}
