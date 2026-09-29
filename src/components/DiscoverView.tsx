import React, { useState, useEffect } from 'react';
import { Search, MapPin, Users, Heart, ArrowRight, X, Check, Compass, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Activity, User, Participant } from '../types';
import { resolveActivityImage, CURATED_STOCK_IMAGES } from '../utils/imageFallback';

interface DiscoverViewProps {
  activities: Activity[];
  users: User[];
  participants: Participant[];
  currentUser: User;
  onJoinRequest: (activityId: string, message: string) => void;
  onSelectActivityDetails: (activity: Activity) => void;
  onCreateActivityClick: () => void;
}

// Destination Vancouver style Curated Masonry Cards (Directly matching user's inspiration screenshot)
interface MasonryCardItem {
  id: string;
  title: string;
  categoryQuery: string;
  image: string;
  heightClass: string;
  subtitle?: string;
}

const HERO_CARD: MasonryCardItem = {
  id: 'cycling',
  title: 'Vancouver Cycling & Mountain Biking',
  categoryQuery: 'cycling',
  image: CURATED_STOCK_IMAGES.cycling,
  heightClass: 'h-48 sm:h-52',
  subtitle: 'Scenic seawall rides & North Shore trails'
};

const MASONRY_LEFT: MasonryCardItem[] = [
  {
    id: 'hiking',
    title: 'Vancouver Hiking',
    categoryQuery: 'hiking',
    image: CURATED_STOCK_IMAGES.hiking,
    heightClass: 'h-72 sm:h-80',
    subtitle: 'Coastal summits & Howe Sound views'
  },
  {
    id: 'walk',
    title: 'Vancouver Sunset Seawall',
    categoryQuery: 'walk',
    image: CURATED_STOCK_IMAGES.walk,
    heightClass: 'h-48 sm:h-52',
    subtitle: 'Golden hour English Bay strolls'
  },
  {
    id: 'run',
    title: 'Vancouver Run Club',
    categoryQuery: 'run',
    image: CURATED_STOCK_IMAGES.run,
    heightClass: 'h-48 sm:h-52',
    subtitle: '5K waterfront social paces'
  }
];

