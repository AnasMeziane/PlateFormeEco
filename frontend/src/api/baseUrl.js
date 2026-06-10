const DEFAULT_API_BASE_URL = 'http://localhost:8000/api';
const DEFAULT_STORAGE_BASE_URL = 'http://localhost:8000/storage/';

export function normalizeApiBaseUrl(value) {
  const configuredUrl = typeof value === 'string' ? value.trim() : '';

  if (!configuredUrl) {
    return DEFAULT_API_BASE_URL;
  }

  return configuredUrl.replace(/\/+$/, '') || '/';
}

export function normalizeStorageBaseUrl(value) {
  const configuredUrl = typeof value === 'string' ? value.trim() : '';

  if (!configuredUrl) {
    return DEFAULT_STORAGE_BASE_URL;
  }

  return `${configuredUrl.replace(/\/+$/, '')}/`;
}

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env?.VITE_API_BASE_URL);
export const STORAGE_BASE_URL = normalizeStorageBaseUrl(import.meta.env?.VITE_STORAGE_BASE_URL);
