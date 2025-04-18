'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Send, ArrowLeft, Phone, Video, MoreVertical, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import { mockPets } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
   const router = useRouter()
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Find the pet by ID
  const pet = mockPets.find(p => p.id === id);
  
  useEffect(() => {
    // Simulate loading chat history
    if (pet) {
      const initialMessages: Message[] = [
        {
          id: '1',
          senderId: pet.owner.id,
          text: `Hello! Thank you for your interest in ${pet.name}. How can I help you?`,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          isRead: true
        }
      ];
      setMessages(initialMessages);
    }
  }, [pet]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user?.id || 'current-user',
      text: message,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Simulate owner reply after 1 second
    setTimeout(() => {
      const ownerReply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: pet?.owner.id || 'owner',
        text: `Thanks for your message about ${pet?.name}. I'll get back to you with more details soon.`,
        timestamp: new Date(),
        isRead: false
      };
      
      setMessages(prevMessages => [...prevMessages, ownerReply]);
      
      toast({
        title: "New message",
        description: `${pet?.owner.name} has replied to your message`,
      });
    }, 1000);
  };

  if (!pet) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Chat Not Found</h1>
          <p className="text-muted-foreground mb-6">The chat you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Button onClick={() => router.back()}>Go Back</Button>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-6">
        <div className="border rounded-lg overflow-hidden flex flex-col h-[calc(100vh-250px)]">
          {/* Chat Header */}
          <div className="p-4 border-b bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={pet.owner.avatar} alt={pet.owner.name} />
                <AvatarFallback>{pet.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{pet.owner.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {pet.owner.role === 'individual' ? 'Pet Owner' : 
                   pet.owner.role === 'shelter' ? 'Shelter' : 'Pet Shop'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" title="Voice Call">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="Video Call">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" title="More Options">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-muted/10 flex flex-col gap-4">
            <div className="flex justify-center mb-2">
              <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                Conversation about {pet.name}
              </span>
            </div>
            
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  msg.senderId === user?.id || msg.senderId === 'current-user'
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted mr-auto"
                )}
              >
                <div className="flex items-start gap-2">
                  {msg.senderId !== user?.id && msg.senderId !== 'current-user' && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={pet.owner.avatar} alt={pet.owner.name} />
                      <AvatarFallback>{pet.owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p>{msg.text}</p>
                    <div className="flex justify-end">
                      <span className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t bg-card">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Message about ${pet.name}...`}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
