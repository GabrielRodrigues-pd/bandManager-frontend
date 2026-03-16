"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { connectSocket, disconnectSocket } from "@/lib/socket";

interface Band {
  id: string;
  name: string;
  _count?: {
    members: number;
    songs: number;
  };
}

interface Member {
  id: string;
  role: string;
  band: Band;
}

interface User {
  id: string;
  name: string;
  email: string;
  members?: Member[];
}

interface AuthContextType {
  user: User | null;
  signedIn: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('bandmanager:token');
    const storedUser = localStorage.getItem('bandmanager:user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      connectSocket(storedToken);
    }
    
    setLoading(false);
  }, []);

  function signIn(token: string, user: User) {
    localStorage.setItem('bandmanager:token', token);
    localStorage.setItem('bandmanager:user', JSON.stringify(user));
    
    setUser(user);
    connectSocket(token);
  }

  function signOut() {
    localStorage.removeItem('bandmanager:token');
    localStorage.removeItem('bandmanager:user');
    
    setUser(null);
    disconnectSocket();
  }

  return (
    <AuthContext.Provider value={{ user, signedIn: !!user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
