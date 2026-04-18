export const supportsFileSystem = () => typeof window !== "undefined" && "showSaveFilePicker" in window;

export async function pickBackupFile() {
  return window.showSaveFilePicker({
    suggestedName: "stageprops-backup.json",
    types: [{ description: "JSON Backup", accept: { "application/json": [".json"] } }],
  });
}

export async function writeBackup(handle, props) {
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(props, null, 2));
  await writable.close();
}
