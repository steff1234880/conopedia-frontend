/**
 * Temporary Demo Authentication Service
 * 
 * NOTE: For UI development/preview only. Not production or secure authentication.
 * Easily swappable with real backend/API endpoints (e.g. POST /api/auth/login).
 */
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

    // Return mock session
    const mockUser = {
      email: email.trim(),
      name: email.split('@')[0] || 'Ananya',
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
    const newUser = {
      name: formData?.fullName?.trim() || 'Ananya Nair',
      email: formData?.email?.trim() || 'ananya@example.com',
      phone: formData?.phone ? `${formData.countryCode || ''} ${formData.phone}`.trim() : '',
      experience: formData?.experience || '',
      program: program || 'NCLEX-RN',
      token: 'demo-token-' + Date.now(),
    };

    localStorage.setItem('canopedia_demo_user', JSON.stringify(newUser));
    localStorage.setItem('canopedia_selected_program', newUser.program);
    return newUser;
  },

  logout: () => {
    localStorage.removeItem('canopedia_demo_user');
  }
};

