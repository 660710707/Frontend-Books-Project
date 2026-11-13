
import {
  createContext,
  useContext,
  useState,
} from 'react';

import {
  loginMember,
  logoutMember,
  hasToken,
  getStoredMember,
} from '../api/backend';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [member, setMember] = useState(() => {
    return hasToken() ? getStoredMember() : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => hasToken() && Boolean(getStoredMember())
  );

  async function login(email, password) {
    const data = await loginMember(email, password);

    if (!data?.token || !data?.member) {
      throw new Error('Backend ไม่ได้ส่งข้อมูลสมาชิกกลับมา');
    }

    setMember(data.member);
    setIsAuthenticated(true);

    return data;
  }

  function logout() {
    logoutMember();
    setMember(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        member,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth ต้องใช้ภายใน AuthProvider');
  }

  return context;
}

