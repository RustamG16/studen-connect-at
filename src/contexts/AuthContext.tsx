import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // TODO: Replace with actual API call
    // Simulating API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (email && password) {
          const newUser: User = {
            id: Date.now().toString(),
            email,
            name: email.split('@')[0],
          };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const signup = async (email: string, password: string, name?: string) => {
    // TODO: Replace with actual API call
    // Simulating API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (email && password && password.length >= 6) {
          const newUser: User = {
            id: Date.now().toString(),
            email,
            name: name || email.split('@')[0],
          };
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          resolve();
        } else {
          reject(new Error('Invalid input or password too short'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};




