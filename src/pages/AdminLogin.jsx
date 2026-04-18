import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { SITE_CONFIG } from "../config/site";

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (password === SITE_CONFIG.adminPassword) {
        onLogin();
      } else {
        setError("Incorrect password. Please try again.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: "100vh",
      paddingTop: "var(--nav-height)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-bg)",
      padding: "calc(var(--nav-height) + 2rem) 1rem 4rem",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border)",
        padding: "2.5rem",
        boxShadow: "var(--shadow-lg)",
      }}>
        {/* Icon */}
        <div style={{
          width: 56, height: 56,
          borderRadius: "50%",
          background: "var(--color-accent-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "1.5rem",
        }}>
          <Lock size={24} color="var(--color-accent)" />
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: 26, fontWeight: 700,
          marginBottom: "0.5rem",
        }}>Admin Access</h1>
        <p style={{ color: "var(--color-text-muted)", fontSize: 14, marginBottom: "2rem" }}>
          Enter your password to manage props inventory.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{
            display: "block",
            fontSize: 12, fontWeight: 500,
            textTransform: "uppercase", letterSpacing: "0.05em",
            color: "var(--color-text-muted)",
            marginBottom: 6,
          }}>Password</label>

          <div style={{ position: "relative", marginBottom: "1.25rem" }}>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter admin password"
              autoFocus
              style={{
                width: "100%",
                padding: "12px 44px 12px 14px",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${error ? "var(--color-red)" : "var(--color-border)"}`,
                fontSize: 15,
                outline: "none",
                background: "var(--color-surface)",
                color: "var(--color-text)",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
              onBlur={e => e.target.style.borderColor = error ? "var(--color-red)" : "var(--color-border)"}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-muted)",
                background: "none", border: "none", cursor: "pointer",
              }}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <p style={{ color: "var(--color-red)", fontSize: 13, marginBottom: "1rem" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "var(--radius-lg)",
              background: loading || !password ? "var(--color-border)" : "var(--color-accent)",
              color: loading || !password ? "var(--color-text-muted)" : "white",
              fontWeight: 500, fontSize: 15,
              border: "none", cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Checking..." : "Enter Admin Panel"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: "var(--color-text-light)", marginTop: "1.5rem" }}>
          Default password is set in <code style={{ fontSize: 11, background: "var(--color-surface-2)", padding: "2px 6px", borderRadius: 4 }}>src/config/site.js</code>
        </p>
      </div>
    </div>
  );
}
