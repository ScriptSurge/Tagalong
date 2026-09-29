import React, { useState } from 'react';
import { ChevronLeft, Sparkles, MapPin, Users, Clock, ShieldCheck, ArrowRight, Wand2 } from 'lucide-react';
import { Activity, User } from '../types';
import { resolveActivityImage, CURATED_STOCK_IMAGES } from '../utils/imageFallback';

interface ActivityCreationWizardProps {
  currentUser: User;
  onActivityCreated: (activityData: Partial<Activity>) => void;
  onCancel: () => void;
  onOpenPaywall: () => void;
  hostedCountThisMonth: number;
}

const TYPE_OPTIONS = [
  { id: 'walk', label: 'Seawall Walk', icon: '🚶‍♀️', defaultTitle: 'Sunset Seawall Walk & Gelato 🍦' },
  { id: 'hiking', label: 'Hiking & Trails', icon: '🥾', defaultTitle: 'Vancouver Summit View Hike 🏔️' },
  { id: 'cycling', label: 'Cycling Club', icon: '🚴', defaultTitle: 'Stanley Park Seawall Bike Ride 🚲' },
  { id: 'coffee', label: 'Coffee & Chat', icon: '☕', defaultTitle: 'Pour-over Coffee & Creative Chat ☕' },
  { id: 'watersports', label: 'Watersports', icon: '🚣', defaultTitle: 'False Creek Ocean Kayaking 🌊' },
  { id: 'run', label: 'Run Club', icon: '🏃‍♂️', defaultTitle: '5K Waterfront Sunset Run 🏃‍♂️' },
  { id: 'drinks', label: 'Patio Drinks', icon: '🍹', defaultTitle: 'Beach House Patio Drinks 🍹' },
  { id: 'picnic', label: 'Beach Picnic', icon: '🧺', defaultTitle: 'Kitsilano Sunset Beach Picnic 🧺' },
  { id: 'camping', label: 'Camping', icon: '⛺', defaultTitle: 'Coastal Campfire & Stargazing 🔥' }
];

