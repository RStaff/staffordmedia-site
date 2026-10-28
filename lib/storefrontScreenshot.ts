export function getStorefrontScreenshot(store: string): string {
  const cleanStore = String(store || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");

  return `https://image.thum.io/get/fullpage/${cleanStore}`;
}
