import React, { useState } from 'react';
import { MapPin, User, Camera, Instagram, Linkedin, Shield, Check, ChevronLeft, Sparkles, ArrowRight } from 'lucide-react';
import { User as UserType } from '../types';

interface OnboardingFlowProps {
  initialPhoneNumber: string;
  onSetUserAndComplete: (user: UserType) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialPhoneNumber,
  onSetUserAndComplete
}) => {
  const [step, setStep] = useState(1);
  
  const [firstName, setFirstName] = useState('Jenny');
  const [lastName, setLastName] = useState('Wilson');
  const [ageRange, setAgeRange] = useState('20s-30s');
  const [gender, setGender] = useState('Female');
  
  const [selectedPhoto, setSelectedPhoto] = useState(
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80'
  );
  
  const [bio, setBio] = useState('Coffee lover & nature enthusiast. Just moved to Vancouver. Up for sunset walks & seawall cycling!');
  const [instagram, setInstagram] = useState('jenny_wilson');
  const [selectedCity, setSelectedCity] = useState('Vancouver');
  const [acceptedGuidelines, setAcceptedGuidelines] = useState(true);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    const newUser: UserType = {
      id: 'user_1',
      name: `${firstName} ${lastName}`.trim(),
      username: `${firstName.toLowerCase()}_${lastName.toLowerCase().slice(0, 2)}`,
      ageRange,
      gender,
      photo: selectedPhoto,
      bio,
      instagram,
      linkedIn: '',
      city: selectedCity,
      isPremium: false,
      canHost: true,
      rating: 5.0,
      hostedCount: 0,
      joinedCount: 1,
      currentStreak: 1,
      blockedUsers: [],
      acceptedGuidelines: true,
      phoneNumber: initialPhoneNumber || '+1 (604) 555-0199'
    };
    onSetUserAndComplete(newUser);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F7F5] relative overflow-y-auto scrollbar-none font-sans text-[#111827] select-none p-5 justify-between text-left">
      
      {/* Top Header Row with Steps Indicator */}
      <div>
        <div className="flex items-center justify-between pb-3">
          {step > 1 && step < 4 ? (
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-[#111827] shadow-xs"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <div className="w-9 h-9"></div>
          )}

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(idx => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step
                    ? 'w-6 bg-[#FF4B63]'
                    : idx < step
                    ? 'w-2 bg-[#111827]'
                    : 'w-2 bg-stone-300'
                }`}
              />
            ))}
          </div>

          <span className="text-[11px] font-semibold text-stone-400">
            Step {step} of 4
          </span>
        </div>

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Profile Setup
              </span>
              <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
                What's your name?
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Used to identify you at meetups and in group coordination chats.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full h-12 px-4 bg-white rounded-2xl text-xs font-bold text-[#111827] border border-stone-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF4B63]/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full h-12 px-4 bg-white rounded-2xl text-xs font-bold text-[#111827] border border-stone-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF4B63]/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  Age Demographic
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['20s-30s', '30s-40s', 'All Ages'].map(age => (
                    <button
                      key={age}
                      onClick={() => setAgeRange(age)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition ${
                        ageRange === age
                          ? 'bg-[#111827] text-white shadow-xs'
                          : 'bg-white text-stone-600 border border-stone-200'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Photo & Bio */}
        {step === 2 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Visual Presence
              </span>
              <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
                Select your avatar
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                High-trust profiles receive 3x faster approvals for spontaneous activities.
              </p>
            </div>

            <div className="flex items-center justify-center py-2">
              <div className="relative">
                <img
                  src={selectedPhoto}
                  alt="Selected Avatar"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-[#FF4B63] shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs">
                  ✓
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              {avatarPresets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedPhoto(preset)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition ${
                    selectedPhoto === preset ? 'border-[#FF4B63] scale-110 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Your Bio Note
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-20 p-3 bg-white rounded-2xl text-xs font-medium text-[#111827] border border-stone-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF4B63]/20 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: High-Trust Guidelines */}
        {step === 3 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Community Trust
              </span>
              <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
                Safety Code & Socials
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Vancouver is built on verified, friendly, low-pressure gatherings.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-2">
              <Instagram className="w-4 h-4 text-stone-400" />
              <span className="text-xs font-bold text-stone-400">@</span>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="instagram_handle"
                className="flex-1 text-xs font-bold text-[#111827] focus:outline-none"
              />
            </div>

            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-2 text-stone-700 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#111827]">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>3 Golden Rules</span>
              </div>
              <ul className="text-[11px] text-stone-500 space-y-1.5 list-disc list-inside leading-relaxed font-medium">
                <li>Strictly casual offline meets (no sales pitches or dates)</li>
                <li>Public places only (parks, seawall, beaches, cafes)</li>
                <li>Be punctual & respect attendee capacity limits</li>
              </ul>

              <button
                onClick={() => setAcceptedGuidelines(!acceptedGuidelines)}
                className="flex items-center gap-2.5 pt-2 cursor-pointer w-full text-left"
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition ${
                  acceptedGuidelines ? 'bg-[#FF4B63] text-white' : 'border border-stone-300 bg-stone-50'
                }`}>
                  {acceptedGuidelines && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-[11px] font-bold text-[#111827]">
                  I agree to keep Tagalong safe & respectful.
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Ready Confirmation */}
        {step === 4 && (
          <div className="text-center space-y-5 py-6">
            <div className="w-20 h-20 rounded-full bg-[#FFF0F2] text-[#FF4B63] flex items-center justify-center mx-auto shadow-md">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Setup Complete
              </span>
              <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
                You're ready to Tagalong
              </h2>
              <p className="text-xs text-stone-500 font-medium max-w-xs mx-auto">
                Spontaneous Vancouver meets are happening all across English Bay, Kitsilano, and Stanley Park.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="pt-4">
        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={step === 3 && !acceptedGuidelines}
            className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition ${
              step === 3 && !acceptedGuidelines
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-[#111827] hover:bg-black text-white active:scale-98'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="w-full py-4 rounded-full bg-[#FF4B63] hover:bg-[#e03a51] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Launch Tagalong Map</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>

    </div>
  );
};
