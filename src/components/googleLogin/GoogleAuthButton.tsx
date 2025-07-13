'use client';

import { loginWithGoogleService } from '@/services/authApi';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { getCurrentUserService, loginService } from '@/services/authApi';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

export default function GoogleAuthButton() {

    const queryClient = useQueryClient();
    const router = useRouter();


    const loginMutation = useMutation({
        mutationFn: loginWithGoogleService,
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

    const handleSuccess = async (response: CredentialResponse) => {
        if (response.credential) {
            try {
                loginMutation.mutate({ token: response.credential });
            } catch (error) {
                console.error('Google login failed:', error);
            }
        } else {
            console.error('No Google credential received');
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Google login error')}
        />
    );
}
