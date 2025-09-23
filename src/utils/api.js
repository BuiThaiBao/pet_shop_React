// Lightweight API helper using fetch. Automatically attaches Authorization header when token is provided.
const API_BASE = '/api';

export async function apiFetch(path, { method = 'GET', headers = {}, body, token } = {}) {
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  // Try to parse JSON; if fails, throw generic error
  let data;
  try {
    data = await response.json();
  } catch (e) {
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return null;
  }

  if (!response.ok) {
    const message = data && (data.message || data.error) ? (data.message || data.error) : 'Request failed';
    throw new Error(message);
  }

  return data;
}


