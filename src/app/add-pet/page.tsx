'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, PawPrint, DollarSign, Heart, Info, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';
import { Address } from '@/types/user';
import { Card } from '@/components/ui/card';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createAddress, getAddresses, updateAddressById } from '@/services/authApi';
import { createPet } from '@/services/petServices';
import { Pet } from '@/types/pet';
type PetPurpose = 'sell' | 'adopt' | 'breed';
export type PetType = 
  | "Dog"
  | "Cat"
  | "Bird"
  | "Fish"
  | "Small Mammal"
  | "Reptile"
  | "Other";


const AddPetPage: React.FC = () => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<PetPurpose>('sell');
  const [petData, setPetData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: 'Male',
    price: '',
    description: '',
    healthInfo: '',
    vaccinated: false,
    neutered: false,
    microchipped: false,
    breedingExperience: '',
    careAdvice: '',
    images: [] as File[]
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressType, setAddressType] = useState<'existing' | 'new'>('existing');
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false
  });
  const queryClient = useQueryClient();

  const { data: addressList, isLoading, isError, refetch } = useQuery({
    queryKey: ['addressList'],
    queryFn: getAddresses,
    enabled: !!Cookies.get('token'),
    retry: false,
  });

  const CreateAddressMutation = useMutation<any, Error, Address>(
    {
      mutationFn: createAddress,
      onSuccess: async (address: any) => {

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

  const CreatePetMutation = useMutation<any, Error, any>(
    {
      mutationFn: createPet,
      onSuccess: async (pet: any) => {

        console.log(pet)
        await queryClient.invalidateQueries({ queryKey: ['petList'] });
        toast({
          title: 'Pet saved successfully',
        });
        setIsSubmitting(false);
      },
      onError: (err: any) => {
        toast({
          title: 'Pet Request failed',
          description: err.message,
          variant: 'destructive',
        });
        setIsSubmitting(false);

      },
    }
  );

  useEffect(() => {
    if (addressList?.success && addressList?.data.length > 0) {
      const selectedId = addressList?.data.find((addr: any) => addr.isDefault)?._id
      setSelectedAddressId(selectedId)
    }
  }, [addressList])
  

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

  const handleTabChange = (value: string) => {
    setActiveTab(value as PetPurpose);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setPetData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setPetData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));

    // Create preview URLs
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setPetData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };



  const handleAddressTypeChange = (value: 'existing' | 'new') => {
    setAddressType(value);
  };

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = (event: any) => {
    event.stopPropagation()
    console.log(newAddress)
    CreateAddressMutation.mutate({ ...newAddress });
    // toast({
    //   title: "Address Saved",
    //   description: "Your address has been saved successfully",
    // });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log({...petData,purpose:activeTab,address:selectedAddressId},)
    // Validate form
    if (!petData.name || !petData.type || !petData.breed) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();

// Append simple fields
formData.append('name', petData.name);
formData.append('type', petData.type as PetType);
formData.append('purpose', activeTab);
formData.append('address', selectedAddressId);
formData.append('breed', petData.breed);
formData.append('age', petData.age.toString());
formData.append('gender', petData.gender as 'Male' | 'Female');
formData.append('price', petData.price.toString());
formData.append('description', petData.description);
formData.append('healthInfo', petData.healthInfo);
formData.append('vaccinated', JSON.stringify(petData.vaccinated));
formData.append('neutered', JSON.stringify(petData.neutered));
formData.append('microchipped', JSON.stringify(petData.microchipped));
formData.append('breedingExperience', petData.breedingExperience);
formData.append('careAdvice', petData.careAdvice);

// Append images (multiple files)
petData.images.forEach((image) => {
  console.log(image)
  formData.append('images', image); 
});

    CreatePetMutation.mutate(formData)

    // Simulate API call
    // setTimeout(() => {
    //   toast({
    //     title: "Pet Added Successfully",
    //     description: `Your pet ${petData.name} has been added for ${activeTab === 'sell' ? 'sale' : activeTab === 'adopt' ? 'adoption' : 'breeding'}.`,
    //   });
    //   setIsSubmitting(false);
    //   router.push('/pets');
    // }, 1500);
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Add Your Pet</h1>
            <p className="text-muted-foreground">List your pet for sale, adoption, or breeding services</p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="sell" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Sell
              </TabsTrigger>
              <TabsTrigger value="adopt" className="flex items-center gap-2">
                <PawPrint className="h-4 w-4" />
                Adopt
              </TabsTrigger>
              <TabsTrigger value="breed" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Breeding
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={petData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Max, Bella"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="species">Species <span className="text-red-500">*</span></Label>
                  <Select name="species" onValueChange={(value) => handleSelectChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Bird">Bird</SelectItem>
                      <SelectItem value="Rabbit">Rabbit</SelectItem>
                      <SelectItem value="Hamster">Hamster</SelectItem>
                      <SelectItem value="Fish">Fish</SelectItem>
                      <SelectItem value="Reptile">Reptile</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed <span className="text-red-500">*</span></Label>
                  <Input
                    id="breed"
                    name="breed"
                    value={petData.breed}
                    onChange={handleInputChange}
                    placeholder="e.g., Labrador, Persian"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    name="age"
                    type='number'
                    value={petData.age}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years, 6 months"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup defaultValue={petData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                {activeTab === 'sell' && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={petData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 500"
                      required={activeTab === 'sell'}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={petData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your pet, its personality, habits, etc."
                  rows={4}
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Health Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Health Information</h2>

              <div className="space-y-2">
                <Label htmlFor="healthInfo">Health Details</Label>
                <Textarea
                  id="healthInfo"
                  name="healthInfo"
                  value={petData.healthInfo}
                  onChange={handleInputChange}
                  placeholder="Include information about your pet's health, any medical conditions, etc."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="vaccinated"
                    checked={petData.vaccinated}
                    onCheckedChange={(checked) => handleSwitchChange('vaccinated', checked)}
                  />
                  <Label htmlFor="vaccinated">Vaccinated</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="neutered"
                    checked={petData.neutered}
                    onCheckedChange={(checked) => handleSwitchChange('neutered', checked)}
                  />
                  <Label htmlFor="neutered">Neutered/Spayed</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="microchipped"
                    checked={petData.microchipped}
                    onCheckedChange={(checked) => handleSwitchChange('microchipped', checked)}
                  />
                  <Label htmlFor="microchipped">Microchipped</Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Address Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Address Information</h2>
              </div>

              <RadioGroup
                value={addressType}
                onValueChange={(value: 'existing' | 'new') => handleAddressTypeChange(value)}
                className="mb-4"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing">Use existing address</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">Add new address</Label>
                </div>
              </RadioGroup>

              {addressType === 'existing' && (
                <div className="grid grid-cols-1 gap-4">
                  {addressList?.success && addressList?.data.length > 0 && addressList?.data.map((address: any) => (
                    <Card
                      key={address._id}
                      className={`p-4 cursor-pointer ${selectedAddressId === address._id ? 'ring-2 ring-primary' : ''
                        }`}
                      onClick={() => setSelectedAddressId(address._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{address.street}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                        </div>
                        {address.isDefault && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {addressType === 'new' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="street">Street Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="street"
                      name="street"
                      value={newAddress.street}
                      onChange={handleNewAddressChange}
                      placeholder="Enter your street address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                    <Input
                      id="city"
                      name="city"
                      value={newAddress.city}
                      onChange={handleNewAddressChange}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                    <Input
                      id="state"
                      name="state"
                      value={newAddress.state}
                      onChange={handleNewAddressChange}
                      placeholder="Enter state"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">ZIP Code <span className="text-red-500">*</span></Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={newAddress.postalCode}
                      onChange={handleNewAddressChange}
                      placeholder="Enter ZIP code"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="make-default" checked={newAddress.isDefault} onCheckedChange={(checked) => {
                        setNewAddress((prev) => ({
                          ...prev,
                          isDefault: checked,
                        }));
                      }} />
                      <Label htmlFor="make-default">Make this my default address</Label>
                    </div>
                    <Button
                      onClick={handleSaveAddress}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Address
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Purpose-specific information */}
            {activeTab === 'breed' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Breeding Information</h2>

                <div className="space-y-2">
                  <Label htmlFor="breedingExperience">Breeding Experience</Label>
                  <Textarea
                    id="breedingExperience"
                    name="breedingExperience"
                    value={petData.breedingExperience}
                    onChange={handleInputChange}
                    placeholder="Describe your pet's breeding history, temperament, and any notable traits"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {activeTab === 'adopt' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Adoption Information</h2>

                <div className="space-y-2">
                  <Label htmlFor="careAdvice">Special Care Requirements</Label>
                  <Textarea
                    id="careAdvice"
                    name="careAdvice"
                    value={petData.careAdvice}
                    onChange={handleInputChange}
                    placeholder="Describe any special care or attention this pet needs from its new owner"
                    rows={3}
                  />
                </div>
              </div>
            )}

            <Separator />

            {/* Images */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Pet Photos</h2>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-border">
                      <img src={url} alt={`Pet preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-md border border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-muted-foreground">
                      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 8 6.25 8C5.2 8 4.33 8.09 4 8.3c0-1.98 1.09-4.2 5.92-4.2C14.74 4.1 17 6.24 17 9.6c0 .94-.24 1.42-.73 2.17" />
                      <path d="M11 13.6c.82.47 1.23.8 1.81 1.5.58.69.87 1.5.87 2.4 0 1.25-.46 2.4-1.43 3.2s-2.05 1.2-3.25 1.2c-2 0-3.64-1.1-4.4-2.9" />
                      <path d="M18 2v6" />
                      <path d="M21 5h-6" />
                    </svg>
                    <span className="text-sm text-muted-foreground">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">Upload up to 8 photos of your pet. The first photo will be the main image.</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span>
                    {activeTab === 'sell' ? 'List for Sale' : activeTab === 'adopt' ? 'List for Adoption' : 'List for Breeding'}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddPetPage;
