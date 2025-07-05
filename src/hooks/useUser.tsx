'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient,useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { getCurrentUserService ,loginService} from '@/services/authApi';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export const useUser = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const token = Cookies.get('token');

  const query = useQuery<{ user: User }, Error>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUserService,
    enabled: !!token,
    retry: false,
  });

  // Auto-logout if token is invalid or request fails
  useEffect(() => {
    if (query.isError) {
      logout();
    }
  }, [query.isError]);

  const logout = () => {
    Cookies.remove('token');
    queryClient.removeQueries({ queryKey: ['currentUser'] });
    router.push('/login'); // redirect to login
  };

    const loginMutation = useMutation({
    mutationFn: loginService,
    onSuccess: async (res: any) => {
      const token = res.token;
      Cookies.set('token', token);
      await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast({
        title: 'Login successful',
        description: `Welcome back, ${res.user.name}!`,
      });
      router.push('/');
    },
    onError: (err: any) => {
      const message = err?.response?.data?.error || err?.message || 'Login failed';
      toast({
        title: 'Login failed',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const login = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  return {
    user: query.data?.user || null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isLoggedIn: !!query.data?.user,
    logout,
    login
  };
};
