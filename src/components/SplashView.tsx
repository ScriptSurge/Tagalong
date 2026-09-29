import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ShieldCheck, Sparkles, Phone, Lock } from 'lucide-react';

interface SplashViewProps {
  onCompleteAuth: (phoneNumber: string) => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onCompleteAuth }) => {
  const [step, setStep] = useState<'welcome' | 'phone' | 'otp'>('welcome');
  const [phoneNumber, setPhoneNumber] = useState('6045550199');
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4']);
  const [otpError, setOtpError] = useState('');

  const submitPhone = () => {
    setStep('otp');
  };

  const verifyOtp = () => {
    onCompleteAuth('+1 (604) 555-0199');
  };

  const handleKeypad = (key: string) => {
    if (step === 'phone') {
      if (key === '⌫') {
        setPhoneNumber(p => p.slice(0, -1));
      } else if (phoneNumber.length < 10) {
        setPhoneNumber(p => p + key);
      }
    } else if (step === 'otp') {
      if (key === '⌫') {
        setOtpDigits(['', '', '', '']);
      } else {
        const emptyIdx = otpDigits.findIndex(d => d === '');
        if (emptyIdx !== -1) {
          const next = [...otpDigits];
          next[emptyIdx] = key;
          setOtpDigits(next);
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F7F5] relative overflow-hidden font-sans text-[#111827] select-none p-5">
      
      {step === 'welcome' && (
        <div className="flex-1 flex flex-col justify-between py-2 text-left">
          
          {/* Top Headline Section */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF4B63] animate-pulse"></span>
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Vancouver In-Person Meets
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight leading-[1.05]">
              Real meetups. <br />
              <span className="text-[#FF4B63]">Right now.</span>
            </h1>
          </div>

          {/* Hero Image Card */}
          <div className="h-64 w-full rounded-3xl overflow-hidden relative shadow-md bg-stone-900 border border-stone-200/60 my-4">
            <img
              src="/src/assets/images/discover_sunset_seawall_1790709914120.jpg"
              alt="Vancouver Sunset Meet"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4B63] block">
                  Next 0–48 Hours
                </span>
                <p className="text-sm font-bold">
                  Sunset Seawall Strolls & Coffees
                </p>
              </div>

              <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-bold">
                12 active
              </span>
            </div>
          </div>

          {/* Bottom Action Section */}
          <div className="space-y-3 pt-2">
            <p className="text-xs text-stone-500 font-medium leading-relaxed">
              Skip endless message queues. Join authentic in-person activities happening right now in your neighborhood.
            </p>

            <button
              onClick={() => setStep('phone')}
              className="w-full py-4 bg-[#FF4B63] hover:bg-[#e03a51] text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2 shadow-md transition active:scale-98"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => onCompleteAuth('+1 (604) 555-0199')}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-full transition text-center"
            >
              ⚡ Instant 1-Tap Demo Login
            </button>
          </div>

        </div>
      )}

      {step === 'phone' && (
        <div className="flex-1 flex flex-col justify-between py-2 text-left">
          
          <div className="space-y-4">
            <button
              onClick={() => setStep('welcome')}
              className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#111827] shadow-xs"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                SMS Verification
              </span>
              <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
                Enter your mobile
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                We'll text a verification code to keep meetups high-trust & safe.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 flex items-center gap-3 shadow-xs">
              <span className="text-sm font-bold text-stone-400">🇨🇦 +1</span>
              <span className="text-base font-bold text-[#111827]">
                {phoneNumber ? `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,6)}-${phoneNumber.slice(6,10)}` : '(604) 000-0000'}
              </span>
            </div>
          </div>

          {/* Keypad */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
                <button
                  key={i}
                  onClick={() => k && handleKeypad(k)}
                  className={`h-12 rounded-2xl text-base font-bold transition flex items-center justify-center ${
                    k ? 'bg-white hover:bg-stone-50 border border-stone-200/80 text-[#111827] shadow-2xs active:bg-stone-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <button
              onClick={submitPhone}
              className="w-full py-4 bg-[#111827] hover:bg-black text-white font-bold text-xs uppercase tracking-wider rounded-full transition shadow-md"
            >
              Continue
            </button>
          </div>

        </div>
      )}

      {step === 'otp' && (
        <div className="flex-1 flex flex-col justify-between py-2 text-left">
          
          <div className="space-y-4">
            <button
              onClick={() => setStep('phone')}
              className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#111827] shadow-xs"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Verify Code
              </span>
              <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
                Enter 4-digit code
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Sent to +1 (604) 555-0199 · Sandbox code is <strong className="text-[#111827]">1234</strong>
              </p>
            </div>

            <div className="grid grid-cols-4 gap-3 pt-2">
              {otpDigits.map((digit, idx) => (
                <div
                  key={idx}
                  className="h-14 rounded-2xl bg-white border-2 border-stone-200 flex items-center justify-center text-xl font-bold shadow-xs text-[#111827]"
                >
                  {digit}
                </div>
              ))}
            </div>
          </div>

          {/* Keypad */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((k, i) => (
                <button
                  key={i}
                  onClick={() => k && handleKeypad(k)}
                  className={`h-12 rounded-2xl text-base font-bold transition flex items-center justify-center ${
                    k ? 'bg-white hover:bg-stone-50 border border-stone-200/80 text-[#111827] shadow-2xs' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            <button
              onClick={verifyOtp}
              className="w-full py-4 bg-[#FF4B63] hover:bg-[#e03a51] text-white font-bold text-xs uppercase tracking-wider rounded-full transition shadow-md"
            >
              Verify & Enter Tagalong
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
