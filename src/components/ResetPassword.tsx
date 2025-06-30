"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendResetPassword } from "@/services/authApi";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfrimPassword] = useState<string>("");
    const [token, setToken] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfPassword, setShowConfPassword] = useState<boolean>(false);
    const router = useRouter()

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const [errors, setErrors] = useState<{
        newPassword?: string;
        confirmPassword?: string;
    }>({});


    const resetPasswordMutation = useMutation<any, Error, any>(
        {
            mutationFn: sendResetPassword,
            onSuccess: async (data: any) => {

                setIsSubmitted(true);
                setIsLoading(false);

                setNewPassword("");
                setConfrimPassword("");
                setErrors({});
                router.push('/login')
                toast({
                    title: "Reset password successfully.",
                    description: "Please access your account with new password.",
                });

            },
            onError: (err: any) => {
                toast({
                    title: 'Send reset password request failed.',
                    description: err.message,
                    variant: 'destructive',
                });
                setIsLoading(false);
            },
        }
    );

    const validatePassword = (password: string) => {
        if (!password.trim()) return "Password is required";
        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(
                password
            )
        )
            return "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
        return "";
    };

    const validateConfirmPassword = (confirmPassword: string) => {
        if (!confirmPassword.trim()) return "Confrim Password is required";
        if (confirmPassword !== newPassword) {
            return "Confirm password does not match the new password";
        }
        return "";
    };

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        setToken(tokenParam);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const passwordError = validatePassword(newPassword);
        const confirmPasswordError = validateConfirmPassword(confirmPassword);

        setErrors({
            newPassword: passwordError,
            confirmPassword: confirmPasswordError,
        });
        if ((passwordError || confirmPasswordError) && token) {
            return;
        }
        setIsSubmitting(true);

        try {
            resetPasswordMutation.mutate({ newPassword, token });

        } catch (error) {
            console.error("Error while submitting:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container mx-auto px-4 py-16'>
                <div className='mx-auto max-w-md'>
                    <div className='rounded-lg border bg-white p-8 shadow-sm'>
                        <div className='mb-6 text-center'>
                            <h1 className='text-2xl font-semibold text-gray-900'>
                                Reset Password
                            </h1>
                            <p className='mt-2 text-sm text-gray-600'>
                                Enter your new password
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div className='space-y-2 relative'>
                                <Label htmlFor='password'>New Password</Label>
                                <Input
                                    id='password'
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    placeholder='Enter your password'
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setNewPassword(value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            newPassword: validatePassword(value),
                                        }));
                                    }}
                                    className={`w-full ${errors.newPassword
                                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                            : ""
                                        }`}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className='absolute right-3 top-9 text-muted-foreground'
                                >
                                    {showPassword ? (
                                        <EyeOff className='h-4 w-4' />
                                    ) : (
                                        <Eye className='h-4 w-4' />
                                    )}
                                    <span className='sr-only'>
                                        {showPassword ? "Hide password" : "Show password"}
                                    </span>
                                </button>
                                {errors.newPassword && (
                                    <p className='text-red-500 text-sm'>{errors.newPassword}</p>
                                )}
                            </div>
                            <div className='space-y-2 relative'>
                                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                                <Input
                                    id='confirmPassword'
                                    type={showConfPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    placeholder='Confirm your password'
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setConfrimPassword(value);
                                        const confirmPasswordError = validateConfirmPassword(value);
                                        setErrors((prev) => ({
                                            ...prev,
                                            confirmPassword: confirmPasswordError,
                                        }));
                                    }}
                                    className={`w-full ${errors.confirmPassword
                                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                            : ""
                                        }`}
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfPassword(!showConfPassword)}
                                    className='absolute right-3 top-9 text-muted-foreground'
                                >
                                    {showConfPassword ? (
                                        <EyeOff className='h-4 w-4' />
                                    ) : (
                                        <Eye className='h-4 w-4' />
                                    )}
                                    <span className='sr-only'>
                                        {showConfPassword ? "Hide password" : "Show password"}
                                    </span>
                                </button>
                                {errors.confirmPassword && (
                                    <p className='text-red-500 text-sm'>
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Button
                                    type='submit'
                                    className='w-full'
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Reseting password..." : "Reset Password"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
