import { User, Activity, Participant, Message, AppNotification } from './types';

// Static users with high quality profile pics
export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Jenny Wilson',
    username: 'jenny_w',
    ageRange: '20s-30s',
    gender: 'Female',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Avid coffee drink and sunset hunter. Recently moved to Vancouver. Let\'s hang out!',
    instagram: 'jenny_wilson',
    linkedIn: 'jenny-wilson-tech',
    city: 'Vancouver',
    isPremium: false,
    canHost: false, // In free tier, hosts are locked to guests first or needs 1 meetup
    rating: 4.8,
    hostedCount: 0,
    joinedCount: 1,
    currentStreak: 3,
    blockedUsers: [],
    acceptedGuidelines: true,
    phoneNumber: '+1 (604) 555-0199'
  },
  {
    id: 'user_host_1',
    name: 'Jhon Doe',
    username: 'jhon_vancity',
    ageRange: '20s-30s',
    gender: 'Male',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Local Vancouverite who loves showing people around. Hiking, beach volleyball, Craft beer enthusiast!',
    instagram: 'jhon_doe_runs',
    linkedIn: 'jhon-doe-vancity',
    city: 'Vancouver',
    isPremium: true,
    canHost: true,
    rating: 4.95,
    hostedCount: 14,
    joinedCount: 22,
    currentStreak: 8,
    blockedUsers: [],
    acceptedGuidelines: true,
    phoneNumber: '+1 (604) 555-5241'
  },
  {
    id: 'user_sarah',
    name: 'Sarah Chen',
    username: 'sarah_runs_yvr',
    ageRange: '20s-30s',
    gender: 'Female',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Yoga teacher & runs along English Bay. High energy, early riser! 🧘🏃',
    instagram: 'sarah_yvr_flow',
    linkedIn: 'sarah-chen-wellness',
    city: 'Vancouver',
    isPremium: false,
    canHost: true,
    rating: 5.0,
    hostedCount: 5,
    joinedCount: 19,
    currentStreak: 4,
    blockedUsers: [],
    acceptedGuidelines: true,
    phoneNumber: '+1 (604) 555-9002'
  },
  {
    id: 'user_brad',
    name: 'Brad Pittman',
    username: 'brad_p',
    ageRange: '20s-30s',
    gender: 'Male',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Software engineer by day, foodie & live music lover by night. Always down for coffee and a tech chat.',
    instagram: 'brad_p_codes',
    linkedIn: 'brad-pittman-dev',
    city: 'Vancouver',
    isPremium: true,
    canHost: true,
    rating: 4.7,
    hostedCount: 3,
    joinedCount: 12,
    currentStreak: 5,
    blockedUsers: [],
    acceptedGuidelines: true,
    phoneNumber: '+1 (604) 555-4421'
  },
  {
    id: 'user_sophia',
    name: 'Sophia Martinez',
    username: 'sophia_m',
    ageRange: '20s-30s',
    gender: 'Female',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Expat from Madrid. Traveling photographer. Looking for girls to try out bubble tea and walk on seawall!',
    instagram: 'sophia_lens',
    linkedIn: 'sophia-travel-photo',
    city: 'Vancouver',
    isPremium: false,
    canHost: true,
    rating: 4.9,
    hostedCount: 6,
    joinedCount: 8,
    currentStreak: 0,
    blockedUsers: [],
    acceptedGuidelines: true,
    phoneNumber: '+1 (778) 555-8833'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act_1',
    hostId: 'user_host_1',
    title: 'Sunset Beach Club & Drinks',
    type: 'drinks',
    vibeTags: ['Patio', 'Twilight', 'Social'],
    note: 'Let us meet up by English Bay Beach House for some sunset drinks! We have a spot on the patio with heaters. Low pressure, casual conversation, great music.',
    time: 'Today • 6:30 PM',
    timeHoursFromNow: 1.5,
    locationName: 'English Bay Beach, Vancouver',
    lat: 44,
    lng: 28,
    maxAttendees: 8,
    soloMode: false,
    isPremium: false,
    photo: '/src/assets/images/discover_evening_drinks_1790709953823.jpg',
    createdAt: '2026-05-25T15:00:00Z',
    viewersCount: 42,
    viewers: ['user_1', 'user_sarah', 'user_brad']
  },
  {
    id: 'act_2',
    hostId: 'user_sarah',
    title: 'Sunset Beach Yoga & Stretch',
    type: 'yoga',
    vibeTags: ['Wellness', 'Ocean Breeze', 'All Levels'],
    note: 'Bring a towel or mat! We will do a very gentle flow session as the sun dips below the mountains. All levels welcome, zero pressure. Hanging out for a chat after.',
    time: 'Today • 7:15 PM',
    timeHoursFromNow: 2.2,
    locationName: 'Kitsilano Beach, Vancouver',
    lat: 68,
    lng: 20,
    maxAttendees: 12,
    soloMode: true,
    isPremium: false,
    photo: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-05-25T11:00:00Z',
    viewersCount: 29,
    viewers: ['user_1', 'user_sophia']
  },
  {
    id: 'act_3',
    hostId: 'user_brad',
    title: 'Espresso & Creative Catchup',
    type: 'coffee',
    vibeTags: ['Specialty Coffee', 'Creative', 'Conversations'],
    note: 'Grabbing pour-overs & iced lattes. Let\'s chat about tech, creative ideas, city living, or just life! Working on fun projects, bring a notebook or sketchpad if you like.',
    time: 'Tomorrow • 10:30 AM',
    timeHoursFromNow: 17.5,
    locationName: 'Matchstick Coffee, Gastown',
    lat: 38,
    lng: 78,
    maxAttendees: 5,
    soloMode: false,
    isPremium: true,
    photo: '/src/assets/images/discover_coffee_cafe_1790709924898.jpg',
    createdAt: '2026-05-25T17:30:00Z',
    viewersCount: 15,
    viewers: ['user_host_1', 'user_sarah']
  },
  {
    id: 'act_4',
    hostId: 'user_sophia',
    title: 'Seawall Sunset Stroll & Gelato',
    type: 'walk',
    vibeTags: ['Coastal Walk', 'Scenic Views', 'Relaxed'],
    note: 'Starting near Devonian Harbour Park, walking the waterfront loop towards Stanley Park and finishing with dynamic conversation and gelatos in West End!',
    time: 'Tomorrow • 2:00 PM',
    timeHoursFromNow: 21.0,
    locationName: 'Stanley Park Seawall, Vancouver',
    lat: 20,
    lng: 39,
    maxAttendees: 6,
    soloMode: true,
    isPremium: false,
    photo: '/src/assets/images/discover_sunset_seawall_1790709914120.jpg',
    createdAt: '2026-05-25T18:00:00Z',
    viewersCount: 31,
    viewers: ['user_1', 'user_sarah']
  },
  {
    id: 'act_5',
    hostId: 'user_host_1',
    title: 'Stanley Park Seawall 5K Run Club',
    type: 'run',
    vibeTags: ['Active', 'Social Pace', 'Post-run Smoothies'],
    note: 'Casual conversational pace (approx 5:45 min/km). Beginners friendly! We regroup at viewpoints and finish with smoothies at English Bay.',
    time: 'Tonight • 6:45 PM',
    timeHoursFromNow: 1.8,
    locationName: 'Second Beach Pool, Stanley Park',
    lat: 24,
    lng: 32,
    maxAttendees: 10,
    soloMode: true,
    isPremium: false,
    photo: '/src/assets/images/discover_run_club_1790709933793.jpg',
    createdAt: '2026-05-25T16:00:00Z',
    viewersCount: 38,
    viewers: ['user_1', 'user_brad']
  },
  {
    id: 'act_6',
    hostId: 'user_sarah',
    title: 'Kitsilano Sunset Beach Picnic',
    type: 'picnic',
    vibeTags: ['Beach Blanket', 'Sunset', 'Snacks & Music'],
    note: 'Bringing a couple of large picnic blankets and some chips & dips. Feel free to bring your favorite snacks or drinks. Watching the golden hour over Vancouver Island!',
    time: 'Tomorrow • 6:00 PM',
    timeHoursFromNow: 25.0,
    locationName: 'Kitsilano Beach West, Vancouver',
    lat: 72,
    lng: 22,
    maxAttendees: 8,
    soloMode: true,
    isPremium: false,
    photo: '/src/assets/images/discover_beach_picnic_1790709944504.jpg',
    createdAt: '2026-05-25T19:00:00Z',
    viewersCount: 22,
    viewers: ['user_1', 'user_sophia']
  },
  {
    id: 'act_7',
    hostId: 'user_brad',
    title: 'Vancouver Cycling & Mountain Biking',
    type: 'walk',
    vibeTags: ['Cycling', 'Coastal Trails', 'Scenic'],
    note: 'Riding the Stanley Park perimeter loop, then heading across Lions Gate bridge. Medium relaxed pace, road bikes and hybrids welcome. Quick coffee pit-stop halfway.',
    time: 'Tomorrow • 11:00 AM',
    timeHoursFromNow: 18.0,
    locationName: 'Stanley Park Seawall, Vancouver',
    lat: 22,
    lng: 40,
    maxAttendees: 6,
    soloMode: true,
    isPremium: false,
    photo: '/src/assets/images/vancouver_cycling_1790710513736.jpg',
    createdAt: '2026-05-25T20:00:00Z',
    viewersCount: 34,
    viewers: ['user_1', 'user_host_1']
  },
  {
    id: 'act_8',
    hostId: 'user_host_1',
    title: 'Vancouver Mountain Summit Hiking',
    type: 'walk',
    vibeTags: ['Summit Views', 'Fjords', 'Alpine'],
    note: 'Day hike up to Eagle Bluffs / Cypress lookout. Rewarding panoramic views over Howe Sound, Point Grey, and Vancouver skyline. Bring good hiking shoes and water!',
    time: 'Saturday • 9:30 AM',
    timeHoursFromNow: 42.0,
    locationName: 'Cypress Provincial Park, Vancouver',
    lat: 15,
    lng: 25,
    maxAttendees: 8,
    soloMode: false,
    isPremium: false,
    photo: '/src/assets/images/vancouver_hiking_1790710524653.jpg',
    createdAt: '2026-05-25T20:30:00Z',
    viewersCount: 52,
    viewers: ['user_1', 'user_sarah', 'user_sophia']
  },
  {
    id: 'act_9',
    hostId: 'user_sophia',
    title: 'Vancouver Watersports & Kayaking',
    type: 'other',
    vibeTags: ['Kayaking', 'Ocean Breeze', 'Granville Island'],
    note: 'Renting ocean kayaks from Granville Island dock and paddling across False Creek and around Sunset Beach. Life jackets provided. Zero experience needed!',
    time: 'Tomorrow • 3:30 PM',
    timeHoursFromNow: 22.5,
    locationName: 'False Creek Marina, Vancouver',
    lat: 52,
    lng: 46,
    maxAttendees: 6,
    soloMode: true,
    isPremium: false,
    photo: '/src/assets/images/vancouver_watersports_1790710535693.jpg',
    createdAt: '2026-05-25T21:00:00Z',
    viewersCount: 45,
    viewers: ['user_1', 'user_brad']
  },
  {
    id: 'act_10',
    hostId: 'user_sarah',
    title: 'Vancouver Camping, Forest & Beaches',
    type: 'other',
    vibeTags: ['Campfire', 'Pacific Rainforest', 'Stargazing'],
    note: 'Evening campfire gathering under tall cedar trees near coastal waters. S\'mores, hot tea, acoustic guitar, and cozy camp chairs. Low pressure, warm social vibe.',
    time: 'Tonight • 8:00 PM',
    timeHoursFromNow: 3.0,
    locationName: 'Lighthouse Park, West Vancouver',
    lat: 12,
    lng: 18,
    maxAttendees: 10,
    soloMode: true,
    isPremium: false,
    photo: '/src/assets/images/vancouver_camping_forest_1790710556485.jpg',
    createdAt: '2026-05-25T21:30:00Z',
    viewersCount: 61,
    viewers: ['user_1', 'user_host_1', 'user_brad']
  }
];

