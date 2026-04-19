import axios from "axios";

export const API_URL = "http://localhost:5000";

const api = axios.create({ baseURL: `${API_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * getImageSrc(imageUrl)
 * Returns the correct src for an image:
 * - Cloudinary URLs are absolute (https://...) → returned as-is
 * - Legacy local paths (/uploads/...) → prefixed with API_URL for backward compat
 */
export function getImageSrc(imageUrl) {
  if (!imageUrl) return "https://via.placeholder.com/400x250?text=No+Image";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return `${API_URL}${imageUrl}`;
}

export default api;
