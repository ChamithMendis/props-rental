// ============================================================
// Google Drive Image Utilities
// ============================================================
// Converts a Google Drive share link into a direct image URL.
// Admin pastes any of these link formats and we normalise them.
//
// Supported input formats:
//   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
//   https://drive.google.com/open?id=FILE_ID
//   https://lh3.googleusercontent.com/d/FILE_ID  (already direct)
//
// Output: https://lh3.googleusercontent.com/d/FILE_ID
// ============================================================

export function driveShareToDirectUrl(input = "") {
  const trimmed = input.trim();

  // Already a direct link
  if (trimmed.includes("lh3.googleusercontent.com")) return trimmed;

  // /file/d/FILE_ID/...
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;

  // ?id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;

  // Raw FILE_ID (no slashes, no http)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return `https://lh3.googleusercontent.com/d/${trimmed}`;
  }

  return trimmed; // Return as-is if nothing matched
}

export function extractFileId(url = "") {
  const trimmed = url.trim();
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  const directMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (directMatch) return directMatch[1];
  return trimmed;
}

// Generates image URL with optional size hint
export function driveImageUrl(fileIdOrUrl, size = "w1200") {
  const id = extractFileId(fileIdOrUrl);
  return `https://lh3.googleusercontent.com/d/${id}=s${size === "w1200" ? "1200" : "400"}`;
}
