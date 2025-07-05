"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Plus, Save } from 'lucide-react';
import { Switch } from '@radix-ui/react-switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getUserSinglePet, updatePet } from '@/services/petServices';
import { getAddresses, createAddress, updateAddressById } from '@/services/authApi';
import Cookies from 'js-cookie';
 

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

const EditPetPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressMode, setAddressMode] = useState<'existing' | 'new'>('existing');
  const [petData, setPetData] = useState<any>(null);

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

  const queryClient = useQueryClient();

  const { data: addressList, isLoading: addressIsLoading, isError: addressIsError, refetch: addressRefetch } = useQuery({
    queryKey: ['addressList'],
    queryFn: getAddresses,
    enabled: !!Cookies.get('token'),
    retry: false,
  });

  const { data: userPet, isLoading, isError, refetch } = useQuery({
    queryKey: ['getUserSinglePet', id],
    queryFn: ({ queryKey }) => {
      const id = queryKey[1];
      if (typeof id !== 'string') {
        throw new Error('Invalid pet ID');
      }
      return getUserSinglePet(id);
    },
    enabled: !!Cookies.get('token') && !!id,
    retry: false,
  });

  const updatePetMutation = useMutation<any, Error, any>(
    {
      mutationFn: updatePet,
      onSuccess: async (pet: any) => {

        console.log(pet)
        await queryClient.invalidateQueries({ queryKey: ['getUserSinglePet'] });
        // toast({
        //   title: 'Pet saved successfully',
        // });
      },
      onError: (err: any) => {
        toast({
          title: 'Pet Update Request failed',
          description: err.message,
          variant: 'destructive',
        });

      },
    }
  );


  useEffect(() => {
    if (userPet) {
      setPetData({ ...userPet })
    }
  }, [userPet])

  const handleInputChange = (field: string, value: any) => {
    setPetData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field: string, value: any) => {
    setPetData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
      if (!files) return;

      const newFiles = Array.from(files);
      setPetData((prev: any) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));

      // Create preview URLs
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

  };

  const removeImage = (index: number) => {
    setPetData((prev:any) => ({
      ...prev,
      images: prev.images.filter((_:any, i:number) => i !== index),
    }));

    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation()

    // Validation
    if (!petData.name.trim()) {
      toast({
        title: "Error",
        description: "Pet name is required.",
        variant: "destructive"
      });
      return;
    }

    if (petData.purpose === 'sell' && (!petData.price || parseFloat(petData.price) <= 0)) {
      toast({
        title: "Error",
        description: "Price is required for pets being sold.",
        variant: "destructive"
      });
      return;
    }

    if (petData.images.length === 0) {
      toast({
        title: "Error",
        description: "At least one image is required.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Updating pet:', petData);
    console.log(petData)

    const formData = new FormData();

    // Append simple fields
    formData.append('name', petData.name);
    formData.append('type', petData.type);
    formData.append('purpose', petData.purpose);
    formData.append('address', petData.address);
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
    petData.images.forEach((image: any) => {
      console.log(image)
      if(typeof image !== 'string'){
        formData.append('images', image);
      }
    });


    updatePetMutation.mutate({ id: petData._id, payload: formData })
    setPreviewUrls( []);
    toast({
      title: "Success",
      description: "Pet updated successfully!",
    });

    // router.push('/dashboard');
  };

  if (isLoading || !petData) {
    return 'Loading...'
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Pet</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Pet Name</Label>
                  <Input
                    id="name"
                    value={petData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter pet's name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Pet Type</Label>
                  <Select value={petData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dog">Dog</SelectItem>
                      <SelectItem value="Cat">Cat</SelectItem>
                      <SelectItem value="Bird">Bird</SelectItem>
                      <SelectItem value="Fish">Fish</SelectItem>
                      <SelectItem value="Small Mammal">Small Mammal</SelectItem>
                      <SelectItem value="Reptile">Reptile</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="breed">Breed</Label>
                  <Input
                    id="breed"
                    value={petData.breed}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                    placeholder="Enter breed"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age (months)</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="30"
                    value={petData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    placeholder="Age in months"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={petData.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
                    className="flex gap-6"
                  >
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={petData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your pet's personality, health, and any special needs..."
                  className="min-h-[100px]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purpose & Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>What would you like to do with your pet?</Label>
                <RadioGroup
                  value={petData.purpose}
                  onValueChange={(value) => handleInputChange('purpose', value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="adopt" id="adopt" />
                    <Label htmlFor="adopt" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Adoption</div>
                        <div className="text-sm text-muted-foreground">Find a loving home</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Sale</div>
                        <div className="text-sm text-muted-foreground">Sell your pet</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="breed" id="breed" />
                    <Label htmlFor="breed" className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">Breeding</div>
                        <div className="text-sm text-muted-foreground">Find breeding partner</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {petData.purpose === 'sell' && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={petData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price in USD"
                    required
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="vaccinated"
                  checked={petData.vaccinated}
                  onCheckedChange={(checked) => handleInputChange('vaccinated', checked)}
                />
                <Label htmlFor="vaccinated">Pet is vaccinated and has medical records</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pet Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...petData.images,...previewUrls].map((image: string, index: number) => {
                  
                  if(typeof image === 'string')
                  return (
                  
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Pet ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )})}

                <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload up to 8 images. First image will be used as the main photo.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Addresses</h3>
            </div>

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

                  {addressList?.success && addressList?.data.length > 0 ? (
                    <div className="space-y-4">
                      {addressList?.data.map((address: any, index: number) => (
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
                              {petData?.address !== address?._id && (
                                <Button
                                  type='button'
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAddressChange('address', address?._id)
                                  }}
                                >
                                  Select
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No addresses found. Add a new address to get started.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Show the list of addresses on the main page */}

          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit">
              Update Pet
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditPetPage;
