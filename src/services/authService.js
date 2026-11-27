/**
 * Temporary Demo Authentication Service
 * 
 * NOTE: For UI development/preview only. Not production or secure authentication.
 * Easily swappable with real backend/API endpoints (e.g. POST /api/auth/login).
 */
const USERS_STORAGE_KEY = 'canopedia_registered_users';

const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveRegisteredUserRecord = (userRecord) => {
  try {
    const users = getRegisteredUsers();
    if (userRecord?.email) {
      users[userRecord.email.toLowerCase()] = userRecord;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  } catch {
    // Ignore localStorage quota/privacy errors in demo mode
  }
};

export const demoAuthService = {
  login: async (email, password) => {
    // Temporary demo delay simulating network handshake
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!email || !email.trim()) {
      throw new Error('Please enter your email address.');
    }
    if (!password || !password.trim()) {
      throw new Error('Please enter your password.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();
    const existingRecord = users[normalizedEmail];

    // Preserve saved user profile & program on subsequent logins without re-triggering onboarding
    const mockUser = existingRecord
      ? {
          ...existingRecord,
          onboardingCompleted: true,
          token: 'demo-token-' + Date.now(),
        }
      : {
          email: email.trim(),
          name: email.split('@')[0] || 'Ananya',
          program: localStorage.getItem('canopedia_selected_program') || 'NCLEX-RN',
          onboardingCompleted: true,
          token: 'demo-token-' + Date.now(),
        };

    localStorage.setItem('canopedia_demo_user', JSON.stringify(mockUser));
    return mockUser;
  },

  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem('canopedia_demo_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  registerUserWithProgram: (formData, program) => {
    const selectedProgram = program || 'NCLEX-RN';
    const newUser = {
      name: formData?.fullName?.trim() || 'Ananya Nair',
      email: formData?.email?.trim() || 'ananya@example.com',
      phone: formData?.phone ? `${formData.countryCode || ''} ${formData.phone}`.trim() : '',
      experience: formData?.experience || '',
      program: selectedProgram,
      onboardingCompleted: true,
      token: 'demo-token-' + Date.now(),
    };

    saveRegisteredUserRecord(newUser);
    localStorage.setItem('canopedia_demo_user', JSON.stringify(newUser));
    localStorage.setItem('canopedia_selected_program', selectedProgram);
    return newUser;
  },

  logout: () => {
    localStorage.removeItem('canopedia_demo_user');
  },
};