export const MOCK_PARTICIPANTS: Participant[] = [
  // Beach party participants
  {
    activityId: 'act_1',
    userId: 'user_host_1', // Host
    status: 'approved',
    role: 'host',
    requestedAt: '2026-05-25T15:00:00Z'
  },
  {
    activityId: 'act_1',
    userId: 'user_sarah',
    status: 'approved',
    role: 'guest',
    requestedAt: '2026-05-25T15:30:00Z',
    joinMessage: "Hey! Sounds awesome, would love to join your sunset patio session."
  },
  {
    activityId: 'act_1',
    userId: 'user_brad',
    status: 'approved',
    role: 'guest',
    requestedAt: '2026-05-25T15:45:00Z',
    joinMessage: "I’m in! See you there Jhon."
  },
  // Yoga participants
  {
    activityId: 'act_2',
    userId: 'user_sarah', // Host
    status: 'approved',
    role: 'host',
    requestedAt: '2026-05-25T11:00:00Z'
  },
  {
    activityId: 'act_2',
    userId: 'user_sophia',
    status: 'approved',
    role: 'guest',
    requestedAt: '2026-05-25T12:15:00Z',
    joinMessage: 'Hey Sarah, been looking for an relaxed yoga group!'
  },
  // Coding participants
  {
    activityId: 'act_3',
    userId: 'user_brad', // Host
    status: 'approved',
    role: 'host',
    requestedAt: '2026-05-25T17:30:00Z'
  }
];

