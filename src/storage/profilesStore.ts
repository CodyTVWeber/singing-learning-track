import type { Profile } from '../models/profile';

const PROFILES_STORAGE_KEY = 'kooka_sing_profiles';
const ACTIVE_PROFILE_ID_KEY = 'kooka_sing_active_profile_id';

function readAllProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Profile[];
    if (!Array.isArray(parsed)) return [];
    // Defensive: normalize minimal shape
    return parsed.map((p) => ({
      id: p.id,
      name: p.name,
      ageGroup: p.ageGroup,
      completedLessons: Array.isArray(p.completedLessons) ? p.completedLessons : [],
    }));
  } catch (_err) {
    return [];
  }
}

function writeAllProfiles(profiles: Profile[]): void {
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
}

export async function getProfiles(): Promise<Profile[]> {
  return readAllProfiles();
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const all = readAllProfiles();
  return all.find((p) => p.id === id) ?? null;
}

export async function saveProfile(profile: Profile): Promise<void> {
  const all = readAllProfiles();
  const idx = all.findIndex((p) => p.id === profile.id);
  if (idx >= 0) {
    all[idx] = profile;
  } else {
    all.push(profile);
  }
  writeAllProfiles(all);
}

export async function deleteProfile(id: string): Promise<void> {
  const all = readAllProfiles();
  const next = all.filter((p) => p.id !== id);
  writeAllProfiles(next);
  const activeId = localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
  if (activeId === id) {
    localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
  }
}

export async function getActiveProfileId(): Promise<string | null> {
  return localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
}

export async function setActiveProfileId(id: string): Promise<void> {
  localStorage.setItem(ACTIVE_PROFILE_ID_KEY, id);
}

export async function getActiveProfile(): Promise<Profile | null> {
  const activeId = await getActiveProfileId();
  if (!activeId) return null;
  return getProfileById(activeId);
}

export async function addCompletedLesson(profileId: string, lessonId: string): Promise<void> {
  const profile = await getProfileById(profileId);
  if (!profile) return;
  if (!profile.completedLessons.includes(lessonId)) {
    profile.completedLessons = [...profile.completedLessons, lessonId];
    await saveProfile(profile);
  }
}

export async function removeCompletedLesson(profileId: string, lessonId: string): Promise<void> {
  const profile = await getProfileById(profileId);
  if (!profile) return;
  if (profile.completedLessons.includes(lessonId)) {
    profile.completedLessons = profile.completedLessons.filter((id) => id !== lessonId);
    await saveProfile(profile);
  }
}

