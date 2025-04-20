import { createContext, useState, useEffect, ReactNode } from 'react';
import usersData from '../data/users.json';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  name: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUserProfile: (updatedUser: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  updateUserProfile: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check for existing session on init
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsAdmin(parsedUser.role === 'admin');
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = usersData.find(u => u.username === username && u.password === password);
    
    if (foundUser) {
      // Don't store the password in the session
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      setIsAuthenticated(true);
      setIsAdmin(foundUser.role === 'admin');
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  const updateUserProfile = (updatedUser: Partial<User>) => {
    if (user) {
      const newUserData = { ...user, ...updatedUser };
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      isAdmin, 
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
