import React, { useState } from 'react';
import { Trash2, Check, X, MessageSquare, Clock, MapPin, AlertCircle, ChevronRight, UserPlus, Sparkles, Repeat } from 'lucide-react';
import { Activity, User, Participant } from '../types';

interface MyActivitiesViewProps {
  currentUser: User;
  activities: Activity[];
  users: User[];
  participants: Participant[];
  onApproveParticipant: (activityId: string, userId: string) => void;
  onDeclineParticipant: (activityId: string, userId: string) => void;
  onEndActivityEarly: (activityId: string) => void;
  onKickParticipant: (activityId: string, userId: string) => void;
  onRepeatActivity: (activity: Activity) => void;
  onOpenChat: (activityId: string) => void;
}

export const MyActivitiesView: React.FC<MyActivitiesViewProps> = ({
  currentUser,
  activities,
  users,
  participants,
  onApproveParticipant,
  onDeclineParticipant,
  onEndActivityEarly,
  onKickParticipant,
  onRepeatActivity,
  onOpenChat
}) => {
  const [activeTab, setActiveTab] = useState<'hosted' | 'going' | 'past'>('hosted');

  const getHost = (hostId: string): User => {
    return users.find(u => u.id === hostId) || currentUser;
  };

  const getUser = (userId: string): User => {
    return users.find(u => u.id === userId) || currentUser;
  };

  // Filter lists
  const hostedActivities = activities.filter(act => act.hostId === currentUser.id);
  const goingActivities = activities.filter(act => {
    if (act.hostId === currentUser.id) return false;
    const joined = participants.find(p => p.activityId === act.id && p.userId === currentUser.id);
    return joined && (joined.status === 'approved' || joined.status === 'pending');
  });

  const getPendingParticipants = (actId: string) => {
    return participants.filter(p => p.activityId === actId && p.status === 'pending' && p.role === 'guest');
  };

  const getApprovedParticipants = (actId: string) => {
    return participants.filter(p => p.activityId === actId && p.status === 'approved' && p.role === 'guest');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F7F5] relative overflow-hidden font-sans text-[#111827] select-none text-left">
      
      {/* Top Header */}
      <div className="px-5 pt-3 pb-2.5 space-y-2.5 bg-[#F8F7F5] shrink-0 border-b border-black/[0.03]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-[#111827] tracking-tight">
              My Activities
            </h1>
            <p className="text-[12px] text-stone-500 font-medium">
              Manage hosted meets & attending passes
            </p>
          </div>

          <span className="text-xs bg-white border border-stone-200/80 px-3 py-1 rounded-full font-bold text-stone-700 shadow-2xs">
            {hostedActivities.length + goingActivities.length} active
          </span>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex p-0.5 bg-stone-200/60 rounded-full text-xs font-semibold">
          <button
            onClick={() => setActiveTab('hosted')}
            className={`flex-1 py-1.5 rounded-full transition-all text-center ${
              activeTab === 'hosted'
                ? 'bg-white text-[#111827] shadow-xs font-bold'
                : 'text-stone-600 hover:text-[#111827]'
            }`}
          >
            Hosted ({hostedActivities.length})
          </button>
          <button
            onClick={() => setActiveTab('going')}
            className={`flex-1 py-1.5 rounded-full transition-all text-center ${
              activeTab === 'going'
                ? 'bg-white text-[#111827] shadow-xs font-bold'
                : 'text-stone-600 hover:text-[#111827]'
            }`}
          >
            Attending ({goingActivities.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-1.5 rounded-full transition-all text-center ${
              activeTab === 'past'
                ? 'bg-white text-[#111827] shadow-xs font-bold'
                : 'text-stone-600 hover:text-[#111827]'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-3 space-y-3 pb-24">
        
        {/* TAB 1: HOSTED */}
        {activeTab === 'hosted' && (
          hostedActivities.length > 0 ? (
            hostedActivities.map(act => {
              const pendings = getPendingParticipants(act.id);
              const approveds = getApprovedParticipants(act.id);

              return (
                <div
                  key={act.id}
                  className="bg-white rounded-3xl p-4 border border-stone-200/70 shadow-xs space-y-3"
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 items-center">
                      <img
                        src={act.photo}
                        alt={act.title}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover"
                      />
                      <div>
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide block">
                          {act.locationName.split(',')[0]}
                        </span>
                        <h3 className="text-sm font-bold text-[#111827] leading-tight">
                          {act.title}
                        </h3>
                        <span className="text-[11px] text-stone-500 font-medium">
                          {act.time}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onEndActivityEarly(act.id)}
                      title="Cancel meetup"
                      className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Pending Handshakes Section */}
                  {pendings.length > 0 && (
                    <div className="bg-[#FFF8F0] p-3 rounded-2xl border border-amber-200/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending Join Requests ({pendings.length})
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {pendings.map(p => {
                          const guest = getUser(p.userId);
                          return (
                            <div key={p.userId} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <img src={guest.photo} className="w-7 h-7 rounded-full object-cover" alt="" />
                                <div className="truncate">
                                  <span className="text-xs font-bold text-[#111827] block truncate">{guest.name}</span>
                                  <span className="text-[11px] text-stone-400 truncate block font-medium">{p.joinMessage || 'Wants to join'}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                <button
                                  onClick={() => onApproveParticipant(act.id, guest.id)}
                                  className="w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold hover:bg-emerald-600 transition shadow-2xs"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </button>
                                <button
                                  onClick={() => onDeclineParticipant(act.id, guest.id)}
                                  className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition"
                                >
                                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Approved Guests & Group Chat Button */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-xs text-stone-500 font-semibold">
                      {approveds.length + 1}/{act.maxAttendees} Going
                    </span>

                    <button
                      onClick={() => onOpenChat(act.id)}
                      className="px-4 py-1.5 bg-[#111827] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Crew Chat</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 space-y-2 bg-white rounded-3xl p-6 border border-stone-200/70">
              <span className="text-3xl">☕</span>
              <h3 className="text-base font-bold text-[#111827]">No active hosted meetups</h3>
              <p className="text-xs text-stone-500">Tap "+ Host Meetup" on Discover to schedule an activity in the next 48 hours.</p>
            </div>
          )
        )}

        {/* TAB 2: GOING */}
        {activeTab === 'going' && (
          goingActivities.length > 0 ? (
            goingActivities.map(act => {
              const host = getHost(act.hostId);
              const myStatus = participants.find(p => p.activityId === act.id && p.userId === currentUser.id)?.status;

              return (
                <div
                  key={act.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200/70 shadow-xs"
                >
                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Confirmed Pass · Vancouver
                      </span>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        myStatus === 'approved' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {myStatus === 'approved' ? '✓ Attending' : '● Pending Approval'}
                      </span>
                    </div>

                    <div className="flex gap-3 items-center pt-0.5">
                      <img src={act.photo} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                      <div>
                        <h3 className="text-base font-bold text-[#111827] leading-tight">
                          {act.title}
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {act.locationName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Clean Perforated Divider */}
                  <div className="relative flex items-center px-4">
                    <div className="w-3 h-3 rounded-full bg-[#F8F7F5] -ml-5.5 border border-stone-200"></div>
                    <div className="flex-1 border-t-2 border-dashed border-stone-200 mx-2"></div>
                    <div className="w-3 h-3 rounded-full bg-[#F8F7F5] -mr-5.5 border border-stone-200"></div>
                  </div>

                  {/* Bottom Host & Chat */}
                  <div className="p-4 bg-stone-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={host.photo} className="w-7 h-7 rounded-full object-cover" alt="" />
                      <div>
                        <span className="text-xs font-bold text-[#111827] block leading-tight">{host.name}</span>
                        <span className="text-[10px] text-stone-400 block font-medium">Host · ★ {host.rating}</span>
                      </div>
                    </div>

                    {myStatus === 'approved' ? (
                      <button
                        onClick={() => onOpenChat(act.id)}
                        className="px-4 py-2 bg-[#111827] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-amber-700">Awaiting Host</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 space-y-2 bg-white rounded-3xl p-6 border border-stone-200/70">
              <span className="text-3xl">🚶‍♀️</span>
              <h3 className="text-base font-bold text-[#111827]">No joined meetups yet</h3>
              <p className="text-xs text-stone-500">Find an activity happening today in Discover and send a handshake!</p>
            </div>
          )
        )}

        {/* TAB 3: PAST */}
        {activeTab === 'past' && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-3xl border border-stone-200/70 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-lg">
                  ☕
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111827]">Gastown Pour-Over & Chat</h4>
                  <span className="text-[11px] text-stone-400 font-medium">Completed · Yesterday</span>
                </div>
              </div>

              <button
                onClick={() => onRepeatActivity(activities[0])}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-[#111827] font-bold text-xs rounded-full flex items-center gap-1 transition"
              >
                <Repeat className="w-3 h-3" />
                <span>Repeat</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
