
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { adoptionService } from '@/services/adoptionService';
import { Pet } from '@/types/pet';
import { useRouter } from 'next/navigation';
import { sendRequest } from '@/services/petServices';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';


interface AdoptionRequestDialogProps {
  pet: Pet;
  buttonText?: string;
  title?: string;
  placeholder?: string;
  onRequestSent?: () => void;
}

const AdoptionRequestDialog: React.FC<AdoptionRequestDialogProps> = ({ pet, buttonText, title, placeholder, onRequestSent }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const SendRequestMutation = useMutation<any, Error, any>(
    {
      mutationFn: sendRequest,
      onSuccess: async (pet: any) => {
        await queryClient.invalidateQueries({ queryKey: ['getUserSentRequest'] });
        toast({
          title: 'Request sent successfully',
        });
        setIsSubmitting(false);
        setIsOpen(false);
        setMessage('');
      },
      onError: (err: any) => {
        toast({
          title: 'Pet Request failed',
          description: err.message,
          variant: 'destructive',
        });
        setIsSubmitting(false);
        setIsOpen(false);
      },
    }
  );

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please write a message to the pet owner",
        variant: "destructive",
      });
      return;
    }

    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "You need to be logged in to submit request",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    try {

      if (!pet?._id) {
        console.error("Pet ID is missing");
        return;
      }
      setIsSubmitting(true);
      console.log(pet)

      const type = pet.purpose === 'sell' ? 'buy' : pet.purpose

      SendRequestMutation.mutate({pet:pet._id,message,type})

      // toast({
      //   title: "Request sent",
      //   description: "Your adoption request has been sent to the pet owner",
      // });

      // setIsOpen(false);
      // setMessage('');
      // if (onRequestSent) onRequestSent();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1">
          {/* <Heart className="h-4 w-4" /> */}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Write a message to the pet owner explaining why you'd be a great match for {pet.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder={`Hi, I'm interested in adopting ${pet.name}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdoptionRequestDialog;
