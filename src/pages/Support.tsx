import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Image, Paperclip, CheckCheck, MoreHorizontal, User, ShieldCheck } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, where, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
  seen: boolean;
  type: 'text' | 'image' | 'file';
}

export default function Support() {
  const { user, isAdmin } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Chat
  useEffect(() => {
    if (!user || !db) return;

    // For simplicity, every user has one unique chat with admin
    const id = isAdmin ? 'global_admin_chat' : `chat_${user.uid}`;
    setChatId(id);

    // Ensure chat document exists
    const setupChat = async () => {
      const chatDoc = doc(db, 'chats', id);
      const snap = await getDoc(chatDoc);
      if (!snap.exists()) {
        await setDoc(chatDoc, {
          participants: isAdmin ? ['admin'] : [user.uid, 'admin'],
          updatedAt: serverTimestamp(),
          lastMessage: 'Chat started',
        });
      }
    };
    setupChat();

    // Listen for messages
    const q = query(
      collection(db, 'chats', id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      
      // Auto-mark as seen if receiving message from other party
      msgs.forEach(m => {
        if (!m.seen && m.senderId !== user.uid) {
           updateDoc(doc(db, 'chats', id, 'messages', m.id), { seen: true });
        }
      });
    });

    return () => unsubscribe();
  }, [user, isAdmin]);

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !user || !db) return;

    const text = newMessage;
    setNewMessage('');

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: user.uid,
        text: text,
        timestamp: serverTimestamp(),
        seen: false,
        type: 'text'
      });

      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: text,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 pt-10 pb-20 h-[80vh] flex flex-col">
      <div className="text-center mb-8 shrink-0">
        <h1 className="text-3xl font-bold mb-2">Live Support</h1>
        <p className="text-slate-400 text-sm">Real-time collaboration with the Nexora Team</p>
      </div>

      <div className="flex-grow glass rounded-[32px] overflow-hidden flex flex-col min-h-0 border border-white/5">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/5 to-brand-purple/5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center neon-glow-pink">
                {isAdmin ? <User className="text-white" /> : <ShieldCheck className="text-white" />}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-brand-dark" />
            </div>
            <div>
              <h3 className="font-bold">{isAdmin ? 'Customer User' : 'Nexus Admin'}</h3>
              <p className="text-xs text-brand-cyan font-medium tracking-wide flex items-center gap-1 animate-pulse">
                Online and ready
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-xl text-slate-500">
            <MoreHorizontal />
          </button>
        </div>

        {/* Messages Pool */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-900/30">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-30 italic">
               <p className="max-w-xs">Connecting to secure encrypted tunnel... You can now start chatting.</p>
            </div>
          )}
          
          {messages.map((m, i) => {
            const isMe = m.senderId === user.uid;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex flex-col max-w-[80%]",
                  isMe ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div className={cn(
                  "px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-lg",
                  isMe 
                    ? "bg-gradient-to-br from-brand-purple via-brand-pink to-brand-purple text-white rounded-tr-none neon-glow-pink" 
                    : "glass text-slate-200 rounded-tl-none border border-white/10"
                )}>
                  {m.text}
                </div>
                <div className="flex items-center gap-2 mt-2 px-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">
                    {m.timestamp ? new Date(m.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                  </span>
                  {isMe && <CheckCheck className={cn("w-3 h-3", m.seen ? "text-brand-cyan" : "text-slate-600")} />}
                </div>
              </motion.div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/5 border-t border-white/10 shrink-0">
          <form onSubmit={sendMessage} className="relative flex items-center gap-4">
             <div className="flex gap-2">
                <button type="button" className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <Image className="w-5 h-5" />
                </button>
                <button type="button" className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                  <Paperclip className="w-5 h-5" />
                </button>
             </div>
             
             <input
               type="text"
               placeholder="Type your secure message..."
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
               className="flex-grow bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-purple transition-all placeholder:text-slate-600"
             />
             
             <button
               type="submit"
               disabled={!newMessage.trim()}
               className="bg-gradient-to-r from-brand-purple to-brand-pink disabled:opacity-50 disabled:grayscale text-white p-4 rounded-2xl neon-glow-pink hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-pink/20"
             >
               <Send className="w-6 h-6" />
             </button>
          </form>
        </div>
      </div>
    </div>
  );
}