const MASONRY_RIGHT: MasonryCardItem[] = [
  {
    id: 'skiing',
    title: 'Vancouver Skiing & Snowboarding',
    categoryQuery: 'ski',
    image: CURATED_STOCK_IMAGES.skiing,
    heightClass: 'h-44 sm:h-48',
    subtitle: 'Alpine sunset lines & night ski'
  },
  {
    id: 'watersports',
    title: 'Vancouver Watersports',
    categoryQuery: 'water',
    image: CURATED_STOCK_IMAGES.watersports,
    heightClass: 'h-44 sm:h-48',
    subtitle: 'Ocean kayaking & False Creek paddle'
  },
  {
    id: 'camping',
    title: 'Vancouver camping offers beaches, forest, and mountains',
    categoryQuery: 'camp',
    image: CURATED_STOCK_IMAGES.camping,
    heightClass: 'h-56 sm:h-64',
    subtitle: 'Campfires under Pacific cedar trees'
  },
  {
    id: 'coffee',
    title: 'Specialty Coffee & Cafes',
    categoryQuery: 'coffee',
    image: CURATED_STOCK_IMAGES.coffee,
    heightClass: 'h-44 sm:h-48',
    subtitle: 'Artisan roasters & morning catchups'
  }
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  activities,
  users,
  participants,
  currentUser,
  onSelectActivityDetails,
  onCreateActivityClick,
  onJoinRequest
}) => {
  const [activeTab, setActiveTab] = useState<'discover' | 'feed' | 'map'>('discover');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterLabel, setActiveFilterLabel] = useState<string | null>(null);
  const [activeFilterQuery, setActiveFilterQuery] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['act_1', 'act_4', 'act_7']);
  const [focusedActivity, setFocusedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (activities.length > 0 && !focusedActivity) {
      setFocusedActivity(activities[0]);
    }
  }, [activities, focusedActivity]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectMasonryCard = (card: MasonryCardItem) => {
    setActiveFilterLabel(card.title);
    setActiveFilterQuery(card.categoryQuery);
    setActiveTab('feed');
  };

  const clearFilter = () => {
    setActiveFilterLabel(null);
    setActiveFilterQuery(null);
    setSearchQuery('');
  };

  // Filter activities
  const filteredActivities = activities.filter(act => {
    const textTarget = `${act.title} ${act.locationName} ${act.type} ${act.vibeTags.join(' ')} ${act.note}`.toLowerCase();

    if (searchQuery.trim()) {
      if (!textTarget.includes(searchQuery.toLowerCase())) return false;
    }

    if (activeFilterQuery) {
      if (!textTarget.includes(activeFilterQuery.toLowerCase())) return false;
    }

    return true;
  });

  const getHost = (hostId: string): User => {
    return users.find(u => u.id === hostId) || currentUser;
  };

  const getJoinedCount = (actId: string) => {
    return participants.filter(p => p.activityId === actId && p.status === 'approved').length + 1;
  };

  const getMyParticipantStatus = (actId: string) => {
    if (currentUser) {
      const p = participants.find(part => part.activityId === actId && part.userId === currentUser.id);
      return p?.status;
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F7F5] relative overflow-hidden font-sans text-[#111827] select-none">
      
      {/* 1. SLIM, UNCLUTTERED TOP BAR (Single clean row to eliminate all visual noise) */}
      <div className="px-5 pt-3 pb-2.5 bg-[#F8F7F5] shrink-0 border-b border-black/[0.04] z-20">
        <div className="flex items-center justify-between">
          
          {/* Brand Wordmark with subtle live status */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-[-0.03em] text-[#111827]">
              Tagalong
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B63] animate-pulse"></span>
          </div>

          {/* Segmented Mode Switcher: Discover (Masonry) vs Feed vs Map */}
          <div className="flex items-center bg-stone-200/70 p-0.5 rounded-full text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('discover');
                setSearchOpen(false);
              }}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'discover'
                  ? 'bg-white text-[#111827] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-[#111827]'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'feed'
                  ? 'bg-white text-[#111827] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-[#111827]'
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'map'
                  ? 'bg-white text-[#111827] shadow-xs font-bold'
                  : 'text-stone-600 hover:text-[#111827]'
              }`}
            >
              Map
            </button>
          </div>

          {/* Minimal Search Button (Expands on click so it doesn't clutter the top by default) */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
              searchOpen || searchQuery
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Expandable Search Input (Only shown when requested, preserving clean vertical space) */}
        {searchOpen && (
          <div className="mt-2.5 relative flex items-center animate-fade-in">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab === 'discover') setActiveTab('feed');
              }}
              placeholder="Search hiking, cycling, coffee, seawall..."
              className="w-full h-9 pl-9 pr-8 bg-white rounded-full text-xs font-medium text-[#111827] placeholder-stone-400 border border-stone-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF4B63]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. MAIN VIEW AREA */}
      
      {/* VIEW A: MASONRY DISCOVERY (Exact big pictures bento layout matching user reference) */}
      {activeTab === 'discover' && (
        <div className="flex-1 overflow-y-auto scrollbar-none px-4 pt-3 pb-24 space-y-3.5 text-left">
          
          {/* Top Hero Panoramic Card: Vancouver Cycling & Mountain Biking */}
          <div
            onClick={() => handleSelectMasonryCard(HERO_CARD)}
            className="group relative w-full rounded-3xl overflow-hidden cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] transition-all duration-300"
            style={{ height: '180px' }}
          >
            <img
              src={HERO_CARD.image}
              alt={HERO_CARD.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = CURATED_STOCK_IMAGES.cycling;
              }}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"></div>

            <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2.5">
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight tracking-tight max-w-[80%] drop-shadow-xs">
                {HERO_CARD.title}
              </h3>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectMasonryCard(HERO_CARD);
                }}
                className="px-4 py-1.5 rounded-full bg-white hover:bg-stone-100 text-[#111827] text-xs font-bold inline-flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
              >
                <span>Discover</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Masonry 2-Column Grid */}
          <div className="grid grid-cols-2 gap-3.5 items-start">
            
            {/* COLUMN 1 */}
            <div className="flex flex-col gap-3.5">
              {MASONRY_LEFT.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleSelectMasonryCard(card)}
                  className={`group relative w-full ${card.heightClass} rounded-3xl overflow-hidden cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] transition-all duration-300`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = resolveActivityImage('', card.categoryQuery, card.title);
                    }}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10"></div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 space-y-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight tracking-tight drop-shadow-xs">
                      {card.title}
                    </h3>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectMasonryCard(card);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-[#111827] text-xs font-bold inline-flex items-center gap-1 shadow-md transition-transform active:scale-95"
                    >
                      <span>Discover</span>
                      <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* COLUMN 2 */}
            <div className="flex flex-col gap-3.5">
              {MASONRY_RIGHT.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleSelectMasonryCard(card)}
                  className={`group relative w-full ${card.heightClass} rounded-3xl overflow-hidden cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] transition-all duration-300`}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = resolveActivityImage('', card.categoryQuery, card.title);
                    }}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10"></div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 space-y-2">
                    <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight tracking-tight drop-shadow-xs">
                      {card.title}
                    </h3>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectMasonryCard(card);
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-100 text-[#111827] text-xs font-bold inline-flex items-center gap-1 shadow-md transition-transform active:scale-95"
                    >
                      <span>Discover</span>
                      <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* VIEW B: FEED (Live upcoming activities matching filter or all) */}
      {activeTab === 'feed' && (
        <div className="flex-1 overflow-y-auto scrollbar-none px-4 pt-3 pb-24 space-y-4 text-left">
          
          {/* Active Filter Bar */}
          {activeFilterLabel ? (
            <div className="flex items-center justify-between bg-white border border-stone-200/90 rounded-2xl px-4 py-2.5 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4B63]"></span>
                <div>
                  <span className="text-xs font-bold text-[#111827] block leading-tight">{activeFilterLabel}</span>
                  <span className="text-[11px] text-stone-500 font-medium">{filteredActivities.length} meetups ready</span>
                </div>
              </div>

              <button
                onClick={clearFilter}
                className="text-xs font-bold text-[#FF4B63] hover:underline flex items-center gap-1 px-2 py-1 rounded-lg"
              >
                <span>Clear</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-base font-bold text-[#111827] tracking-tight">
                  Upcoming Meetups
                </h2>
                <p className="text-[12px] text-stone-500 font-medium">
                  {filteredActivities.length} spontaneous events happening in 0–48h
                </p>
              </div>
            </div>
          )}

          {/* Cards List with AI Fallback Engine */}
          {filteredActivities.length > 0 ? (
            <div className="space-y-4">
              {filteredActivities.map(act => {
                const host = getHost(act.hostId);
                const joinedCount = getJoinedCount(act.id);
                const isFav = favorites.includes(act.id);
                const myStatus = getMyParticipantStatus(act.id);
                const isHost = act.hostId === currentUser.id;

                // Smart AI/stock cover image fallback
                const resolvedPhoto = resolveActivityImage(act.photo, act.type, act.title, act.note);

                return (
                  <div
                    key={act.id}
                    onClick={() => onSelectActivityDetails(act)}
                    className="group bg-white rounded-3xl p-3 border border-stone-200/70 shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.07)] transition-all duration-300 cursor-pointer space-y-3"
                  >
                    {/* Big picture with rounded corners */}
                    <div className="h-48 w-full rounded-2xl relative overflow-hidden bg-stone-100">
                      <img
                        src={resolvedPhoto}
                        alt={act.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = CURATED_STOCK_IMAGES.default;
                        }}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25"></div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                          {act.vibeTags[0] || 'Local Meetup'}
                        </span>

                        <button
                          onClick={(e) => toggleFavorite(act.id, e)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                            isFav
                              ? 'bg-[#FF4B63] text-white shadow-sm'
                              : 'bg-black/35 hover:bg-black/55 text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 text-white z-10 flex items-end justify-between">
                        <div className="pr-2">
                          <span className="text-[10px] font-medium text-stone-200 block mb-0.5">
                            {act.locationName.split(',')[0]}
                          </span>
                          <h3 className="text-base font-bold text-white leading-snug tracking-tight drop-shadow-xs">
                            {act.title}
                          </h3>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-white text-[#111827] group-hover:bg-[#FF4B63] group-hover:text-white transition flex items-center justify-center shrink-0 shadow-sm">
                          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata & Host */}
                    <div className="px-1 pt-0.5 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                        <span className="text-[#111827] font-semibold">{act.time}</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span>{joinedCount}/{act.maxAttendees} spots</span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="text-emerald-700 font-semibold">Free</span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-stone-100">
                        <div className="flex items-center gap-2">
                          <img
                            src={host.photo}
                            alt={host.name}
                            referrerPolicy="no-referrer"
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-stone-200"
                          />
                          <div>
                            <span className="text-xs font-bold text-[#111827] block leading-tight">
                              {host.name}
                            </span>
                            <span className="text-[10px] text-stone-400 font-medium">
                              Host · ★ {host.rating}
                            </span>
                          </div>
                        </div>

                        {isHost ? (
                          <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                            Your Meetup
                          </span>
                        ) : myStatus === 'approved' ? (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Attending</span>
                          </span>
                        ) : myStatus === 'pending' ? (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                            Pending
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (act.soloMode) {
                                onJoinRequest(act.id, "Joined instantly via feed!");
                              } else {
                                onSelectActivityDetails(act);
                              }
                            }}
                            className="px-3.5 py-1 bg-[#111827] hover:bg-[#FF4B63] text-white text-xs font-semibold rounded-full transition shadow-xs"
                          >
                            {act.soloMode ? 'Join Instantly' : 'Handshake'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-stone-200/80 space-y-2">
              <Compass className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="text-sm font-bold text-[#111827]">No activities found</h3>
              <p className="text-xs text-stone-500">
                Be the first to host an activity in this category!
              </p>
              <button
                onClick={clearFilter}
                className="mt-2 px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full text-xs font-semibold transition"
              >
                Show all meetups
              </button>
            </div>
          )}

        </div>
      )}

      {/* VIEW C: MAP VIEW */}
      {activeTab === 'map' && (
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {/* Top Floating Guide Card */}
          <div className="absolute top-3 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-stone-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={focusedActivity ? getHost(focusedActivity.hostId).photo : currentUser.photo}
                alt="Host"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-stone-200"
              />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#111827]">
                    {focusedActivity ? getHost(focusedActivity.hostId).name : 'Vancouver Hosts'}
                  </span>
                  <span className="text-[10px] text-stone-500 font-semibold">
                    ★ {focusedActivity ? getHost(focusedActivity.hostId).rating : '4.9'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium truncate max-w-[180px]">
                  {focusedActivity ? focusedActivity.title : 'Live Vancouver Activities'}
                </p>
              </div>
            </div>

            <div className="text-right pl-2 border-l border-stone-100">
              <span className="text-[10px] font-semibold text-stone-400 block">Schedule</span>
              <span className="text-xs font-bold text-[#FF4B63] block">
                {focusedActivity ? focusedActivity.time.split(' ')[0] : 'Today'}
              </span>
            </div>
          </div>

          {/* SVG Canvas Map */}
          <div className="flex-1 w-full h-full relative bg-[#F4F3EF] overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
              <defs>
                <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E8E5DD" strokeWidth="0.8" />
                </pattern>
              </defs>

              <rect width="100%" height="100%" fill="url(#city-grid)" />

              {/* Water Coastline */}
              <path
                d="M -20,180 C 60,190 120,240 160,320 C 190,380 240,410 320,400 C 370,395 420,420 440,450 L 440,620 L -20,620 Z"
                fill="#E2EFF7"
                stroke="#C6DEED"
                strokeWidth="1.5"
              />

              {/* Stanley Park */}
              <path
                d="M -20,-20 L 220,-20 C 210,80 180,140 100,160 C 40,170 -10,140 -20,100 Z"
                fill="#E8F1D4"
                stroke="#D6E4B8"
                strokeWidth="1.5"
              />
              <text x="50" y="70" fill="#658231" fontSize="9" fontWeight="600" letterSpacing="0.05em">
                STANLEY PARK
              </text>
              <text x="60" y="380" fill="#6A97B5" fontSize="9" fontWeight="600" letterSpacing="0.05em">
                ENGLISH BAY
              </text>
              <text x="260" y="440" fill="#6A97B5" fontSize="9" fontWeight="600" letterSpacing="0.05em">
                FALSE CREEK
              </text>

              {/* Roads */}
              <path d="M 30,160 L 380,260" stroke="#EDE6D8" strokeWidth="6" strokeLinecap="round" />
              <path d="M 120,150 L 160,320" stroke="#EDE6D8" strokeWidth="6" strokeLinecap="round" />
              <path d="M 180,200 L 360,400" stroke="#EDE6D8" strokeWidth="5" strokeLinecap="round" />
              <path d="M 50,300 L 350,330" stroke="#EDE6D8" strokeWidth="4" strokeLinecap="round" />

              {/* Route */}
              <path
                d="M 130,130 C 150,190 170,220 210,250 C 260,280 280,310 240,360 C 200,400 160,370 120,330"
                fill="none"
                stroke="#FF4B63"
                strokeWidth="2"
                strokeDasharray="4,5"
                strokeLinecap="round"
              />
              <circle cx="130" cy="130" r="3" fill="#FF4B63" />
              <circle cx="210" cy="250" r="3" fill="#FF4B63" />
              <circle cx="240" cy="360" r="3" fill="#FF4B63" />
            </svg>

            {/* Interactive Map Pins */}
            {filteredActivities.map((act) => {
              const host = getHost(act.hostId);
              const isSelected = focusedActivity?.id === act.id;
              const top = `${act.lat}%`;
              const left = `${act.lng}%`;

              return (
                <div
                  key={act.id}
                  style={{ top, left }}
                  onClick={() => setFocusedActivity(act)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                >
                  <div className={`relative flex flex-col items-center transition-all ${
                    isSelected ? 'scale-110 z-30' : 'scale-90 hover:scale-100'
                  }`}>
                    {isSelected && (
                      <div className="absolute -inset-2 rounded-full bg-[#FF4B63]/30 animate-ping pointer-events-none"></div>
                    )}

                    <div className={`w-10 h-10 rounded-full p-0.5 shadow-md flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#FF4B63] ring-2 ring-white shadow-lg'
                        : 'bg-white ring-1 ring-stone-200'
                    }`}>
                      <img
                        src={host.photo}
                        alt={host.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    <span className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-xs ${
                      isSelected
                        ? 'bg-[#111827] text-white'
                        : 'bg-white/95 text-stone-700 border border-stone-200'
                    }`}>
                      {act.title.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Bottom Preview Sheet */}
          {focusedActivity && (
            <div className="absolute bottom-4 left-4 right-4 z-30 bg-white rounded-3xl p-3.5 shadow-xl border border-stone-200/80 text-left">
              <div className="flex gap-3 items-center">
                <img
                  src={resolveActivityImage(focusedActivity.photo, focusedActivity.type, focusedActivity.title, focusedActivity.note)}
                  alt={focusedActivity.title}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 rounded-2xl object-cover shrink-0"
                />

                <div className="min-w-0 flex-1 space-y-0.5">
                  <span className="text-[10px] font-semibold text-stone-400 block">
                    {focusedActivity.locationName.split(',')[0]}
                  </span>
                  <h4 className="text-sm font-bold text-[#111827] leading-snug truncate">
                    {focusedActivity.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                    <span>{focusedActivity.time}</span>
                    <span>·</span>
                    <span>{getJoinedCount(focusedActivity.id)}/{focusedActivity.maxAttendees} spots</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-stone-100">
                <button
                  onClick={() => onSelectActivityDetails(focusedActivity)}
                  className="py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-bold text-[#111827] transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    onJoinRequest(focusedActivity.id, "Joined via live map!");
                    onSelectActivityDetails(focusedActivity);
                  }}
                  className="py-2.5 bg-[#FF4B63] hover:bg-[#e03a51] rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-1 shadow-xs"
                >
                  <span>{focusedActivity.soloMode ? 'Join Instantly' : 'Handshake'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button: Host Meetup */}
      <div className="absolute bottom-20 right-4 z-30">
        <button
          onClick={onCreateActivityClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] hover:bg-black text-white rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.18)] transition-all active:scale-95 group font-bold text-xs"
        >
          <div className="w-5 h-5 rounded-full bg-[#FF4B63] text-white flex items-center justify-center font-bold text-xs">
            +
          </div>
          <span>Host Meetup</span>
        </button>
      </div>

    </div>
  );
};
