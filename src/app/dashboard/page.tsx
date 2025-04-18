'use client'
import React, { useState } from 'react';
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

// Mock data for dashboard
const currentUser = mockUsers[0]; // Using the first user as the current user
const userPets = mockPets.filter(pet => pet.owner.id === currentUser.id);
const favoritePets = mockPets.slice(1, 4); // Just using some pets as favorites for demo

// Mock adoption/purchase requests
const mockRequests = [
  {
    id: 'req1',
    petId: mockPets[0].id,
    petName: mockPets[0].name,
    petImage: mockPets[0].images[0],
    type: 'adoption',
    status: 'pending',
    requesterId: mockUsers[3].id,
    requesterName: mockUsers[3].name,
    requesterAvatar: mockUsers[3].avatar,
    message: "Hello, I'm interested in adopting Max. He looks like a wonderful dog and I think he'd fit perfectly in my family. Could we arrange a meeting?",
    date: '2023-07-20T14:30:00.000Z',
  },
  {
    id: 'req2',
    petId: mockPets[2].id,
    petName: mockPets[2].name,
    petImage: mockPets[2].images[0],
    type: 'purchase',
    status: 'approved',
    requesterId: mockUsers[1].id,
    requesterName: mockUsers[1].name,
    requesterAvatar: mockUsers[1].avatar,
    message: "Hi there! I'd like to purchase Rocky. He looks amazing and I'm willing to pay the listed price. When can I come see him?",
    date: '2023-07-18T09:15:00.000Z',
  },
  {
    id: 'req3',
    petId: mockPets[4].id,
    petName: mockPets[4].name,
    petImage: mockPets[4].images[0],
    type: 'breeding',
    status: 'rejected',
    requesterId: mockUsers[4].id,
    requesterName: mockUsers[4].name,
    requesterAvatar: mockUsers[4].avatar,
    message: "Hello, I have a female Maine Coon and I'm interested in breeding with Oliver. Could we discuss the details?",
    date: '2023-07-15T11:45:00.000Z',
  },
];

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('my-pets');

  const handleDeletePet = (petId: string) => {
    toast({
      title: "Pet Deleted",
      description: "Pet has been removed from your listings.",
    });
  };

  const handleRequestAction = (requestId: string, action: 'approve' | 'reject') => {
    toast({
      title: action === 'approve' ? "Request Approved" : "Request Rejected",
      description: `The request has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

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
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="font-semibold text-xl">{currentUser.name}</h2>
                  <p className="text-sm text-muted-foreground mb-1">@{currentUser.name.toLowerCase().replace(' ', '')}</p>
                  <Badge className="capitalize mt-1">{currentUser.role}</Badge>
                  
                  {currentUser.isVerified && (
                    <Badge variant="outline" className="border-green-500 text-green-600 mt-2">
                      Verified Account
                    </Badge>
                  )}
                  
                  <Link href="/profile/edit" className="w-full mt-4">
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
                    <Badge className="ml-auto" variant="secondary">3</Badge>
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
                
                {userPets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userPets.map(pet => (
                      <Card key={pet.id} className="overflow-hidden">
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
                                  <Link href={`/pets/${pet.id}`}>View Listing</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/edit-pet/${pet.id}`}>Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeletePet(pet.id)}
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
                    {mockRequests.map(request => (
                      <Card key={request.id}>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="sm:w-20 sm:h-20 w-full h-32 flex-shrink-0">
                              <img 
                                src={request.petImage} 
                                alt={request.petName} 
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{request.petName}</h3>
                                    {request.type === 'adoption' && (
                                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                        Adoption
                                      </Badge>
                                    )}
                                    {request.type === 'purchase' && (
                                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                        Purchase
                                      </Badge>
                                    )}
                                    {request.type === 'breeding' && (
                                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                                        Breeding
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    <span>{new Date(request.date).toLocaleDateString()}</span>
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
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-3">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={request.requesterAvatar} alt={request.requesterName} />
                                  <AvatarFallback>{request.requesterName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">{request.requesterName}</span>
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
                                    onClick={() => handleRequestAction(request.id, 'reject')}
                                  >
                                    <X className="h-4 w-4 mr-1" /> Reject
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleRequestAction(request.id, 'approve')}
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
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="sent">
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
                  </TabsContent>
                </Tabs>
              </div>
            )}
            
            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Favorite Pets</h1>
                
                {favoritePets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoritePets.map(pet => (
                      <Card key={pet.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img 
                            src={pet.images[0]} 
                            alt={pet.name} 
                            className="w-full h-full object-cover"
                          />
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 text-foreground hover:bg-white backdrop-blur"
                            onClick={() => {
                              toast({
                                title: "Removed from Favorites",
                                description: `${pet.name} has been removed from your favorites.`,
                              });
                            }}
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
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
                              {pet.city}
                            </span>
                            {pet.purpose === 'sell' && pet.price && (
                              <span className="font-semibold text-primary">
                                ${pet.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <Button className="w-full mt-4" asChild>
                            <Link href={`/pets/${pet.id}`}>View Details</Link>
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
                      {mockUsers.slice(1, 4).map((user, index) => (
                        <div 
                          key={user.id}
                          className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{user.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {index === 0 ? "Yes, the cat is still available for adoption!" : 
                                 index === 1 ? "When can I come see the puppy?" : 
                                 "Thanks for the information about the vaccination."}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-muted-foreground">
                              {index === 0 ? "10 min ago" : 
                               index === 1 ? "1 hour ago" : 
                               "Yesterday"}
                            </span>
                            {index === 0 && (
                              <Badge className="mt-1">New</Badge>
                            )}
                          </div>
                        </div>
                      ))}
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
                          <Input placeholder="Your name" defaultValue={currentUser.name} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">Email</label>
                          <Input placeholder="Your email" defaultValue={currentUser.email} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-2 items-start">
                          <label className="text-sm font-medium">Bio</label>
                          <textarea 
                            className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                            placeholder="Write a short bio..."
                            defaultValue={currentUser.bio}
                          ></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">Phone</label>
                          <Input placeholder="Your phone number" defaultValue={currentUser.phone} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[150px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">City</label>
                          <Input placeholder="Your city" defaultValue={currentUser.city} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
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
                          <Input type="password" placeholder="Your current password" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[180px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">New Password</label>
                          <Input type="password" placeholder="Your new password" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[180px,1fr] gap-2 items-center">
                          <label className="text-sm font-medium">Confirm New Password</label>
                          <Input type="password" placeholder="Confirm your new password" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Update Password</Button>
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
                          <Switch checked={true} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">New Message Alerts</h4>
                            <p className="text-sm text-muted-foreground">
                              Get notified when you receive a new message.
                            </p>
                          </div>
                          <Switch checked={true} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Pet Request Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive alerts for adoption, purchase, or breeding requests.
                            </p>
                          </div>
                          <Switch checked={true} />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Marketing Emails</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive promotional content and updates about our services.
                            </p>
                          </div>
                          <Switch checked={false} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline">Reset to Defaults</Button>
                      <Button>Save Preferences</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="border-destructive">
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
                  </Card>
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
  ({ className, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          {...props}
        />
        <div
          className={`w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary`}
        ></div>
      </div>
    );
  }
);
Switch.displayName = "Switch";

export default DashboardPage;
