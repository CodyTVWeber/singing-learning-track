import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getUser, createNewUser, saveUser as saveUserToStorage } from '../utils/storage';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  createUser: (name: string, ageGroup: User['ageGroup']) => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = getUser();
    setUser(savedUser);
    setIsLoading(false);
  }, []);

  const createUser = (name: string, ageGroup: User['ageGroup']) => {
    const newUser = createNewUser(name, ageGroup);
    setUser(newUser);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, createUser, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};