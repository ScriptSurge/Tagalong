import React, { useState, useEffect, useRef } from 'react';
import { Compass, Calendar, MessageSquare, User, Sparkles } from 'lucide-react';

import { PhoneFrame } from './components/PhoneFrame';
import { SplashView } from './components/SplashView';
import { OnboardingFlow } from './components/OnboardingFlow';
import { DiscoverView } from './components/DiscoverView';
import { ActivityCreationWizard } from './components/ActivityCreationWizard';
import { MyActivitiesView } from './components/MyActivitiesView';
import { ChatRoomView } from './components/ChatRoomView';
import { ProfileView } from './components/ProfileView';
import { ActivityDetailsView } from './components/ActivityDetailsView';

import { User as UserType, Activity, Participant, Message, AppNotification, Report } from './types';
import { MOCK_USERS, MOCK_ACTIVITIES, MOCK_PARTICIPANTS, MOCK_MESSAGES, MOCK_NOTIFICATIONS } from './data';
import { ensureSharedData, syncSharedData } from './lib/database';

export default function App() {
  // Pilot Actor switch matching Developer Control Panel
  const [activeActorId, setActiveActorId] = useState<string>('user_1'); // starts as Jenny (Guest)
  
  // App routing core states
  const [appRoute, setAppRoute] = useState<'auth' | 'onboarding' | 'main'>('auth');
  const [activeTab, setActiveTab] = useState<'discover' | 'my-activities' | 'profile'>('discover');
  
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  
  // Creation wizards
  const [showCreationWizard, setShowCreationWizard] = useState(false);
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(null);
  const [showPaywallGlobal, setShowPaywallGlobal] = useState(false);
  const [currentDetailsActivity, setCurrentDetailsActivity] = useState<Activity | null>(null);

  // Db references
  const [activities, setActivities] = useState<Activity[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<UserType[]>(MOCK_USERS);
  const [dataError, setDataError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const usersRef = useRef<UserType[]>(MOCK_USERS);
  const reportsRef = useRef<Report[]>([]);

  // 1. Load shared data from Supabase. This device only remembers who you are acting as.
  useEffect(() => {
    let cancelled = false;

    const restoreActor = (directory: UserType[]) => {
      const cachedRoute = localStorage.getItem('tagalong_app_route');
      const cachedActor = localStorage.getItem('tagalong_actor_id');
      const actorId = cachedActor ? JSON.parse(cachedActor) as string : 'user_1';
      const actor = directory.find(u => u.id === actorId) || directory[0];
      setActiveActorId(actor?.id || 'user_1');
      setCurrentUser(actor || null);
      const storedRoute = cachedRoute ? JSON.parse(cachedRoute) as 'auth' | 'onboarding' | 'main' : 'auth';
      const route = actor?.acceptedGuidelines && storedRoute === 'auth' ? 'main' : storedRoute;
      setAppRoute(route);
    };

    ensureSharedData()
      .then((snapshot) => {
        if (cancelled) return;
        usersRef.current = snapshot.users;
        reportsRef.current = snapshot.reports;
        setUsers(snapshot.users);
        setActivities(snapshot.activities);
        setParticipants(snapshot.participants);
        setMessages(snapshot.messages);
        setNotifications(snapshot.notifications);
        setReports(snapshot.reports);
        setDataError(null);
        restoreActor(snapshot.users);
        setSessionReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : 'Could not reach Supabase';
        const friendly = message.includes('schema cache')
          ? 'Supabase is connected. Open the SQL editor, run supabase/schema.sql, then refresh.'
          : message;
        setDataError(friendly);
        setActivities(MOCK_ACTIVITIES);
        setParticipants(MOCK_PARTICIPANTS);
        setMessages(MOCK_MESSAGES);
        setNotifications(MOCK_NOTIFICATIONS);
        restoreActor(MOCK_USERS);
        setSessionReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const rememberActor = (updatedRoute: string, updatedActor: string) => {
    localStorage.setItem('tagalong_app_route', JSON.stringify(updatedRoute));
    localStorage.setItem('tagalong_actor_id', JSON.stringify(updatedActor));
  };

  const directoryWith = (updatedUser: UserType | null) => {
    const directory = usersRef.current;
    if (!updatedUser) return directory;
    const exists = directory.some(user => user.id === updatedUser.id);
    const next = exists
      ? directory.map(user => user.id === updatedUser.id ? updatedUser : user)
      : [...directory, updatedUser];
    usersRef.current = next;
    setUsers(next);
    return next;
  };

  // Shared rows go to Supabase. This browser only remembers the demo actor and screen.
  const saveStateToStorage = (
    updatedAct: Activity[],
    updatedPart: Participant[],
    updatedMsg: Message[],
    updatedNot: AppNotification[],
    updatedUser: UserType | null,
    updatedRoute: string,
    updatedActor: string
  ) => {
    rememberActor(updatedRoute, updatedActor);
    const nextUsers = directoryWith(updatedUser);
    void syncSharedData({
      users: nextUsers,
      activities: updatedAct,
      participants: updatedPart,
      messages: updatedMsg,
      notifications: updatedNot,
      reports: reportsRef.current,
    }).then(() => setDataError(null))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Could not save to Supabase';
        setDataError(message);
      });
  };

  // 2. Action Handlers for simulation
  const handleSwitchActorUser = (userId: string) => {
    setActiveActorId(userId);
    const selectedUser = usersRef.current.find(u => u.id === userId);
    if (selectedUser) {
      // If we are resetting Jenny Wilson to complete onboarding
      if (userId === 'user_1' && !currentUser?.acceptedGuidelines) {
        setAppRoute('auth');
      } else {
        setAppRoute('main');
      }
      setCurrentUser(selectedUser);
      saveStateToStorage(activities, participants, messages, notifications, selectedUser, 'main', userId);
    }
  };

  const handleCompletePhoneAuth = (phone: string) => {
    setAppRoute('onboarding');
    // Prepare initial signup draft
    if (currentUser) {
      const draft = { ...currentUser, phoneNumber: phone, acceptedGuidelines: false };
      setCurrentUser(draft);
      saveStateToStorage(activities, participants, messages, notifications, draft, 'onboarding', activeActorId);
    }
  };

  const handleCompleteOnboarding = (completedUser: UserType) => {
    setCurrentUser(completedUser);
    setAppRoute('main');
    setActiveTab('discover');
    // Ensure she is added as a default going member of kits yoga to witness chats
    const defaultPart: Participant = {
      activityId: 'act_2',
      userId: completedUser.id,
      status: 'approved',
      role: 'guest',
      requestedAt: new Date().toISOString()
    };
    const nextParts = [...participants, defaultPart];
    setParticipants(nextParts);

    // Add corresponding welcome system chat message
    const welcomeMsg: Message = {
      id: `msg_onboard_${Date.now()}`,
      chatId: 'act_2',
      senderId: 'system',
      senderName: 'System',
      senderPhoto: '',
      text: `${completedUser.name} has joined the sunset yoga group spontaneously!`,
      timestamp: '6:15 PM',
      isSystem: true
    };
    const nextMsgs = [...messages, welcomeMsg];
    setMessages(nextMsgs);

    saveStateToStorage(activities, nextParts, nextMsgs, notifications, completedUser, 'main', activeActorId);
  };

  const handleJoinRequested = (activityId: string, joinNote: string) => {
    if (!currentUser) return;

    // Check if duplicate requests exist
    const exists = participants.some(p => p.activityId === activityId && p.userId === currentUser.id);
    if (exists) return;

    // Is it soloMode? Auto approve!
    const targetAct = activities.find(a => a.id === activityId);
    const resolvedStatus = targetAct?.soloMode ? 'approved' : 'pending';

    const newParticipant: Participant = {
      activityId,
      userId: currentUser.id,
      status: resolvedStatus,
      role: 'guest',
      requestedAt: new Date().toISOString(),
      joinMessage: joinNote
    };

    const nextParts = [...participants, newParticipant];
    setParticipants(nextParts);

    // Notify host if manual
    let nextNot = [...notifications];
    if (resolvedStatus === 'pending' && targetAct) {
      const hostNotify: AppNotification = {
        id: `not_req_${Date.now()}`,
        userId: targetAct.hostId,
        title: 'New Join Request ⚡',
        description: `${currentUser.name} wants to join your "${targetAct.title}". Approve inside Hosted Activities!`,
        type: 'join_request',
        activityId,
        relatedUserId: currentUser.id,
        createdAt: new Date().toISOString(),
        read: false
      };
      nextNot.push(hostNotify);
    }

    // Auto add system chat lines
    let nextMsgs = [...messages];
    if (resolvedStatus === 'approved') {
      const autoSysMsg: Message = {
        id: `msg_solosys_${Date.now()}`,
        chatId: activityId,
        senderId: 'system',
        senderName: 'System',
        senderPhoto: '',
        text: `${currentUser.name} joined via Solo-Mode auto approval.`,
        timestamp: 'Just Now',
        isSystem: true
      };
      nextMsgs.push(autoSysMsg);
    } else {
      const waitSysMsg: Message = {
        id: `msg_sys_pend_${Date.now()}`,
        chatId: activityId,
        senderId: 'system',
        senderName: 'System',
        senderPhoto: '',
        text: `${currentUser.name} requested to join under host review.`,
        timestamp: 'Just Now',
        isSystem: true
      };
      nextMsgs.push(waitSysMsg);
    }

    setNotifications(nextNot);
    setMessages(nextMsgs);
    
    saveStateToStorage(activities, nextParts, nextMsgs, nextNot, currentUser, 'main', activeActorId);
  };

  // Host Action Tools (Section 3 Approvals)
  const handleApproveParticipant = (activityId: string, guestUserId: string) => {
    const updated = participants.map((p) => {
      if (p.activityId === activityId && p.userId === guestUserId) {
        return { ...p, status: 'approved' as const };
      }
      return p;
    });

    // Send in-app accepted notification
    const guestUser = usersRef.current.find(u => u.id === guestUserId);
    const act = activities.find(a => a.id === activityId);
    let nextNot = [...notifications];
    if (guestUser && act) {
      const acceptNotify: AppNotification = {
        id: `not_acc_${Date.now()}`,
        userId: guestUserId,
        title: 'Join Request Approved! 🎉',
        description: `Host approved your access onto "${act.title}". Group chat is now unlocked!`,
        type: 'request_approved',
        activityId,
        createdAt: new Date().toISOString(),
        read: false
      };
      nextNot.push(acceptNotify);
    }

    // Live chat system lines update
    const guestName = guestUser ? guestUser.name : 'A Guest';
    const acceptMsg: Message = {
      id: `msg_host_approve_${Date.now()}`,
      chatId: activityId,
      senderId: 'system',
      senderName: 'System',
      senderPhoto: '',
      text: `${guestName} was accepted into this spontaneous group by host. Welcome!`,
      timestamp: 'Just Now',
      isSystem: true
    };
    const nextMsgs = [...messages, acceptMsg];

    setParticipants(updated);
    setNotifications(nextNot);
    setMessages(nextMsgs);
    saveStateToStorage(activities, updated, nextMsgs, nextNot, currentUser, 'main', activeActorId);
  };

  const handleDeclineParticipant = (activityId: string, guestUserId: string) => {
    const updated = participants.map((p) => {
      if (p.activityId === activityId && p.userId === guestUserId) {
        return { ...p, status: 'declined' as const };
      }
      return p;
    });
    setParticipants(updated);
    saveStateToStorage(activities, updated, messages, notifications, currentUser, 'main', activeActorId);
  };

  const handleKickParticipant = (activityId: string, guestUserId: string) => {
    const updated = participants.filter((p) => !(p.activityId === activityId && p.userId === guestUserId));
    setParticipants(updated);
    saveStateToStorage(activities, updated, messages, notifications, currentUser, 'main', activeActorId);
  };

  const handleEndActivityEarly = (activityId: string) => {
    const updatedActs = activities.filter(a => a.id !== activityId);
    const updatedParts = participants.filter(p => p.activityId !== activityId);
    setActivities(updatedActs);
    setParticipants(updatedParts);
    saveStateToStorage(updatedActs, updatedParts, messages, notifications, currentUser, 'main', activeActorId);
  };

  const handleSendMessage = (chatId: string, text: string, attachedPhoto?: string) => {
    if (!currentUser) return;
    
    // format system timestamp
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const newMsg: Message = {
      id: `msg_new_${Date.now()}`,
      chatId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderPhoto: currentUser.photo,
      text,
      photo: attachedPhoto,
      timestamp: `${hours}:${minutes} ${ampm}`
    };

    const nextMsgs = [...messages, newMsg];
    setMessages(nextMsgs);
    saveStateToStorage(activities, participants, nextMsgs, notifications, currentUser, 'main', activeActorId);
  };

  // Host new spontaneous event matching monthly limits logic
  const handleHostNewActivity = (draft: Partial<Activity>) => {
    if (!currentUser) return;

    const newId = `act_hosted_${Date.now()}`;
    const completeAct: Activity = {
      id: newId,
      hostId: currentUser.id,
      title: draft.title || 'Spontaneous meetup',
      type: draft.type || 'coffee',
      vibeTags: draft.vibeTags || [],
      note: draft.note || '',
      time: draft.time || 'Today • 6:30 PM',
      timeHoursFromNow: draft.timeHoursFromNow || 3,
      locationName: draft.locationName || 'Vancouver',
      lat: draft.lat || 50,
      lng: draft.lng || 50,
      maxAttendees: draft.maxAttendees || 6,
      soloMode: draft.soloMode || false,
      isPremium: draft.isPremium || false,
      photo: draft.photo || 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=600&q=80',
      createdAt: new Date().toISOString(),
      viewersCount: Math.floor(Math.random() * 20),
      viewers: []
    };

    // Add host as first approved participant
    const hostParticipant: Participant = {
      activityId: newId,
      userId: currentUser.id,
      status: 'approved',
      role: 'host',
      requestedAt: new Date().toISOString()
    };

    const nextActs = [completeAct, ...activities];
    const nextParts = [...participants, hostParticipant];

    setActivities(nextActs);
    setParticipants(nextParts);
    setShowCreationWizard(false);
    setActiveTab('my-activities');

    // Update user hosting statistics
    const updatedUser = { ...currentUser, hostedCount: currentUser.hostedCount + 1 };
    setCurrentUser(updatedUser);

    saveStateToStorage(nextActs, nextParts, messages, notifications, updatedUser, 'main', activeActorId);
  };

  const handleTogglePremiumGlobal = () => {
    if (!currentUser) return;
    const nextPremiumState = !currentUser.isPremium;
    const updatedUser = { ...currentUser, isPremium: nextPremiumState };
    setCurrentUser(updatedUser);
    saveStateToStorage(activities, participants, messages, notifications, updatedUser, 'main', activeActorId);
  };

  const handleResetSandboxOnboarding = () => {
    // Reset Jenny's profile onboarding progress to try again!
    const resettedJenny = {
      ...MOCK_USERS[0],
      acceptedGuidelines: false
    };
    setCurrentUser(resettedJenny);
    setActiveActorId('user_1');
    setAppRoute('auth');
    saveStateToStorage(activities, participants, messages, notifications, resettedJenny, 'auth', 'user_1');
  };

  const handleResetAppAll = () => {
    localStorage.removeItem('tagalong_app_route');
    localStorage.removeItem('tagalong_actor_id');
    const defaultUser = { ...MOCK_USERS[0], acceptedGuidelines: false };
    const resetDirectory = MOCK_USERS.map(user => user.id === defaultUser.id ? defaultUser : user);
    usersRef.current = resetDirectory;
    reportsRef.current = [];
    setUsers(resetDirectory);
    setReports([]);
    setCurrentUser(defaultUser);
    setActiveActorId('user_1');
    setActivities(MOCK_ACTIVITIES);
    setParticipants(MOCK_PARTICIPANTS);
    setMessages(MOCK_MESSAGES);
    setNotifications(MOCK_NOTIFICATIONS);
    setAppRoute('auth');
    saveStateToStorage(MOCK_ACTIVITIES, MOCK_PARTICIPANTS, MOCK_MESSAGES, MOCK_NOTIFICATIONS, defaultUser, 'auth', 'user_1');
  };

  const handleReportCreated = (reportData: Partial<Report>) => {
    if (!currentUser) return;
    const brandReport: Report = {
      id: `rep_${Date.now()}`,
      reportedUserId: reportData.reportedUserId || 'unknown',
      reporterUserId: currentUser.id,
      reason: reportData.reason || 'General',
      details: reportData.details || '',
      createdAt: new Date().toISOString()
    };
    const nextReports = [...reportsRef.current, brandReport];
    reportsRef.current = nextReports;
    setReports(nextReports);
    if (currentUser) {
      void syncSharedData({
        users: usersRef.current,
        activities,
        participants,
        messages,
        notifications,
        reports: nextReports,
      }).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Could not save report';
        setDataError(message);
      });
    }
  };

  const handleBlockListReset = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, blockedUsers: [] };
    setCurrentUser(updatedUser);
    saveStateToStorage(activities, participants, messages, notifications, updatedUser, 'main', activeActorId);
  };

  const handleDeleteAccount = () => {
    handleResetAppAll();
  };

  // Resolve counts for current actor details
  const currentActorHostedThisMonth = activities.filter(a => a.hostId === activeActorId).length;

  return (
    <PhoneFrame
      activeUserId={activeActorId}
      actorName={currentUser?.name}
      actorPhoto={currentUser?.photo}
      onSwitchUser={handleSwitchActorUser}
      isPremium={currentUser?.isPremium || false}
      onTogglePremium={handleTogglePremiumGlobal}
      onResetApp={handleResetAppAll}
      currentScreen={appRoute === 'main' ? activeTab : appRoute}
    >
      {!sessionReady ? (
        <div className="flex-1 flex items-center justify-center text-xs font-semibold text-stone-400">
          Loading your profile…
        </div>
      ) : null}
      {sessionReady && dataError && (
        <div className="absolute top-2 left-3 right-3 z-[60] rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 text-[10px] font-semibold text-amber-900 leading-snug">
          {dataError}
        </div>
      )}

      {sessionReady && appRoute === 'auth' && (
        <SplashView onCompleteAuth={handleCompletePhoneAuth} />
      )}

      {/* 2. REGISTRATION/WELCOME ONBOARDING */}
      {sessionReady && appRoute === 'onboarding' && (
        <OnboardingFlow 
          initialPhoneNumber={currentUser?.phoneNumber || '+1 (604) 555-0199'}
          onSetUserAndComplete={handleCompleteOnboarding}
        />
      )}

      {/* 3. CORE ADOPTED WEB SHELL SYSTEM */}
      {sessionReady && appRoute === 'main' && currentUser && (
        
        <div id="main-client-shell" className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Active direct full view overlay: Group Chat Room */}
          {currentChatRoomId ? (
            <ChatRoomView 
              activityId={currentChatRoomId}
              activities={activities}
              users={users}
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onBack={() => setCurrentChatRoomId(null)}
            />
          ) : currentDetailsActivity ? (
            <ActivityDetailsView
              activity={currentDetailsActivity}
              currentUser={currentUser}
              users={users}
              participants={participants}
              onJoinRequest={(actId, note) => {
                handleJoinRequested(actId, note);
              }}
              onOpenChat={(actId) => {
                setCurrentDetailsActivity(null);
                setCurrentChatRoomId(actId);
              }}
              onBack={() => setCurrentDetailsActivity(null)}
            />
          ) : showCreationWizard ? (
            /* Creation Active Wizard overlay */
            <ActivityCreationWizard 
              currentUser={currentUser}
              onActivityCreated={handleHostNewActivity}
              onCancel={() => setShowCreationWizard(false)}
              onOpenPaywall={() => setShowPaywallGlobal(true)}
              hostedCountThisMonth={currentActorHostedThisMonth}
            />
          ) : (
            
            /* GENERAL NAVIGATION TAB CHANGER VIEWPORT */
            <div className="flex-1 flex flex-col overflow-hidden relative">
              
              {activeTab === 'discover' && (
                <DiscoverView 
                  activities={activities}
                  users={users}
                  participants={participants}
                  currentUser={currentUser}
                  onJoinRequest={handleJoinRequested}
                  onSelectActivityDetails={(act) => {
                    setCurrentDetailsActivity(act);
                  }}
                  onCreateActivityClick={() => setShowCreationWizard(true)}
                />
              )}

              {activeTab === 'my-activities' && (
                <MyActivitiesView 
                  currentUser={currentUser}
                  activities={activities}
                  users={users}
                  participants={participants}
                  onApproveParticipant={handleApproveParticipant}
                  onDeclineParticipant={handleDeclineParticipant}
                  onEndActivityEarly={handleEndActivityEarly}
                  onKickParticipant={handleKickParticipant}
                  onRepeatActivity={(pastAct) => {
                    // Repeat template powerup
                    if (currentUser.isPremium) {
                      handleHostNewActivity(pastAct);
                    } else {
                      setShowPaywallGlobal(true);
                    }
                  }}
                  onOpenChat={(chatId) => setCurrentChatRoomId(chatId)}
                />
              )}

              {activeTab === 'profile' && (
                <ProfileView 
                  currentUser={currentUser}
                  onTogglePremium={handleTogglePremiumGlobal}
                  onResetOnboarding={handleResetSandboxOnboarding}
                  onReportSubmit={handleReportCreated}
                  onBlockListReset={handleBlockListReset}
                  onDeleteAccount={handleDeleteAccount}
                  showPaywallSheet={showPaywallGlobal}
                  onSetShowPaywall={setShowPaywallGlobal}
                />
              )}

              {/* FLOATING CAPSULE BOTTOM NAVIGATION DOCK (Tinder/Hinge/Airbnb clean aesthetic) */}
              <div className="absolute bottom-3 left-5 right-5 h-13 bg-white/95 backdrop-blur-xl border border-stone-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-full flex items-center justify-around px-2 z-40">
                
                {/* Discover button */}
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`flex items-center gap-1.5 transition-all duration-200 py-1.5 px-3.5 rounded-full text-xs font-bold ${
                    activeTab === 'discover'
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'text-stone-500 hover:text-[#111827]'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore</span>
                </button>

                {/* My Activities button */}
                <button
                  onClick={() => setActiveTab('my-activities')}
                  className={`flex items-center gap-1.5 transition-all duration-200 py-1.5 px-3.5 rounded-full text-xs font-bold relative ${
                    activeTab === 'my-activities'
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'text-stone-500 hover:text-[#111827]'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Activities</span>
                  
                  {/* Notification badge indicator */}
                  {activeTab !== 'my-activities' && activities.some(a => a.hostId === currentUser.id && participants.some(p => p.activityId === a.id && p.status === 'pending')) && (
                    <span className="w-2 h-2 bg-[#FF4B63] rounded-full animate-pulse ring-2 ring-white"></span>
                  )}
                </button>

                {/* Profile button */}
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-1.5 transition-all duration-200 py-1.5 px-3.5 rounded-full text-xs font-bold ${
                    activeTab === 'profile'
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'text-stone-500 hover:text-[#111827]'
                  }`}
                >
                  <img
                    src={currentUser.photo}
                    alt=""
                    className="w-4 h-4 rounded-full object-cover ring-1 ring-black/10"
                  />
                  <span>Profile</span>
                </button>

              </div>

            </div>
          )}

        </div>
      )}

      {/* Global paywall backing handler overlay */}
      {showPaywallGlobal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-xs rounded-3xl bg-white p-6 space-y-4 shadow-2xl relative text-left">
            <button 
              onClick={() => setShowPaywallGlobal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-400 hover:text-stone-800"
            >
              ✕
            </button>
            <div className="text-center space-y-1 pt-1">
              <div className="w-12 h-12 rounded-full bg-[#FFF0F2] text-[#FF4B63] flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
                ✦
              </div>
              <h3 className="text-lg font-extrabold text-[#111827] tracking-tight">Tagalong Plus</h3>
              <p className="text-[11px] text-stone-500 font-semibold">Unlimited Spontaneous Hosting</p>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl space-y-2 border border-stone-200/60 text-xs text-stone-600 leading-relaxed font-medium">
              <p>📍 Free explorers host up to 3 spontaneous meetups monthly.</p>
              <p>⚡ Plus members host limitless seawall walks, coffees, and social runs.</p>
            </div>
            <button
              onClick={() => {
                handleTogglePremiumGlobal();
                setShowPaywallGlobal(false);
              }}
              className="w-full py-3.5 bg-[#FF4B63] hover:bg-[#e03a51] text-white font-bold text-xs rounded-full uppercase tracking-wider text-center shadow-md transition active:scale-98"
            >
              Upgrade Membership
            </button>
          </div>
        </div>
      )}

    </PhoneFrame>
  );
}
