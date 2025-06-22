'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  Heart,
  Medal,
  MapPin,
  Calendar,
  Shield,
  Star,
  MessageCircle,
  Info,
  AlertTriangle,
  Check,
  ThumbsUp
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageSlider } from '@/components/ui/image-slider';
import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';
import RatingModal from '@/components/ratings/RatingModal';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { getSinglePets, toggolFavouritePet, ratePetOwner } from '@/services/petServices';
import AdoptionRequestDialog from '@/components/adoption/AdoptionRequestDialog';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuth } from '@/contexts/AuthContext';

const PetDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const router = useRouter()
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'adopt' | 'buy' | 'breed'>('adopt');
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const queryClient = useQueryClient();


  const ToggolFavourite = useMutation<any, Error, any>(
    {
      mutationFn: toggolFavouritePet,
      onSuccess: async (pet: any) => {
        await queryClient.invalidateQueries({ queryKey: ['getSinglePet'] });
        await queryClient.invalidateQueries({ queryKey: ['petList'] });

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


  const { data: pet, isLoading, isError } = useQuery({
    queryKey: ['getSinglePet', id],
    queryFn: ({ queryKey }) => getSinglePets(queryKey[1]),
    refetchOnMount: true,
    retry: true,
  });


  if (!pet) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Pet Not Found</h1>
          <p className="text-muted-foreground mb-6">The pet you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/pets">Browse Other Pets</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAction = (type: 'adopt' | 'buy' | 'breed') => {
    setActionType(type);
    setIsContactDialogOpen(true);
  };

  const handleSubmitRequest = () => {
    setIsContactDialogOpen(false);

    router.push(`/chat/${pet._id}`);
  };

  const handleAddToFavorites = (id: string) => {
    ToggolFavourite.mutate(id)

  };

  const handleShare = () => {
    const currentUrl = window.location.href;

    navigator.clipboard.writeText(currentUrl).then(() => {
      toast({
        title: "Link Copied",
        description: "Pet link copied to clipboard!",
      });
    }).catch(() => {
      toast({
        title: "Failed to Copy",
        description: "Unable to copy the link. Please try manually.",
        variant: "destructive",
      });
    });
  };

  const renderActionButtons = () => {
    if (pet.purpose === 'adopt') {
      return (
        // <Button 
        //   className="flex-1"
        //   onClick={() => handleAction('adopt')}
        // >
        //   Request Adoption
        // </Button>

        <AdoptionRequestDialog
          pet={pet}
          buttonText="Request Adoption"
          title={`Request to Adopt ${pet.name}.`}
          placeholder={`Hi, I'm interested in adopting ${pet.name}...`}

        />
      );
    } else if (pet.purpose === 'sell') {
      return (
        // <Button 
        //   className="flex-1"
        //   onClick={() => handleAction('buy')}
        // >
        //   {`Buy Now - $${parseFloat(pet.price)}`}
        // </Button>

        <AdoptionRequestDialog
          pet={pet}
          buttonText={`Buy Now - $${parseFloat(pet.price)}`}
          title={`Request to Buy ${pet.name}.`}
          placeholder={`Hi, I'm interested in buying ${pet.name}...`}

        />
      );
    } else {
      return (
        // <Button 
        //   className="flex-1"
        //   onClick={() => handleAction('breed')}
        // >
        //   Send Breeding Request
        // </Button>

        <AdoptionRequestDialog
          pet={pet}
          buttonText={`Send Breeding Request`}
          title={`Request to Breed ${pet.name}.`}
          placeholder={`Hi, I'm interested in breeding with ${pet.name}...`}


        />
      );
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/pets" className="inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listings
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          <div>
            <div className="mb-6">
              <ImageSlider
                images={pet.images}
                className="aspect-video rounded-lg overflow-hidden"
              />
            </div>

            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="owner">Owner Info</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="p-4 border rounded-lg mt-4">
                <h3 className="text-lg font-semibold mb-4">About {pet.name}</h3>
                <p className="text-muted-foreground mb-6">{pet.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Pet Details</h4>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <span>{pet.type}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Breed</span>
                      <span>{pet.breed}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Age</span>
                      <span>{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Gender</span>
                      <span>{pet.gender}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Health & Status</h4>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Vaccinated</span>
                      <span className="flex items-center">
                        {pet.vaccinated ?
                          <Check className="h-4 w-4 text-green-600 mr-1" /> :
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                        }
                        {pet.vaccinated ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Purpose</span>
                      <span>
                        {pet.purpose === 'adopt' && 'For Adoption'}
                        {pet.purpose === 'sell' && 'For Sale'}
                        {pet.purpose === 'breed' && 'For Breeding'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Location</span>
                      <span>{pet.address.city}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm">
                      <span className="text-muted-foreground">Listed On</span>
                      <span>{new Date(pet.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="owner" className="p-4 border rounded-lg mt-4">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={pet.owner.avatar ? pet.owner.avatar : '/maleAvatar.jpg'}
                    alt={pet.owner.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{pet.owner.name}</h3>
                      {pet.ownerVerified && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="border-green-500 text-green-600 flex items-center gap-1">
                                <Medal className="h-3 w-3" /> Verified
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This user has been verified by our team</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="capitalize">{pet.owner.role}</span>
                      <button
                        className="flex items-center hover:text-primary transition-colors"
                        onClick={() => setIsRatingModalOpen(true)}
                      >
                        <Star className="h-4 w-4 text-amber-500 mr-1 fill-amber-500" />
                        {pet.owner.averageRating.toFixed(1)}
                      </button>
                      <span>Member since {new Date(pet.owner.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => {
                      const actionMap = {
                        'adopt': 'adopt',
                        'sell': 'buy',
                        'breed': 'breed'
                      } as const;
                      handleAction(actionMap[pet.purpose as 'breed' | 'sell' | 'adopt']);
                    }}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Owner
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsRatingModalOpen(true)}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Rate This {pet.owner.role === 'individual' ? 'Owner' : pet.owner.role === 'shelter' ? 'Shelter' : 'Pet Shop'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="terms" className="p-4 border rounded-lg mt-4">
                <h3 className="text-lg font-semibold mb-4">
                  {pet.purpose === 'adopt' && 'Adoption Terms'}
                  {pet.purpose === 'sell' && 'Purchase Terms'}
                  {pet.purpose === 'breed' && 'Breeding Terms'}
                </h3>

                {pet.purpose === 'adopt' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      By submitting an adoption request, you agree to our adoption process which may include:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>A screening interview with the current owner or shelter</li>
                      <li>Possible home visit to ensure the living environment is suitable</li>
                      <li>Commitment to provide proper care, nutrition, and veterinary attention</li>
                      <li>Adoption fee may be required (to be discussed with owner)</li>
                      <li>Agreement to follow-up check-ins after adoption</li>
                    </ul>
                    <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-950/50 rounded-lg text-amber-800 dark:text-amber-200">
                      <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        The adoption process will be determined by the current owner or shelter. Please contact them for specific details and requirements.
                      </p>
                    </div>
                  </div>
                )}

                {pet.purpose === 'sell' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      By making a purchase inquiry, you understand:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>The listed price is {pet.price ? `$${parseFloat(pet.price)}` : 'to be discussed with the seller'}</li>
                      <li>You may need to provide proof of ability to care for the pet</li>
                      <li>The seller may have additional requirements before finalizing the sale</li>
                      <li>We recommend meeting the pet in person before completing the purchase</li>
                      <li>PawConnect is not responsible for transactions between users</li>
                    </ul>
                    <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-950/50 rounded-lg text-amber-800 dark:text-amber-200">
                      <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        We recommend using secure payment methods and obtaining proper documentation (receipts, health certificates, etc.) before completing any transaction.
                      </p>
                    </div>
                  </div>
                )}

                {pet.purpose === 'breed' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      By submitting a breeding request, you acknowledge:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Breeding should only be done with healthy animals and appropriate veterinary oversight</li>
                      <li>You may need to provide information about your pet's health, lineage, and temperament</li>
                      <li>Breeding fees and arrangements will be discussed directly with the owner</li>
                      <li>Responsible breeding practices must be followed</li>
                      <li>PawConnect is not responsible for breeding arrangements between users</li>
                    </ul>
                    <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-950/50 rounded-lg text-amber-800 dark:text-amber-200">
                      <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        We strongly encourage all breeders to follow ethical breeding practices and to prioritize the health and wellbeing of the animals involved.
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="bg-card rounded-lg p-6 border sticky top-20">
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-2xl font-bold">{pet.name}</h1>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddToFavorites(pet._id)}
                    >


                      {pet.isFavourite ? <Heart className="h-4 w-4 fill-red-500 text-white  bg-red" /> : <Heart className="h-4 w-4 " />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{pet.city}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
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
                  <Badge variant="secondary">{pet.type}</Badge>
                  <Badge variant="secondary">{pet.breed}</Badge>
                  <Badge variant="secondary">{pet.gender}</Badge>
                  {pet.vaccinated && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Vaccinated
                    </Badge>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Button
                  variant="ghost"
                  className="h-auto p-0 hover:bg-transparent flex items-center gap-1 text-amber-500"
                  onClick={() => setIsRatingModalOpen(true)}
                >
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4"
                        fill={star <= Math.round(pet.owner.averageRating) ? "currentColor" : "transparent"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{pet.owner.averageRating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({pet.owner.totalRatings.toFixed(1)} ratings)</span>
                </Button>
              </div>

              {pet.purpose === 'sell' && (
                <div className="mb-6">
                  <h2 className="font-bold text-2xl text-primary">${pet.price}</h2>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Owner</h3>
                <div className="flex items-center gap-2">
                  <img
                    src={pet.owner.avatar ? pet.owner.avatar : '/maleAvatar.jpg'}
                    alt={pet.owner.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{pet.owner.name}</span>
                      {pet.ownerVerified && (
                        <Medal className="h-3 w-3 ml-1 text-green-600" />
                      )}
                    </div>
                    <button
                      className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsRatingModalOpen(true)}
                    >
                      <Star className="h-3 w-3 text-amber-500 mr-1 fill-amber-500" />
                      <span>{pet.owner.averageRating.toFixed(1)}</span>
                    </button>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex gap-3">
                {renderActionButtons()}
                <Button
                  variant="outline"
                  onClick={() => router.push(`/chat/${pet.id}`)}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="sr-only">Message</span>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By contacting the owner, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {currentUser &&
        <CahtInquiry
          isContactDialogOpen={isContactDialogOpen}
          setIsContactDialogOpen={setIsContactDialogOpen}
          pet={pet}
          actionType={actionType}
          userId={currentUser._id}
        />
      }





      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        targetName={pet.owner.name}
        targetType="owner"
        targetId={pet.owner._id}
      />
    </Layout>
  );
};

export default PetDetailsPage;


const CahtInquiry = ({ isContactDialogOpen, setIsContactDialogOpen, pet, actionType, userId }: any) => {
  const { messages, sendMessage } = useChatSocket(userId);
  const [text, setText] = useState('');

  const handleSubmitRequest = () => {
    
    sendMessage({
      senderId: userId,
      receiverId: pet.owner._id,
      petId: pet._id,
      text: text,
    })
    setText('')
    setIsContactDialogOpen(false);
    // router.push(`/chat/${pet._id}`);
  };
  return (
    <>
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'adopt' && 'Request Adoption'}
              {actionType === 'buy' && 'Purchase Inquiry'}
              {actionType === 'breed' && 'Breeding Request'}
            </DialogTitle>
            <DialogDescription>
              Send a message to the owner to express your interest in {pet.name}.
              They will respond to discuss next steps.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <textarea
              className="w-full p-3 rounded-md border border-input text-sm"
              rows={5}
              value={text}
              onChange={(e) => { setText(e.target.value) }}
              placeholder={`Hello, I'm interested in ${actionType === 'adopt' ? 'adopting' : actionType === 'buy' ? 'purchasing' : 'breeding with'} ${pet.name}. I'd like to learn more and discuss next steps.`}
            ></textarea>
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Your contact information will be shared with the pet owner
                once you submit this request.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest}>Start Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
