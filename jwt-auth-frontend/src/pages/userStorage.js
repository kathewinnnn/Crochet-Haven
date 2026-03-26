const KEYS = {
  TOKEN:   'ch_token',
  USER:    'ch_user',
  AVATAR:  'ch_avatar',
};

/* ── write ── */
export const saveToken  = (token)   => localStorage.setItem(KEYS.TOKEN,  token);
export const saveAvatar = (dataUrl) => {
  if (dataUrl) localStorage.setItem(KEYS.AVATAR, dataUrl);
  else         localStorage.removeItem(KEYS.AVATAR);
};

/**
 * Merge partial fields into the stored profile and persist.
 * Always pass at least { username, email } on first save.
 */
export const saveUserProfile = (profileFields) => {
  const existing = loadUserProfile() || {};
  const merged   = { ...existing, ...profileFields, updatedAt: new Date().toISOString() };
  localStorage.setItem(KEYS.USER, JSON.stringify(merged));
  return merged;
};

/* ── read ── */
export const loadToken = () => localStorage.getItem(KEYS.TOKEN) || null;

export const loadAvatar = () => localStorage.getItem(KEYS.AVATAR) || null;

export const loadUserProfile = () => {
  try {
    const raw = localStorage.getItem(KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Returns the complete profile merged with a decoded JWT,
 * giving localStorage fields priority (they may have been edited).
 */
export const loadFullUser = (jwtDecoded = {}) => {
  const stored = loadUserProfile() || {};
  return { ...jwtDecoded, ...stored };   // stored wins
};

/* ── clear (logout / delete) ── */
export const clearUserData = () => {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  // also clean up any legacy keys the old code may have written
  ['token','user','userProfile','profileActiveSection',
   'userNotifications','userPrivacy'].forEach(k => localStorage.removeItem(k));
};