export const useAuth = () => {
  const user = useState('user', () => null);

  const fetchUser = async () => {
    try {
      const headers = useRequestHeaders(['cookie']);
      const data = await $fetch('/api/auth/me', { headers });
      user.value = data;
    } catch (e) {
      user.value = null;
    }
  };

  const login = async (username, password) => {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { username, password }
    });
    user.value = data;
  };

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' });
    user.value = null;
    navigateTo('/login');
  };

  return { user, fetchUser, login, logout };
};
