import { Link } from "react-router-dom";
import { Phone, Mail, Instagram, MapPin } from "lucide-react";
import { SITE_CONFIG } from "../config/site";

export default function Footer() {
  return (
    <footer id="contact" style={{
      background: "var(--color-text)",
      color: "rgba(255,255,255,0.7)",
      padding: "4rem clamp(1rem,5vw,3rem) 2rem",
      marginTop: "auto",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "3rem",
          marginBottom: "3rem",
        }}>
          {/* Brand */}
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "white", marginBottom: "1rem" }}>
              {SITE_CONFIG.businessName}
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>{SITE_CONFIG.tagline}</p>
            <p style={{ fontSize: 14, marginTop: "0.75rem" }}>{SITE_CONFIG.address}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "white", fontWeight: 500, marginBottom: "1rem", fontSize: 15 }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Browse All Props", "/browse"], ["Home", "/"], ["Admin", "/admin"]].map(([label, href]) => (
                <Link key={label} to={href} style={{ fontSize: 14, transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "white"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}
                >{label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div id="about">
            <h4 style={{ color: "white", fontWeight: 500, marginBottom: "1rem", fontSize: 15 }}>Get in Touch</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href={`tel:${SITE_CONFIG.phone}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                <Phone size={15} /> {SITE_CONFIG.phone}
              </a>
              <a href={`https://wa.me/${SITE_CONFIG.whatsapp}`} target="_blank" rel="noreferrer"
                style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                <Phone size={15} /> WhatsApp
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                <Mail size={15} /> {SITE_CONFIG.email}
              </a>
              <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                <Instagram size={15} /> {SITE_CONFIG.instagram}
              </a>
              <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}>
                <MapPin size={15} /> {SITE_CONFIG.address}
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 13 }}>© {new Date().getFullYear()} {SITE_CONFIG.businessName}. All rights reserved.</p>
          <p style={{ fontSize: 13 }}>
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/chamithmendis/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "rgba(255,255,255,0.85)", textDecoration: "underline", textUnderlineOffset: 3, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.85)"}
            >
              Chamith Mendis
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
