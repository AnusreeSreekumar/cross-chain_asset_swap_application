import React, { useState, useEffect } from "react";
import "../styles/Swap.css";
import {
  canisterId,
  createActor,
} from "../../../declarations/cross_chain_asset_swap_backend";

/**
 * Swap page.
 * TODO: Fetch balances, swap rates, and swap actions from backend/wallet.
 * No dummy values present.
 */
export default function Swap({ principal, isWalletConnected }) {
  // TODO: Get these from backend
  // const balances = { BTC: ..., ICP: ..., ETH: ... }
  // const prices = { BTC: ..., ICP: ..., ETH: ... }

  // Example placeholder UI with no values
  const tokens = ["BTC", "ICP", "ETH"];
  const backend = createActor(canisterId);

  const [inputToken, setInputToken] = useState("BTC");
  const [outputToken, setOutputToken] = useState("ICP");
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");

  const [tokenConversions, setTokenConversions] = useState({
    BTC: { ICP: null, ETH: null, USD: null },
    ICP: { BTC: null, ETH: null, USD: null },
    ETH: { BTC: null, ICP: null, USD: null },
  });

  useEffect(() => {
    const fetchConvertedAmount = async () => {
      if (!inputAmount || isNaN(inputAmount)) {
        setOutputAmount("");
        return;
      }
      try {
        // Call your backend swap_tokens function
        // Adjust the argument order/types as per your backend definition
        const result = await backend.swap_tokens(
          { [inputToken]: null },
          { [outputToken]: null },
          parseFloat(inputAmount)
        );
        console.log(result);

        setOutputAmount(result.toString());
      } catch (e) {
        setOutputAmount("Error");
      }
    };

    fetchConvertedAmount();
  }, [inputToken, outputToken, inputAmount]);

  useEffect(() => {
    const fetchAllConversions = async () => {
      try {
        const ratesArray = await backend.all_token_rates();
        const usdRates = Object.fromEntries(
          ratesArray.map((r) => [r.token, r.usd])
        );

        const conversions = {
          BTC: {
            ICP: await backend.swap_tokens({ BTC: null }, { ICP: null }, 1),
            ETH: await backend.swap_tokens({ BTC: null }, { ETH: null }, 1),
            USD: usdRates["BTC"],
          },
          ICP: {
            BTC: await backend.swap_tokens({ ICP: null }, { BTC: null }, 1),
            ETH: await backend.swap_tokens({ ICP: null }, { ETH: null }, 1),
            USD: usdRates["ICP"],
          },
          ETH: {
            BTC: await backend.swap_tokens({ ETH: null }, { BTC: null }, 1),
            ICP: await backend.swap_tokens({ ETH: null }, { ICP: null }, 1),
            USD: usdRates["ETH"],
          },
        };

        setTokenConversions(conversions);
      } catch (error) {
        console.error("Failed to fetch conversions", error);
      }
    };

    fetchAllConversions();
  }, []);

  async function handleSwap() {
    if (!principal || !isWalletConnected) {
      window.alert("Wallet not connected.");
      return;
    }

    console.log("principal", principal);
    console.log("Calling canisterId:", canisterId);

    try {
      const response = await backend.create_swap(
        typeof principal === "string" ? principal : principal.toText(),
        Number(inputAmount),
        recipientAddress, 
        { [inputToken]: null }, 
        { [outputToken]: null }
      );

      console.log("Swap result:", response);
      window.alert(`Swap successful! ID: ${response.swap_id}`);
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
          <TokenCard
            key={token}
            name={token}
            value={tokenConversions[token]}
            usd={tokenConversions[token]?.USD}
          />
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
            // Swap input and output tokens
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

function TokenCard({ name, value = {}, usd }) {
  const colors = { BTC: "#FF9900", ICP: "#4bb1ff", ETH: "#627eea" };
  const icons = {
    BTC: "₿",
    ICP: "⛓️",
    ETH: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 32 32"
        style={{ verticalAlign: "sub" }}
      >
        <polygon fill="#fff" points="16,3 16,23 27,16.5 " />
        <polygon fill="#627eea" points="16,3 5,16.5 16,23 " />
        <polygon fill="#fff" opacity="0.7" points="16,29 16,23 27,16.5 " />
        <polygon fill="#627eea" opacity="0.7" points="16,29 16,23 5,16.5 " />
      </svg>
    ),
  };

  const formattedRates =
    value &&
    Object.entries(value)
      .filter(([key]) => key !== "USD" && value[key] != null)
      .map(([key, val]) => (
        <div key={key}>
          {Number(val).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}{" "}
          {key}
        </div>
      ));

  return (
    <div className="swap-token-card" style={{ borderColor: colors[name] }}>
      <div className="swap-token-icon" style={{ color: colors[name] }}>
        {icons[name]}
      </div>
      <div className="swap-token-title">{name}</div>
      <div className="swap-token-value">
        <div className="conversion-list">{formattedRates || "Loading..."}</div>
      </div>
      <div className="swap-token-usd">
        ≈ ${usd ? usd.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"}
      </div>
    </div>
  );
}


