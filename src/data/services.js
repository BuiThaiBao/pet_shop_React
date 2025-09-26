import axios from 'axios';

export const serviceIcons = {
  veterinary: 'fas fa-stethoscope',
  grooming: 'fas fa-bath',
  haircut: 'fas fa-cut',
  vaccination: 'fas fa-syringe',
  petboarding: 'fas fa-dog'
};

export const formatDuration = (minutes) => {
  if (minutes === undefined || minutes === null) return '';
  const total = Number(minutes);
  if (Number.isNaN(total)) return '';
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h > 0 && m > 0) return `${h} giờ ${m} phút`;
  if (h > 0) return `${h} giờ`;
  return `${m} phút`;
};

export const mapServiceDto = (dto) => ({
  id: dto.id,
  key: dto.name,
  icon: serviceIcons[dto.name] || 'fas fa-paw',
  title: dto.title || dto.name,
  description: dto.description || '',
  duration: formatDuration(dto.durationMinutes),
  price: typeof dto.price === 'number' ? dto.price : parseFloat(dto.price || '0')
});

let servicesCache = null;
let inFlightPromise = null;

export async function getActiveServices(apiUrl = '/api/v1/services/active') {
  if (servicesCache) return servicesCache;
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = axios
    .get(apiUrl, { withCredentials: false })
    .then((res) => {
      const payload = res.data || {};
      const list = Array.isArray(payload.result) ? payload.result : [];
      const mapped = list
        .filter((s) => {
          const v = s.isActive;
          if (v === undefined || v === null) return true;
          if (typeof v === 'number') return v === 1;
          if (typeof v === 'boolean') return v;
          const str = String(v).toLowerCase();
          return str === '1' || str === 'true' || str === 'y' || str === 'active';
        })
        .map(mapServiceDto);
      servicesCache = mapped;
      return mapped;
    })
    .catch((err) => {
      throw err;
    })
    .finally(() => {
      inFlightPromise = null;
    });

  return inFlightPromise;
}


