'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    PlusCircle,
    Inbox,
    User,
    Heart,
    LogOut,
    PawPrint,
    Settings,
    Edit,
    Trash,
    Check,
    X,
    MessageSquare,
    ChevronRight,
    Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useUser } from "@/hooks/useUser";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';

const DashboardSideBar = ({ activeTab, setActiveTab, petReceivedReequests }: any) => {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'my-pets';
    const { user: currentUser, logout } = useUser();
    const router = useRouter()

    useEffect(() => {
        if (searchParams.get('tab') && searchParams.get('tab') !== activeTab) {
            setActiveTab(searchParams.get('tab')!);
        }
    }, [searchParams,initialTab]);

    const handleLogout = () => {
        logout()
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
    };


    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        router.push(`/dashboard?tab=${tab}`);
    };

    return (
        <>
            <aside className="space-y-6">
                {/* User Profile Card */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="h-20 w-20 mb-4">
                                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                                <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="font-semibold text-xl">{currentUser?.name}</h2>
                            <p className="text-sm text-muted-foreground mb-1">@{currentUser?.name.toLowerCase().replace(' ', '')}</p>
                            <Badge className="capitalize mt-1">{currentUser?.role}</Badge>

                            {currentUser?.isVerified && (
                                <Badge variant="outline" className="border-green-500 text-green-600 mt-2">
                                    Verified Account
                                </Badge>
                            )}

                            <Link href="/edit-profile" className="w-full mt-4">
                                <Button variant="outline" className="w-full">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation Menu */}
                <Card>
                    <CardContent className="p-0">
                        <nav className="space-y-1">
                            <Button
                                variant={activeTab === 'my-pets' ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => handleTabClick('my-pets')}
                            >
                                <PawPrint className="h-4 w-4 mr-2" />
                                My Pets
                            </Button>
                            <Button
                                variant={activeTab === 'requests' ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => handleTabClick('requests')}
                            >
                                <Inbox className="h-4 w-4 mr-2" />
                                Requests
                                <Badge className="ml-auto" variant="secondary">{petReceivedReequests?.length || ''}</Badge>
                            </Button>
                            <Button
                                variant={activeTab === 'favorites' ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => handleTabClick('favorites')}
                            >
                                <Heart className="h-4 w-4 mr-2" />
                                Favorites
                            </Button>
                            <Button
                                variant={activeTab === 'messages' ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => handleTabClick('messages')}
                            >
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Messages
                                {/* <Badge className="ml-auto" variant="secondary">5</Badge> */}
                            </Button>
                            <Button
                                variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => handleTabClick('settings')}
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Button>
                            <Separator className="my-2" />
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </nav>
                    </CardContent>
                </Card>
            </aside>
        </>
    )
}


export default DashboardSideBar