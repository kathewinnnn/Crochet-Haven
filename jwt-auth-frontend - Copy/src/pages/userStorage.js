export const loadToken = () =>
  localStorage.getItem('ch_token') || localStorage.getItem('token') || null;

export const saveToken = (token) => {
  if (token) {
    localStorage.setItem('ch_token', token);
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('ch_token');
    localStorage.removeItem('token');
  }
};

// ─── Resolve the current user's ID ───────────────────────────────────────────
// Mirrors the same priority order used in Orders.js / Checkout.js so every
// part of the app agrees on who is logged in.

export const resolveUserId = () => {
  // 1. Explicit userId key (fastest)
  const direct = localStorage.getItem('userId');
  if (direct) return String(direct);

  // 2. 'user' JSON object (written by Login.js)
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const p = JSON.parse(raw);
      const id = p?.id || p?.userId;
      if (id) return String(id);
    }
  } catch { /* ignore */ }

  // 3. 'ch_user' JSON object (written by Register / CartContext)
  try {
    const raw = localStorage.getItem('ch_user');
    if (raw) {
      const p = JSON.parse(raw);
      const id = p?.id || p?.userId;
      if (id) return String(id);
    }
  } catch { /* ignore */ }

  // 4. Decode JWT
  try {
    const token = loadToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const id = payload?.id || payload?.userId || payload?.sub;
      if (id) return String(id);
    }
  } catch { /* ignore */ }

  return null;
};

// ─── Profile-specific storage key ────────────────────────────────────────────

const profileKey = (userId) => `ch_profile_${userId}`;
const avatarKey  = (userId) => `ch_avatar_${userId}`;

// ─── Load the full user object ────────────────────────────────────────────────
// Merges (in priority order):
//   1. Saved profile edits  (ch_profile_<id>)   ← highest priority
//   2. Auth user object     (ch_user / user)
//   3. JWT payload          (decoded)            ← lowest priority

export const loadFullUser = (jwtDecoded = {}) => {
  // Resolve base auth data
  let base = {};
  try {
    const raw = localStorage.getItem('ch_user') || localStorage.getItem('user');
    if (raw) base = JSON.parse(raw) || {};
  } catch { /* ignore */ }

  // Merge with jwt payload (base wins over jwt)
  const merged = { ...jwtDecoded, ...base };

  // Resolve userId
  const userId =
    merged.id || merged.userId ||
    jwtDecoded?.id || jwtDecoded?.userId || jwtDecoded?.sub ||
    null;

  if (!userId) return merged;

  // Persist userId separately for fast access
  localStorage.setItem('userId', String(userId));

  // Overlay with any saved profile edits (these win over everything)
  try {
    const savedProfile = localStorage.getItem(profileKey(userId));
    if (savedProfile) {
      const edits = JSON.parse(savedProfile);
      return { ...merged, ...edits, id: userId };
    }
  } catch { /* ignore */ }

  return { ...merged, id: userId };
};

// ─── Save profile edits ───────────────────────────────────────────────────────
// Saves ONLY the editable fields under a user-scoped key so they survive
// logout. The auth keys (token, ch_user, etc.) are NOT touched.

export const saveUserProfile = (fields) => {
  const userId = resolveUserId();
  if (!userId) {
    console.log('⚠️ saveUserProfile: No userId found');
    return fields;
  }

  // Load current saved profile (if any) and merge
  let existing = {};
  try {
    const raw = localStorage.getItem(profileKey(userId));
    if (raw) existing = JSON.parse(raw);
  } catch { /* ignore */ }

  const updated = {
    ...existing,
    ...fields, // Include all fields from registration
  };

  console.log('💾 Saving user profile:', { userId, updated });

  localStorage.setItem(profileKey(userId), JSON.stringify(updated));
  return updated;
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

export const loadAvatar = () => {
  const userId = resolveUserId();
  console.log('🖼️ loadAvatar - userId:', userId);
  if (!userId) {
    console.log('🖼️ loadAvatar - no userId, returning null');
    return null;
  }
  const avatar = localStorage.getItem(avatarKey(userId)) || null;
  console.log('🖼️ loadAvatar - avatar:', avatar ? 'found' : 'not found');
  return avatar;
};

export const saveAvatar = (dataUrl) => {
  const userId = resolveUserId();
  console.log('💾 saveAvatar - userId:', userId, ', has data:', !!dataUrl);
  if (!userId) {
    console.log('⚠️ saveAvatar: No userId found');
    return;
  }
  localStorage.setItem(avatarKey(userId), dataUrl);
  console.log('💾 saveAvatar: Saved avatar for user', userId);
};

// ─── Clear auth data on logout ────────────────────────────────────────────────
// Clears only auth/session keys. Profile edits + avatar are intentionally
// kept so they reappear when the user logs back in.

export const clearAuthData = () => {
  [
    'token', 'ch_token',
    'user',  'ch_user',
    'userId', 'username',
  ].forEach(k => localStorage.removeItem(k));
};

// ─── Clear ALL user data (account deletion) ───────────────────────────────────
// Also removes the user-scoped profile/avatar keys.

export const clearUserData = () => {
  const userId = resolveUserId();

  // Remove auth keys
  clearAuthData();

  // Remove user-scoped keys
  if (userId) {
    localStorage.removeItem(profileKey(userId));
    localStorage.removeItem(avatarKey(userId));
    localStorage.removeItem(`ch_notifications_${userId}`);
    localStorage.removeItem(`ch_privacy_${userId}`);
    localStorage.removeItem(`cart_${userId}`);
    localStorage.removeItem(`cart_${userId}_selected`);
  }

  // Also sweep any legacy un-scoped keys
  [
    'ch_notifications', 'ch_privacy',
    'profileActiveSection',
  ].forEach(k => localStorage.removeItem(k));
};