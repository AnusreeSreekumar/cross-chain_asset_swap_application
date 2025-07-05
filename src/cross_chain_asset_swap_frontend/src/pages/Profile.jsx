import React from "react";
import "../styles/Profile.css";

/**
 * Profile page.
 * @param {object|null} userProfile - Should come from backend.
 *
 * TODO: Display real profile info fetched from backend.
 */
export default function Profile({ userProfile }) {
  return (
    <main className="profile-root fadeInUp">
      <h2 className="profile-title">Profile</h2>
      <div className="profile-info">
        {/* TODO: Replace below with real info from backend */}
        <div><strong>Wallet Address:</strong> (from backend)</div>
        <div><strong>Member Since:</strong> (from backend)</div>
        <div><strong>Status:</strong> (from backend)</div>
      </div>
    </main>
  );
}