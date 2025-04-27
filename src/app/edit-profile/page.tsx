'use client'
import React, { useState ,useEffect} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from '@/hooks/use-toast';
import { Save, User, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {createAddress,getAddresses,updateAddressById  } from '@/services/authApi';

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

const EditProfilePage = () => {
  const { user } = useAuth();
   const router = useRouter()
  // Initialize with some default addresses
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressMode, setAddressMode] = useState<'existing' | 'new'>('existing');
  const [newAddress, setNewAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false,
  });
 const queryClient = useQueryClient();
  useEffect(() => {
    const token = Cookies.get('token');
    console.log(token)
    if (!token) {

      toast({
        title: "You are not logged in.",
        description: "Please login first.",
        variant: "destructive",
      });

      router.replace('/login'); // Redirect to login if no token
    }
  }, [router]);


  const { data:addressList, isLoading, isError, refetch } = useQuery({
    queryKey: ['addressList'],
    queryFn: getAddresses,
    enabled: !!Cookies.get('token'),
    retry: false,
  });

   const CreateAddressMutation = useMutation<any, Error, Address>(
      {
        mutationFn: createAddress,
        onSuccess: async(address: any) => {

            console.log(address)
            await queryClient.invalidateQueries({ queryKey: ['addressList'] });
          toast({
            title: 'Address saved successfully',
          });
       
        },
        onError: (err: any) => {
          toast({
            title: 'Address Request failed',
            description: err.message,
            variant: 'destructive',
          });
        },
      }
    );

    const UpdateAddressMutation = useMutation<any, Error, Address>(
        {
          mutationFn: updateAddressById,
          onSuccess: async(address: any) => {
  
              console.log(address)
              await queryClient.invalidateQueries({ queryKey: ['addressList'] });
            toast({
              title: 'Default Address Updated',
            });
         
          },
          onError: (err: any) => {
            toast({
              title: 'Address Request failed',
              description: err.message,
              variant: 'destructive',
            });
          },
        }
      );

  const handleAddressSave = () => {

    CreateAddressMutation.mutate(newAddress);

    // if (newAddress.isDefault) {
    //   setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    // }
    // setAddresses(prev => [...prev, newAddress]);
    // setNewAddress({
    //   street: '',
    //   city: '',
    //   state: '',
    //   postalCode: '',
    //   isDefault: false,
    // });
    setShowAddressForm(false);
    toast({
      title: "Address Added",
      description: "Your new address has been saved successfully.",
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleMakeDefault = (index: number) => {

    UpdateAddressMutation.mutate({...addressList.data[index],isDefault:true})

    // setAddresses(prev => 
    //   prev.map((addr, i) => ({
    //     ...addr,
    //     isDefault: i === index
    //   }))
    // );
    // toast({
    //   title: "Default Address Updated",
    //   description: "Your default address has been updated successfully.",
    // });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to your storage
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been updated successfully.",
      });
    }
  };

  console.log('addressList',addressList)

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your profile information and manage your addresses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Profile Picture Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Picture</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      <User className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="picture" className="cursor-pointer">
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" className="cursor-pointer">
                          Change Picture
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          JPG, PNG or GIF. Max size of 2MB.
                        </span>
                      </div>
                    </Label>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={user?.email} 
                      readOnly 
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={user?.phone || ''} />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Addresses Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Addresses</h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                  >
                    {showAddressForm ? 'Cancel' : 'Manage Addresses'}
                  </Button>
                </div>

                {showAddressForm && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-base font-medium">Manage Your Addresses</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowAddressForm(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <RadioGroup
                          value={addressMode}
                          onValueChange={(value) => setAddressMode(value as 'existing' | 'new')}
                          className="flex flex-col space-y-2 mb-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="existing" id="existing" />
                            <Label htmlFor="existing">Use existing address</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="new" id="new" />
                            <Label htmlFor="new">Add new address</Label>
                          </div>
                        </RadioGroup>

                        {addressMode === 'existing' &&  addressList?.success && addressList?.data.length > 0 ? (
                          <div className="space-y-4">
                            {addressList?.data.map((address:any, index:number) => (
                              <Card key={index}>
                                <CardContent className="pt-6">
                                  <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                      <p className="font-medium">{address.street}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {address.city}, {address.state} {address.postalCode}
                                      </p>
                                      {address.isDefault && (
                                        <span className="text-sm text-green-600">Default Address</span>
                                      )}
                                    </div>
                                    {!address.isDefault && (
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleMakeDefault(index)}
                                      >
                                        Make Default
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : addressMode === 'new' ? (
                          <div>
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="street">Street Address</Label>
                                <Input
                                  id="street"
                                  name="street"
                                  value={newAddress.street}
                                  onChange={handleAddressChange}
                                  placeholder="123 Main St"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                  id="city"
                                  name="city"
                                  value={newAddress.city}
                                  onChange={handleAddressChange}
                                  placeholder="City"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                  id="state"
                                  name="state"
                                  value={newAddress.state}
                                  onChange={handleAddressChange}
                                  placeholder="State"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                  id="postalCode"
                                  name="postalCode"
                                  value={newAddress.postalCode}
                                  onChange={handleAddressChange}
                                  placeholder="Postal Code"
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="default-address"
                                  checked={newAddress.isDefault}
                                  onCheckedChange={(checked) => 
                                    setNewAddress(prev => ({ ...prev, isDefault: checked }))
                                  }
                                />
                                <Label htmlFor="default-address">
                                  Make this my default address
                                </Label>
                              </div>
                              <Button
                                onClick={handleAddressSave}
                                className="flex items-center gap-2"
                              >
                                <Save className="h-4 w-4" />
                                Save Address
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">No addresses found. Add a new address to get started.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Show the list of addresses on the main page */}
                {!showAddressForm && addressList?.success && addressList?.data.length > 0 && (
                  <div className="space-y-2">
                    {addressList?.data.map((address:any, index:number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className={`p-2 rounded-md border ${address.isDefault ? 'border-green-500' : 'border-gray-200'} flex-grow`}>
                          <p className="font-medium">{address.street}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          {address.isDefault && (
                            <span className="text-xs font-medium text-green-600">Default</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditProfilePage;
