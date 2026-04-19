import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Map DB row (snake_case) → app object (camelCase)
function toApp(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    pricePerDay: row.price_per_day,
    pricePerHour: row.price_per_hour,
    quantity: row.quantity,
    available: row.available,
    published: row.published,
    tags: row.tags ?? [],
    images: row.images ?? [],
    dimensions: row.dimensions,
    weight: row.weight,
    color: row.color,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Map app object (camelCase) → DB row (snake_case)
function toDB(prop) {
  return {
    id: prop.id,
    name: prop.name,
    category: prop.category,
    description: prop.description,
    price_per_day: prop.pricePerDay,
    price_per_hour: prop.pricePerHour,
    quantity: prop.quantity,
    available: prop.available,
    published: prop.published,
    tags: prop.tags ?? [],
    images: prop.images ?? [],
    dimensions: prop.dimensions,
    weight: prop.weight,
    color: prop.color,
    created_at: prop.createdAt,
    updated_at: prop.updatedAt,
  };
}

export async function loadProps() {
  const { data, error } = await supabase
    .from("props")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data.map(toApp);
}

export async function saveProps(props) {
  const rows = props.map(toDB);
  const { error } = await supabase.from("props").upsert(rows, { onConflict: "id" });
  if (error) throw error;
  return true;
}

export async function saveProp(prop) {
  const { error } = await supabase
    .from("props")
    .upsert(toDB(prop), { onConflict: "id" });
  if (error) throw error;
  return true;
}

export async function deleteProp(id) {
  const { error } = await supabase.from("props").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export function generateId() {
  const num = String(Date.now()).slice(-6);
  return `prop_${num}`;
}

// Export data as downloadable JSON backup
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
