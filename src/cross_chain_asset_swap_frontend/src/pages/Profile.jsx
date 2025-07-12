import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import {
  canisterId,
  createActor,
} from "../../../declarations/cross_chain_asset_swap_backend";

export default function Profile({ principal }) {
  const [profile, setProfile] = useState(null);
  const backend = createActor(canisterId);

  const userId = principal?.toText?.() || principal;
  console.log("User ID:", userId);
  console.log("Principal value (raw):", principal);
  console.log("Resolved userId:", userId);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) return;
        const data = await backend.get_user_profile(userId);
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  async function claim_tokens() {
    try {
      if (!userId) return;
      await backend.claim_test_tokens(userId);
      const updated = await backend.get_user_profile(userId);
      setProfile(updated);
    } catch (error) {
      console.error("Failed to add initial balance:", error);
    }
  }

  return (
    <main className="profile-root fadeInUp">
      <h2 className="profile-title">Profile</h2>
      <div className="profile-info">
        <div>
          <strong>Wallet Address:</strong>{" "}
          {profile?.wallet_address ?? "Loading..."}
        </div>
        <div>
          <strong>Member Since:</strong> {profile?.member_since ?? "Loading..."}
        </div>
        <div>
          <strong>Account Balance:</strong>{" "}
          {profile?.balance !== undefined
            ? `${profile.balance} ICP`
            : "Loading..."}
        </div>
        <div>
          <strong>Status:</strong> {profile?.status ?? "Loading..."}
        </div>
        <div className="profile-claim-button">
          <button
            className="claim-btn"
            onClick={(e) => {
              e.preventDefault();
              claim_tokens();
            }}
          >
            Claim Test Tokens
          </button>
        </div>
      </div>
    </main>
  );
}
