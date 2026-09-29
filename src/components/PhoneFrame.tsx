import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, RefreshCw, Sparkles, User, ChevronDown, Check } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  activeUserId: string;
  onSwitchUser: (userId: string) => void;
  isPremium: boolean;
  onTogglePremium: () => void;
  onResetApp: () => void;
  currentScreen: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  activeUserId,
  onSwitchUser,
  isPremium,
  onTogglePremium,
  onResetApp,
}) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'full'>('mobile');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState('9:41 AM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const users = [
    {
      id: 'user_1',
      name: 'Jenny Wilson',
      role: 'Guest / Explorer',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80'
    },
    {
      id: 'user_host_1',
      name: 'Jhon Doe',
      role: 'Event Host',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80'
    },
    {
      id: 'user_sarah',
      name: 'Sarah Chen',
      role: 'Yoga Host',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80'
    }
  ];

  const currentUser = users.find(u => u.id === activeUserId) || users[0];

  return (
    <div className="min-h-screen bg-[#ECEAE4] text-[#111827] flex flex-col font-sans selection:bg-[#FF4B63] selection:text-white">
      
      {/* Top Floating Control Bar - Minimal, Elegant, Non-Intrusive */}
      <header className="w-full bg-[#ECEAE4]/90 backdrop-blur-md border-b border-black/[0.04] px-4 sm:px-6 py-2.5 flex items-center justify-between z-50 shrink-0">
        
        {/* Brand Crest */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#FF4B63] flex items-center justify-center text-white shadow-xs">
            <span className="text-xs font-black">✦</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-sm tracking-tight text-[#111827]">
              Tagalong
            </span>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-stone-500">
              Vancouver Meets
            </span>
          </div>
        </div>

        {/* Center: Viewport Switcher */}
        <div className="flex items-center bg-stone-300/60 p-0.5 rounded-full text-xs font-semibold text-stone-600">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              viewMode === 'mobile'
                ? 'bg-white text-[#111827] shadow-xs font-bold'
                : 'hover:text-[#111827]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Mobile Frame</span>
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              viewMode === 'full'
                ? 'bg-white text-[#111827] shadow-xs font-bold'
                : 'hover:text-[#111827]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Full Width</span>
          </button>
        </div>

        {/* Right: Persona Switcher & Sandbox Reset */}
        <div className="flex items-center gap-2 relative">
          
          {/* Persona selector button */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-white/90 hover:bg-white border border-black/5 px-2.5 py-1 rounded-full shadow-xs text-xs font-bold transition text-[#111827]"
            >
              <img
                src={currentUser.photo}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/5 p-2 space-y-1 z-50 text-left">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Switch Persona
                </div>
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u.id);
                      setShowUserMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                      activeUserId === u.id
                        ? 'bg-stone-100 text-[#111827] font-bold'
                        : 'hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.photo} className="w-6 h-6 rounded-full object-cover" alt={u.name} />
                      <div>
                        <p className="text-xs font-bold leading-tight">{u.name}</p>
                        <p className="text-[10px] text-stone-400 leading-tight">{u.role}</p>
                      </div>
                    </div>
                    {activeUserId === u.id && <Check className="w-3.5 h-3.5 text-[#FF4B63]" />}
                  </button>
                ))}
                <div className="border-t border-stone-100 pt-1 mt-1">
                  <button
                    onClick={() => {
                      onTogglePremium();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isPremium ? 'Plus Active' : 'Toggle Plus Member'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset Sandbox */}
          <button
            onClick={onResetApp}
            title="Reset to initial state"
            className="w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-black/5 flex items-center justify-center text-stone-500 hover:text-[#111827] transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        
        {viewMode === 'mobile' ? (
          /* iPhone 16 Pro Style Luxury Smartphone Container */
          <div className="relative my-auto select-none">
            {/* Ambient Warm Shadow behind device */}
            <div className="absolute -inset-4 bg-black/10 blur-2xl rounded-[60px] -z-10 pointer-events-none"></div>

            {/* Smartphone Outer Titanium Chassis */}
            <div className="w-[390px] h-[830px] max-h-[92vh] rounded-[52px] bg-[#1a1b1e] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-white/20 flex flex-col relative overflow-hidden">
              
              {/* Dynamic Island Ear Speaker element */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0a0a0b] mr-8"></span>
                <span className="w-2 h-2 rounded-full bg-[#121316]"></span>
              </div>

              {/* Screen Inner Bezel */}
              <div className="w-full h-full rounded-[42px] bg-[#F8F7F5] text-[#111827] flex flex-col overflow-hidden relative shadow-inner">
                
                {/* Clean Status Bar */}
                <div className="h-10 px-7 pt-3 flex justify-between items-center text-[11px] text-[#111827] pointer-events-none shrink-0 font-bold z-40 bg-[#F8F7F5]">
                  <span>{currentTime}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold tracking-wider">5G</span>
                    <div className="w-5 h-2.5 border border-[#111827] rounded-[3px] p-[1.5px] flex items-center">
                      <span className="h-full w-2.5 bg-[#111827] rounded-[1px]"></span>
                    </div>
                  </div>
                </div>

                {/* Inner Dynamic Screen Content */}
                <div className="flex-1 flex flex-col overflow-hidden relative bg-[#F8F7F5]">
                  {children}
                </div>

                {/* iOS Bottom Home Bar */}
                <div className="h-4 bg-[#F8F7F5] shrink-0 flex items-center justify-center z-40 pointer-events-none">
                  <div className="w-28 h-1 bg-stone-300 rounded-full"></div>
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* Full Screen Responsive Experience (Max-W-xl Centered for Optimal Tablet/Desktop Comfort) */
          <div className="w-full max-w-xl h-full min-h-[85vh] bg-[#F8F7F5] rounded-3xl shadow-xl border border-black/5 flex flex-col overflow-hidden relative">
            <div className="flex-1 flex flex-col overflow-hidden relative bg-[#F8F7F5]">
              {children}
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
