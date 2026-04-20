import { Link } from "react-router-dom";
import { Clock, Calendar, Package } from "lucide-react";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23F3F0EB'/%3E%3Ctext x='200' y='155' font-family='sans-serif' font-size='14' fill='%239E9890' text-anchor='middle'%3ENo image%3C/text%3E%3C/svg%3E";

export default function PropCard({ prop }) {
  const image = prop.images?.[0] || PLACEHOLDER;
  const hasImage = prop.images?.length > 0;

  return (
    <Link to={`/item/${prop.id}`} style={{
      display: "block",
      background: "var(--color-surface)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      border: "1px solid var(--color-border)",
      transition: "transform 0.25s ease, box-shadow 0.25s ease",
      textDecoration: "none",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", paddingTop: "75%", overflow: "hidden", background: "var(--color-surface-2)" }}>
        <img
          src={hasImage ? image : PLACEHOLDER}
          alt={prop.name}
          style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
          onError={e => { e.target.src = PLACEHOLDER; }}
        />

        {/* Availability badge */}
        <div style={{
          position: "absolute", top: 12, right: 12,
          padding: "4px 10px",
          borderRadius: 99,
          fontSize: 11, fontWeight: 500,
          background: prop.available ? "var(--color-green-light)" : "var(--color-red-light)",
          color: prop.available ? "var(--color-green)" : "var(--color-red)",
          border: `1px solid ${prop.available ? "#C3E6CB" : "#F5C6CB"}`,
        }}>
          {prop.available ? "Available" : "Rented Out"}
        </div>

        {/* Category chip */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          padding: "4px 10px",
          borderRadius: 99,
          fontSize: 11, fontWeight: 500,
          background: "rgba(250,248,245,0.92)",
          color: "var(--color-text-muted)",
          backdropFilter: "blur(4px)",
        }}>
          {prop.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1rem 1.125rem 1.25rem" }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: 17, fontWeight: 600,
          color: "var(--color-text)",
          marginBottom: 6,
          lineHeight: 1.3,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {prop.name}
        </h3>

        <p style={{
          fontSize: 13, color: "var(--color-text-light)",
          marginBottom: "0.875rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          lineHeight: 1.5,
        }}>
          {prop.description}
        </p>

        {/* Pricing */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {prop.pricePerDay > 0 && prop.showPricePerDay !== false && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Calendar size={13} color="var(--color-accent)" />
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-accent)" }}>
                Rs. {prop.pricePerDay.toLocaleString()}
                <span style={{ fontWeight: 400, color: "var(--color-text-light)", fontSize: 12 }}>/day</span>
              </span>
            </div>
          )}
          {prop.pricePerHour > 0 && prop.showPricePerHour !== false && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Clock size={13} color="var(--color-text-muted)" />
              <span style={{ fontSize: 13, fontWeight: 400, color: "var(--color-text-muted)" }}>
                Rs. {prop.pricePerHour.toLocaleString()}
                <span style={{ fontSize: 12 }}>/hr</span>
              </span>
            </div>
          )}
        </div>

        {/* Qty */}
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5 }}>
          <Package size={12} color="var(--color-text-light)" />
          <span style={{ fontSize: 12, color: "var(--color-text-light)" }}>
            {prop.quantity} unit{prop.quantity !== 1 ? "s" : ""} available
          </span>
        </div>
      </div>
    </Link>
  );
}
