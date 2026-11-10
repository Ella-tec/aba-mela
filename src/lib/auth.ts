
const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:5018'
).replace(/\/$/, '');

export type UserRole =
  | 'Customer'
  | 'Professional'
  | 'Organization'
  | 'Admin'
  | 'Developer';

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  preferredLanguage: string;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}/api/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      `Cannot reach the Mela API at ${API_BASE}. Make sure the backend is running.`
    );
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || `Request failed (${response.status}).`
    );
  }

  return payload as T;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const result = await request<AuthResponse>('auth/login', {
    email,
    password,
  });

  localStorage.setItem('mela-auth', JSON.stringify(result));

  return result;
}

export async function register(input: {
  email: string;
  password: string;
  fullName: string;
  role: 'Customer' | 'Professional' | 'Organization';
  phone?: string;
}): Promise<AuthResponse> {
  const result = await request<AuthResponse>('auth/register', input);

  localStorage.setItem('mela-auth', JSON.stringify(result));

  return result;
}

export function getAuth(): AuthResponse | null {
  try {
    const raw = localStorage.getItem('mela-auth');

    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  } catch {
    localStorage.removeItem('mela-auth');
    return null;
  }
}

export function logout(): void {
  localStorage.removeItem('mela-auth');
}
