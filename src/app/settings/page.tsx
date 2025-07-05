'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User, Edit, Bell, Lock, Shield, CreditCard, HelpCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Layout from '@/components/layout/Layout';
 
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';

// Profile form schema
const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional(),
  bio: z.string().optional(),
  city: z.string().optional(),
});

// Notification form schema
const notificationSchema = z.object({
  emailNotifications: z.boolean(),
  messageNotifications: z.boolean(),
  newPetListings: z.boolean(),
  adoptionUpdates: z.boolean(),
  marketingEmails: z.boolean(),
});

const SettingsPage: React.FC = () => {
  const { user } = useUser();
 const router = useRouter()
  // Profile form
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      city: user?.city || "",
    },
  });

  // Notification form
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      messageNotifications: true,
      newPetListings: true,
      adoptionUpdates: true,
      marketingEmails: false,
    },
  });

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
    console.log(values);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const onNotificationSubmit = (values: z.infer<typeof notificationSchema>) => {
    console.log(values);
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 shrink-0">
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center p-4 border rounded-lg">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-lg">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{user?.role || 'User'}</p>
                  <Button variant="outline" size="sm" className="mt-2 w-full">
                    <Edit className="h-3 w-3 mr-2" /> Edit avatar
                  </Button>
                </div>

                <div className="hidden md:block">
                  <nav className="flex flex-col space-y-1">
                    <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                      <TabsTrigger value="profile" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" /> Profile
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="w-full justify-start">
                        <Bell className="h-4 w-4 mr-2" /> Notifications
                      </TabsTrigger>
                      <TabsTrigger value="security" className="w-full justify-start">
                        <Lock className="h-4 w-4 mr-2" /> Security
                      </TabsTrigger>
                      <TabsTrigger value="privacy" className="w-full justify-start">
                        <Shield className="h-4 w-4 mr-2" /> Privacy
                      </TabsTrigger>
                      <TabsTrigger value="billing" className="w-full justify-start">
                        <CreditCard className="h-4 w-4 mr-2" /> Billing
                      </TabsTrigger>
                      <TabsTrigger value="help" className="w-full justify-start">
                        <HelpCircle className="h-4 w-4 mr-2" /> Help
                      </TabsTrigger>
                    </TabsList>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="md:hidden mb-6">
                <TabsList className="grid grid-cols-3 gap-2 mb-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsList className="grid grid-cols-3 gap-2">
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                  <TabsTrigger value="help">Help</TabsTrigger>
                </TabsList>
              </div>

              {/* TabsContent goes here - same as before */}
              {/* NO CHANGES to TabContent below */}
              {/* Keep all TabsContent code you already had here exactly the same */}
              {/* ... */}
              
              {/* Example for one tab to show it's working: */}
              <TabsContent value="profile">
                {/* your full profile form here (unchanged) */}
              </TabsContent>
              
              <TabsContent value="notifications">
                {/* your full notifications form here (unchanged) */}
              </TabsContent>

              {/* All other TabsContent blocks (security, privacy, etc.) here unchanged */}
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
