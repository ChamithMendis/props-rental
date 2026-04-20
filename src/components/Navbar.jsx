import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { SITE_CONFIG } from "../config/site";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: "var(--nav-height)",
      background: scrolled ? "rgba(250,248,245,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid var(--color-border)" : "none",
      transition: "all 0.3s ease",
      display: "flex", alignItems: "center",
      padding: "0 clamp(1rem, 5vw, 3rem)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 1280, margin: "0 auto" }}>
        {/* Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/logo.jpeg" alt={SITE_CONFIG.businessName} style={{ height: 44, width: "auto", objectFit: "contain" }} />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-text)" }}>
            {SITE_CONFIG.businessName}
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          {[["Browse Props", "/browse"], ["About", "/#about"], ["Contact", "/#contact"]].map(([label, href]) => (
            <Link key={label} to={href} style={{
              fontSize: 14, fontWeight: 500,
              color: pathname === href ? "var(--color-accent)" : "var(--color-text-muted)",
              transition: "color 0.2s",
            }}>{label}</Link>
          ))}
          <a href={`tel:${SITE_CONFIG.phone}`} style={{
            padding: "8px 20px", borderRadius: "var(--radius-lg)",
            background: "var(--color-accent)", color: "white",
            fontSize: 13, fontWeight: 500, letterSpacing: "0.02em",
            transition: "background 0.2s",
          }}>{SITE_CONFIG.phone}</a>
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} style={{ display: "none", color: "var(--color-text)" }} className="burger">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          position: "fixed", top: "var(--nav-height)", left: 0, right: 0,
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          padding: "1.5rem 2rem",
          display: "flex", flexDirection: "column", gap: 20,
          boxShadow: "var(--shadow-md)",
        }}>
          {[["Browse Props", "/browse"], ["About", "/#about"], ["Contact", "/#contact"]].map(([label, href]) => (
            <Link key={label} to={href} style={{ fontSize: 16, fontWeight: 500, color: "var(--color-text)" }}>{label}</Link>
          ))}
          <a href={`tel:${SITE_CONFIG.phone}`} style={{
            padding: "12px 20px", borderRadius: "var(--radius-md)",
            background: "var(--color-accent)", color: "white",
            fontWeight: 500, textAlign: "center",
          }}>{SITE_CONFIG.phone}</a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .burger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
