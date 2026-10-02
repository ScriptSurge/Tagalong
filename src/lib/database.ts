import {
  Activity,
  AppNotification,
  Message,
  Participant,
  Report,
  User,
} from '../types'
import {
  MOCK_ACTIVITIES,
  MOCK_MESSAGES,
  MOCK_NOTIFICATIONS,
  MOCK_PARTICIPANTS,
  MOCK_USERS,
} from '../data'
import { supabase } from './supabase'

export interface SharedSnapshot {
  users: User[]
  activities: Activity[]
  participants: Participant[]
  messages: Message[]
  notifications: AppNotification[]
  reports: Report[]
}

function profileToRow(user: User) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    age_range: user.ageRange,
    gender: user.gender,
    photo: user.photo,
    bio: user.bio,
    instagram: user.instagram,
    linked_in: user.linkedIn,
    city: user.city,
    is_premium: user.isPremium,
    can_host: user.canHost,
    rating: user.rating,
    hosted_count: user.hostedCount,
    joined_count: user.joinedCount,
    current_streak: user.currentStreak,
    blocked_users: user.blockedUsers,
    accepted_guidelines: user.acceptedGuidelines,
    phone_number: user.phoneNumber,
  }
}

function rowToProfile(row: Record<string, unknown>): User {
  return {
    id: String(row.id),
    name: String(row.name),
    username: String(row.username),
    ageRange: String(row.age_range ?? ''),
    gender: String(row.gender ?? ''),
    photo: String(row.photo ?? ''),
    bio: String(row.bio ?? ''),
    instagram: String(row.instagram ?? ''),
    linkedIn: String(row.linked_in ?? ''),
    city: String(row.city ?? ''),
    isPremium: Boolean(row.is_premium),
    canHost: Boolean(row.can_host),
    rating: Number(row.rating ?? 0),
    hostedCount: Number(row.hosted_count ?? 0),
    joinedCount: Number(row.joined_count ?? 0),
    currentStreak: Number(row.current_streak ?? 0),
    blockedUsers: (row.blocked_users as string[]) ?? [],
    acceptedGuidelines: Boolean(row.accepted_guidelines),
    phoneNumber: String(row.phone_number ?? ''),
  }
}

function activityToRow(activity: Activity) {
  return {
    id: activity.id,
    host_id: activity.hostId,
    title: activity.title,
    type: activity.type,
    vibe_tags: activity.vibeTags,
    note: activity.note,
    time_label: activity.time,
    time_hours_from_now: activity.timeHoursFromNow,
    location_name: activity.locationName,
    lat: activity.lat,
    lng: activity.lng,
    max_attendees: activity.maxAttendees,
    solo_mode: activity.soloMode,
    is_premium: activity.isPremium,
    photo: activity.photo,
    created_at: activity.createdAt,
    viewers_count: activity.viewersCount,
    viewers: activity.viewers,
  }
}

function rowToActivity(row: Record<string, unknown>): Activity {
  return {
    id: String(row.id),
    hostId: String(row.host_id),
    title: String(row.title),
    type: String(row.type) as Activity['type'],
    vibeTags: (row.vibe_tags as string[]) ?? [],
    note: String(row.note ?? ''),
    time: String(row.time_label ?? ''),
    timeHoursFromNow: Number(row.time_hours_from_now ?? 0),
    locationName: String(row.location_name ?? ''),
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
    maxAttendees: Number(row.max_attendees ?? 0),
    soloMode: Boolean(row.solo_mode),
    isPremium: Boolean(row.is_premium),
    photo: String(row.photo ?? ''),
    createdAt: String(row.created_at ?? ''),
    viewersCount: Number(row.viewers_count ?? 0),
    viewers: (row.viewers as string[]) ?? [],
  }
}

function participantToRow(participant: Participant) {
  return {
    activity_id: participant.activityId,
    user_id: participant.userId,
    status: participant.status,
    role: participant.role,
    requested_at: participant.requestedAt,
    join_message: participant.joinMessage ?? null,
  }
}

function rowToParticipant(row: Record<string, unknown>): Participant {
  return {
    activityId: String(row.activity_id),
    userId: String(row.user_id),
    status: String(row.status) as Participant['status'],
    role: String(row.role) as Participant['role'],
    requestedAt: String(row.requested_at ?? ''),
    joinMessage: row.join_message ? String(row.join_message) : undefined,
  }
}

function messageToRow(message: Message) {
  return {
    id: message.id,
    chat_id: message.chatId,
    sender_id: message.senderId,
    sender_name: message.senderName,
    sender_photo: message.senderPhoto,
    body: message.text,
    photo: message.photo ?? null,
    timestamp_label: message.timestamp,
    is_system: Boolean(message.isSystem),
  }
}

function rowToMessage(row: Record<string, unknown>): Message {
  return {
    id: String(row.id),
    chatId: String(row.chat_id),
    senderId: String(row.sender_id ?? ''),
    senderName: String(row.sender_name ?? ''),
    senderPhoto: String(row.sender_photo ?? ''),
    text: String(row.body ?? ''),
    photo: row.photo ? String(row.photo) : undefined,
    timestamp: String(row.timestamp_label ?? ''),
    isSystem: Boolean(row.is_system),
  }
}

