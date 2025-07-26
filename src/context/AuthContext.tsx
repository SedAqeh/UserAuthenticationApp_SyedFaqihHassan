import React, { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  name: string;
  email: string;
  password: string;
}

interface AuthContextProps {
  user: Omit<User, "password"> | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem("currentUser");
      if (stored) setUser(JSON.parse(stored));
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const usersJson = await AsyncStorage.getItem("users");
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    const match = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!match) return false;

    const { password: _, ...publicUser } = match;
    setUser(publicUser);
    await AsyncStorage.setItem("currentUser", JSON.stringify(publicUser));
    return true;
  };

  const signup = async (name: string, email: string, password: string) => {
    const usersJson = await AsyncStorage.getItem("users");
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    const exists = users.find((u) => u.email === email);
    if (exists) return false;

    const newUser: User = { name, email, password };
    const updatedUsers = [...users, newUser];

    await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
    const { password: _, ...publicUser } = newUser;
    setUser(publicUser);
    await AsyncStorage.setItem("currentUser", JSON.stringify(publicUser));
    return true;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
