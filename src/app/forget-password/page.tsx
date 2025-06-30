
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendForgetPasswordLink } from '@/services/authApi';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });



    const SendForgetPasswordMutation = useMutation<any, Error, any>(
        {
            mutationFn: sendForgetPasswordLink,
            onSuccess: async (data: any) => {

                setIsSubmitted(true);
                setIsLoading(false);

                toast({
                    title: "Reset link sent",
                    description: "Check your email for password reset instructions.",
                });

            },
            onError: (err: any) => {
                toast({
                    title: 'Send forget password request failed.',
                    description: err.message,
                    variant: 'destructive',
                });
                 setIsLoading(false);
            },
        }
    );


    const onSubmit = async (data: ForgotPasswordForm) => {
        setIsLoading(true);

        // Simulate API call
        SendForgetPasswordMutation.mutate(data)


    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Mail className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle>Check your email</CardTitle>
                            <CardDescription>
                                We've sent password reset instructions to your email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <AlertDescription>
                                    Didn't receive the email? Check your spam folder or try again in a few minutes.
                                </AlertDescription>
                            </Alert>
                            <div className="text-center">
                                <Link href="/login" className="text-sm text-primary hover:underline">
                                    Back to login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Forgot your password?
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Send reset link'}
                                </Button>
                            </form>
                        </Form>

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm text-primary hover:underline"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
