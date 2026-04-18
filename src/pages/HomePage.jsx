import { Link } from "react-router-dom";
import { ArrowRight, Star, Phone } from "lucide-react";
import PropCard from "../components/PropCard";
import { SITE_CONFIG } from "../config/site";

export default function HomePage({ props }) {
  const published = props.filter(p => p.published !== false);
  const featured = published.filter(p => p.available).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #1A1714 0%, #2D2420 50%, #3D2E28 100%)",
        padding: "calc(var(--nav-height) + 4rem) clamp(1rem,5vw,3rem) 4rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: "10%", right: "5%",
          width: 400, height: 400, borderRadius: "50%",
          border: "1px solid rgba(139,94,60,0.2)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "15%", right: "8%",
          width: 280, height: 280, borderRadius: "50%",
          border: "1px solid rgba(139,94,60,0.15)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-5%", left: "-5%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,94,60,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 99,
              border: "1px solid rgba(139,94,60,0.4)",
              marginBottom: "2rem",
            }}>
              <Star size={12} fill="var(--color-accent)" color="var(--color-accent)" />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Premium Props for Rent
              </span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}>
              Every Shoot<br />
              <span style={{ color: "var(--color-accent)" }}>Deserves</span><br />
              the Right Props
            </h1>

            <p style={{
              fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
              maxWidth: 520,
            }}>
              Hand-curated props for film sets, photo studios, events, and productions. 
              Browse our collection and bring your creative vision to life.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link to="/browse" style={{
                padding: "14px 28px",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-accent)",
                color: "white",
                fontWeight: 500,
                fontSize: 15,
                display: "flex", alignItems: "center", gap: 8,
                transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--color-accent-dark)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--color-accent)"}
              >
                Browse All Props <ArrowRight size={16} />
              </Link>
              <a href={`tel:${SITE_CONFIG.phone}`} style={{
                padding: "14px 28px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 500,
                fontSize: 15,
                display: "flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.06)",
              }}>
                <Phone size={16} /> Call to Book
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "3rem", marginTop: "4rem", flexWrap: "wrap" }}>
              {[
                [published.length + "+", "Props Available"],
                [published.filter(p => p.available).length + "", "Ready to Rent"],
                ["Same Day", "Delivery Possible"],
              ].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "white" }}>{val}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Props */}
      <section style={{ padding: "5rem clamp(1rem,5vw,3rem)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, color: "var(--color-accent)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
                Featured
              </p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700 }}>
                Available Right Now
              </h2>
            </div>
            <Link to="/browse" style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 14, fontWeight: 500,
              color: "var(--color-accent)",
            }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--color-text-muted)" }}>
              No props available yet.
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}>
              {featured.map(prop => (
                <PropCard key={prop.id} prop={prop} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        padding: "5rem clamp(1rem,5vw,3rem)",
        background: "var(--color-accent-light)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", fontWeight: 700, marginBottom: "1rem" }}>
            Need Something Specific?
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: 16, marginBottom: "2rem", lineHeight: 1.7 }}>
            Can't find exactly what you're looking for? Call us directly — we might have it in storage, 
            or can source it for you.
          </p>
          <a href={`tel:${SITE_CONFIG.phone}`} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-accent)",
            color: "white",
            fontWeight: 500,
            fontSize: 16,
          }}>
            <Phone size={18} /> {SITE_CONFIG.phone}
          </a>
          <p style={{ marginTop: "1rem", fontSize: 13, color: "var(--color-text-light)" }}>
            Available 9am – 7pm, 7 days a week
          </p>
        </div>
      </section>
    </div>
  );
}
