import { useEffect, useState } from 'react';
import API from '../api/axios';

const DEFAULTS = {
  whatsapp_number: '212671869919',
  contact_email: 'Tijara.shop00@gmail.com',
};

let cache = null;
let pending = null;
const subscribers = new Set();

function notify() {
  subscribers.forEach((cb) => cb(cache));
}

export function refreshSiteSettings() {
  pending = API.get('/site-settings').then((r) => {
    cache = { ...DEFAULTS, ...r.data };
    notify();
    return cache;
  });
  return pending;
}

export function useSiteSettings() {
  const [data, setData] = useState(cache || DEFAULTS);

  useEffect(() => {
    subscribers.add(setData);
    if (!cache && !pending) {
      refreshSiteSettings().catch(() => {});
    }
    return () => {
      subscribers.delete(setData);
    };
  }, []);

  return data;
}

/** Convert international (212XXXXXXXXX) to local Moroccan format with leading 0. */
export function formatLocalPhone(intl) {
  if (!intl) return '';
  const digits = String(intl).replace(/\D/g, '');
  if (digits.startsWith('212')) return '0' + digits.slice(3);
  return digits;
}

/** Display-friendly phone (+212 X XX XX XX XX). */
export function formatDisplayPhone(intl) {
  if (!intl) return '';
  const digits = String(intl).replace(/\D/g, '');
  if (digits.startsWith('212') && digits.length === 12) {
    const rest = digits.slice(3);
    return `+212 ${rest[0]} ${rest.slice(1, 3)} ${rest.slice(3, 5)} ${rest.slice(5, 7)} ${rest.slice(7, 9)}`;
  }
  return intl;
}
