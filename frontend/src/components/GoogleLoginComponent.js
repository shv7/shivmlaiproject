import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";

/**
 * GoogleLoginComponent
 * Uses @react-oauth/google (implicit flow).
 * Decodes the ID token to extract name, email, picture.
 * Calls onLoginSuccess(userData) when complete.
 *
 * Install: npm install @react-oauth/google
 * Wrap App in: <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
 */

function decodeJWT(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch { return null; }
}

export default function GoogleLoginComponent({ onLoginSuccess, accentColor = "#00d4ff" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError(null);
      try {
        /* Fetch user info from Google API using access token */
        const res  = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const info = await res.json();
        const userData = {
          name:      info.name  || info.given_name || "Learner",
          email:     info.email || "",
          picture:   info.picture || "",
          loginType: "google",
        };
        onLoginSuccess(userData);
      } catch (e) {
        setError("Could not fetch your Google profile. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => { setError("Google login was cancelled or failed."); },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <button
        onClick={() => { setError(null); login(); }}
        disabled={loading}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "#fff", border: "1px solid #ddd",
          borderRadius: 10, padding: "12px 24px",
          cursor: loading ? "default" : "pointer",
          fontWeight: 700, fontSize: 15, color: "#1f2937",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          opacity: loading ? 0.7 : 1, transition: "all 0.2s",
        }}
      >
        {loading ? (
          <span style={{ fontSize: 18, animation: "spin 1s linear infinite" }}>⟳</span>
        ) : (
          /* Google G icon as SVG */
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
        )}
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
      {error && (
        <div style={{ color: "#ef4444", fontSize: 13, textAlign: "center", maxWidth: 260 }}>{error}</div>
      )}
      <p style={{ color: "#64748b", fontSize: 11, textAlign: "center", maxWidth: 260 }}>
        Your data stays in your browser. No account database until backend is added.
      </p>
    </div>
  );
}
