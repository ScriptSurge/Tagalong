import React, { useState, useEffect, useRef } from 'react';
import { Send, Camera, ChevronLeft, Users, Sparkles } from 'lucide-react';
import { Message, User, Activity } from '../types';

interface ChatRoomViewProps {
  activityId: string;
  activities: Activity[];
  users: User[];
  messages: Message[];
  currentUser: User;
  onSendMessage: (chatId: string, text: string, photo?: string) => void;
  onBack: () => void;
}

export const ChatRoomView: React.FC<ChatRoomViewProps> = ({
  activityId,
  activities,
  users,
  messages,
  currentUser,
  onSendMessage,
  onBack
}) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const act = activities.find(a => a.id === activityId) || activities[0];
  const chatMessages = messages.filter(m => m.chatId === activityId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText;
    onSendMessage(activityId, text);
    setInputText('');

    setIsTyping(true);
    const responders = ['Jenny Wilson', 'Jhon Doe', 'Sarah Chen'];
    const randomResponder = responders[Math.floor(Math.random() * responders.length)];
    setTypingUser(randomResponder);

    setTimeout(() => {
      let reply = "See you there! Can't wait! 🎉";
      if (act.type === 'coffee') reply = "Grabbed a table near the window! ☕";
      if (act.type === 'yoga') reply = "Sun is shining over the water, ready with mats! 🧘‍♀️";
      if (act.type === 'walk') reply = "Meeting by the beach logs in 10 mins! 🚶‍♀️";

      onSendMessage(activityId, reply);
      setIsTyping(false);
    }, 1600);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F7F5] relative overflow-hidden font-sans text-[#111827] select-none text-left">
      
      {/* Top Header */}
      <div className="px-4 py-3 bg-white/95 backdrop-blur-md border-b border-stone-200/80 flex items-center justify-between z-10 shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-[#111827] flex items-center justify-center transition"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <img
            src={act.photo}
            alt={act.title}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-2xl object-cover ring-1 ring-stone-200"
          />

          <div>
            <h3 className="text-xs font-bold text-[#111827] leading-tight truncate max-w-[180px]">
              {act.title}
            </h3>
            <span className="text-[10px] text-stone-500 font-medium block">
              📍 {act.locationName.split(',')[0]} · Crew Chat
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Crew</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
        {chatMessages.map(msg => {
          const isMe = msg.senderId === currentUser.id;

          if (msg.isSystem) {
            return (
              <div key={msg.id} className="text-center py-1">
                <span className="text-[10px] font-medium text-stone-500 bg-white/90 px-3 py-1 rounded-full shadow-2xs border border-stone-200/60">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={msg.senderPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&h=50&q=80'}
                  alt={msg.senderName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-white"
                />
              )}

              <div className="max-w-[75%] space-y-0.5">
                {!isMe && (
                  <span className="text-[10px] font-semibold text-stone-400 ml-1 block">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-[#111827] text-white rounded-br-xs'
                      : 'bg-white text-[#111827] border border-stone-200/80 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className={`text-[9px] text-stone-400 block px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-stone-400 text-xs pl-2">
            <span className="w-2 h-2 rounded-full bg-stone-400 animate-bounce"></span>
            <span className="text-[11px] font-medium">{typingUser} is typing...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="p-3 bg-white/95 backdrop-blur-md border-t border-stone-200/80 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {}}
          className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition"
        >
          <Camera className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message crew..."
          className="flex-1 h-10 px-4 bg-stone-50 rounded-full text-xs font-medium text-[#111827] placeholder-stone-400 border border-stone-200/80 focus:outline-none focus:ring-2 focus:ring-[#FF4B63]/20"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            inputText.trim()
              ? 'bg-[#FF4B63] text-white shadow-xs hover:bg-[#e03a51]'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
