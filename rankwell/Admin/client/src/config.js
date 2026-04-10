const API_BASE_URL =
  window.__CONFIG__?.VITE_API_URL || import.meta.env.VITE_API_URL;

export default API_BASE_URL;