export const MOCK_MESSAGES: Message[] = [
  // Beach Club Chat
  {
    id: 'msg_1',
    chatId: 'act_1',
    senderId: 'user_host_1',
    senderName: 'Jhon Doe',
    senderPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    text: "Hey everyone! Welcome to the group! I’ll head down around 6:15 PM to secure us a nice large table.",
    timestamp: '5:15 PM'
  },
  {
    id: 'msg_2',
    chatId: 'act_1',
    senderId: 'user_sarah',
    senderName: 'Sarah Chen',
    senderPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80',
    text: "Perfect! I will be finished with my classes around 6:25 so I will make it just on time at 6:30 PM.",
    timestamp: '5:22 PM'
  },
  {
    id: 'msg_3',
    chatId: 'act_1',
    senderId: 'user_brad',
    senderName: 'Brad Pittman',
    senderPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    text: "Awesome, I can ride my Mobi bike there, should take me 10 mins. Looking forward to meetups!",
    timestamp: '5:35 PM'
  },
  {
    id: 'msg_system_1',
    chatId: 'act_1',
    senderId: 'system',
    senderName: 'System',
    senderPhoto: '',
    text: "Jenny Wilson has requested to join this activity.",
    timestamp: '6:02 PM',
    isSystem: true
  },

  // Yoga Chat
  {
    id: 'msg_4',
    chatId: 'act_2',
    senderId: 'user_sarah',
    senderName: 'Sarah Chen',
    senderPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80',
    text: "Excited for yoga tonight! I will set up some teal-styled lanterns so we are easy to spot on the grass.",
    timestamp: '2:15 PM'
  },
  {
    id: 'msg_5',
    chatId: 'act_2',
    senderId: 'user_sophia',
    senderName: 'Sophia Martinez',
    senderPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    text: "Sounds magical! Should I bring any spare yoga mats? I have two extra ones.",
    timestamp: '2:40 PM'
  },
  {
    id: 'msg_6',
    chatId: 'act_2',
    senderId: 'user_sarah',
    senderName: 'Sarah Chen',
    senderPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80',
    text: "Yes please, Sophia! That would be amazing in case someone joins last minute and forgets theirs.",
    timestamp: '3:05 PM'
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'not_1',
    userId: 'user_1',
    title: 'Welcome to Tagalong! 👋',
    description: 'Create your profile to join spontaneously matching locals in Vancouver!',
    type: 'request_approved',
    createdAt: '2026-05-25T11:00:00Z',
    read: false
  },
  {
    id: 'not_2',
    userId: 'user_host_1',
    title: 'New Join Request ⚡',
    description: 'Sarah Chen wants to join your "Party in the Beach Club". Tap to approve!',
    type: 'join_request',
    activityId: 'act_1',
    relatedUserId: 'user_sarah',
    createdAt: '2026-05-25T15:30:00Z',
    read: true
  }
];

