import type { UserProfile } from '../models/user';

const USER_STORAGE_KEY = 'kooka_sing_user';

export async function getUser(): Promise<UserProfile | null> {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as UserProfile;
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
}

export async function saveUser(user: UserProfile): Promise<void> {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
}

export async function clearUser(): Promise<void> {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing user:', error);
    throw error;
  }
}