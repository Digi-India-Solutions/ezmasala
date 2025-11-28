export const getAdminToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
};

export const getAdminData = (): { id: string; username: string } | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('adminData');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Failed to parse admin data:', error);
        clearAdminAuth();
        return null;
      }
    }
  }
  return null;
};

export const isAdminAuthenticated = (): boolean => {
  return !!getAdminToken();
};

export const clearAdminAuth = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  }
};
