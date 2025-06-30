'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyAccount } from '@/services/authApi';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

export default function VerifyAccount() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const hasCalled = useRef(false);
    const router = useRouter()
   const { toast } = useToast();

     const resetPasswordMutation = useMutation<any, Error, any>(
        {
            mutationFn: verifyAccount,
            onSuccess: async (data: any) => {

              
                router.push('/login')
                toast({
                    title: "Account verified successfully.",
                    description: "Please access your account with new password.",
                });

            },
            onError: (err: any) => {
                toast({
                    title: 'Account verified request failed.',
                    description: err.message,
                    variant: 'destructive',
                });
            },
        }
    );

    useEffect(() => {
        if (token && !hasCalled.current) {
            resetPasswordMutation.mutate({ token });
            hasCalled.current = true;
        }
    }, [token]);

    return (
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            <h1>{resetPasswordMutation.isPending ? 'Verifying your account...' : 'Processing'}</h1>
            {resetPasswordMutation.isPending && <div className="spinner" />}
            <style jsx>{`
                .spinner {
                    margin: 20px auto;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
