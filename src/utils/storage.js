// ============================================================
// Data Storage Utility
// ============================================================
// Props data is stored in localStorage so admin changes persist
// without a backend. The initial seed comes from props.json.
// On deployment, replace with Supabase/Firebase for multi-device sync.
// ============================================================

import initialData from "../data/props.json";

const STORAGE_KEY = "stageprops_inventory";

export function loadProps() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.warn("Could not load stored props, using defaults.", e);
  }
  return initialData;
}

export function saveProps(props) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(props));
    return true;
  } catch (e) {
    console.error("Could not save props.", e);
    return false;
  }
}

export function generateId() {
  const num = String(Date.now()).slice(-6);
  return `prop_${num}`;
}

export function resetToDefaults() {
  localStorage.removeItem(STORAGE_KEY);
  return initialData;
}

// Export data as downloadable JSON (admin backup)
export function exportData(props) {
  const blob = new Blob([JSON.stringify(props, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `stageprops-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import data from JSON file (admin restore)
export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) throw new Error("Invalid format");
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsText(file);
  });
}
