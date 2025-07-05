import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Route guard: Use your backend wallet connection state here.
 */
export default function ProtectedRoute({ isWalletConnected, children }) {
  if (!isWalletConnected) return <Navigate to="/" replace />;
  return children;
}