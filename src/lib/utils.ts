import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
  }).format(date);
}

export function getGasUrl() {
  const url = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
  if (!url) {
    console.warn("NEXT_PUBLIC_APPS_SCRIPT_URL is not set");
    return "";
  }
  return url;
}

/**
 * Converts a Google Drive sharing link to a direct view link for images.
 * Example: https://drive.google.com/file/d/ID/view?usp=sharing -> https://drive.google.com/uc?export=view&id=ID
 */
export function getGoogleDriveDirectLink(url: string | undefined): string {
  if (!url) return "";
  
  // Check if it's already a direct link or not a Google Drive link
  if (!url.includes("drive.google.com")) return url;

  // Regex to extract the ID from various Drive URL formats
  const driveIdRegex = /\/file\/d\/([^\/]+)|\?id=([^\&]+)|id=([^\&]+)/;
  const match = url.match(driveIdRegex);
  const fileId = match ? (match[1] || match[2] || match[3]) : null;

  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  return url;
}