export const VIBE_CATEGORIES = [
  { id: 'all', name: 'All Activities', icon: '📍' },
  { id: 'women', name: 'Women Only', icon: '👩' },
  { id: 'nature', name: 'Outdoors & Nature', icon: '🌲' },
  { id: 'food', name: 'Foodie & Drinks', icon: '🍹' },
  { id: 'beginner', name: 'Beginners Welcome', icon: '☀️' },
  { id: 'twenty-thirty', name: '20s & 30s', icon: '⚡' },
  { id: 'sport', name: 'Active & Sport', icon: '🏃' },
  { id: 'chill', name: 'Mellow & Chill', icon: '☕' }
];

export const VANCOUVER_NEIGHBORHOODS = [
  { name: 'Stanley Park', x: 25, y: 15, desc: 'World famous rainforest seawall & outlook' },
  { name: 'Kitsilano Beach', x: 22, y: 70, desc: 'Casual volleyball, sandy log lines, sunsets' },
  { name: 'English Bay', x: 38, y: 45, desc: 'Teal waters, beach chairs, beach snacks, active social hub' },
  { name: 'Downtown Vancouver', x: 55, y: 52, desc: 'Bustling core, coffee shops, meeting bars' },
  { name: 'Gastown Historic District', x: 80, y: 40, desc: 'Cobbled brick streets, vintage lamps & trendy cafes' },
  { name: 'Yaletown Marina', x: 62, y: 72, desc: 'Chic waterfront, sunset dining decks' },
  { name: 'Granville Island', x: 48, y: 82, desc: 'Artisanal markets, docks, cozy spots' }
];
