// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8004';

export const API_URL = API_BASE_URL;
export const PHOTOS_API = `${API_BASE_URL}/api/photos`;
export const ADMIN_API = `${API_BASE_URL}/api/admin`;
