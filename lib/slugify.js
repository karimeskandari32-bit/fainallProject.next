export function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[\s_\u200c]+/g, "-")
    .replace(/[^\u0600-\u06FFa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}