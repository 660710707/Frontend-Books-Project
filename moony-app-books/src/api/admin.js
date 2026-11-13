
const API_BASE = (
  process.env.REACT_APP_API_URL ||
  'https://bookhub-backend-7ldt.onrender.com'
).replace(/\/+$/, '');

const TOKEN_KEY = 'bookhub_token';

async function adminFetch(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = {
    Accept: 'application/json',
    ...options.headers,
  };

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error?.message ||
      data?.error ||
      `เกิดข้อผิดพลาด HTTP ${response.status}`;

    throw new Error(
      typeof message === 'string'
        ? message
        : 'เกิดข้อผิดพลาดจาก Backend'
    );
  }

  return data;
}

export async function getAdminStats() {
  return adminFetch('/api/admin/stats');
}

export async function getAdminMembers() {
  const data = await adminFetch('/api/admin/members');
  return data?.items || [];
}

export async function updateMemberRole(id, role) {
  return adminFetch(
    `/api/admin/members/${encodeURIComponent(id)}/role`,
    {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }
  );
}

export async function getAdminBook(isbn) {
  return adminFetch(
    `/api/admin/books/${encodeURIComponent(isbn)}`
  );
}

export async function createAdminBook(book) {
  return adminFetch('/api/admin/books', {
    method: 'POST',
    body: JSON.stringify(book),
  });
}

export async function updateAdminBook(isbn, book) {
  return adminFetch(
    `/api/admin/books/${encodeURIComponent(isbn)}`,
    {
      method: 'PUT',
      body: JSON.stringify(book),
    }
  );
}

export async function deleteAdminBook(isbn) {
  return adminFetch(
    `/api/admin/books/${encodeURIComponent(isbn)}`,
    { method: 'DELETE' }
  );
}
