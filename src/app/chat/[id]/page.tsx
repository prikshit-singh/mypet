'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';
 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { toast } from '@/hooks/use-toast';
import { getSingleChat } from '@/services/chatServices';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useChatSocket } from '@/hooks/useChatSocket';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/useUser';

interface Message {
  _id: string;
  sender: any;
  text: string;
  createdAt: string;
}

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
 const { user } = useUser();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const queryClient = useQueryClient();
  const { messages: newMessage, sendMessage } = useChatSocket(user?._id as string);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['getSingleChat', id],
    queryFn: () => getSingleChat(id),
    refetchOnMount: true,
  });

  const chat = data?.chat;
  const pet = chat?.pet;
  const owner = pet?.owner;

  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data]);

  const handleSendMessage = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !chat?.participants) return;

    // Find the receiver (other participant)
    const receiverId = chat.participants.find(
      (p: any) => p._id !== user?._id
    )?._id;

    if (!receiverId) {
      console.error('Receiver ID not found');
      return;
    }

    const newMessage = {
      senderId: user?._id as string,
      receiverId,
      petId: pet._id,
      text: message,
    }
    console.log('newMessage', newMessage)
    sendMessage(newMessage);
    await queryClient.invalidateQueries({ queryKey: ['petList'] });
    setMessage('');

    toast({
      title: 'Message Sent',
      description: `Your message has been sent.`,
    });
  };

  if (isLoading) return <Layout>Loading chat...</Layout>;
  if (isError || !chat) return <Layout>Error loading chat</Layout>;

  return (
    <Layout>
      <div className="container max-w-4xl py-6">
        <div className="border rounded-lg overflow-hidden flex flex-col h-[calc(100vh-250px)]">
          {/* Header */}
          {owner && typeof owner !== 'string' && (
            <div className="p-4 border-b bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={owner.avatar} alt={owner.name} />
                  <AvatarFallback>{owner.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{owner.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {owner.role === 'individual'
                      ? 'Pet Owner'
                      : owner.role === 'shelter'
                        ? 'Shelter'
                        : 'Pet Shop'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-muted/10 flex flex-col gap-4">
            <div className="flex justify-center mb-2">
              <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full">
                Conversation about {pet?.name}
              </span>
            </div>

            {messages.map((msg) => {
              const isSender = msg.sender === user?._id || msg.sender?._id === user?._id;
              const senderName = isSender ? user?.name : owner?.name;
              const senderAvatar = isSender ? user?.avatar : owner?.avatar;

              return (
                <div
                  key={msg._id}
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 flex",
                    isSender
                      ? "bg-primary text-primary-foreground ml-auto flex-row-reverse"
                      : "bg-muted mr-auto"
                  )}
                >
                  <Avatar className="h-6 w-6 mt-1 mx-2">
                    <AvatarImage src={senderAvatar} alt={senderName} />
                    <AvatarFallback>{senderName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{msg.text}</p>
                    <div className="flex justify-end">
                      <span className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-card">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Message about ${pet?.name}...`}
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
