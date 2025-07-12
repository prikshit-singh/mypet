import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  _id: string;
  chat: string;
  sender: string;
  text: string;
  createdAt: string;
}

interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  petId: string;
  text: string;
}

interface ReceiveMessagePayload {
  chatId: string;
  message: Message;
}

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://thepetwala.com';

export const useChatSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      socket.emit('join', userId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('⚠️ Socket connection error:', err.message);
    });

    socket.on('receive_message', ({ chatId, message }: ReceiveMessagePayload) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const sendMessage = useCallback((payload: SendMessagePayload) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', payload);
      console.log('📤 Message sent:', payload);
    } else {
      console.warn('⚠️ Cannot send message. Socket not connected.');
    }
  }, []);

  return {
    messages,
    sendMessage,
  };
};
