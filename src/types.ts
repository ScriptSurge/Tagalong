export interface User {
  id: string;
  name: string;
  username: string;
  ageRange: string;
  gender: string;
  photo: string;
  bio: string;
  instagram: string;
  linkedIn: string;
  city: string;
  isPremium: boolean;
  canHost: boolean;
  rating: number; // 4.9 etc.
  hostedCount: number;
  joinedCount: number;
  currentStreak: number;
  blockedUsers: string[]; // List of user IDs
  acceptedGuidelines: boolean;
  phoneNumber: string;
}

export interface Activity {
  id: string;
  hostId: string;
  title: string;
  type: 'coffee' | 'walk' | 'yoga' | 'run' | 'drinks' | 'picnic' | 'other';
  vibeTags: string[];
  note: string;
  time: string; // Printable relative name, e.g. "Today: 6:30 PM"
  timeHoursFromNow: number; // to sort
  locationName: string;
  lat: number; // Relative grid coordinate for mock map 0-100%
  lng: number; // Relative grid coordinate for mock map 0-100%
  maxAttendees: number;
  soloMode: boolean; // Auto-approval of guests
  isPremium: boolean;
  photo: string;
  createdAt: string;
  viewersCount: number;
  viewers: string[]; // User IDs who "viewed"
}

export interface Participant {
  activityId: string;
  userId: string;
  status: 'pending' | 'approved' | 'declined';
  role: 'host' | 'guest';
  requestedAt: string;
  joinMessage?: string;
}

export interface Chat {
  id: string; // Matches activityId
  activityTitle: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  text: string;
  photo?: string;
  timestamp: string; // format: "6:32 PM"
  isSystem?: boolean;
}

export interface Report {
  id: string;
  reportedUserId: string;
  reporterUserId: string;
  reason: string;
  activityId?: string;
  details: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'request_approved' | 'join_request' | 'new_message' | 'premium_unlock';
  activityId?: string;
  relatedUserId?: string;
  createdAt: string;
  read: boolean;
}
