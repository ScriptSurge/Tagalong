import React, { useState } from 'react';
import { ChevronLeft, Share2, Heart, Star, MapPin, Users, Clock, Coffee, ShieldCheck, Sparkles, MessageSquare, Check, ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { Activity, User, Participant } from '../types';

interface ActivityDetailsViewProps {
  activity: Activity;
  currentUser: User;
  users: User[];
  participants: Participant[];
  onJoinRequest: (activityId: string, message: string) => void;
  onOpenChat: (activityId: string) => void;
  onBack: () => void;
}

export const ActivityDetailsView: React.FC<ActivityDetailsViewProps> = ({
  activity,
  currentUser,
  users,
  participants,
  onJoinRequest,
  onOpenChat,
  onBack
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [greetingNote, setGreetingNote] = useState("Hey! I'd love to tagalong with you today.");
  
  // Friends on Map opt-in toggle
  const [showOnMap, setShowOnMap] = useState<boolean>(() => {
    return localStorage.getItem(`friends_map_${activity.id}`) !== 'false';
  });

  const handleToggleMapSharing = () => {
    const nextVal = !showOnMap;
    setShowOnMap(nextVal);
    localStorage.setItem(`friends_map_${activity.id}`, String(nextVal));
  };

  const host = users.find(u => u.id === activity.hostId) || currentUser;

  const activityParticipants = participants.filter(
    p => p.activityId === activity.id && p.status === 'approved'
  );

  const attendeeIds = activityParticipants.map(p => p.userId);
  const attendees = users.filter(u => attendeeIds.includes(u.id) && u.id !== host.id);

  const selfParticipant = participants.find(
    p => p.activityId === activity.id && p.userId === currentUser.id
  );

  const isHost = activity.hostId === currentUser.id;
  const isGoing = selfParticipant?.status === 'approved' || isHost;
  const isPending = selfParticipant?.status === 'pending';

  const handleAction = () => {
    if (isGoing) {
      onOpenChat(activity.id);
    } else if (isPending) {
      // Pending
    } else {
      if (activity.soloMode) {
        onJoinRequest(activity.id, "Joined instantly via Solo Mode!");
      } else {
        setShowMessageModal(true);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F7F5] relative overflow-y-auto scrollbar-none font-sans text-[#111827] select-none">
      
      {/* Hero Photo Section with Floating Controls */}
      <div className="relative h-72 w-full shrink-0 bg-stone-900 overflow-hidden">
        <img
          src={activity.photo}
          alt={activity.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />

        {/* Measured Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50"></div>

        {/* Top Floating Action Buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition border border-white/10 shadow-md"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition border border-white/10 shadow-md"
            >
              <Share2 className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition border border-white/10 shadow-md ${
                isFavorite ? 'bg-[#FF4B63] text-white' : 'bg-black/40 hover:bg-black/60 text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Photo Details Overlaid */}
        <div className="absolute bottom-5 left-5 right-5 text-white z-10 space-y-1">
          <span className="text-[11px] font-semibold text-stone-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B63]"></span>
            {activity.locationName.split(',')[0]} · Vancouver
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
            {activity.title}
          </h1>
          <div className="flex items-center gap-2 pt-0.5 text-xs text-stone-200">
            <span className="font-semibold">Host: {host.name}</span>
            <span className="text-stone-400">·</span>
            <span className="text-amber-300 font-semibold">★ {host.rating}</span>
          </div>
        </div>
      </div>

      {/* Sheet Content Section */}
      <div className="px-5 pt-6 pb-24 space-y-5 text-left flex-1 bg-[#F8F7F5]">
        
        {/* Vibe Tags */}
        <div className="flex flex-wrap gap-1.5">
          {activity.vibeTags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-semibold text-stone-600 bg-white border border-stone-200/80 px-3 py-1 rounded-full shadow-2xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Quick Specs 3-Column */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-white rounded-2xl border border-stone-200/70 shadow-xs flex flex-col items-center justify-center text-center space-y-0.5">
            <MapPin className="w-4 h-4 text-stone-400" />
            <span className="text-[10px] font-semibold text-stone-400 uppercase">Distance</span>
            <span className="text-xs font-bold text-[#111827]">1.2 km away</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-stone-200/70 shadow-xs flex flex-col items-center justify-center text-center space-y-0.5">
            <Users className="w-4 h-4 text-stone-400" />
            <span className="text-[10px] font-semibold text-stone-400 uppercase">Capacity</span>
            <span className="text-xs font-bold text-[#111827]">
              {activityParticipants.length + 1}/{activity.maxAttendees} Spots
            </span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-stone-200/70 shadow-xs flex flex-col items-center justify-center text-center space-y-0.5">
            <Clock className="w-4 h-4 text-stone-400" />
            <span className="text-[10px] font-semibold text-stone-400 uppercase">Schedule</span>
            <span className="text-xs font-bold text-[#111827] truncate">{activity.time.split(' ')[0]}</span>
          </div>
        </div>

        {/* Coordinator Note Section */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/70 shadow-xs space-y-1.5">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
            Coordinator Note
          </span>
          <p className="text-xs text-stone-700 leading-relaxed font-medium">
            {activity.note || "Let's gather spontaneously on public beach, park seawall or cafe grounds today. Low pressure, friendly vibes, offline interactions only."}
          </p>
        </div>

        {/* Host Profile Card */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={host.photo}
              alt={host.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-stone-100"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-[#111827]">{host.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-[11px] text-stone-400 font-medium">
                {host.bio || 'Local meetup coordinator'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-semibold text-stone-400 uppercase block">Rating</span>
            <span className="text-xs font-bold text-[#111827] bg-stone-100 px-2 py-0.5 rounded-full">
              ★ {host.rating}
            </span>
          </div>
        </div>

        {/* Live Friends on Map Feature Card */}
        {isGoing && (
          <div className="p-4 bg-white rounded-2xl border border-stone-200/70 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Spot Radar
                </span>
                <span className="text-xs font-bold text-[#111827] block mt-0.5">
                  Friends on Map (Opt-In)
                </span>
              </div>
              <button onClick={handleToggleMapSharing} className="focus:outline-none">
                {showOnMap ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600 stroke-[1.5]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
              Shares approximate location with attendees 45 minutes before the event so you easily spot each other.
            </p>
          </div>
        )}

        {/* Attendees Stack */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">
              Attending Crew ({activityParticipants.length + 1}/{activity.maxAttendees})
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Host pill */}
            <div className="flex items-center gap-2 bg-white border border-stone-200/70 py-1 px-3 rounded-full shadow-2xs">
              <img src={host.photo} className="w-5 h-5 rounded-full object-cover" alt="Host" />
              <span className="text-xs font-bold text-[#111827]">{host.name.split(' ')[0]}</span>
              <span className="text-[9px] bg-[#111827] text-white px-1.5 py-0.2 rounded-full uppercase font-bold">
                Host
              </span>
            </div>

            {/* Attendees */}
            {attendees.map(a => (
              <div key={a.id} className="flex items-center gap-2 bg-white border border-stone-200/70 py-1 px-3 rounded-full shadow-2xs">
                <img src={a.photo} className="w-5 h-5 rounded-full object-cover" alt={a.name} />
                <span className="text-xs font-bold text-[#111827]">{a.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-stone-200/70 flex items-center justify-between z-30 shrink-0 shadow-lg">
        <div>
          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
            Admission
          </span>
          <span className="text-base font-extrabold text-[#111827] leading-tight">
            Free <span className="text-xs font-normal text-stone-500">/ meetup</span>
          </span>
        </div>

        {isGoing ? (
          <button
            onClick={handleAction}
            className="px-6 py-3 rounded-full bg-[#111827] hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Crew Chat</span>
          </button>
        ) : isPending ? (
          <div className="px-5 py-3 rounded-full bg-stone-100 text-stone-600 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Request Pending</span>
          </div>
        ) : (
          <button
            onClick={handleAction}
            className="px-7 py-3 rounded-full bg-[#FF4B63] hover:bg-[#e03a51] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition active:scale-95"
          >
            <span>{activity.soloMode ? 'Join Instantly' : 'Send Handshake'}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Modal Dialog for Handshake Greeting Note */}
      {showMessageModal && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-5">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 space-y-4 shadow-2xl text-left font-sans">
            <div>
              <span className="text-2xl">🤝</span>
              <h3 className="text-base font-bold text-[#111827] mt-1">
                Say Hello to {host.name.split(' ')[0]}
              </h3>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                Add a friendly note explaining why you'd like to join today's meetup.
              </p>
            </div>

            <textarea
              value={greetingNote}
              onChange={(e) => setGreetingNote(e.target.value)}
              className="w-full h-24 p-3 text-xs rounded-2xl bg-[#F8F7F5] border border-stone-200 text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FF4B63]/20 resize-none font-medium"
            />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowMessageModal(false)}
                className="py-2.5 bg-stone-100 hover:bg-stone-200 rounded-full text-xs font-bold text-stone-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onJoinRequest(activity.id, greetingNote);
                  setShowMessageModal(false);
                }}
                className="py-2.5 bg-[#FF4B63] hover:bg-[#e03a51] rounded-full text-xs font-bold text-white transition shadow-xs"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
