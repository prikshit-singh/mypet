'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { mockPets, mockUsers } from '@/data/mock-data';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPets, getUserFavouritePets, toggolFavouritePet, deleteSinglePets, getSentRequest, getReceivedRequest, updateRequest, } from '@/services/petServices';
import { updateCurrentUser, updateCurrentUserPassword } from '@/services/authApi';
import { getAllChats } from '@/services/chatServices';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
// Mock data for dashboard
// const currentUser = mockUsers[0]; // Using the first user as the current user
// const userPets = mockPets.filter(pet => pet.owner._id === currentUser.id);


const DashboardPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    phone: currentUser?.phone || '',
  });
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notificationFields, setNotificationFields] = useState({
    email: true,
    messages: true,
    petRequests: true,
    marketing: true,
  })

  const [activeTab, setActiveTab] = useState('my-pets');
  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      bio: currentUser?.bio || '',
      phone: currentUser?.phone || '',
    })


    setNotificationFields({
      email: currentUser?.notification?.email !== undefined ? currentUser?.notification?.email : true,
      messages: currentUser?.notification?.email !== undefined ? currentUser?.notification?.messages : true,
      petRequests: currentUser?.notification?.email !== undefined ? currentUser?.notification?.petRequests : true,
      marketing: currentUser?.notification?.email !== undefined ? currentUser?.notification?.marketing : true,
    })

    console.log('currentUser?.notification?.messages', currentUser?.notification?.messages)
  }, [currentUser])


  const { data: userPets, isLoading, isError, refetch } = useQuery({
    queryKey: ['getUserPets'],
    queryFn: getUserPets,
    enabled: !!Cookies.get('token'),
    retry: false,
  });

  const { data: userChats, isLoading: chatIsLoading, isError: chtIsError, refetch: chatRefetch } = useQuery({
    queryKey: ['getAllChats'],
    queryFn: getAllChats,
    enabled: !!Cookies.get('token'),
    retry: false,
  });

  const { data: favoritePets } = useQuery({
    queryKey: ['getUserFavouritePets'],
    queryFn: getUserFavouritePets,
    enabled: !!Cookies.get('token'),
    retry: false,
  });

  const { data: petSentReequests, isLoading: sentRequestIsLoading, isError: sentRequestIsError, refetch: sentRequestRefetch } = useQuery({
    queryKey: ['getUserSentRequest'],
    queryFn: getSentRequest,
    enabled: !!Cookies.get('token'),
    retry: false,
  });


  const { data: petReceivedReequests, isLoading: receivedRequestIsLoading, isError: receivedRequestIsError, refetch: receivedRequestRefetch } = useQuery({
    queryKey: ['getUserReceivedRequest'],
    queryFn: getReceivedRequest,
    enabled: !!Cookies.get('token'),
    retry: false,
  });

  const deletePetMutation = useMutation<any, Error, string>(
    {
      mutationFn: deleteSinglePets,
      onSuccess: async (deleteRes: any) => {

        console.log(deleteRes)
        await queryClient.invalidateQueries({ queryKey: ['getUserPets'] });
        toast({
          title: "Pet Deleted",
          description: "Pet has been removed from your listings.",
        });

      },
      onError: (err: any) => {
        toast({
          title: 'Pet Deleted Request failed',
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  const updatePetRequestStates = useMutation<any, Error, { requestId: string, status: 'approved' | 'rejected' }>(
    {
      mutationFn: updateRequest,
      onSuccess: async (updatedReq: any) => {

        console.log(updatedReq)
        await queryClient.invalidateQueries({ queryKey: ['getUserSentRequest'] });
        await queryClient.invalidateQueries({ queryKey: ['getUserReceivedRequest'] });
        // toast({
        //   title: "Pet Status updated",
        //   description: "Pet has been removed from your listings.",
        // });

      },
      onError: (err: any) => {
        toast({
          title: 'Pet status request failed',
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  const updateCurrentUserMutation = useMutation<any, Error, any>(
    {
      mutationFn: updateCurrentUser,
      onSuccess: async (updatedReq: any) => {
        await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        toast({
          title: "User updated successfully.",
          description: "User has been updated successfully.",
        });

      },
      onError: (err: any) => {
        toast({
          title: 'Update user request failed',
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  const updateCurrentUserPasswordMutation = useMutation<any, Error, any>(
    {
      mutationFn: updateCurrentUserPassword,
      onSuccess: async (updatedReq: any) => {

        console.log(updatedReq)
        await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        toast({
          title: "User updated successfully.",
          description: "User password updated successfully.",
        });

      },
      onError: (err: any) => {
        toast({
          title: 'Update user request failed',
          description: err.message,
          variant: 'destructive',
        });
      },
    }
  );

  const handleDeletePet = (petId: string) => {

    deletePetMutation.mutate(petId)

  };

  const handleRequestAction = (requestId: string, action: 'approved' | 'rejected') => {

    updatePetRequestStates.mutate({ requestId: requestId, status: action })

    toast({
      title: action === 'approved' ? "Request Approved" : "Request Rejected",
      description: `The request has been ${action === 'approved' ? 'approved' : 'rejected'}.`,
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const ToggolFavourite = useMutation<any, Error, any>(
    {
      mutationFn: toggolFavouritePet,
      onSuccess: async (pet: any) => {
        await queryClient.invalidateQueries({ queryKey: ['getUserFavouritePets'] });
        // toast({
        //   title: 'Pet saved successfully',
        // });
      },
      onError: (err: any) => {
        toast({
          title: 'Pet Request failed',
          description: err.message,
          variant: 'destructive',
        });

      },
    }
  );

  const handleToggol = (id: string) => {
    ToggolFavourite.mutate(id)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPasswordFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsToggle = (key: keyof typeof notificationFields) => {
    setNotificationFields(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveCurrentUserProfile = () => {
    updateCurrentUserMutation.mutate(formData)
  }

  const saveCurrentUserNotification = (type: string) => {
    if (type === 'default') {
      updateCurrentUserMutation.mutate({
        notification: {
          email: true,
          messages: true,
          petRequests: true,
          marketing: true,
        }

      })
    } else {
      updateCurrentUserMutation.mutate({ notification: notificationFields })

    }
  }

  const updatePassword = () => {
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      toast({
        title: 'Password not match.',
        description: 'New password and confirm password are not same.',
        variant: 'destructive',
      });
      return;
    }
    updateCurrentUserPasswordMutation.mutate(passwordFields)
  }


  function timeAgo(date: string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  console.log('userChats', userChats)

  return (
    <Layout>
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr] gap-8">
          {/* Sidebar */}
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
                    onClick={() => setActiveTab('my-pets')}
                  >
                    <PawPrint className="h-4 w-4 mr-2" />
                    My Pets
                  </Button>
                  <Button
                    variant={activeTab === 'requests' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('requests')}
                  >
                    <Inbox className="h-4 w-4 mr-2" />
                    Requests
                    <Badge className="ml-auto" variant="secondary">{petReceivedReequests?.length || 0}</Badge>
                  </Button>
                  <Button
                    variant={activeTab === 'favorites' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('favorites')}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                  <Button
                    variant={activeTab === 'messages' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('messages')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Messages
                    <Badge className="ml-auto" variant="secondary">5</Badge>
                  </Button>
                  <Button
                    variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('settings')}
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

          {/* Main Content */}
          <main>
            {/* My Pets Tab */}
            {activeTab === 'my-pets' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">My Pets</h1>
                  <Link href="/add-pet">
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add New Pet
                    </Button>
                  </Link>
                </div>

                {userPets && userPets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userPets.map((pet: any) => (
                      <Card key={pet._id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img
                            src={pet.images[0]}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/pets/${pet._id}`}>View Listing</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/edit-pet/${pet._id}`}>Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeletePet(pet._id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{pet.name}</h3>
                            {pet.purpose === 'adopt' && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                For Adoption
                              </Badge>
                            )}
                            {pet.purpose === 'sell' && (
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                For Sale
                              </Badge>
                            )}
                            {pet.purpose === 'breed' && (
                              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                                For Breeding
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mb-4">
                            {pet.breed} · {pet.age} {pet.age === 1 ? 'year' : 'years'} · {pet.gender}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Listed on {new Date(pet.createdAt).toLocaleDateString()}
                            </span>
                            {pet.purpose === 'sell' && pet.price && (
                              <span className="font-semibold text-primary">
                                ${pet.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-muted/40">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-primary/10 p-3 mb-4">
                        <PawPrint className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Pets Listed Yet</h3>
                      <p className="text-muted-foreground text-center mb-6">
                        Start adding your pets for adoption, sale, or breeding.
                      </p>
                      <Link href="/add-pet">
                        <Button>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Your First Pet
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Requests</h1>

                <Tabs defaultValue="received">
                  <TabsList className="mb-4">
                    <TabsTrigger value="received">Received</TabsTrigger>
                    <TabsTrigger value="sent">Sent</TabsTrigger>
                  </TabsList>

                  <TabsContent value="received" className="space-y-4">
                    {petReceivedReequests && petReceivedReequests.length > 0 ? petReceivedReequests.map((request: any) => (
                      <Card key={request._id}>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="sm:w-20 sm:h-20 w-full h-32 flex-shrink-0">
                              <img
                                src={request.pet.images[0]}
                                alt={request.pet.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{request.pet.name}</h3>
                                    {request.type === 'adopt' && (
                                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                        Adoption
                                      </Badge>
                                    )}
                                    {request.type === 'buy' && (
                                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                        Purchase
                                      </Badge>
                                    )}
                                    {request.type === 'breed' && (
                                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                                        Breeding
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                                <div>
                                  {request.status === 'pending' && (
                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                                      Pending
                                    </Badge>
                                  )}
                                  {request.status === 'approved' && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                                      Approved
                                    </Badge>
                                  )}
                                  {request.status === 'rejected' && (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                      Rejected
                                    </Badge>
                                  )}

                                  {request.status === 'cancelled' && (
                                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                      Cancelled
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mb-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={request.requester.avatar} alt={request.requester.name} />
                                  <AvatarFallback>{request.requester.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{request.requester.name}</span>
                              </div>

                              <p className="text-sm text-muted-foreground mb-4">
                                {request.message}
                              </p>

                              {request.status === 'pending' && (
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive"
                                    onClick={() => handleRequestAction(request._id, 'rejected')}
                                  >
                                    <X className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleRequestAction(request._id, 'approved')}
                                  >
                                    <Check className="h-4 w-4 mr-1" /> Approve
                                  </Button>
                                </div>
                              )}

                              {request.status === 'approved' && (
                                <div className="flex justify-end">
                                  <Button size="sm">
                                    <MessageSquare className="h-4 w-4 mr-1" /> Contact
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                      :
                      (
                        <Card className="bg-muted/40">
                          <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="rounded-full bg-primary/10 p-3 mb-4">
                              <Heart className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Requests Yet</h3>
                            <p className="text-muted-foreground text-center mb-6">
                              No requests found.
                            </p>
                            <Link href="/pets">
                              <Button>
                                Browse Pets
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      )


                    }
                  </TabsContent>

                  <TabsContent value="sent">
                    {petSentReequests && petSentReequests.length > 0 ?

                      petSentReequests.map((request: any, index: number) => {
                        return (
                          <Card key={request._id}>
                            <CardContent className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row gap-4">
                                <div className="sm:w-20 sm:h-20 w-full h-32 flex-shrink-0">
                                  <img
                                    src={request.pet.images[0]}
                                    alt={request.pet.name}
                                    className="w-full h-full object-cover rounded-md"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{request.pet.name}</h3>
                                        {request.type === 'adopt' && (
                                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                            Adoption
                                          </Badge>
                                        )}
                                        {request.type === 'buy' && (
                                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                            Purchase
                                          </Badge>
                                        )}
                                        {request.type === 'breed' && (
                                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                                            Breeding
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                    <div>
                                      {request.status === 'pending' && (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                                          Pending
                                        </Badge>
                                      )}
                                      {request.status === 'approved' && (
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                                          Approved
                                        </Badge>
                                      )}
                                      {request.status === 'rejected' && (
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                          Rejected
                                        </Badge>
                                      )}
                                      {request.status === 'cancelled' && (
                                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                          Cancelled
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 mb-3">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={request.owner.avatar} alt={request.owner.name} />
                                      <AvatarFallback>{request.owner.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">To: {request.owner.name}</span>
                                  </div>

                                  <p className="text-sm text-muted-foreground mb-4">
                                    {request.message}
                                  </p>

                                  <div className="flex justify-end gap-2">
                                    {request.status === 'pending' && (
                                      <Button variant="outline" size="sm">
                                        <MessageSquare className="h-4 w-4 mr-1" /> Follow Up
                                      </Button>
                                    )}

                                    {request.status === 'approved' && (
                                      <Button size="sm">
                                        <MessageSquare className="h-4 w-4 mr-1" /> Contact Owner
                                      </Button>
                                    )}

                                    {request.status === 'rejected' && (
                                      <span className="text-sm text-muted-foreground">Request was declined</span>
                                    )}

                                    <Button variant="outline" size="sm" asChild>
                                      <Link href={`/pets/${request.pet._id}`}>View Pet</Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })
                      :

                      <Card className="bg-muted/40">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                          <div className="rounded-full bg-primary/10 p-3 mb-4">
                            <Inbox className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">No Sent Requests</h3>
                          <p className="text-muted-foreground text-center mb-6">
                            You haven't sent any requests for pets yet.
                          </p>
                          <Link href="/pets">
                            <Button>
                              Browse Available Pets
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>

                    }


                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Favorite Pets</h1>

                {favoritePets && favoritePets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoritePets.map((pet: any) => (
                      <Card key={pet?.pet._id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img
                            src={pet?.pet.images[0]}
                            alt={pet?.pet.name}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white backdrop-blur"
                            onClick={() => {

                              handleToggol(pet.pet._id)
                              toast({
                                title: "Removed from Favorites",
                                description: `${pet?.pet.name} has been removed from your favorites.`,
                              });
                            }}
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{pet?.pet.name}</h3>
                            {pet?.pet.purpose === 'adopt' && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                For Adoption
                              </Badge>
                            )}
                            {pet?.pet.purpose === 'sell' && (
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                For Sale
                              </Badge>
                            )}
                            {pet?.pet.purpose === 'breed' && (
                              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                                For Breeding
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mb-4">
                            {pet?.pet.breed} · {pet?.pet.age} {pet?.pet.age === 1 ? 'year' : 'years'} · {pet?.pet.gender}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {pet?.pet.city}
                            </span>
                            {pet?.pet.purpose === 'sell' && pet?.pet.price && (
                              <span className="font-semibold text-primary">
                                ${pet?.pet.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <Button className="w-full mt-4" asChild>
                            <Link href={`/pets/${pet?.pet._id}`}>View Details</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-muted/40">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-primary/10 p-3 mb-4">
                        <Heart className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
                      <p className="text-muted-foreground text-center mb-6">
                        Start adding pets to your favorites to keep track of them.
                      </p>
                      <Link href="/pets">
                        <Button>
                          Browse Pets
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Messages</h1>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Conversations</CardTitle>
                    <CardDescription>
                      Chat with other pet owners, breeders, and potential adopters.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userChats && userChats.map((chat: any, index: number) => {
                        return (
                          <Link key={chat._id} href={`/chat/${chat._id}`}>
                            <div
                              className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={chat.participants[0].avatar} alt={chat.participants[0].name} />
                                  <AvatarFallback>{chat.participants[0].name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">{chat.participants[0].name}</h3>
                                  <p className="text-sm text-muted-foreground line-clamp-1">
                                    {chat.lastMessage.text}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-muted-foreground">
                                  {timeAgo(chat.lastMessage.createdAt)}
                                </span>
                                {index === 0 && (
                                  <Badge className="mt-1">New</Badge>
                                )}
                              </div>
                            </div>
                          </Link>

                        )
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center border-t pt-4">
                    <Button variant="outline" className="w-full">
                      View All Messages
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your account details and public profile.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        This information will be displayed publicly so be careful what you share.
                      </p>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">Name</label>
                          <Input name='name' placeholder="Your name" value={formData?.name} onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">Email</label>
                          <Input name='email' placeholder="Your email" value={formData?.email} onChange={handleChange} disabled />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-2 items-start">
                          <label className="text-sm font-medium">Bio</label>
                          <textarea
                            className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            placeholder="Write a short bio..."
                            name='bio'
                            value={formData?.bio}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">Phone</label>
                          <Input placeholder="Your phone number" name='phone' type='number' value={formData?.phone} onChange={handleChange} />
                        </div>
                        {/* <div className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">City</label>
                          <Input placeholder="Your city" value={formData?.city} />
                        </div> */}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={saveCurrentUserProfile}>Save Changes</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Password</CardTitle>
                      <CardDescription>
                        Change your password to a new secure one.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-[180px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">Current Password</label>
                          <Input name='currentPassword' value={passwordFields.currentPassword} onChange={handlePasswordChange} type="password" placeholder="Your current password" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[180px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">New Password</label>
                          <Input name='newPassword' value={passwordFields.newPassword} onChange={handlePasswordChange} type="password" placeholder="Your new password" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[180px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">Confirm New Password</label>
                          <Input name='confirmPassword' value={passwordFields.confirmPassword} onChange={handlePasswordChange} type="password" placeholder="Confirm your new password" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button onClick={updatePassword}>Update Password</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>
                        Configure how you receive notifications.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive email notifications about your account activity.
                            </p>
                          </div>
                          <Switch checked={notificationFields.email} onChange={() => handleSettingsToggle("email")} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">New Message Alerts</h4>
                            <p className="text-sm text-muted-foreground">
                              Get notified when you receive a new message.
                            </p>
                          </div>
                          <Switch checked={notificationFields.messages} onChange={() => handleSettingsToggle("messages")} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Pet Request Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive alerts for adoption, purchase, or breeding requests.
                            </p>
                          </div>
                          <Switch checked={notificationFields.petRequests} onChange={() => handleSettingsToggle("petRequests")} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Marketing Emails</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive promotional content and updates about our services.
                            </p>
                          </div>
                          <Switch checked={notificationFields.marketing} onChange={() => handleSettingsToggle("marketing")} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => saveCurrentUserNotification('default')}>Reset to Defaults</Button>
                      <Button onClick={() => saveCurrentUserNotification('save')}>Save Preferences</Button>
                    </CardFooter>
                  </Card>

                  {/* <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-destructive">Danger Zone</CardTitle>
                      <CardDescription>
                        Actions here cannot be undone. Be careful.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Deactivate Account</h4>
                            <p className="text-sm text-muted-foreground">
                              Temporarily disable your account and hide your listings.
                            </p>
                          </div>
                          <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                            Deactivate
                          </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Delete Account</h4>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete your account and all associated data.
                            </p>
                          </div>
                          <Button variant="destructive">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const Switch = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ checked, onChange, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        <div className="w-11 h-6 bg-gray-200 peer-checked:bg-primary rounded-full transition-colors relative">
          <div className={`absolute top-[2px] ${checked ? 'right-[2px]' : 'left-[2px]'} h-5 w-5 bg-white border border-gray-300 rounded-full transition-transform duration-200 `} />
        </div>
      </label>
    );
  }
);
Switch.displayName = "Switch";

export default DashboardPage;
