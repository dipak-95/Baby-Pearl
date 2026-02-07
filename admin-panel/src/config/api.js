// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.babyphotoadmin.online';

export const API_URL = API_BASE_URL;
export const PHOTOS_API = `${API_BASE_URL}/api/photos`;
export const ADMIN_API = `${API_BASE_URL}/api/admin`;
