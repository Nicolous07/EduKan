import { UserProfile, UserRole } from '../types';

const TOKEN_KEY = 'edukan_auth_token';
const USER_KEY = 'edukan_user';
const IS_REGISTERED_KEY = 'edukan_is_registered';

export const GUEST_USER: UserProfile = {
  id: 'guest-visitor',
  name: 'Mgeni (Guest Visitor)',
  handle: 'mgeni',
  email: '',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  schoolName: 'Edu-Kan Tanzania (Hali ya Mgeni / Browsing Only)',
  schoolRegion: 'Tanzania',
  schoolDistrict: '',
  level: 'Hujaingia kwenye Akaunti',
  combination: 'Kutazama Tu (Guest Mode)',
  title: 'Mtumiaji Mgeni',
  bio: 'Karibu Edu-Kan Tanzania! Mfumo wa bure wa masomo kwa wanafunzi wa Tanzania. Uko kwenye hali ya Mgeni (Browsing Only). Ili kuchapisha, kupakua faili, kutuma ujumbe, au kutoa maoni, tafadhali fungua akaunti au ingia.',
  points: 0,
  followersCount: 0,
  followingCount: 0,
  achievements: [],
  activities: []
};

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.warn('Could not store auth token:', err);
  }
}

export function removeAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(IS_REGISTERED_KEY);
  } catch (err) {
    console.warn('Could not clear auth token:', err);
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchCurrentServerUser(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const token = getAuthToken();
  if (!token) {
    return { success: false, error: 'No token' };
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        return { success: true, user: data.user };
      }
    }
    return { success: false, error: 'Token invalid or expired' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

export async function loginToServer(identifier: string, password: string): Promise<{ success: boolean; token?: string; user?: UserProfile; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        setAuthToken(data.token);
      }
      return { success: true, token: data.token, user: data.user };
    }
    return { success: false, error: data.error || 'Hitilafu ya kuingia' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Hitilafu ya mtandao wakati wa kuingia' };
  }
}

export async function registerToServer(payload: any): Promise<{ success: boolean; token?: string; user?: UserProfile; error?: string }> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        setAuthToken(data.token);
      }
      return { success: true, token: data.token, user: data.user };
    }
    return { success: false, error: data.error || 'Hitilafu ya usajili' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Hitilafu ya mtandao wakati wa kusajili' };
  }
}