function notificationToRow(notification: AppNotification) {
  return {
    id: notification.id,
    user_id: notification.userId,
    title: notification.title,
    description: notification.description,
    type: notification.type,
    activity_id: notification.activityId ?? null,
    related_user_id: notification.relatedUserId ?? null,
    created_at: notification.createdAt,
    is_read: notification.read,
  }
}

function rowToNotification(row: Record<string, unknown>): AppNotification {
  return {
    id: String(row.id),
    userId: String(row.user_id ?? ''),
    title: String(row.title ?? ''),
    description: String(row.description ?? ''),
    type: String(row.type) as AppNotification['type'],
    activityId: row.activity_id ? String(row.activity_id) : undefined,
    relatedUserId: row.related_user_id ? String(row.related_user_id) : undefined,
    createdAt: String(row.created_at ?? ''),
    read: Boolean(row.is_read),
  }
}

function reportToRow(report: Report) {
  return {
    id: report.id,
    reported_user_id: report.reportedUserId,
    reporter_user_id: report.reporterUserId,
    reason: report.reason,
    activity_id: report.activityId ?? null,
    details: report.details,
    created_at: report.createdAt,
  }
}

function rowToReport(row: Record<string, unknown>): Report {
  return {
    id: String(row.id),
    reportedUserId: String(row.reported_user_id ?? ''),
    reporterUserId: String(row.reporter_user_id ?? ''),
    reason: String(row.reason ?? ''),
    activityId: row.activity_id ? String(row.activity_id) : undefined,
    details: String(row.details ?? ''),
    createdAt: String(row.created_at ?? ''),
  }
}

function throwIfError(error: { message: string } | null, action: string) {
  if (error) {
    throw new Error(`Supabase ${action} failed: ${error.message}`)
  }
}

async function selectAll<T>(table: string, map: (row: Record<string, unknown>) => T): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*')
  throwIfError(error, `read ${table}`)
  return (data ?? []).map((row) => map(row as Record<string, unknown>))
}

export function mockSnapshot(): SharedSnapshot {
  return {
    users: MOCK_USERS,
    activities: MOCK_ACTIVITIES,
    participants: MOCK_PARTICIPANTS,
    messages: MOCK_MESSAGES,
    notifications: MOCK_NOTIFICATIONS,
    reports: [],
  }
}

export async function loadSharedData(): Promise<SharedSnapshot | null> {
  const { data, error } = await supabase.from('profiles').select('id').limit(1)
  throwIfError(error, 'read profiles')
  if (!data || data.length === 0) return null

  const [users, activities, participants, messages, notifications, reports] = await Promise.all([
    selectAll('profiles', rowToProfile),
    selectAll('activities', rowToActivity),
    selectAll('participants', rowToParticipant),
    selectAll('messages', rowToMessage),
    selectAll('notifications', rowToNotification),
    selectAll('reports', rowToReport),
  ])

  return { users, activities, participants, messages, notifications, reports }
}

async function upsertAll(table: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return
  const { error } = await supabase.from(table).upsert(rows)
  throwIfError(error, `save ${table}`)
}

async function deleteMissing(table: string, idColumn: string, ids: string[]) {
  if (ids.length === 0) {
    const { error } = await supabase.from(table).delete().neq(idColumn, '')
    throwIfError(error, `clear ${table}`)
    return
  }
  const { error } = await supabase.from(table).delete().not(idColumn, 'in', `(${ids.join(',')})`)
  throwIfError(error, `prune ${table}`)
}

export async function syncSharedData(snapshot: SharedSnapshot) {
  await upsertAll('profiles', snapshot.users.map(profileToRow))
  await upsertAll('activities', snapshot.activities.map(activityToRow))
  await upsertAll('participants', snapshot.participants.map(participantToRow))
  const { data: existingParticipants, error: participantReadError } = await supabase
    .from('participants')
    .select('activity_id,user_id')
  throwIfError(participantReadError, 'read participants')
  for (const row of existingParticipants ?? []) {
    const stillThere = snapshot.participants.some(
      (participant) => participant.activityId === row.activity_id && participant.userId === row.user_id
    )
    if (!stillThere) {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('activity_id', row.activity_id)
        .eq('user_id', row.user_id)
      throwIfError(error, 'prune participants')
    }
  }

  await upsertAll('messages', snapshot.messages.map(messageToRow))
  await deleteMissing('messages', 'id', snapshot.messages.map((message) => message.id))

  await upsertAll('notifications', snapshot.notifications.map(notificationToRow))
  await deleteMissing('notifications', 'id', snapshot.notifications.map((notification) => notification.id))

  await upsertAll('reports', snapshot.reports.map(reportToRow))
  await deleteMissing('reports', 'id', snapshot.reports.map((report) => report.id))

  await deleteMissing('activities', 'id', snapshot.activities.map((activity) => activity.id))
  await deleteMissing('profiles', 'id', snapshot.users.map((user) => user.id))
}

export async function ensureSharedData(): Promise<SharedSnapshot> {
  const existing = await loadSharedData()
  if (existing) return existing
  const seeded = mockSnapshot()
  await syncSharedData(seeded)
  return seeded
}
