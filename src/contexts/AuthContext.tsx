'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserCredentials } from '@/types/user';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { loginService, signupService, getCurrentUserService } from '@/services/authApi';
import { toast } from '@/hooks/use-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserService,
    enabled: !!Cookies.get('token'),
    retry: false,
  });


  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
    if (isError) {
      Cookies.remove('token');
      setUser(null);
    }
  }, [data, isError]);

  const loginMutation = useMutation<User, Error, UserCredentials>(
    {
      mutationFn: loginService,
      onSuccess: async (user: any) => {

        console.log('success', user)

        const token = user.token;
        Cookies.set('token', token);
        await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        toast({
          title: 'Login successful',
          description: `Welcome back, ${user.user.name}!`,
        });
        router.push('/')
      },
      onError: (err: any) => {
        const message = err?.response?.data?.error || err?.message || 'Login failed';
        console.log(123,err,err?.response)
        toast({
          title: 'Login failed',
          description: message,
          variant: 'destructive',
        });
      },
    }
  );

  const login = async (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading || loginMutation.isPending,
        login,
        logout,
        isLoggedIn: !!user,
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
