import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Phone, MessageCircle, ArrowLeft, Calendar, Clock, Package, Tag, Ruler, ChevronLeft, ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "../config/site";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23F3F0EB'/%3E%3Ctext x='400' y='305' font-family='sans-serif' font-size='18' fill='%239E9890' text-anchor='middle'%3ENo image provided%3C/text%3E%3C/svg%3E";

export default function ItemDetailPage({ propsState }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const prop = propsState.props.find(p => p.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [pricingMode, setPricingMode] = useState("day");

  if (!prop) {
    return (
      <div style={{ paddingTop: "calc(var(--nav-height) + 4rem)", textAlign: "center", padding: "8rem 2rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 16 }}>Prop not found</h2>
        <Link to="/browse" style={{ color: "var(--color-accent)" }}>← Back to Browse</Link>
      </div>
    );
  }

  const images = prop.images?.length ? prop.images : [PLACEHOLDER];
  const showDay = prop.showPricePerDay !== false;
  const showHour = prop.showPricePerHour !== false;
  const availableModes = [showDay && "day", showHour && "hour"].filter(Boolean);
  const activePricingMode = availableModes.includes(pricingMode) ? pricingMode : (availableModes[0] ?? "day");
  const price = activePricingMode === "day" ? prop.pricePerDay : prop.pricePerHour;
  const message = encodeURIComponent(`Hi! I'm interested in renting: ${prop.name}\nCategory: ${prop.category}\nPlease let me know availability and details.`);

  const nextImg = () => setActiveImg((activeImg + 1) % images.length);
  const prevImg = () => setActiveImg((activeImg - 1 + images.length) % images.length);

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem clamp(1rem,5vw,3rem)" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
          <button onClick={() => navigate(-1)} style={{
            display: "flex", alignItems: "center", gap: 6,
            color: "var(--color-text-muted)", fontSize: 14,
            cursor: "pointer", border: "none", background: "none",
          }}>
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ color: "var(--color-border-dark)" }}>/</span>
          <Link to="/browse" style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Browse</Link>
          <span style={{ color: "var(--color-border-dark)" }}>/</span>
          <span style={{ fontSize: 14, color: "var(--color-text)" }}>{prop.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: "3rem", alignItems: "start" }} className="detail-layout">
          {/* Gallery */}
          <div>
            {/* Main image */}
            <div style={{
              position: "relative",
              paddingTop: "75%",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              background: "var(--color-surface-2)",
              marginBottom: "1rem",
            }}>
              <img
                src={images[activeImg]}
                alt={prop.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.target.src = PLACEHOLDER; }}
              />

              {/* Availability badge */}
              <div style={{
                position: "absolute", top: 16, left: 16,
                padding: "6px 14px", borderRadius: 99,
                fontSize: 13, fontWeight: 500,
                background: prop.available ? "var(--color-green-light)" : "var(--color-red-light)",
                color: prop.available ? "var(--color-green)" : "var(--color-red)",
              }}>
                {prop.available ? "✓ Available" : "✗ Currently Rented"}
              </div>

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImg} style={{
                    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                    width: 40, height: 40, borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}><ChevronLeft size={20} /></button>
                  <button onClick={nextImg} style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    width: 40, height: 40, borderRadius: "50%",
                    background: "rgba(255,255,255,0.9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}><ChevronRight size={20} /></button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{
                    flexShrink: 0, width: 80, height: 60,
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: `2px solid ${i === activeImg ? "var(--color-accent)" : "transparent"}`,
                    cursor: "pointer",
                  }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.target.src = PLACEHOLDER; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div style={{ position: "sticky", top: "calc(var(--nav-height) + 1.5rem)" }}>
            <div style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border)",
              padding: "2rem",
            }}>
              {/* Category */}
              <span style={{
                display: "inline-block",
                padding: "4px 12px", borderRadius: 99,
                background: "var(--color-accent-light)",
                color: "var(--color-accent)",
                fontSize: 12, fontWeight: 500,
                marginBottom: "1rem",
              }}>{prop.category}</span>

              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                fontWeight: 700,
                lineHeight: 1.2,
                marginBottom: "1rem",
              }}>
                {prop.name}
              </h1>

              <p style={{ color: "var(--color-text-muted)", fontSize: 14, lineHeight: 1.7, marginBottom: "1.5rem" }}>
                {prop.description}
              </p>

              {/* Pricing toggle — only shown if both modes are enabled */}
              {availableModes.length > 1 && (
                <div style={{
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-md)",
                  padding: 4,
                  display: "flex",
                  marginBottom: "1rem",
                }}>
                  {availableModes.map(mode => (
                    <button key={mode} onClick={() => setPricingMode(mode)} style={{
                      flex: 1, padding: "8px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: 13, fontWeight: 500,
                      background: activePricingMode === mode ? "var(--color-surface)" : "transparent",
                      color: activePricingMode === mode ? "var(--color-text)" : "var(--color-text-muted)",
                      boxShadow: activePricingMode === mode ? "var(--shadow-sm)" : "none",
                      border: "none", cursor: "pointer",
                      transition: "all 0.2s",
                    }}>
                      Per {mode === "day" ? "Day" : "Hour"}
                    </button>
                  ))}
                </div>
              )}

              {availableModes.length > 0 && (
                <div style={{
                  display: "flex", alignItems: "baseline", gap: 8,
                  marginBottom: "1.5rem",
                }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "var(--color-accent)" }}>
                    Rs. {price?.toLocaleString() || "—"}
                  </span>
                  <span style={{ fontSize: 15, color: "var(--color-text-muted)" }}>
                    / {activePricingMode === "day" ? "day" : "hour"}
                  </span>
                </div>
              )}

              {/* Details */}
              <div style={{
                borderTop: "1px solid var(--color-border)",
                paddingTop: "1.25rem",
                marginBottom: "1.5rem",
              }}>
                {[
                  prop.quantity && [<Package size={14} />, "Quantity", `${prop.quantity} unit${prop.quantity !== 1 ? "s" : ""}`],
                  prop.dimensions && [<Ruler size={14} />, "Dimensions", prop.dimensions],
                  prop.weight && [<Tag size={14} />, "Weight", prop.weight],
                  prop.color && [<Tag size={14} />, "Color", prop.color],
                ].filter(Boolean).map(([icon, label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--color-text-muted)" }}>
                      {icon} {label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {prop.tags?.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1.5rem" }}>
                  {prop.tags.map(tag => (
                    <span key={tag} style={{
                      padding: "3px 10px", borderRadius: 99,
                      background: "var(--color-surface-2)",
                      color: "var(--color-text-muted)",
                      fontSize: 12,
                      border: "1px solid var(--color-border)",
                    }}>#{tag}</span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href={`tel:${SITE_CONFIG.phone}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "14px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-accent)",
                  color: "white",
                  fontWeight: 500,
                  fontSize: 15,
                }}>
                  <Phone size={18} /> Call to Book · {SITE_CONFIG.phone}
                </a>
                <a href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${message}`} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "14px",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid #25D366",
                  color: "#1A9E48",
                  background: "#F0FDF4",
                  fontWeight: 500,
                  fontSize: 15,
                }}>
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>

              <p style={{ fontSize: 12, color: "var(--color-text-light)", textAlign: "center", marginTop: 12 }}>
                Updated {prop.updatedAt}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .detail-layout {
            grid-template-columns: 1fr !important;
          }
          .detail-layout > div:last-child {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
