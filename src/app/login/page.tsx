'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff, Facebook, Github, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';
import { User, UserCredentials, RegisterData } from '@/types/user';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { loginService, signupService, getCurrentUserService } from '@/services/authApi';
import { useAuth } from '@/contexts/AuthContext';

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  remember: z.boolean().optional(),
});

// Registration form schema
const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["individual", "pet_shop", "shelter"], {
    required_error: "Please select a role",
  }),
  terms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [tabValue, setTabValue] = useState('login')
  const { login, user, loading } = useAuth();

  const router = useRouter()
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [loading, user])
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "individual",
      terms: false,
    },
  });

  const RegisterMutation = useMutation<User, Error, RegisterData>(
    {
      mutationFn: signupService,
      onSuccess: async (user: any) => {
        toast({
          title: 'Registration successful',
        });
        setTabValue('login')
        registerForm.reset();
      },
      onError: (err: any) => {
        toast({
          title: 'Registration failed',
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  // Handle login form submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoggingIn(true);
      await login(values.email, values.password);

    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle register form submission
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      setIsRegistering(true);

      // Call register service with properly typed values
      const registerData: RegisterData = {
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: values.role
      };

      RegisterMutation.mutate(registerData);

    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Set test credentials
  const setTestCredentials = (type: 'individual' | 'pet_shop' | 'shelter') => {
    let email = "";

    switch (type) {
      case 'individual':
        email = "user@example.com";
        break;
      case 'shelter':
        email = "shelter@example.com";
        break;
      case 'pet_shop':
        email = "petshop@example.com";
        break;
      default:
        email = "user@example.com";
    }

    loginForm.setValue("email", email);
    loginForm.setValue("password", "password123");
  };


  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-md mx-auto py-8">
          <Tabs value={tabValue} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" onClick={() => setTabValue('login')} id="login-tab">Login</TabsTrigger>
              <TabsTrigger value="register" onClick={() => setTabValue('register')} id="register-tab">Register</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Login to access your account and manage your pets.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Enter your password"
                                  type={showPassword ? "text" : "password"}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ?
                                    <EyeOff className="h-4 w-4 text-muted-foreground" /> :
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  }
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" {...loginForm.register("remember")} />
                          <Label htmlFor="remember">Remember me</Label>
                        </div>
                        <Link href="/forget-password" className="text-sm text-primary hover:underline">
                          Forget password?
                        </Link>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoggingIn}>
                        {isLoggingIn ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          "Login"
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* <div className="mt-4">
                    <div className="text-sm text-muted-foreground mb-2">Test Accounts:</div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTestCredentials('individual')}
                        className="text-xs"
                      >
                        User
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTestCredentials('pet_shop')}
                        className="text-xs"
                      >
                        Pet Shop
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTestCredentials('shelter')}
                        className="text-xs"
                      >
                        Shelter
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Click any option to fill in test credentials
                    </div>
                  </div> */}

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="w-full">
                        <Facebook className="mr-2 h-4 w-4" />
                        Facebook
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="#" className="text-primary hover:underline" onClick={() => document.getElementById('register-tab')?.click()}>
                      Register
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Register Form */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Register to start adopting, selling, or breeding pets.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Create a password"
                                  type={showPassword ? "text" : "password"}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ?
                                    <EyeOff className="h-4 w-4 text-muted-foreground" /> :
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  }
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Confirm your password"
                                  type={showConfirmPassword ? "text" : "password"}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={toggleConfirmPasswordVisibility}
                                >
                                  {showConfirmPassword ?
                                    <EyeOff className="h-4 w-4 text-muted-foreground" /> :
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  }
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>I am a</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="individual">Individual</SelectItem>
                                <SelectItem value="pet_shop">Pet Shop</SelectItem>
                                <SelectItem value="shelter">Animal Shelter</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the{" "}
                                <Link href="/terms" className="text-primary hover:underline">
                                  terms of service
                                </Link>
                                {" "}and{" "}
                                <Link href="/privacy" className="text-primary hover:underline">
                                  privacy policy
                                </Link>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full" disabled={isRegistering}>
                        {isRegistering ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create account"
                        )}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="w-full">
                        <Facebook className="mr-2 h-4 w-4" />
                        Facebook
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="#" className="text-primary hover:underline" onClick={() => document.getElementById('login-tab')?.click()}>
                      Login
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
