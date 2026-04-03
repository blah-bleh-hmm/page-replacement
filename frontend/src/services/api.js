import { API_BASE, API_ENDPOINTS } from '../utils/api.js';

const handleResponse = async (res, fallbackMessage) => {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || fallbackMessage);
  }
  return res.json();
};

export const runSimulation = async (
  frameSize,
  pages,
  algorithms,
  { save = true } = {},
) => {
  const res = await fetch(`${API_BASE}${API_ENDPOINTS.RUN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ frameSize, pages, algorithms, save }),
  });

  return handleResponse(res, 'Failed to run simulation');
};

export const fetchAlgorithms = async () => {
  const res = await fetch(`${API_BASE}${API_ENDPOINTS.ALGORITHMS}`);
  return handleResponse(res, 'Failed to load algorithms');
};

export const fetchHistory = async () => {
  const res = await fetch(`${API_BASE}${API_ENDPOINTS.HISTORY}`);
  const data = await handleResponse(res, 'Failed to load history');
  if (Array.isArray(data)) return data;
  return data.items || data.history || [];
};
