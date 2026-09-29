import React, { useState } from 'react';
import { Sparkles, Shield, UserX, Trash2, X, RefreshCw, Star, ShieldCheck, Instagram, Award } from 'lucide-react';
import { User, Report } from '../types';

interface ProfileViewProps {
  currentUser: User;
  onTogglePremium: () => void;
  onResetOnboarding: () => void;
  onReportSubmit: (report: Partial<Report>) => void;
  onBlockListReset: () => void;
  onDeleteAccount: () => void;
  showPaywallSheet: boolean;
  onSetShowPaywall: (show: boolean) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onTogglePremium,
  onResetOnboarding,
  onReportSubmit,
  onBlockListReset,
  onDeleteAccount,
}) => {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('Commercial solicitation');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleReportAction = () => {
    if (!reportDetails.trim()) return;
    onReportSubmit({
      reportedUserId: 'user_host_1',
      reason: reportReason,
      details: reportDetails,
    });
    setReportSuccess(true);
    setReportDetails('');
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportDialog(false);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F7F5] relative overflow-y-auto scrollbar-none font-sans text-[#111827] select-none text-left p-5 space-y-4 pb-24">
      
      {/* Top Header */}
      <div>
        <h1 className="text-xl font-extrabold text-[#111827] tracking-tight">
          My Account
        </h1>
        <p className="text-[12px] text-stone-500 font-medium">
          Profile, trust score and member status
        </p>
      </div>

      {/* User Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/70 shadow-xs space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentUser.photo}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#FF4B63]"
            />
            {currentUser.isPremium && (
              <span className="absolute -bottom-1 -right-1 bg-[#111827] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                PLUS
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-[#111827] leading-tight">
                {currentUser.name}
              </h3>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-stone-400 mt-0.5">@{currentUser.username}</p>
            <p className="text-xs text-stone-600 font-medium mt-1 line-clamp-1">
              {currentUser.bio}
            </p>
          </div>
        </div>

        {/* 3-Column Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center">
          <div className="p-2.5 bg-stone-50 rounded-2xl">
            <span className="text-sm font-extrabold text-[#111827] block">{currentUser.hostedCount}</span>
            <span className="text-[10px] font-semibold text-stone-400 uppercase">Hosted</span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-2xl">
            <span className="text-sm font-extrabold text-[#111827] block">{currentUser.joinedCount + 3}</span>
            <span className="text-[10px] font-semibold text-stone-400 uppercase">Joined</span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-2xl">
            <span className="text-sm font-extrabold text-[#111827] block">★ {currentUser.rating}</span>
            <span className="text-[10px] font-semibold text-stone-400 uppercase">Rating</span>
          </div>
        </div>
      </div>

      {/* Plus Membership Card */}
      <div className="bg-[#111827] rounded-3xl p-4 text-white space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FFF0F2] text-[#FF4B63] flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <div>
              <h4 className="text-sm font-bold leading-tight">Tagalong Plus</h4>
              <span className="text-[11px] text-stone-400">Unlimited Spontaneous Hosting</span>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
            currentUser.isPremium ? 'bg-[#FF4B63] text-white' : 'bg-white/20 text-white'
          }`}>
            {currentUser.isPremium ? 'Active' : 'Free Tier'}
          </span>
        </div>

        <button
          onClick={onTogglePremium}
          className="w-full py-2.5 bg-white hover:bg-stone-100 text-[#111827] rounded-full text-xs font-bold transition shadow-xs"
        >
          {currentUser.isPremium ? 'Revert to Free Tier' : 'Upgrade to Plus (Instant)'}
        </button>
      </div>

      {/* Trust & Safety Options */}
      <div className="bg-white rounded-3xl p-4 border border-stone-200/70 shadow-xs space-y-2">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block px-1">
          Trust & Safety Center
        </span>

        <button
          onClick={() => setShowReportDialog(true)}
          className="w-full flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-2xl transition text-xs font-bold text-stone-700"
        >
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-stone-400" />
            <span>Community Report Tool</span>
          </div>
          <span className="text-stone-300">›</span>
        </button>

        <button
          onClick={onBlockListReset}
          className="w-full flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-2xl transition text-xs font-bold text-stone-700"
        >
          <div className="flex items-center gap-2.5">
            <UserX className="w-4 h-4 text-stone-400" />
            <span>Reset Blocked Users List</span>
          </div>
          <span className="text-stone-300">›</span>
        </button>

        <button
          onClick={onResetOnboarding}
          className="w-full flex items-center justify-between p-2.5 hover:bg-stone-50 rounded-2xl transition text-xs font-bold text-stone-700"
        >
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-stone-400" />
            <span>Re-run Onboarding Setup</span>
          </div>
          <span className="text-stone-300">›</span>
        </button>
      </div>

      {/* Report Modal */}
      {showReportDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-5">
          <div className="w-full max-w-xs bg-white rounded-3xl p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#111827]">Submit Trust Report</h3>
              <button onClick={() => setShowReportDialog(false)} className="text-stone-400">✕</button>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center text-xs font-bold text-emerald-700">
                ✓ Report logged securely with Tagalong Moderation.
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full h-10 px-3 bg-stone-50 rounded-xl text-xs font-medium text-[#111827] border border-stone-200"
                >
                  <option>Commercial solicitation</option>
                  <option>Inappropriate messaging</option>
                  <option>Did not show up</option>
                  <option>Other concerns</option>
                </select>

                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide incident details..."
                  className="w-full h-20 p-3 bg-stone-50 rounded-xl text-xs text-[#111827] border border-stone-200 resize-none focus:outline-none"
                />

                <button
                  onClick={handleReportAction}
                  className="w-full py-3 bg-[#111827] hover:bg-black text-white rounded-full text-xs font-bold transition"
                >
                  Submit Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
