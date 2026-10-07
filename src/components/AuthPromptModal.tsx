import React, { useEffect } from 'react';
import {
  Lock,
  UserPlus,
  LogIn,
  X,
  FileDown,
  MessageSquare,
  Heart,
  Send,
  Sparkles,
  BookOpen,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export type AuthRequiredAction =
  | 'post'
  | 'download'
  | 'comment'
  | 'like'
  | 'message'
  | 'follow'
  | 'poll'
  | 'general';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: AuthRequiredAction;
  customMessage?: string;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  action,
  customMessage,
  onOpenRegister,
  onOpenLogin
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Contextual configs per action
  const getActionDetails = () => {
    switch (action) {
      case 'post':
        return {
          title: 'Posting Requires an Account',
          swahiliTitle: 'Kuchapisha Kunahitaji Akaunti',
          description: customMessage || 'Please create an account or sign in to continue.',
          swahiliDesc: 'Uko kwenye hali ya Mgeni (Browsing Only). Ili kuchapisha maswali au notisi kwa wanafunzi wenzako, tafadhali jiunge au ingia kwenye akaunti yako.',
          icon: <Send className="w-7 h-7 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />,
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800'
        };
      case 'download':
        return {
          title: 'Downloads Require Login',
          swahiliTitle: 'Kupakua Kunahitaji Akaunti',
          description: customMessage || 'Create an account or sign in to download this material.',
          swahiliDesc: 'Fungua akaunti au ingia ili kupakua nyenzo hii ya masomo (PDFs, vitabu vya TIE, au past papers za NECTA). Ni bure kwa wanafunzi wote wa Tanzania!',
          icon: <FileDown className="w-7 h-7 text-blue-600 dark:text-blue-400 stroke-[2.2]" />,
          iconBg: 'bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-800'
        };
      case 'comment':
        return {
          title: 'Commenting Requires an Account',
          swahiliTitle: 'Kutoa Maoni Kunahitaji Akaunti',
          description: customMessage || 'Please create an account or sign in to continue.',
          swahiliDesc: 'Ili kutoa maoni, kujadili maswali, au kuchangia kwenye majadiliano ya kitaaluma, tafadhali fungua akaunti au ingia.',
          icon: <MessageSquare className="w-7 h-7 text-teal-600 dark:text-teal-400 stroke-[2.2]" />,
          iconBg: 'bg-teal-50 dark:bg-teal-950/70 border-teal-200 dark:border-teal-800'
        };
      case 'like':
        return {
          title: 'Reactions Require an Account',
          swahiliTitle: 'Kupenda (Like) Kunahitaji Akaunti',
          description: customMessage || 'Please create an account or sign in to continue.',
          swahiliDesc: 'Ili kuthamini au kumpa mwanafunzi alama (EduPoints) kwa mchango wake, tafadhali fungua akaunti au ingia.',
          icon: <Heart className="w-7 h-7 text-rose-600 dark:text-rose-400 stroke-[2.2]" />,
          iconBg: 'bg-rose-50 dark:bg-rose-950/70 border-rose-200 dark:border-rose-800'
        };
      case 'message':
        return {
          title: 'Messaging Requires an Account',
          swahiliTitle: 'Kutuma Ujumbe Kunahitaji Akaunti',
          description: customMessage || 'Please create an account or sign in to continue.',
          swahiliDesc: 'Ujumbe na soga za shule zimefungwa kwa ajili ya usalama wa wanafunzi. Fungua akaunti au ingia ili uweze kutuma ujumbe.',
          icon: <MessageSquare className="w-7 h-7 text-indigo-600 dark:text-indigo-400 stroke-[2.2]" />,
          iconBg: 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800'
        };
      case 'follow':
        return {
          title: 'Following Members Requires an Account',
          swahiliTitle: 'Kufuata Wanafunzi Kunahitaji Akaunti',
          description: customMessage || 'Please create an account or sign in to continue.',
          swahiliDesc: 'Ili kufuata walimu, vinara wa masomo, au shule, tafadhali fungua akaunti au ingia.',
          icon: <Sparkles className="w-7 h-7 text-amber-600 dark:text-amber-400 stroke-[2.2]" />,
          iconBg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800'
        };
      default:
        return {
          title: 'Authentication Required',
          swahiliTitle: 'Akaunti Inahitajika',
          description: customMessage || 'Please create an account or sign in to continue.',
          swahiliDesc: 'Uko kwenye hali ya Mgeni (Guest Mode / Browsing Only). Kitendo hiki kinahitaji uthibitisho wa akaunti.',
          icon: <Lock className="w-7 h-7 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />,
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800'
        };
    }
  };

  const details = getActionDetails();

  return (
    <div
      id="auth-required-prompt-overlay"
      className="fixed inset-0 z-50 bg-black/65 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="auth-required-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-emerald-100 dark:border-slate-800 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-150"
      >
        {/* Top colorful accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Funga"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7 text-center">
          {/* Action Icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xs ${details.iconBg}`}>
              {details.icon}
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-[11px] font-semibold mb-2.5 border border-amber-200 dark:border-amber-800/60">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>GUEST MODE • BROWSING ONLY</span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-heading font-black text-gray-900 dark:text-white tracking-tight">
            {details.title}
          </h3>
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
            {details.swahiliTitle}
          </p>

          {/* Description */}
          <div className="mt-3.5 bg-gray-50/80 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-gray-100 dark:border-slate-800 text-left">
            <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-slate-100 leading-relaxed">
              "{details.description}"
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
              {details.swahiliDesc}
            </p>
          </div>

          {/* Value Prop Highlights */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-gray-600 dark:text-slate-300 text-left">
            <div className="flex items-center gap-1.5 bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>100% Bure kwa Wanafunzi</span>
            </div>
            <div className="flex items-center gap-1.5 bg-teal-50/50 dark:bg-teal-950/30 p-2 rounded-xl">
              <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>Vitabu & Mitihani ya NECTA</span>
            </div>
          </div>

          {/* Action Buttons: Create Account & Sign In */}
          <div className="mt-6 space-y-2.5">
            <button
              id="auth-prompt-create-account-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Account (Fungua Akaunti)</span>
            </button>

            <button
              id="auth-prompt-sign-in-btn"
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-[0.98] text-gray-800 dark:text-slate-100 font-semibold rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-gray-200/80 dark:border-slate-700"
            >
              <LogIn className="w-4 h-4 stroke-[2.2]" />
              <span>Sign In (Ingia kwenye Akaunti)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 font-medium py-1 transition-colors cursor-pointer"
            >
              Endelea kama Mgeni (Continue Browsing)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
