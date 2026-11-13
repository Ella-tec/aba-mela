import type { BookingStatus } from '@/data/mock';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5018').replace(/\/$/, '');

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  fullName: string;
  role: 'Customer' | 'Professional' | 'Organization' | 'Admin';
  preferredLanguage: string;
}

export interface MfaChallenge { mfaRequired: true; challengeToken: string; }
export interface AuthenticatorSetup { secret: string; otpauthUri: string; message: string; }
export interface ServiceCategory { id: string; key: string; }
export interface BookingInput {
  serviceCategoryId: string;
  address: string;
  scheduledAt: string | null;
  notes?: string;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(API_BASE + '/api/' + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the Mela API at ' + API_BASE + '. Start the backend and check VITE_API_URL.');
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Request failed (' + response.status + ').');
  return payload as T;
}

export async function login(email: string, password: string): Promise<AuthResponse | MfaChallenge> {
  const result = await request<AuthResponse | MfaChallenge>('auth/login', { email, password });
  if (!('mfaRequired' in result && result.mfaRequired)) {
    localStorage.setItem('mela-auth', JSON.stringify(result));
  }
  return result;
}

export async function verifyAuthenticator(challengeToken: string, code: string): Promise<AuthResponse> {
  const result = await request<AuthResponse>('auth/verify-authenticator', { challengeToken, code });
  localStorage.setItem('mela-auth', JSON.stringify(result));
  return result;
}

async function authenticatedPost<T>(path: string, body: unknown = {}): Promise<T> {
  const auth = getAuth();
  if (!auth?.token) throw new Error('Please sign in again to manage account security.');
  let response: Response;
  try {
    response = await fetch(API_BASE + '/api/' + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: 'Bearer ' + auth.token },
      body: JSON.stringify(body),
    });
  } catch { throw new Error('Cannot reach the Mela API. Check that the backend is running.'); }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Security request failed (' + response.status + ').');
  return payload as T;
}

export async function getSecurityStatus(): Promise<{ authenticatorEnabled: boolean }> {
  const auth = getAuth();
  if (!auth?.token) throw new Error('Please sign in to view account security.');
  const response = await fetch(API_BASE + '/api/auth/security', {
    headers: { Accept: 'application/json', Authorization: 'Bearer ' + auth.token },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Could not load security settings.');
  return payload as { authenticatorEnabled: boolean };
}

export function startAuthenticatorSetup(): Promise<AuthenticatorSetup> {
  return authenticatedPost<AuthenticatorSetup>('auth/authenticator/setup');
}
export function confirmAuthenticator(code: string) {
  return authenticatedPost<{ authenticatorEnabled: boolean; message: string }>('auth/authenticator/confirm', { code });
}
export function disableAuthenticator(password: string, code: string) {
  return authenticatedPost<{ authenticatorEnabled: boolean; message: string }>('auth/authenticator/disable', { password, code });
}

export async function register(input: { email: string; password: string; fullName: string; role: 'Customer' | 'Professional' | 'Organization'; phone?: string; }) {
  const result = await request<AuthResponse>('auth/register', input);
  localStorage.setItem('mela-auth', JSON.stringify(result));
  return result;
}

export function getAuth(): AuthResponse | null {
  try {
    const raw = localStorage.getItem('mela-auth');
    return raw ? JSON.parse(raw) as AuthResponse : null;
  } catch {
    localStorage.removeItem('mela-auth');
    return null;
  }
}

export function logout() { localStorage.removeItem('mela-auth'); }

export async function listServices(): Promise<ServiceCategory[]> {
  let response: Response;
  try { response = await fetch(API_BASE + '/api/services', { headers: { Accept: 'application/json' } }); }
  catch { throw new Error('Cannot reach the Mela API. Start the backend to load available services.'); }
  if (!response.ok) throw new Error('Could not load services (' + response.status + ').');
  return await response.json() as ServiceCategory[];
}

export async function createBooking(input: BookingInput) {
  const auth = getAuth();
  if (!auth?.token) throw new Error('Please sign in again before creating a booking.');
  let response: Response;
  try {
    response = await fetch(API_BASE + '/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: 'Bearer ' + auth.token },
      body: JSON.stringify(input),
    });
  } catch { throw new Error('Cannot reach the Mela API. Your booking was not submitted.'); }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Booking failed (' + response.status + ').');
  return payload as { id: string; status: string; address: string; };
}

export interface BookingRecord {
  id: string;
  status: BookingStatus;
  address: string;
  serviceCategoryId: string;
  scheduledAt?: string | null;
  createdAt: string;
  notes?: string | null;
  price?: number | null;
}

async function authenticatedGet<T>(path: string): Promise<T> {
  const auth = getAuth();
  if (!auth?.token) throw new Error('Please sign in again to view your bookings.');
  let response: Response;
  try {
    response = await fetch(API_BASE + '/api/' + path, {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + auth.token },
    });
  } catch { throw new Error('Cannot reach the Mela API. Check that the backend is running.'); }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401) {
      logout();
      throw new Error('Your sign-in session has expired or is no longer valid. Please sign in again to view your Mela account.');
    }
    throw new Error(payload?.message || 'Request failed (' + response.status + ').');
  }
  return payload as T;
}

export function listBookings(): Promise<BookingRecord[]> {
  return authenticatedGet<BookingRecord[]>('bookings');
}

export function getBooking(id: string): Promise<BookingRecord> {
  return authenticatedGet<BookingRecord>('bookings/' + encodeURIComponent(id));
}

export interface ProjectRecord {
  id: string;
  name: string;
  client: string;
  location: string;
  status: 'planning' | 'active' | 'onHold' | 'completed' | 'cancelled' | string;
  progress: number;
  budget?: number;
  spent?: number;
  startDate?: string | null;
  endDate?: string | null;
}

export interface CreateProjectInput {
  name: string;
  client: string;
  customerEmail?: string;
  location: string;
  status?: string;
  progress?: number;
  budget: number;
  spent?: number;
  startDate?: string;
  endDate?: string | null;
}

export function listCustomerProjects(): Promise<ProjectRecord[]> {
  return authenticatedGet<ProjectRecord[]>('projects');
}

export function getCustomerProject(id: string): Promise<ProjectRecord> {
  return authenticatedGet<ProjectRecord>('projects/' + encodeURIComponent(id));
}

export function listOrganizationProjects(): Promise<ProjectRecord[]> {
  return authenticatedGet<ProjectRecord[]>('projects');
}

export function getOrganizationProject(id: string): Promise<ProjectRecord> {
  return authenticatedGet<ProjectRecord>('projects/' + encodeURIComponent(id));
}

export function createOrganizationProject(input: CreateProjectInput): Promise<ProjectRecord> {
  return authenticatedPost<ProjectRecord>('projects', input);
}

export async function updateOrganizationProject(id: string, update: { status: string; progress: number; endDate: string | null }): Promise<ProjectRecord> {
  const auth = getAuth();
  if (!auth?.token) throw new Error('Please sign in again to update this project.');
  let response: Response;
  try {
    response = await fetch(API_BASE + '/api/projects/' + encodeURIComponent(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: 'Bearer ' + auth.token },
      body: JSON.stringify(update),
    });
  } catch { throw new Error('Cannot reach the Mela API. Check that the backend is running.'); }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || 'Project update failed (' + response.status + ').');
  return payload as ProjectRecord;
}
