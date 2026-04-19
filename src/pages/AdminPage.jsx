import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, LogOut, Download, Upload, Search, Package, AlertTriangle, Eye, EyeOff, HardDrive, Link2 } from "lucide-react";
import PropForm from "../components/PropForm";
import { exportData, importData } from "../utils/storage";
import { supportsFileSystem, pickBackupFile, writeBackup } from "../utils/fileBackup";
import { SITE_CONFIG } from "../config/site";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='60' viewBox='0 0 80 60'%3E%3Crect width='80' height='60' fill='%23F3F0EB'/%3E%3C/svg%3E";

export default function AdminPage({ propsState, onLogout }) {
  const { props, addProp, updateProp, deleteProp, toggleAvailability, togglePublished, setProps } = propsState;
  const [mode, setMode] = useState("list"); // list | add | edit
  const [editTarget, setEditTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [backupHandle, setBackupHandle] = useState(null);
  const isFirstRender = useRef(true);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auto-save to linked backup file whenever props change (skip initial load)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (!backupHandle) return;
    writeBackup(backupHandle, props).catch(() => showToast("Auto-save to file failed.", "error"));
  }, [props, backupHandle]);

  const handleLinkBackup = async () => {
    try {
      const handle = await pickBackupFile();
      await writeBackup(handle, props);
      setBackupHandle(handle);
      showToast("Backup file linked — changes will auto-save.");
    } catch (err) {
      if (err.name !== "AbortError") showToast("Could not link backup file.", "error");
    }
  };

  const filtered = props.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data) => {
    addProp(data);
    setMode("list");
    showToast("Prop added successfully!");
  };

  const handleEdit = (data) => {
    updateProp(editTarget.id, data);
    setMode("list");
    setEditTarget(null);
    showToast("Prop updated!");
  };

  const handleDelete = (id) => {
    deleteProp(id);
    setDeleteConfirm(null);
    showToast("Prop deleted.", "info");
  };

  const handleToggle = (id) => {
    toggleAvailability(id);
    showToast("Availability updated.");
  };

  const handleTogglePublish = (id) => {
    togglePublished(id);
    const prop = props.find(p => p.id === id);
    const isCurrentlyPublished = prop?.published !== false;
    showToast(isCurrentlyPublished ? "Prop unpublished — hidden from public." : "Prop published — now visible to public.");
  };

  const handleExport = () => {
    exportData(props);
    showToast("Backup downloaded.");
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importData(file);
      setProps(data);
      showToast(`Imported ${data.length} props!`);
    } catch {
      showToast("Invalid file format.", "error");
    }
    e.target.value = "";
  };

  const handleReset = async () => {
    if (window.confirm("Reload inventory from database?")) {
      try {
        const { loadProps } = await import("../utils/storage");
        const fresh = await loadProps();
        setProps(fresh);
        showToast("Inventory reloaded from database.");
      } catch {
        showToast("Could not reload from database.", "error");
      }
    }
  };

  // Stats
  const totalAvailable = props.filter(p => p.available).length;
  const totalPublished = props.filter(p => p.published !== false).length;
  const categories = [...new Set(props.map(p => p.category))].length;

  return (
    <div style={{ paddingTop: "var(--nav-height)", minHeight: "100vh", background: "var(--color-bg)" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 999,
          padding: "12px 20px",
          borderRadius: "var(--radius-md)",
          background: toast.type === "error" ? "var(--color-red)" : toast.type === "info" ? "var(--color-text)" : "var(--color-green)",
          color: "white", fontSize: 14, fontWeight: 500,
          boxShadow: "var(--shadow-lg)",
          animation: "slideUp 0.2s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "1rem",
        }}>
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            padding: "2rem",
            maxWidth: 380, width: "100%",
            boxShadow: "var(--shadow-lg)",
          }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: "1rem" }}>
              <AlertTriangle size={22} color="var(--color-red)" />
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Delete prop?</h3>
                <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
                  "{deleteConfirm.name}" will be permanently removed from your inventory.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setDeleteConfirm(null)} style={{
                padding: "9px 20px", borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)", background: "none",
                fontWeight: 500, cursor: "pointer", fontSize: 14,
              }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} style={{
                padding: "9px 20px", borderRadius: "var(--radius-md)",
                border: "none", background: "var(--color-red)", color: "white",
                fontWeight: 500, cursor: "pointer", fontSize: 14,
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem clamp(1rem,4vw,2.5rem)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700 }}>Admin Panel</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>
              Manage your props inventory · {SITE_CONFIG.businessName}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {supportsFileSystem() && (
              <button onClick={handleLinkBackup} title={backupHandle ? "Backup file linked — click to change" : "Link a file for auto-backup"}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid ${backupHandle ? "var(--color-green)" : "var(--color-border)"}`,
                  background: backupHandle ? "var(--color-green-light)" : "var(--color-surface)",
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                  color: backupHandle ? "var(--color-green)" : "var(--color-text-muted)",
                }}>
                {backupHandle ? <HardDrive size={14} /> : <Link2 size={14} />}
                {backupHandle ? "Auto-saving" : "Link Backup File"}
              </button>
            )}
            <button onClick={handleExport} title="Export backup"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-surface)", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "var(--color-text-muted)" }}>
              <Download size={14} /> Export
            </button>
            <label style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-surface)", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "var(--color-text-muted)" }}>
              <Upload size={14} /> Import
              <input type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
            </label>
            <button onClick={onLogout}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-surface)", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "var(--color-text-muted)" }}>
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            ["Total Props", props.length, "var(--color-text)"],
            ["Published", totalPublished, "var(--color-green)"],
            ["Unpublished", props.length - totalPublished, "var(--color-red)"],
            ["Categories", categories, "var(--color-accent)"],
          ].map(([label, val, color]) => (
            <div key={label} style={{
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              padding: "1.25rem",
            }}>
              <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "var(--font-display)" }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {(mode === "add" || mode === "edit") && (
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border)",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "var(--shadow-md)",
          }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: "1.5rem" }}>
              {mode === "add" ? "Add New Prop" : `Edit: ${editTarget?.name}`}
            </h2>
            <PropForm
              initial={editTarget}
              mode={mode}
              onSave={mode === "add" ? handleAdd : handleEdit}
              onCancel={() => { setMode("list"); setEditTarget(null); }}
            />
          </div>
        )}

        {/* List */}
        <div style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          border: "1px solid var(--color-border)",
          overflow: "hidden",
        }}>
          {/* Toolbar */}
          <div style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 340 }}>
              <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
              <input
                placeholder="Search inventory..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "8px 12px 8px 34px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  fontSize: 14, outline: "none",
                  background: "var(--color-bg)",
                  color: "var(--color-text)",
                }}
              />
            </div>
            <button onClick={() => { setMode("add"); setEditTarget(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 18px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-accent)", color: "white",
                fontWeight: 500, fontSize: 14,
                border: "none", cursor: "pointer",
              }}>
              <Plus size={16} /> Add New Prop
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-surface-2)" }}>
                  {["Image", "Name", "Category", "Price/Day", "Price/Hr", "Qty", "Status", "Published", "Actions"].map(h => (
                    <th key={h} style={{
                      padding: "10px 14px", textAlign: "left",
                      fontSize: 11, fontWeight: 500,
                      color: "var(--color-text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.05em",
                      borderBottom: "1px solid var(--color-border)",
                      whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)", fontSize: 14 }}>
                      <Package size={32} style={{ display: "block", margin: "0 auto 12px", opacity: 0.3 }} />
                      {search ? "No props match your search" : "No props yet. Add your first one above."}
                    </td>
                  </tr>
                )}
                {filtered.map((prop, i) => (
                  <tr key={prop.id} style={{
                    borderBottom: i < filtered.length - 1 ? "1px solid var(--color-border)" : "none",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--color-surface-2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Thumb */}
                    <td style={{ padding: "12px 14px", opacity: prop.published === false ? 0.5 : 1 }}>
                      <img
                        src={prop.images?.[0] || PLACEHOLDER}
                        alt=""
                        style={{ width: 60, height: 45, objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}
                        onError={e => { e.target.src = PLACEHOLDER; }}
                      />
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>{prop.name}</p>
                      <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{prop.id}</p>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--color-text-muted)" }}>{prop.category}</td>
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 500 }}>
                      {prop.pricePerDay ? `Rs. ${prop.pricePerDay.toLocaleString()}` : "—"}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>
                      {prop.pricePerHour ? `Rs. ${prop.pricePerHour.toLocaleString()}` : "—"}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>{prop.quantity}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <button onClick={() => handleToggle(prop.id)} title="Toggle availability"
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "4px 10px", borderRadius: 99,
                          border: `1px solid ${prop.available ? "#C3E6CB" : "var(--color-border)"}`,
                          background: prop.available ? "var(--color-green-light)" : "var(--color-surface-2)",
                          color: prop.available ? "var(--color-green)" : "var(--color-text-muted)",
                          fontSize: 12, fontWeight: 500, cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}>
                        {prop.available ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                        {prop.available ? "Available" : "Rented"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <button onClick={() => handleTogglePublish(prop.id)} title={prop.published === false ? "Publish" : "Unpublish"}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "4px 10px", borderRadius: 99,
                          border: `1px solid ${prop.published !== false ? "#C3E6CB" : "var(--color-border)"}`,
                          background: prop.published !== false ? "var(--color-green-light)" : "var(--color-surface-2)",
                          color: prop.published !== false ? "var(--color-green)" : "var(--color-text-muted)",
                          fontSize: 12, fontWeight: 500, cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}>
                        {prop.published !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                        {prop.published !== false ? "Published" : "Unpublished"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setEditTarget(prop); setMode("edit"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          title="Edit"
                          style={{
                            padding: "7px", borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border)",
                            background: "none", cursor: "pointer",
                            color: "var(--color-text-muted)",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--color-accent-light)"; e.currentTarget.style.color = "var(--color-accent)"; e.currentTarget.style.borderColor = "var(--color-accent)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.borderColor = "var(--color-border)"; }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(prop)}
                          title="Delete"
                          style={{
                            padding: "7px", borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--color-border)",
                            background: "none", cursor: "pointer",
                            color: "var(--color-text-muted)",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "var(--color-red-light)"; e.currentTarget.style.color = "var(--color-red)"; e.currentTarget.style.borderColor = "var(--color-red)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.borderColor = "var(--color-border)"; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--color-border)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 8,
          }}>
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              Showing {filtered.length} of {props.length} props
            </span>
            <button onClick={handleReset}
              style={{ fontSize: 12, color: "var(--color-text-light)", background: "none", border: "none", cursor: "pointer" }}>
              Reload from database
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
