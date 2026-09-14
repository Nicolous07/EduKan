import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Users,
  Send,
  Smile,
  Paperclip,
  Search,
  School,
  GraduationCap,
  CheckCheck,
  Pin,
  Plus,
  Info,
  X,
  ChevronLeft,
  FileText,
  Filter,
  Lock,
  Reply,
  Share2,
  Sparkles,
  Award,
  Check,
  Hash,
  Volume2,
  Video,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import {
  SchoolChatChannel,
  ChatMessage,
  UserProfile,
  ChatChannelType,
  ChatAttachment
} from '../types';
import {
  INITIAL_CHAT_CHANNELS,
  INITIAL_CHAT_MESSAGES,
  PEER_STUDENTS,
  PeerStudentContact
} from '../data/mockChatData';
import { getInitialState, saveState } from '../lib/store';
import { WebinarVideoModal } from './WebinarVideoModal';

interface Props {
  currentUser: UserProfile;
  initialSchoolId?: string;
  initialChannelId?: string;
  onOpenSchoolProfile?: (schoolId: string) => void;
  onBackToDirectory?: () => void;
}

export const SchoolChatView: React.FC<Props> = ({
  currentUser,
  initialSchoolId,
  initialChannelId,
  onOpenSchoolProfile,
  onBackToDirectory
}) => {
  // Persistent channels and messages
  const [channels, setChannels] = useState<SchoolChatChannel[]>(() => {
    return getInitialState<SchoolChatChannel[]>('edukan_chat_channels', INITIAL_CHAT_CHANNELS);
  });

  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(() => {
    return getInitialState<Record<string, ChatMessage[]>>('edukan_chat_messages', INITIAL_CHAT_MESSAGES);
  });

  // Filter tab for channels: 'all' | 'school_general' | 'level_group' | 'private_direct'
  const [activeFilter, setActiveFilter] = useState<'all' | 'school_general' | 'level_group' | 'private_direct'>('all');

  // Active selected channel
  const [activeChannelId, setActiveChannelId] = useState<string>(() => {
    if (initialChannelId) return initialChannelId;
    if (initialSchoolId) {
      const match = INITIAL_CHAT_CHANNELS.find(c => c.schoolId === initialSchoolId);
      if (match) return match.id;
    }
    return 'channel-malampaka-general';
  });

  // Mobile layout state: when false, list is shown; when true on mobile, active chat view is shown
  const [isMobileChatOpen, setIsMobileChatOpen] = useState<boolean>(Boolean(initialChannelId || initialSchoolId));

  // Search filter
  const [channelSearch, setChannelSearch] = useState('');

  // Input states
  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTab, setNewChatTab] = useState<'private' | 'group'>('private');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedSchoolForGroup, setSelectedSchoolForGroup] = useState<string>(currentUser.schoolName);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupLevel, setNewGroupLevel] = useState('Form VI');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [showWebinarModal, setShowWebinarModal] = useState<boolean>(false);

  // Quick preset academic attachments
  const academicAttachmentsPreset: ChatAttachment[] = [
    {
      type: 'resource',
      title: 'NECTA Past Paper Solved (Physics & Chemistry 2025).pdf',
      fileSize: '3.8 MB',
      subject: 'Sayansi'
    },
    {
      type: 'question',
      title: 'Swali la Mada: Simple Harmonic Motion & Calculus Derivation',
      subject: 'Physics'
    },
    {
      type: 'audio_note',
      title: 'Maelezo ya Sauti: Muongozo wa Practical ya Kemia (2:45)',
      fileSize: '1.2 MB',
      subject: 'Chemistry'
    }
  ];

  // User custom file upload state
  const [pendingAttachment, setPendingAttachment] = useState<ChatAttachment | null>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  const handleChatFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setPendingAttachment({
        type: isImg ? 'image' : 'resource',
        title: file.name,
        url: reader.result as string,
        fileSize: `${sizeMb} MB`,
        subject: isImg ? 'Picha ya Mwanafunzi' : 'Nyaraka ya Masomo'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    saveState('edukan_chat_channels', channels);
  }, [channels]);

  useEffect(() => {
    saveState('edukan_chat_messages', messagesMap);
  }, [messagesMap]);

  // Scroll to bottom of message list on new message or channel change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChannelId, messagesMap]);

  // If initialChannelId or initialSchoolId props change, update activeChannelId
  useEffect(() => {
    if (initialChannelId) {
      setActiveChannelId(initialChannelId);
      setIsMobileChatOpen(true);
    } else if (initialSchoolId) {
      const match = channels.find(c => c.schoolId === initialSchoolId);
      if (match) {
        setActiveChannelId(match.id);
        setIsMobileChatOpen(true);
      }
    }
  }, [initialChannelId, initialSchoolId, channels]);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const activeMessages = messagesMap[activeChannelId] || [];

  // Filter channels based on search and active tab
  const filteredChannels = channels.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(channelSearch.toLowerCase()) ||
      c.schoolName.toLowerCase().includes(channelSearch.toLowerCase()) ||
      (c.level && c.level.toLowerCase().includes(channelSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeFilter === 'all') return true;
    return c.type === activeFilter;
  });

  // Handle sending a new message
  const handleSendMessage = (e?: React.FormEvent, attachmentToSend?: ChatAttachment) => {
    if (e) e.preventDefault();
    const finalAttachment = attachmentToSend || pendingAttachment || undefined;
    if (!inputText.trim() && !finalAttachment) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role,
      senderLevel: `${currentUser.level} • ${currentUser.combination || 'General'}`,
      schoolName: currentUser.schoolName,
      content: inputText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            content: replyingTo.content
          }
        : undefined,
      attachment: finalAttachment
    };

    // Update messages
    setMessagesMap(prev => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMessage]
    }));

    // Update channel last message
    setChannels(prev =>
      prev.map(ch => {
        if (ch.id === activeChannelId) {
          return {
            ...ch,
            lastMessage: {
              content: finalAttachment ? `📎 ${finalAttachment.title}` : newMessage.content,
              senderName: currentUser.name,
              timestamp: 'Sasa hivi'
            }
          };
        }
        return ch;
      })
    );

    // Reset input states
    setInputText('');
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
    setPendingAttachment(null);
  };

  // Add emoji reaction to message
  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessagesMap(prev => {
      const channelMsgs = prev[activeChannelId] || [];
      const updated = channelMsgs.map(msg => {
        if (msg.id === msgId) {
          const reactions = { ...(msg.reactions || {}) };
          const userReactions = [...(msg.userReactions || [])];
          const hasReacted = userReactions.includes(emoji);

          if (hasReacted) {
            reactions[emoji] = Math.max(0, (reactions[emoji] || 1) - 1);
            if (reactions[emoji] === 0) delete reactions[emoji];
            const filteredUserReacts = userReactions.filter(e => e !== emoji);
            return { ...msg, reactions, userReactions: filteredUserReacts };
          } else {
            reactions[emoji] = (reactions[emoji] || 0) + 1;
            userReactions.push(emoji);
            return { ...msg, reactions, userReactions };
          }
        }
        return msg;
      });
      return { ...prev, [activeChannelId]: updated };
    });
  };

  // Start new 1-on-1 private chat with a selected peer
  const handleStartPrivateChat = (student: PeerStudentContact) => {
    // Check if channel already exists
    const existing = channels.find(
      c => c.type === 'private_direct' && c.participant?.id === student.id
    );

    if (existing) {
      setActiveChannelId(existing.id);
      setIsMobileChatOpen(true);
      setShowNewChatModal(false);
      return;
    }

    // Create new private channel
    const newChanId = `channel-dm-${student.id}-${Date.now()}`;
    const newChan: SchoolChatChannel = {
      id: newChanId,
      type: 'private_direct',
      name: student.name,
      schoolName: student.schoolName,
      description: `${student.level} • ${student.combination || 'Mwanafunzi'} • ${student.schoolName}`,
      memberCount: 2,
      unreadCount: 0,
      participant: {
        id: student.id,
        name: student.name,
        handle: student.handle,
        avatar: student.avatar,
        schoolName: student.schoolName,
        level: `${student.level} ${student.combination ? `• ${student.combination}` : ''}`,
        status: student.status
      }
    };

    setChannels(prev => [newChan, ...prev]);
    setMessagesMap(prev => ({
      ...prev,
      [newChanId]: [
        {
          id: `msg-welcome-${Date.now()}`,
          channelId: newChanId,
          senderId: student.id,
          senderName: student.name,
          senderAvatar: student.avatar,
          schoolName: student.schoolName,
          senderLevel: student.level,
          content: `Habari Nicolous! Karibu tuzungumze kuhusu masomo ya ${student.combination || student.level}. Una swali au mada yoyote tunayoweza kujadiliana leo?`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]
    }));

    setActiveChannelId(newChanId);
    setIsMobileChatOpen(true);
    setShowNewChatModal(false);
  };

  // Create new school level group
  const handleCreateLevelGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    const newGroupId = `channel-group-${Date.now()}`;
    const newGroup: SchoolChatChannel = {
      id: newGroupId,
      type: 'level_group',
      schoolName: selectedSchoolForGroup,
      name: newGroupName.trim(),
      description: newGroupDesc.trim() || `Kikundi cha kitaaluma cha ${newGroupLevel} - ${selectedSchoolForGroup}`,
      level: newGroupLevel,
      category: 'High School',
      memberCount: 1,
      unreadCount: 0,
      lastMessage: {
        content: 'Kikundi kimeundwa rasmi! Karibuni wote.',
        senderName: currentUser.name,
        timestamp: 'Sasa hivi'
      }
    };

    setChannels(prev => [newGroup, ...prev]);
    setMessagesMap(prev => ({
      ...prev,
      [newGroupId]: [
        {
          id: `msg-create-${Date.now()}`,
          channelId: newGroupId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          senderRole: currentUser.role,
          senderLevel: currentUser.level,
          schoolName: currentUser.schoolName,
          content: `Hongera! Umeanzisha kikundi hiki cha "${newGroupName}". Wanafunzi wote wa ${newGroupLevel} katika ${selectedSchoolForGroup} wanaweza kujiunga, kubadilishana notisi na kuuliza maswali.`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        }
      ]
    }));

    setActiveChannelId(newGroupId);
    setIsMobileChatOpen(true);
    setShowNewChatModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  const filteredStudents = PEER_STUDENTS.filter(s => {
    const q = studentSearchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.schoolName.toLowerCase().includes(q) ||
      s.level.toLowerCase().includes(q) ||
      (s.combination && s.combination.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[550px] max-h-[850px] relative">
      {/* Top Main Navigation Bar for School Community Chat */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-3 sm:px-5 flex items-center justify-between shadow-xs z-10">
        <div className="flex items-center gap-3">
          {onBackToDirectory && (
            <button
              onClick={onBackToDirectory}
              className="p-1.5 hover:bg-white/10 rounded-xl text-emerald-100 hover:text-white transition-colors flex items-center gap-1 text-xs"
              title="Rudi kwenye orodha ya shule"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Shule</span>
            </button>
          )}
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 leading-tight">
              <span>Soga & Jumuiya za Shule (School Chat)</span>
              <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Mawasiliano ya Wanafunzi
              </span>
            </h1>
            <p className="text-[11px] text-emerald-100/90 leading-tight">
              Shirikiana na wanafunzi wa shule yako, makundi ya darasa/level, na mazungumzo ya faragha (1-on-1).
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewChatModal(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
          title="Anzisha mazungumzo au kundi jipya"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Chat / Kundi Jipya</span>
        </button>
      </div>

      {/* Main Chat Split Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT COLUMN: Channels and Direct Messages List (Hidden on mobile if chat is active) */}
        <aside
          className={`w-full md:w-80 lg:w-96 border-r border-gray-200 bg-gray-50/70 flex flex-col transition-all duration-200 ${
            isMobileChatOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Channel Search and Filter Controls */}
          <div className="p-3 border-b border-gray-200 bg-white space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={channelSearch}
                onChange={e => setChannelSearch(e.target.value)}
                placeholder="Tafuta kundi, shule au mwanafunzi..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
              />
              {channelSearch && (
                <button
                  onClick={() => setChannelSearch('')}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-0.5 text-[11px]">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Yote ({channels.length})
              </button>
              <button
                onClick={() => setActiveFilter('school_general')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeFilter === 'school_general'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <School className="w-3 h-3" />
                <span>Shule Kuu</span>
              </button>
              <button
                onClick={() => setActiveFilter('level_group')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeFilter === 'level_group'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                <span>Vikundi vya Level</span>
              </button>
              <button
                onClick={() => setActiveFilter('private_direct')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
                  activeFilter === 'private_direct'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Binafsi (1-on-1)</span>
              </button>
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredChannels.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-xs">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="font-semibold text-gray-700">Hakuna mazungumzo yaliyopatikana</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Jaribu kurekebisha maneno ya utafutaji au anzisha chat mpya.
                </p>
              </div>
            ) : (
              filteredChannels.map(channel => {
                const isSelected = channel.id === activeChannelId;
                return (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setActiveChannelId(channel.id);
                      setIsMobileChatOpen(true);
                      // Clear unread badge
                      if (channel.unreadCount > 0) {
                        setChannels(prev =>
                          prev.map(c => (c.id === channel.id ? { ...c, unreadCount: 0 } : c))
                        );
                      }
                    }}
                    className={`w-full p-3 text-left flex items-start gap-3 transition-colors cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-50/90 border-l-4 border-emerald-600'
                        : 'hover:bg-white bg-transparent'
                    }`}
                  >
                    {/* Channel Avatar */}
                    <div className="relative shrink-0">
                      {channel.type === 'private_direct' && channel.participant ? (
                        <div className="relative">
                          <img
                            src={channel.participant.avatar}
                            alt={channel.participant.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-xs"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                              channel.participant.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
                            }`}
                          />
                        </div>
                      ) : channel.type === 'school_general' ? (
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-2xs">
                          <School className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800 shadow-2xs">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Channel Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="text-xs font-bold text-gray-900 truncate">
                            {channel.name}
                          </h4>
                          {channel.pinned && (
                            <Pin className="w-2.5 h-2.5 text-emerald-700 shrink-0 rotate-45" />
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {channel.lastMessage?.timestamp || ''}
                        </span>
                      </div>

                      {/* Tag info: School or Level */}
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
                        <span className="font-semibold text-emerald-800 truncate">
                          {channel.schoolName}
                        </span>
                        {channel.level && (
                          <>
                            <span>•</span>
                            <span className="bg-gray-200/80 text-gray-700 px-1.5 py-0.2 rounded font-medium truncate">
                              {channel.level}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Last Message Preview */}
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] text-gray-600 truncate">
                          {channel.lastMessage ? (
                            <span>
                              <strong className="font-medium text-gray-700">
                                {channel.lastMessage.senderName.split(' ')[0]}:{' '}
                              </strong>
                              {channel.lastMessage.content}
                            </span>
                          ) : (
                            <span className="italic text-gray-400">Anzisha mazungumzo...</span>
                          )}
                        </p>

                        {channel.unreadCount > 0 && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 animate-pulse">
                            {channel.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Quick peer online strip */}
          <div className="p-2.5 bg-emerald-900/5 border-t border-emerald-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-900 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Wanafunzi {PEER_STUDENTS.filter(s => s.status === 'online').length} wapo hewani
            </span>
            <button
              onClick={() => {
                setShowNewChatModal(true);
                setNewChatTab('private');
              }}
              className="text-emerald-700 font-bold hover:underline"
            >
              + Chat nao
            </button>
          </div>
        </aside>

        {/* RIGHT COLUMN: Active Chat Room */}
        <main
          className={`flex-1 flex flex-col bg-[#f8fafc] overflow-hidden ${
            !isMobileChatOpen ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Active Channel Header */}
          {activeChannel ? (
            <div className="bg-white p-3 sm:px-4 border-b border-gray-200 flex items-center justify-between shadow-2xs z-10">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Back button on mobile */}
                <button
                  onClick={() => setIsMobileChatOpen(false)}
                  className="md:hidden p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mr-1"
                  aria-label="Rudi kwenye orodha ya soga"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="relative shrink-0">
                  {activeChannel.type === 'private_direct' && activeChannel.participant ? (
                    <div className="relative">
                      <img
                        src={activeChannel.participant.avatar}
                        alt={activeChannel.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                          activeChannel.participant.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                      {activeChannel.type === 'school_general' ? (
                        <School className="w-5 h-5" />
                      ) : (
                        <GraduationCap className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {activeChannel.name}
                    </h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                        activeChannel.type === 'private_direct'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : activeChannel.type === 'level_group'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {activeChannel.type === 'private_direct'
                        ? 'Binafsi (1-on-1)'
                        : activeChannel.type === 'level_group'
                        ? 'Kikundi cha Level'
                        : 'Jumuiya Kuu'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-500">
                    <span className="font-semibold text-emerald-700 truncate">
                      {activeChannel.schoolName}
                    </span>
                    <span>•</span>
                    {activeChannel.type === 'private_direct' && activeChannel.participant ? (
                      <span
                        className={
                          activeChannel.participant.status === 'online'
                            ? 'text-emerald-600 font-semibold'
                            : 'text-gray-400'
                        }
                      >
                        {activeChannel.participant.status === 'online'
                          ? 'Yupo mtandaoni sasa'
                          : activeChannel.participant.lastSeen || 'Hajaonekana hivi karibuni'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span>{activeChannel.memberCount} wanachama</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowWebinarModal(true)}
                  className="text-[11px] font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                  title="Anzisha au jiunge na Video Chat / Webinar ya kundi hili"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Webinar / Video Chat</span>
                  <span className="xs:hidden">Video</span>
                </button>

                {activeChannel.schoolId && onOpenSchoolProfile && (
                  <button
                    onClick={() => onOpenSchoolProfile(activeChannel.schoolId!)}
                    className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                  >
                    <School className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Wasifu wa Shule</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    const preset = academicAttachmentsPreset[0];
                    handleSendMessage(undefined, preset);
                  }}
                  className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                  title="Shiriki Notisi / Past Paper haraka"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">Shiriki Past Paper</span>
                </button>
              </div>
            </div>
          ) : null}

          {/* Description banner if available */}
          {activeChannel?.description && (
            <div className="bg-emerald-50/60 border-b border-emerald-100/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-emerald-900">
              <p className="truncate mr-2">
                <span className="font-semibold text-emerald-800">Lengo: </span>
                {activeChannel.description}
              </p>
              {activeChannel.level && (
                <span className="bg-white border border-emerald-200 font-bold px-2 py-0.5 rounded text-[10px] text-emerald-800 shrink-0">
                  {activeChannel.level}
                </span>
              )}
            </div>
          )}

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 custom-scrollbar">
            {activeMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-2" />
                <h4 className="text-sm font-bold text-gray-700">Mwanzo wa mazungumzo!</h4>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Kuwa wa kwanza kutuma ujumbe, kuuliza swali gumu la NECTA, au kuweka notisi kwa ajili ya wenzako.
                </p>
              </div>
            ) : (
              activeMessages.map((msg, index) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id || index}
                    className={`flex items-end gap-2 group ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Left Avatar for others */}
                    {!isMe && (
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-gray-200 shrink-0 mb-1"
                      />
                    )}

                    <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {/* Sender Info for group chats */}
                      {!isMe && (
                        <div className="flex items-center gap-1.5 text-[11px] mb-1 ml-1">
                          <span className="font-bold text-gray-800">
                            {msg.senderName}
                          </span>
                          {msg.senderLevel && (
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded font-medium">
                              {msg.senderLevel}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Reply preview if replying to a previous message */}
                      {msg.replyTo && (
                        <div
                          className={`text-[11px] px-2.5 py-1 mb-1 rounded-lg border-l-2 truncate max-w-full ${
                            isMe
                              ? 'bg-emerald-800/15 border-emerald-700 text-emerald-900'
                              : 'bg-gray-100 border-gray-400 text-gray-700'
                          }`}
                        >
                          <strong className="font-semibold block text-[10px]">
                            {msg.replyTo.senderName}
                          </strong>
                          <span className="line-clamp-1">{msg.replyTo.content}</span>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`rounded-2xl p-3 text-xs leading-relaxed shadow-2xs relative group/bubble ${
                          isMe
                            ? 'bg-emerald-700 text-white rounded-br-xs'
                            : 'bg-white text-gray-800 border border-gray-200/90 rounded-bl-xs'
                        }`}
                      >
                        {/* Text message */}
                        <p className="whitespace-pre-wrap">{msg.content}</p>

                        {/* Attachment Card if present */}
                        {msg.attachment && (
                          <div
                            className={`mt-2 p-2.5 rounded-xl border flex items-center gap-2.5 text-xs ${
                              isMe
                                ? 'bg-emerald-800/40 border-emerald-600/60 text-white'
                                : 'bg-gray-50 border-gray-200 text-gray-800'
                            }`}
                          >
                            <div
                              className={`p-2 rounded-lg ${
                                isMe ? 'bg-emerald-600' : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {msg.attachment.type === 'audio_note' ? (
                                <Volume2 className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-bold block truncate">
                                {msg.attachment.title}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] opacity-80 mt-0.5">
                                {msg.attachment.subject && <span>{msg.attachment.subject}</span>}
                                {msg.attachment.fileSize && (
                                  <>
                                    <span>•</span>
                                    <span>{msg.attachment.fileSize}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Footer: Timestamp and status */}
                        <div
                          className={`flex items-center justify-end gap-1 text-[10px] mt-1 pt-0.5 ${
                            isMe ? 'text-emerald-200' : 'text-gray-400'
                          }`}
                        >
                          <span>{msg.createdAt}</span>
                          {isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />}
                        </div>
                      </div>

                      {/* Reactions badges */}
                      {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 mt-1 ml-1">
                          {Object.entries(msg.reactions).map(([emoji, count]) => {
                            const isMyReaction = msg.userReactions?.includes(emoji);
                            return (
                              <button
                                key={emoji}
                                onClick={() => handleToggleReaction(msg.id, emoji)}
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${
                                  isMyReaction
                                    ? 'bg-emerald-100 border-emerald-300 text-emerald-900 shadow-2xs font-bold'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <span>{emoji}</span>
                                <span>{count}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Quick Hover Actions: Reply & React */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 text-[10px] text-gray-500">
                        <button
                          onClick={() => setReplyingTo(msg)}
                          className="hover:text-emerald-700 flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-gray-100"
                        >
                          <Reply className="w-3 h-3" />
                          <span>Jibu</span>
                        </button>
                        <span className="text-gray-300">•</span>
                        {['👍', '❤️', '💡', '🔥'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className="hover:scale-125 transition-transform px-0.5 text-xs"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Replying banner if active */}
          {replyingTo && (
            <div className="bg-emerald-50 border-t border-emerald-200 px-4 py-2 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2 truncate">
                <Reply className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="truncate">
                  Unamjibu <strong>{replyingTo.senderName}</strong>: "{replyingTo.content}"
                </span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-emerald-700 hover:text-emerald-900 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Attachment Quick Presets Menu */}
          {showAttachmentMenu && (
            <div className="bg-white border-t border-gray-200 p-3 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Chagua Kiambatisho cha Kitaaluma (Academic Attachment)
                </span>
                <button
                  onClick={() => setShowAttachmentMenu(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {academicAttachmentsPreset.map((att, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleSendMessage(undefined, att);
                      setShowAttachmentMenu(false);
                    }}
                    className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-left transition-all flex items-start gap-2"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
                      {att.type === 'audio_note' ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{att.title}</p>
                      <p className="text-[10px] text-gray-500">{att.subject} • {att.fileSize || 'NECTA Item'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Emoji Picker Row */}
          {showEmojiPicker && (
            <div className="bg-white border-t border-gray-200 p-2 flex items-center gap-2 overflow-x-auto text-lg shadow-sm">
              {['👍', '❤️', '🔥', '💡', '👏', '📚', '🎯', '🧪', '⚡', '🙏', '💯', '✨', '🎓'].map(
                em => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => {
                      setInputText(prev => prev + em);
                      setShowEmojiPicker(false);
                    }}
                    className="hover:scale-125 transition-transform p-1"
                  >
                    {em}
                  </button>
                )
              )}
            </div>
          )}

          {/* Pending Upload Attachment Chip */}
          {pendingAttachment && (
            <div className="bg-emerald-50 border-t border-emerald-200 px-4 py-2 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                {pendingAttachment.type === 'image' ? (
                  <img
                    src={pendingAttachment.url}
                    alt="Preview"
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-400 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">{pendingAttachment.title}</p>
                  <p className="text-[10px] text-emerald-700">{pendingAttachment.fileSize} • Tayari kutumwa</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingAttachment(null)}
                className="p-1 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                title="Ondoa kiambatisho"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Hidden File Input for Direct Upload */}
          <input
            type="file"
            ref={chatFileInputRef}
            onChange={handleChatFileUpload}
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
          />

          {/* Bottom Chat Input Form */}
          <form
            onSubmit={e => handleSendMessage(e)}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            {/* Direct Upload Button (+) */}
            <button
              type="button"
              id="btn-chat-upload-file"
              onClick={() => chatFileInputRef.current?.click()}
              className="p-2 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1 border border-emerald-200 shrink-0"
              title="Pakia picha au faili la masomo moja kwa moja (+)"
            >
              <Upload className="w-4 h-4 text-emerald-700" />
              <span className="hidden lg:inline text-[11px] font-bold">Pakia (+)</span>
            </button>

            {/* Academic Presets Attachment Menu Button */}
            <button
              type="button"
              onClick={() => setShowAttachmentMenu(prev => !prev)}
              className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Ambatisha faili la masomo ya NECTA au swali"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Weka emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={`Andika ujumbe kwa ${activeChannel?.name || 'wanafunzi'}...`}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() && !pendingAttachment}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tuma</span>
            </button>
          </form>
        </main>
      </div>

      {/* NEW CHAT MODAL: Create Group or Start Private 1-on-1 */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-300" />
                  <span>Anzisha Soga au Kikundi Kipya</span>
                </h3>
                <p className="text-xs text-emerald-100">
                  Wasiliana na mwanafunzi moja kwa moja au unda kundi la level ya shule yako.
                </p>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs: Private vs Group */}
            <div className="flex border-b border-gray-200 bg-gray-50 text-xs">
              <button
                onClick={() => setNewChatTab('private')}
                className={`flex-1 py-3 font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  newChatTab === 'private'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Mwanafunzi Mmoja kwa Mmoja (Private)</span>
              </button>
              <button
                onClick={() => setNewChatTab('group')}
                className={`flex-1 py-3 font-bold text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  newChatTab === 'group'
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Kikundi cha Level Shuleni (Class Group)</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1">
              {newChatTab === 'private' ? (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={studentSearchQuery}
                      onChange={e => setStudentSearchQuery(e.target.value)}
                      placeholder="Tafuta mwanafunzi kwa jina, shule au combination..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-emerald-500"
                    />
                  </div>

                  <div className="text-[11px] font-semibold text-gray-500 flex items-center justify-between">
                    <span>Wanafunzi Wanaopatikana ({filteredStudents.length})</span>
                    <span className="text-emerald-700">Chagua mmoja kuanzisha chat</span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {filteredStudents.map(student => (
                      <div
                        key={student.id}
                        onClick={() => handleStartPrivateChat(student)}
                        className="p-2.5 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200"
                            />
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                student.status === 'online' ? 'bg-emerald-500' : 'bg-gray-400'
                              }`}
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-800 transition-colors truncate">
                              {student.name}
                            </h4>
                            <p className="text-[11px] text-gray-500 truncate">
                              {student.level} {student.combination ? `• ${student.combination}` : ''}
                            </p>
                            <p className="text-[10px] text-emerald-700 font-semibold truncate">
                              {student.schoolName}
                            </p>
                          </div>
                        </div>

                        <button className="bg-emerald-600 group-hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shrink-0 transition-colors">
                          Soga
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Group Creation Form */
                <form onSubmit={handleCreateLevelGroup} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Shule Yako
                    </label>
                    <input
                      type="text"
                      value={selectedSchoolForGroup}
                      onChange={e => setSelectedSchoolForGroup(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-emerald-500"
                      placeholder="Jina la Shule"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Kidato / Level Shuleni
                      </label>
                      <select
                        value={newGroupLevel}
                        onChange={e => setNewGroupLevel(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-emerald-500"
                      >
                        <option value="Form VI">Kidato cha Sita (Form VI)</option>
                        <option value="Form V">Kidato cha Tano (Form V)</option>
                        <option value="Form IV">Kidato cha Nne (Form IV)</option>
                        <option value="Form III">Kidato cha Tatu (Form III)</option>
                        <option value="Form II">Kidato cha Pili (Form II)</option>
                        <option value="Form I">Kidato cha Kwanza (Form I)</option>
                        <option value="Sayansi (PCB/PCM)">Sayansi (PCB / PCM)</option>
                        <option value="Sanaa & Biashara (EGM/HGL/HKL)">Sanaa & Biashara (EGM/HGL/HKL)</option>
                        <option value="Chuo Kikuu - Mwaka 1 & 2">Chuo Kikuu (Year 1 & 2)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Jina la Kikundi
                      </label>
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder="k.m. Form VI PCM Revision Squad"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Maelezo / Madhumuni ya Kikundi (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={newGroupDesc}
                      onChange={e => setNewGroupDesc(e.target.value)}
                      placeholder="k.m. Majadiliano ya maswali ya NECTA, practicals na kubadilishana notisi..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-xs"
                    >
                      Unda Kikundi cha Masomo
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Webinar / Video Chat Modal */}
      {showWebinarModal && activeChannel && (
        <WebinarVideoModal
          isOpen={showWebinarModal}
          onClose={() => setShowWebinarModal(false)}
          channelName={activeChannel.name}
          schoolName={activeChannel.schoolName}
          currentUser={currentUser}
          onShareWebinarLink={(msg) => handleSendMessage(msg)}
        />
      )}
    </div>
  );
};