export const ActivityCreationWizard: React.FC<ActivityCreationWizardProps> = ({
  currentUser,
  onActivityCreated,
  onCancel,
  onOpenPaywall,
  hostedCountThisMonth
}) => {
  const [selectedType, setSelectedType] = useState<string>('walk');
  const [title, setTitle] = useState('Sunset Seawall Walk & Gelato 🍦');
  const [locationName, setLocationName] = useState('English Bay Beach, Vancouver');
  const [time, setTime] = useState('Today • 6:30 PM');
  const [maxAttendees, setMaxAttendees] = useState(6);
  const [soloMode, setSoloMode] = useState(true);
  const [note, setNote] = useState('Casual sunset loop starting by the palm trees. Grab gelato or espresso along the way!');
  
  // High-res AI Cover state
  const [selectedCover, setSelectedCover] = useState<string>(CURATED_STOCK_IMAGES.walk);

  const handleSelectType = (opt: typeof TYPE_OPTIONS[0]) => {
    setSelectedType(opt.id);
    setTitle(opt.defaultTitle);
    const newCover = resolveActivityImage(null, opt.id, opt.defaultTitle);
    setSelectedCover(newCover);
  };

  const handleAutoGenerateCover = () => {
    const aiCover = resolveActivityImage(null, selectedType, title, note);
    setSelectedCover(aiCover);
  };

  const handlePublish = () => {
    if (!currentUser.isPremium && hostedCountThisMonth >= 3) {
      onOpenPaywall();
      return;
    }

    let lat = 45;
    let lng = 35;
    if (locationName.toLowerCase().includes('kits')) { lat = 68; lng = 24; }
    else if (locationName.toLowerCase().includes('gastown')) { lat = 36; lng = 78; }
    else if (locationName.toLowerCase().includes('stanley')) { lat = 18; lng = 38; }
    else if (locationName.toLowerCase().includes('cypress')) { lat = 15; lng = 25; }

    const finalPhoto = resolveActivityImage(selectedCover, selectedType, title, note);

    onActivityCreated({
      title,
      type: (['coffee', 'walk', 'yoga', 'run', 'drinks', 'picnic'].includes(selectedType) ? selectedType : 'walk') as any,
      vibeTags: ['Spontaneous', 'Vancouver Locals', selectedType.toUpperCase()],
      note,
      time,
      timeHoursFromNow: 3,
      locationName,
      lat,
      lng,
      maxAttendees,
      soloMode,
      photo: finalPhoto
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F7F5] relative overflow-y-auto scrollbar-none font-sans text-[#111827] select-none text-left p-5 pb-24 space-y-4">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onCancel}
          className="w-9 h-9 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-[#111827] shadow-xs"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
          Host Spontaneous Meetup
        </span>

        <div className="w-9 h-9"></div>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
          What are you up for?
        </h1>
        <p className="text-xs text-stone-500 font-medium">
          Create an open hangout for local urbanites in the next 48 hours.
        </p>
      </div>

      {/* Type Selector Grid */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {TYPE_OPTIONS.map(opt => {
          const isSelected = selectedType === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelectType(opt)}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all text-center border ${
                isSelected
                  ? 'bg-[#111827] text-white border-[#111827] shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200/70 hover:bg-stone-50'
              }`}
            >
              <span className="text-lg">{opt.icon}</span>
              <span className="text-[10px] font-bold leading-tight">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI Cover Photo Auto-Generator Box */}
      <div className="bg-white rounded-3xl p-3.5 border border-stone-200/80 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4B63]" />
            <span className="text-xs font-bold text-[#111827]">AI Cover Resolution</span>
          </div>

          <button
            onClick={handleAutoGenerateCover}
            className="text-[11px] font-bold text-[#FF4B63] hover:underline flex items-center gap-1"
          >
            <Wand2 className="w-3 h-3" />
            <span>Regenerate</span>
          </button>
        </div>

        {/* Live Photo Preview */}
        <div className="h-32 w-full rounded-2xl overflow-hidden relative shadow-inner bg-stone-900">
          <img
            src={selectedCover}
            alt="Activity Cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

          <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] text-white font-bold border border-white/20">
            ✦ AI High-Res Photography
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
            <span className="text-xs font-bold block truncate">{title}</span>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/70 shadow-xs space-y-3">
        <div>
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
            Meetup Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="w-full h-11 px-3.5 bg-stone-50 rounded-xl text-xs font-bold text-[#111827] border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#FF4B63]/20"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
            Meeting Location
          </label>
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3" />
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full h-11 pl-9 pr-3.5 bg-stone-50 rounded-xl text-xs font-bold text-[#111827] border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#FF4B63]/20"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
            When to Meet (Next 48h)
          </label>
          <div className="relative flex items-center">
            <Clock className="w-4 h-4 text-stone-400 absolute left-3" />
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full h-11 pl-9 pr-3.5 bg-stone-50 rounded-xl text-xs font-bold text-[#111827] border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#FF4B63]/20"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
            Attendee Limit: {maxAttendees} People
          </label>
          <input
            type="range"
            min="2"
            max="12"
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(Number(e.target.value))}
            className="w-full accent-[#FF4B63]"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
            Coordinator Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-18 p-3 bg-stone-50 rounded-xl text-xs text-[#111827] border border-stone-200 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF4B63]/20"
          />
        </div>
      </div>

      {/* Solo Mode Toggle Card */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#111827] block">Instant Auto-Approval (Solo Mode)</span>
          <span className="text-[11px] text-stone-500 font-medium block">
            Approved instantly without manual handshake confirmations.
          </span>
        </div>
        <button
          onClick={() => setSoloMode(!soloMode)}
          className={`w-12 h-7 rounded-full transition-colors flex items-center p-1 ${
            soloMode ? 'bg-[#FF4B63]' : 'bg-stone-300'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
            soloMode ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>

      {/* Publish Action Button */}
      <button
        onClick={handlePublish}
        className="w-full py-4 bg-[#FF4B63] hover:bg-[#e03a51] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition active:scale-98 flex items-center justify-center gap-2"
      >
        <span>Publish Spontaneous Meetup</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </button>

    </div>
  );
};
