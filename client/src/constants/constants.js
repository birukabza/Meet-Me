export const SERVER_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_PRODUCTION_SERVER_URL
    : import.meta.env.VITE_SERVER_URL;

export const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;
