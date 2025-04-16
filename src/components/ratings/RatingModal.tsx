
import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetName: string;
  targetType: 'owner' | 'pet' | 'service';
  targetId: string;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  targetName,
  targetType,
  targetId
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleRatingSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to save the rating
    console.log({
      targetId,
      targetType,
      rating,
      comment,
      timestamp: new Date()
    });
    
    toast({
      title: "Rating submitted",
      description: `Thank you for rating ${targetName}!`,
    });
    
    // Reset form and close modal
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Rate {targetName}</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {targetType === 'owner' && 'Share your experience with this pet owner.'}
            {targetType === 'pet' && 'How was your experience with this pet?'}
            {targetType === 'service' && 'Rate the quality of service you received.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex justify-center">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  >
                    <Star
                      className="h-8 w-8 transition-all"
                      fill={(hoveredRating || rating) >= star ? "gold" : "transparent"}
                      stroke={
                        (hoveredRating || rating) >= star
                          ? "gold"
                          : "currentColor"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
              {rating === 0 && "Select a rating"}
            </div>
          </div>
          
          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Comment (optional)</label>
            <Textarea
              placeholder="Share details of your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleRatingSubmit}>
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
