import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import PropCard from "../components/PropCard";
import { CATEGORIES } from "../config/site";

export default function BrowsePage({ propsState }) {
  const { props } = propsState;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [priceType, setPriceType] = useState("day");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const maxPossible = useMemo(() => {
    if (!props.length) return 10000;
    return Math.max(...props.map(p => (priceType === "day" ? p.pricePerDay : p.pricePerHour) || 0));
  }, [props, priceType]);

  const filtered = useMemo(() => {
    let result = props.filter(p => p.published !== false);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    if (category !== "All") result = result.filter(p => p.category === category);

    if (availability === "Available") result = result.filter(p => p.available);
    if (availability === "Rented") result = result.filter(p => !p.available);

    if (maxPrice) {
      const limit = Number(maxPrice);
      result = result.filter(p => {
        const price = priceType === "day" ? p.pricePerDay : p.pricePerHour;
        return price <= limit;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price_asc") {
        const pa = priceType === "day" ? a.pricePerDay : a.pricePerHour;
        const pb = priceType === "day" ? b.pricePerDay : b.pricePerHour;
        return pa - pb;
      }
      if (sortBy === "price_desc") {
        const pa = priceType === "day" ? a.pricePerDay : a.pricePerHour;
        const pb = priceType === "day" ? b.pricePerDay : b.pricePerHour;
        return pb - pa;
      }
      if (sortBy === "newest") return b.createdAt?.localeCompare(a.createdAt || "");
      return 0;
    });

    return result;
  }, [props, search, category, availability, priceType, maxPrice, sortBy]);

  const activeFilters = [
    category !== "All" && category,
    availability !== "All" && availability,
    maxPrice && `Max Rs. ${Number(maxPrice).toLocaleString()}`,
  ].filter(Boolean);

  const clearAll = () => {
    setSearch("");
    setCategory("All");
    setAvailability("All");
    setMaxPrice("");
    setSortBy("name");
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-text)",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: "var(--color-text-muted)",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "var(--color-text)",
        padding: "3rem clamp(1rem,5vw,3rem) 2.5rem",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            color: "white",
            marginBottom: "0.5rem",
          }}>
            Browse Props
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }}>
            {props.filter(p => p.published !== false).length} props total · {props.filter(p => p.published !== false && p.available).length} available
          </p>

          {/* Search bar */}
          <div style={{ position: "relative", maxWidth: 560, marginTop: "1.5rem" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)" }} />
            <input
              type="text"
              placeholder="Search props, categories, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 42px",
                borderRadius: "var(--radius-lg)",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                fontSize: 15,
                outline: "none",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem clamp(1rem,5vw,3rem)", display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem", alignItems: "start" }} className="browse-layout">

        {/* Sidebar filters */}
        <aside style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
          padding: "1.5rem",
          position: "sticky",
          top: "calc(var(--nav-height) + 1rem)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500, fontSize: 15 }}>
              <SlidersHorizontal size={16} color="var(--color-accent)" />
              Filters
            </div>
            {activeFilters.length > 0 && (
              <button onClick={clearAll} style={{ fontSize: 12, color: "var(--color-accent)", fontWeight: 500 }}>
                Clear all
              </button>
            )}
          </div>

          {/* Category */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Category</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} style={{
                  padding: "7px 10px",
                  borderRadius: "var(--radius-sm)",
                  textAlign: "left",
                  fontSize: 14,
                  fontWeight: category === cat ? 500 : 400,
                  color: category === cat ? "var(--color-accent)" : "var(--color-text-muted)",
                  background: category === cat ? "var(--color-accent-light)" : "transparent",
                  transition: "all 0.15s",
                  border: "none",
                  cursor: "pointer",
                }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Availability</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {["All", "Available", "Rented"].map(opt => (
                <button key={opt} onClick={() => setAvailability(opt)} style={{
                  padding: "7px 10px",
                  borderRadius: "var(--radius-sm)",
                  textAlign: "left",
                  fontSize: 14,
                  fontWeight: availability === opt ? 500 : 400,
                  color: availability === opt ? "var(--color-accent)" : "var(--color-text-muted)",
                  background: availability === opt ? "var(--color-accent-light)" : "transparent",
                  border: "none", cursor: "pointer",
                }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Price filter */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Max Price</label>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {["day", "hour"].map(t => (
                <button key={t} onClick={() => setPriceType(t)} style={{
                  flex: 1, padding: "6px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 12, fontWeight: 500,
                  border: `1px solid ${priceType === t ? "var(--color-accent)" : "var(--color-border)"}`,
                  background: priceType === t ? "var(--color-accent-light)" : "transparent",
                  color: priceType === t ? "var(--color-accent)" : "var(--color-text-muted)",
                  cursor: "pointer",
                }}>Per {t}</button>
              ))}
            </div>
            <input
              type="number"
              placeholder={`Max Rs. (up to ${maxPossible.toLocaleString()})`}
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              style={{ ...inputStyle, fontSize: 13 }}
            />
          </div>

          {/* Sort */}
          <div>
            <label style={labelStyle}>Sort by</label>
            <div style={{ position: "relative" }}>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, appearance: "none", paddingRight: 32 }}>
                <option value="name">Name A–Z</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--color-text-muted)" }} />
            </div>
          </div>
        </aside>

        {/* Results */}
        <div>
          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1.25rem" }}>
              {activeFilters.map(f => (
                <span key={f} style={{
                  padding: "4px 12px",
                  borderRadius: 99,
                  background: "var(--color-accent-light)",
                  color: "var(--color-accent)",
                  fontSize: 12, fontWeight: 500,
                  border: "1px solid rgba(139,94,60,0.2)",
                }}>
                  {f}
                </span>
              ))}
            </div>
          )}

          <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginBottom: "1.25rem" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            {search && ` for "${search}"`}
          </p>

          {filtered.length === 0 ? (
            <div style={{
              padding: "4rem 2rem", textAlign: "center",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
            }}>
              <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>No props found</p>
              <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Try adjusting your filters or search term</p>
              <button onClick={clearAll} style={{
                marginTop: 16, padding: "8px 20px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-accent)",
                color: "var(--color-accent)",
                background: "transparent",
                fontSize: 14, fontWeight: 500,
                cursor: "pointer",
              }}>Clear all filters</button>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}>
              {filtered.map(prop => (
                <PropCard key={prop.id} prop={prop} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .browse-layout {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
