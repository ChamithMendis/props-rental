import { useState } from "react";
import { Plus, Trash2, Info, Upload } from "lucide-react";
import { CATEGORIES, IMAGE_CONVENTION } from "../config/site";
import { uploadToCloudinary } from "../utils/cloudinary";

const EMPTY_FORM = {
  name: "",
  category: "Furniture",
  description: "",
  pricePerDay: "",
  pricePerHour: "",
  quantity: 1,
  available: true,
  tags: "",
  dimensions: "",
  weight: "",
  color: "",
  images: [""],
};

export default function PropForm({ initial, onSave, onCancel, mode = "add" }) {
  const [form, setForm] = useState(() => {
    if (initial) {
      return {
        ...initial,
        tags: (initial.tags || []).join(", "),
        images: initial.images?.length ? initial.images : [""],
      };
    }
    return EMPTY_FORM;
  });
  const [saving, setSaving] = useState(false);
  const [showConvention, setShowConvention] = useState(false);
  const [uploading, setUploading] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const setImage = (i, val) => {
    const imgs = [...form.images];
    imgs[i] = val;
    setForm(f => ({ ...f, images: imgs }));
  };

  const handleUpload = async (i, file) => {
    if (!file) return;
    setUploading(u => ({ ...u, [i]: 0 }));
    try {
      const url = await uploadToCloudinary(file, (pct) =>
        setUploading(u => ({ ...u, [i]: pct }))
      );
      setImage(i, url);
    } catch {
      alert("Upload failed. Check your Cloudinary cloud name and upload preset in .env");
    } finally {
      setUploading(u => { const n = { ...u }; delete n[i]; return n; });
    }
  };

  const addImageField = () => setForm(f => ({ ...f, images: [...f.images, ""] }));
  const removeImageField = (i) => {
    const imgs = form.images.filter((_, idx) => idx !== i);
    setForm(f => ({ ...f, images: imgs.length ? imgs : [""] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      pricePerDay: Number(form.pricePerDay) || 0,
      pricePerHour: Number(form.pricePerHour) || 0,
      quantity: Number(form.quantity) || 1,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      images: form.images.filter(Boolean),
    };
    await onSave(payload);
    setSaving(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
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
    fontSize: 12, fontWeight: 500,
    textTransform: "uppercase", letterSpacing: "0.05em",
    color: "var(--color-text-muted)",
    marginBottom: 5,
  };

  const fieldStyle = { marginBottom: "1.25rem" };

  return (
    <form onSubmit={handleSubmit}>
      {/* Section: Basic Info */}
      <h3 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-border)" }}>
        Basic Information
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Prop Name *</label>
          <input required value={form.name} onChange={e => set("name", e.target.value)}
            placeholder="e.g. Antique Chesterfield Sofa"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-border)"}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Category *</label>
          <select required value={form.category} onChange={e => set("category", e.target.value)}
            style={{ ...inputStyle, appearance: "none" }}>
            {CATEGORIES.filter(c => c !== "All").map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Quantity</label>
          <input type="number" min="0" value={form.quantity} onChange={e => set("quantity", e.target.value)}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-border)"}
          />
        </div>

        <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={e => set("description", e.target.value)}
            placeholder="Describe the prop — its style, era, condition, ideal use cases..."
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-border)"}
          />
        </div>
      </div>

      {/* Section: Pricing */}
      <h3 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-border)", marginTop: "0.5rem" }}>
        Pricing (Rs.)
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Price Per Day</label>
          <input type="number" min="0" value={form.pricePerDay} onChange={e => set("pricePerDay", e.target.value)}
            placeholder="e.g. 4500"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-border)"}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Price Per Hour</label>
          <input type="number" min="0" value={form.pricePerHour} onChange={e => set("pricePerHour", e.target.value)}
            placeholder="e.g. 800"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-border)"}
          />
        </div>
      </div>

      {/* Section: Images */}
      <h3 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-border)", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: 8 }}>
        Images (Cloudinary)
        <button type="button" onClick={() => setShowConvention(!showConvention)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}>
          <Info size={14} />
        </button>
      </h3>

      {showConvention && (
        <div style={{
          background: "var(--color-surface-2)",
          borderRadius: "var(--radius-md)",
          padding: "1rem",
          marginBottom: "1rem",
          fontSize: 13,
          lineHeight: 1.7,
          border: "1px solid var(--color-border)",
        }}>
          <p style={{ fontWeight: 500, marginBottom: 6 }}>Image Upload Guide</p>
          <p><strong>Naming:</strong> <code style={{ background: "white", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>{IMAGE_CONVENTION.format}</code></p>
          <p><strong>Example:</strong> <code style={{ background: "white", padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>{IMAGE_CONVENTION.example}</code></p>
          <p><strong>Resolution:</strong> {IMAGE_CONVENTION.resolution}</p>
          <p><strong>Max size:</strong> {IMAGE_CONVENTION.maxSize} · <strong>Format:</strong> {IMAGE_CONVENTION.formats}</p>
          <p style={{ marginTop: 8, color: "var(--color-text-muted)" }}>
            Click "Upload" to select a file — it uploads directly to Cloudinary.<br />
            Or paste an existing Cloudinary URL into the text field.
          </p>
        </div>
      )}

      {form.images.map((img, i) => (
        <div key={i} style={{ marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                <input
                  value={img}
                  onChange={e => setImage(i, e.target.value)}
                  placeholder="Cloudinary URL (auto-filled after upload)"
                  style={{ ...inputStyle, fontFamily: "monospace", fontSize: 12, flex: 1 }}
                  onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
                  onBlur={e => e.target.style.borderColor = "var(--color-border)"}
                />
                <label style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "0 14px", borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface-2)",
                  color: "var(--color-text-muted)",
                  fontSize: 12, fontWeight: 500,
                  cursor: uploading[i] !== undefined ? "not-allowed" : "pointer",
                  flexShrink: 0, whiteSpace: "nowrap",
                }}>
                  <Upload size={12} />
                  {uploading[i] !== undefined ? `${uploading[i]}%` : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    disabled={uploading[i] !== undefined}
                    onChange={e => handleUpload(i, e.target.files[0])}
                  />
                </label>
              </div>
              {uploading[i] !== undefined && (
                <div style={{ height: 3, borderRadius: 2, background: "var(--color-border)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${uploading[i]}%`, background: "var(--color-accent)", transition: "width 0.2s" }} />
                </div>
              )}
            </div>
            {img && (
              <img
                src={img}
                alt="preview"
                style={{ width: 56, height: 42, objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", flexShrink: 0 }}
                onError={e => { e.target.style.display = "none"; }}
              />
            )}
            {form.images.length > 1 && (
              <button type="button" onClick={() => removeImageField(i)}
                style={{ padding: "10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "none", cursor: "pointer", color: "var(--color-red)", flexShrink: 0 }}>
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      ))}

      <button type="button" onClick={addImageField}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "var(--color-accent)", fontWeight: 500,
          background: "none", border: "1px dashed var(--color-border)",
          borderRadius: "var(--radius-md)", padding: "8px 14px",
          cursor: "pointer", marginBottom: "1.25rem", width: "100%",
          justifyContent: "center",
        }}>
        <Plus size={14} /> Add another image
      </button>

      {/* Section: Details */}
      <h3 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--color-border)" }}>
        Additional Details
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Dimensions</label>
          <input value={form.dimensions} onChange={e => set("dimensions", e.target.value)}
            placeholder="e.g. 220cm × 90cm"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-border)"}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Weight</label>
          <input value={form.weight} onChange={e => set("weight", e.target.value)}
            placeholder="e.g. 45kg"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-border)"}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Color</label>
          <input value={form.color} onChange={e => set("color", e.target.value)}
            placeholder="e.g. Burgundy"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
            onBlur={e => e.target.style.borderColor = "var(--color-border)"}
          />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Tags (comma separated)</label>
        <input value={form.tags} onChange={e => set("tags", e.target.value)}
          placeholder="e.g. vintage, velvet, luxury, seating"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = "var(--color-accent)"}
          onBlur={e => e.target.style.borderColor = "var(--color-border)"}
        />
      </div>

      {/* Availability toggle */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px",
        background: form.available ? "var(--color-green-light)" : "var(--color-surface-2)",
        borderRadius: "var(--radius-md)",
        border: `1px solid ${form.available ? "#C3E6CB" : "var(--color-border)"}`,
        marginBottom: "1.5rem",
        cursor: "pointer",
      }} onClick={() => set("available", !form.available)}>
        <div>
          <p style={{ fontWeight: 500, fontSize: 14, color: form.available ? "var(--color-green)" : "var(--color-text-muted)" }}>
            {form.available ? "✓ Available for Rent" : "✗ Currently Unavailable"}
          </p>
          <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>Click to toggle</p>
        </div>
        <div style={{
          width: 44, height: 24,
          borderRadius: 99,
          background: form.available ? "var(--color-green)" : "var(--color-border-dark)",
          position: "relative",
          transition: "background 0.2s",
        }}>
          <div style={{
            position: "absolute",
            top: 3, left: form.available ? 23 : 3,
            width: 18, height: 18,
            borderRadius: "50%", background: "white",
            transition: "left 0.2s",
          }} />
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel}
          style={{
            padding: "11px 24px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            background: "none", color: "var(--color-text-muted)",
            fontWeight: 500, fontSize: 14, cursor: "pointer",
          }}>
          Cancel
        </button>
        <button type="submit" disabled={saving}
          style={{
            padding: "11px 28px",
            borderRadius: "var(--radius-md)",
            background: saving ? "var(--color-border)" : "var(--color-accent)",
            color: "white", fontWeight: 500, fontSize: 14,
            border: "none", cursor: saving ? "not-allowed" : "pointer",
          }}>
          {saving ? "Saving..." : mode === "add" ? "Add Prop" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
