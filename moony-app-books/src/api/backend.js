
const API_BASE = (
  process.env.REACT_APP_API_URL ||
  'https://bookhub-backend-7ldt.onrender.com'
).replace(/\/+$/, '');

const TOKEN_KEY = 'bookhub_token';
const MEMBER_KEY = 'bookhub_member';

async function apiFetch(path, options = {}) {
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

// แปลงข้อมูลหนังสือ
export function mapBook(book) {
  return {
    id: book.isbn,
    isbn: book.isbn,
    title: book.title,
    titleTh: null,
    author: book.author || '',
    year: book.year || '',
    publisher: book.publisher || '',
    genre: null,
    rating: book.rating ?? 0,
    ratingCount: book.ratingCount ?? 0,
    poster:
      book.imageUrl ||
      book.imageUrlM ||
      book.imageUrlS ||
      null,
    detail: '',
  };
}

// หนังสือทั้งหมด
export async function getBooks(query = '') {
  const params = new URLSearchParams();

  if (query.trim()) {
    params.set('q', query.trim());
  }

  const queryString = params.toString();
  const path = queryString
    ? `/api/books?${queryString}`
    : '/api/books';

  const data = await apiFetch(path);

  return (data?.items || []).map(mapBook);
}

// รายละเอียดหนังสือ
export async function getBook(isbn) {
  const data = await apiFetch(
    `/api/books/${encodeURIComponent(isbn)}`
  );

  return mapBook(data);
}

// รีวิวหนังสือ
export async function getReviews(isbn) {
  const data = await apiFetch(
    `/api/books/${encodeURIComponent(isbn)}/reviews`
  );

  return data?.items || [];
}

// สมัครสมาชิก
export async function registerMember(memberData) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(memberData),
  });
}

// Login
export async function loginMember(email, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  if (data?.member) {
    localStorage.setItem(
      MEMBER_KEY,
      JSON.stringify(data.member)
    );
  }

  return data;
}

// Logout
export function logoutMember() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(MEMBER_KEY);
}

// ตรวจสอบ Token
export function hasToken() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

// ดึงข้อมูลสมาชิก
export function getStoredMember() {
  try {
    const member = localStorage.getItem(MEMBER_KEY);
    return member ? JSON.parse(member) : null;
  } catch {
    return null;
  }
}
