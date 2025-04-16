
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
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

interface AdoptionRequestDialogProps {
  pet: Pet;
  onRequestSent?: () => void;
}

const AdoptionRequestDialog: React.FC<AdoptionRequestDialogProps> = ({ pet, onRequestSent }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please write a message to the pet owner",
        variant: "destructive",
      });
      return;
    }

    if (!authService.isLoggedIn()) {
      toast({
        title: "Login required",
        description: "You need to be logged in to submit an adoption request",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      await adoptionService.submitRequest(pet.id, message);
      
      toast({
        title: "Request sent",
        description: "Your adoption request has been sent to the pet owner",
      });
      
      setIsOpen(false);
      setMessage('');
      if (onRequestSent) onRequestSent();
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
        <Button className="gap-2">
          <Heart className="h-4 w-4" />
          Request Adoption
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request to Adopt {pet.name}</DialogTitle>
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
