import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  ScreenShare,
  Hand,
  Users,
  MessageSquare,
  Maximize2,
  Minimize2,
  Share2,
  Sparkles,
  Check,
  Award,
  Radio,
  Volume2,
  Settings,
  MoreVertical,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

export interface WebinarParticipant {
  id: string;
  name: string;
  school: string;
  level: string;
  role: 'host' | 'presenter' | 'student';
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  hasHandRaised: boolean;
  isSpeaking: boolean;
}

interface WebinarVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelName: string;
  schoolName: string;
  currentUser: UserProfile;
  onShareWebinarLink?: (msg: string) => void;
}

export const WebinarVideoModal: React.FC<WebinarVideoModalProps> = ({
  isOpen,
  onClose,
  channelName,
  schoolName,
  currentUser,
  onShareWebinarLink
}) => {
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(142);
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'participants' | 'none'>('chat');
  const [viewMode, setViewMode] = useState<'speaker' | 'grid'>('speaker');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [hasCameraError, setHasCameraError] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Live Webinar in-meeting chat
  const [meetingChatInput, setMeetingChatInput] = useState<string>('');
  const [meetingMessages, setMeetingMessages] = useState<
    Array<{ id: string; sender: string; time: string; text: string; isQuestion?: boolean }>
  >([
    {
      id: 'm1',
      sender: 'Mwl. Joseph Makoye',
      time: '10:02',
      text: 'Karibuni nyote kwenye kipindi hiki cha mtandaoni (Webinar). Mnaweza kuuliza maswali kwenye chat hii.'
    },
    {
      id: 'm2',
      sender: 'Amina Selemani',
      time: '10:04',
      text: 'Mwalimu, swali la pili la NECTA 2023 kuhusu Organic Chemistry linahitaji kueleza mechanism gani?',
      isQuestion: true
    },
    {
      id: 'm3',
      sender: 'Kelvin Komba',
      time: '10:05',
      text: 'Sauti inasikika vizuri sana mwalimu. Skrini pia inaonekana safi.'
    }
  ]);

  // Initial mock participants in this school webinar
  const [participants, setParticipants] = useState<WebinarParticipant[]>([
    {
      id: 'host-1',
      name: 'Mwl. Joseph Makoye',
      school: 'Tabora Boys Secondary School',
      level: 'Mkuu wa Taaluma / Mwalimu',
      role: 'host',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      isMuted: false,
      isVideoOn: true,
      hasHandRaised: false,
      isSpeaking: true
    },
    {
      id: 'p-1',
      name: currentUser.name,
      school: currentUser.schoolName || schoolName,
      level: currentUser.level || 'Kidato cha V - VI',
      role: currentUser.role === 'admin' ? 'presenter' : 'student',
      avatar: currentUser.avatar,
      isMuted: !isAudioOn,
      isVideoOn: isVideoOn,
      hasHandRaised: isHandRaised,
      isSpeaking: false
    },
    {
      id: 'p-2',
      name: 'Amina Selemani',
      school: 'Jangwani Girls Secondary School',
      level: 'Kidato cha VI (PCB)',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isMuted: true,
      isVideoOn: true,
      hasHandRaised: true,
      isSpeaking: false
    },
    {
      id: 'p-3',
      name: 'Baraka John',
      school: 'Ilboru Secondary School',
      level: 'Kidato cha VI (PCM)',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
      isMuted: true,
      isVideoOn: false,
      hasHandRaised: false,
      isSpeaking: false
    },
    {
      id: 'p-4',
      name: 'Dr. Esther Mwita',
      school: 'University of Dar es Salaam (UDSM)',
      level: 'Mkufunzi wa Sayansi',
      role: 'presenter',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      isMuted: false,
      isVideoOn: true,
      hasHandRaised: false,
      isSpeaking: false
    }
  ]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  // Timer counter for webinar recording
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Request actual camera & mic if available
  useEffect(() => {
    if (!isOpen) {
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
        setMediaStream(null);
      }
      return;
    }

    let isMounted = true;
    async function startCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          if (isMounted) {
            setMediaStream(stream);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          }
        } else {
          setHasCameraError(true);
        }
      } catch {
        // In iframe or without camera attached, fallback gracefully
        if (isMounted) {
          setHasCameraError(true);
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isOpen]);

  // Toggle Video Track
  const handleToggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
    setIsVideoOn(prev => !prev);
    setParticipants(prev =>
      prev.map(p => (p.name === currentUser.name ? { ...p, isVideoOn: !isVideoOn } : p))
    );
  };

  // Toggle Audio Track
  const handleToggleAudio = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
    setIsAudioOn(prev => !prev);
    setParticipants(prev =>
      prev.map(p => (p.name === currentUser.name ? { ...p, isMuted: isAudioOn } : p))
    );
  };

  // Toggle Hand Raise
  const handleToggleHand = () => {
    const newState = !isHandRaised;
    setIsHandRaised(newState);
    setParticipants(prev =>
      prev.map(p => (p.name === currentUser.name ? { ...p, hasHandRaised: newState } : p))
    );
  };

  // Screen share handler
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setIsScreenSharing(true);
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = screenStream;
        }
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
        };
      } else {
        setIsScreenSharing(true);
      }
    } catch {
      // Fallback screen presentation simulation
      setIsScreenSharing(true);
    }
  };

  // Send message in meeting chat
  const handleSendMeetingMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingChatInput.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: currentUser.name,
      time: timeStr,
      text: meetingChatInput.trim(),
      isQuestion: meetingChatInput.includes('?')
    };

    setMeetingMessages(prev => [...prev, newMsg]);
    setMeetingChatInput('');
  };

  // Share webinar link to channel
  const handleShareLink = () => {
    const link = `${window.location.origin}/#webinar-${channelName.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);

    if (onShareWebinarLink) {
      onShareWebinarLink(`🎥 Jiunge na Webinar ya moja kwa moja: "${channelName}" - Kipindi kinaendelea sasa! Kiungo: ${link}`);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const speaker = participants.find(p => p.role === 'host') || participants[0];

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 flex flex-col text-white animate-in fade-in duration-200">
      {/* Top Webinar Stage Bar */}
      <header className="h-14 bg-gray-900 border-b border-gray-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 bg-red-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full animate-pulse shrink-0">
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE WEBINAR</span>
          </div>

          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-2">
              <span>{channelName}</span>
              <span className="text-gray-400 font-normal hidden sm:inline">• {schoolName}</span>
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-gray-400">
              <span className="text-red-400 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                REC {formatTimer(elapsedSeconds)}
              </span>
              <span>•</span>
              <span>HD 1080p WebRTC</span>
            </div>
          </div>
        </div>

        {/* View mode toggle and close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'speaker' ? 'grid' : 'speaker')}
            className="hidden sm:flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-xl transition-colors text-gray-200"
          >
            {viewMode === 'speaker' ? 'Mwonekano wa Gridi (Grid)' : 'Spika Mkuu (Speaker)'}
          </button>

          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-xs"
            title="Shiriki kiungo cha webinar kwa wanafunzi"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{copiedLink ? 'Kiungo Kimenakiliwa!' : 'Alika Wanafunzi'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors"
            title="Funga Mwonekano"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Webinar Center Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Stage Video Area */}
        <main className="flex-1 bg-black flex flex-col p-2 sm:p-4 overflow-hidden relative">
          {viewMode === 'speaker' ? (
            /* SPEAKER VIEW MODE */
            <div className="flex-1 flex flex-col gap-3 min-h-0">
              {/* Active Stage (Main Speaker or Screen Sharing) */}
              <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden relative border border-gray-800 flex items-center justify-center shadow-2xl">
                {isScreenSharing ? (
                  /* Screen Share Presentation Surface */
                  <div className="w-full h-full bg-slate-900 flex flex-col relative">
                    <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <ScreenShare className="w-4 h-4" />
                        <span>Unashiriki: Mada ya Fizikia & Past Papers (NECTA Form VI Revision)</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                        Skrini ya Mwalimu
                      </span>
                    </div>
                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                      <div className="max-w-xl p-6 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-xl text-left space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            NECTA 2024 - Physics Paper 1
                          </span>
                          <span className="text-[10px] text-gray-400">Slide 4 ya 18</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          Question 3: Electric Potential & Capacitance in Dielectric Media
                        </h3>
                        <p className="text-xs text-gray-300 leading-relaxed font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                          Formula: C = (εr × ε0 × A) / d<br />
                          Where εr = dielectric constant, A = plate area, d = separation.
                        </p>
                        <p className="text-[11px] text-emerald-300 italic">
                          ✍️ Mwalimu anaeleza jinsi ya kutatua sehemu (b) kwa usahihi ili kupata alama zote 10.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Live Camera of Main Speaker */
                  <div className="w-full h-full relative flex items-center justify-center bg-radial from-gray-800 to-gray-950">
                    <img
                      src={speaker.avatar}
                      alt={speaker.name}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    {/* Speaker info badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-white">{speaker.name}</span>
                      <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {speaker.role === 'host' ? 'Mwezeshaji Mkuu (Host)' : 'Spika'}
                      </span>
                    </div>

                    {/* Audio wave indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-emerald-400">
                      <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                      <span>Anazungumza...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Filmstrip of other participants */}
              <div className="h-28 sm:h-32 flex items-center gap-2.5 overflow-x-auto pb-1 custom-scrollbar shrink-0">
                {/* Local user tile */}
                <div className="w-36 sm:w-44 h-full bg-gray-900 rounded-xl overflow-hidden relative border-2 border-emerald-500/80 shrink-0 shadow-lg flex items-center justify-center">
                  {isVideoOn ? (
                    hasCameraError ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-950/40 p-2 text-center">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500 mb-1"
                        />
                        <span className="text-[11px] font-bold text-white truncate max-w-full">
                          Wewe ({currentUser.name.split(' ')[0]})
                        </span>
                        <span className="text-[9px] text-emerald-300">Kamera Imewashwa</span>
                      </div>
                    ) : (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-2 text-center">
                      <div className="w-9 h-9 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center mb-1">
                        <VideoOff className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-gray-400">Kamera Imezimwa</span>
                    </div>
                  )}

                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[10px] bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded">
                    <span className="truncate font-semibold text-white">Wewe</span>
                    <div className="flex items-center gap-1">
                      {isHandRaised && <Hand className="w-3 h-3 text-amber-400" />}
                      {isAudioOn ? (
                        <Mic className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <MicOff className="w-3 h-3 text-red-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Other students tiles */}
                {participants
                  .filter(p => p.id !== speaker.id && p.name !== currentUser.name)
                  .map(p => (
                    <div
                      key={p.id}
                      className="w-36 sm:w-44 h-full bg-gray-900 rounded-xl overflow-hidden relative border border-gray-800 shrink-0 shadow-sm flex items-center justify-center"
                    >
                      {p.isVideoOn ? (
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-full h-full object-cover opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 p-2 text-center">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-9 h-9 rounded-full object-cover opacity-40 mb-1"
                          />
                          <span className="text-[10px] text-gray-400 truncate max-w-full">
                            {p.name.split(' ')[0]}
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[10px] bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded">
                        <span className="truncate text-gray-200">{p.name.split(' ')[0]}</span>
                        <div className="flex items-center gap-1">
                          {p.hasHandRaised && <Hand className="w-3 h-3 text-amber-400 animate-pulse" />}
                          {p.isMuted ? (
                            <MicOff className="w-3 h-3 text-red-400" />
                          ) : (
                            <Mic className="w-3 h-3 text-emerald-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            /* GRID VIEW MODE */
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 overflow-y-auto custom-scrollbar">
              {participants.map(p => {
                const isLocal = p.name === currentUser.name;
                return (
                  <div
                    key={p.id}
                    className="bg-gray-900 rounded-2xl overflow-hidden relative border border-gray-800 flex items-center justify-center aspect-video min-h-[160px]"
                  >
                    {isLocal && isVideoOn && !hasCameraError ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                    ) : (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-white truncate">
                          {isLocal ? 'Wewe' : p.name}
                        </span>
                        {p.role === 'host' && (
                          <span className="bg-emerald-600 text-[10px] font-semibold px-1.5 py-0.2 rounded text-white shrink-0">
                            Host
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {(isLocal ? isHandRaised : p.hasHandRaised) && (
                          <Hand className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        {(isLocal ? isAudioOn : !p.isMuted) ? (
                          <Mic className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <MicOff className="w-3.5 h-3.5 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* SIDEBAR: Live In-Meeting Chat & Participants */}
        {activeSideTab !== 'none' && (
          <aside className="w-full sm:w-80 md:w-96 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-gray-800 bg-gray-950 text-xs font-semibold">
              <button
                onClick={() => setActiveSideTab('chat')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeSideTab === 'chat'
                    ? 'border-emerald-500 text-emerald-400 bg-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Mazungumzo ({meetingMessages.length})</span>
              </button>
              <button
                onClick={() => setActiveSideTab('participants')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeSideTab === 'participants'
                    ? 'border-emerald-500 text-emerald-400 bg-gray-900'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Washiriki ({participants.length})</span>
              </button>
            </div>

            {activeSideTab === 'chat' ? (
              /* Webinar Chat View */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-2.5 bg-emerald-950/30 border-b border-emerald-900/40 text-[11px] text-emerald-200 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Maswali yanayoulizwa hapa yatajibiwa mubashara na spika.</span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar text-xs">
                  {meetingMessages.map(m => (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-xl border ${
                        m.isQuestion
                          ? 'bg-amber-950/30 border-amber-800/50 text-amber-100'
                          : m.sender === currentUser.name
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-100'
                          : 'bg-gray-800/70 border-gray-700/50 text-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white flex items-center gap-1">
                          {m.sender}
                          {m.isQuestion && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 font-semibold px-1 rounded">
                              Swali
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-gray-400">{m.time}</span>
                      </div>
                      <p className="leading-relaxed text-gray-200 text-[11px]">{m.text}</p>
                    </div>
                  ))}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendMeetingMessage} className="p-3 border-t border-gray-800 bg-gray-950 flex gap-2">
                  <input
                    type="text"
                    value={meetingChatInput}
                    onChange={e => setMeetingChatInput(e.target.value)}
                    placeholder="Uliza swali au changia..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Tuma
                  </button>
                </form>
              </div>
            ) : (
              /* Webinar Participants View */
              <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Waliopo Ukumbini ({participants.length})
                </div>

                {participants.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-800/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-700"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                          <span>{p.name}</span>
                          {p.name === currentUser.name && (
                            <span className="text-[10px] text-emerald-400 font-normal">(Wewe)</span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate">
                          {p.role === 'host' ? 'Mwezeshaji Mkuu' : p.school}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {p.hasHandRaised && (
                        <span title="Ameinua mkono">
                          <Hand className="w-4 h-4 text-amber-400 animate-pulse" />
                        </span>
                      )}
                      {p.isMuted ? (
                        <MicOff className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Bottom Floating Webinar Action Controller */}
      <footer className="h-20 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 px-4 flex items-center justify-between shrink-0">
        {/* Left indicators */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          <span>EduKan WebRTC Webinar Server • Muunganisho Imara</span>
        </div>

        {/* Center Control Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 mx-auto md:mx-0">
          {/* Audio toggle */}
          <button
            onClick={handleToggleAudio}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isAudioOn
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            }`}
            title={isAudioOn ? 'Zima Maikrofoni (Mute)' : 'Washa Maikrofoni (Unmute)'}
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Video toggle */}
          <button
            onClick={handleToggleVideo}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isVideoOn
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            }`}
            title={isVideoOn ? 'Zima Kamera (Turn off Camera)' : 'Washa Kamera (Turn on Camera)'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={handleToggleScreenShare}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isScreenSharing
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
            title="Shiriki Skrini au Notisi (Screen Share)"
          >
            <ScreenShare className="w-5 h-5" />
          </button>

          {/* Raise Hand */}
          <button
            onClick={handleToggleHand}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
              isHandRaised
                ? 'bg-amber-500 text-gray-950 font-bold ring-2 ring-amber-300'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
            title={isHandRaised ? 'Shusha Mkono' : 'Inua Mkono ili Kuuliza'}
          >
            <Hand className="w-5 h-5" />
          </button>

          {/* Chat toggle */}
          <button
            onClick={() => setActiveSideTab(activeSideTab === 'chat' ? 'none' : 'chat')}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
              activeSideTab === 'chat'
                ? 'bg-emerald-700 text-white'
                : 'bg-gray-800 hover:bg-gray-700 text-white'
            }`}
            title="Onyesha / Ficha Mazungumzo"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Leave / End webinar button */}
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg active:scale-95 ml-2"
            title="Ondoka kwenye Webinar"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Ondoka</span>
          </button>
        </div>

        {/* Right toggle participants */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setActiveSideTab(activeSideTab === 'participants' ? 'none' : 'participants')}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeSideTab === 'participants'
                ? 'bg-emerald-700 border-emerald-600 text-white'
                : 'border-gray-800 bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{participants.length} Washiriki</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
