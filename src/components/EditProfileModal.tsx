import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Camera,
  Upload,
  Sparkles,
  School,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Check,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
}

// Curated high quality avatars for students in Tanzania
const PRESET_AVATARS = [
  {
    label: 'Mwanafunzi Sayansi (Kike)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Mwanafunzi Uongozi (Kiume)',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Kiranja wa Masomo (Kike)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Mbunifu & Teknolojia (Kiume)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Mwanafunzi Mchapakazi (Kike)',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Kiongozi wa Michezo (Kiume)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  }
];

// Curated high quality covers
const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80'
];

const WADHIFU_PRESETS = [
  'Mwanafunzi',
  'Kiranja wa Masomo (Academic Prefect)',
  'Kiranja Mkuu (Head Prefect)',
  'Kiranja wa Nidhamu',
  'Kiongozi wa Klabu ya Sayansi',
  'Mwenyekiti wa Midahalo (Debate Club)',
  'Mratibu wa Elimu ya Kidijitali',
  'Mwanafunzi Bora wa Sayansi (PCB/PCM)',
  'Mwanafunzi wa Kidato cha Sita',
  'Mtafiti Chipukizi'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [title, setTitle] = useState(user.title || 'Mwanafunzi');
  const [avatar, setAvatar] = useState(user.avatar);
  const [coverPhoto, setCoverPhoto] = useState(user.coverPhoto || PRESET_COVERS[0]);
  const [bio, setBio] = useState(user.bio);
  const [schoolName, setSchoolName] = useState(user.schoolName);
  const [level, setLevel] = useState(user.level);
  const [combination, setCombination] = useState(user.combination || 'PCB (Physics, Chemistry, Biology)');
  const [schoolRegion, setSchoolRegion] = useState(user.schoolRegion);
  const [schoolDistrict, setSchoolDistrict] = useState(user.schoolDistrict);

  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'academic'>('info');
  const [isSaved, setIsSaved] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local image file upload for Avatar
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Picha isizidi MB 5. Tafadhali chagua picha ndogo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local image file upload for Cover
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Picha ya jalada isizidi MB 8.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCoverPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Tafadhali weka jina lako kamili.');
      return;
    }

    onSave({
      name: name.trim(),
      handle: handle.trim().replace(/^@/, ''),
      title: title.trim(),
      avatar: avatar.trim(),
      coverPhoto: coverPhoto.trim(),
      bio: bio.trim(),
      schoolName: schoolName.trim(),
      level: level.trim(),
      combination: combination.trim(),
      schoolRegion: schoolRegion.trim(),
      schoolDistrict: schoolDistrict.trim()
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-800 to-teal-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Hariri Wasifu & Taarifa Zako</h3>
              <p className="text-xs text-emerald-100">
                Badilisha jina, picha, wadhifu na taarifa za shule
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Funga"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Navigation Tabs */}
        <div className="flex items-center border-b border-gray-200 bg-gray-50/80 px-4 sm:px-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Jina & Wadhifu</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'photos'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Picha ya Wasifu</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'academic'
                ? 'border-emerald-600 text-emerald-800 font-bold bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Shule & Mchepuo</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-5">
          {/* TAB 1: Taarifa za Msingi & Wadhifu */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Profile Preview Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-3">
                <img
                  src={avatar}
                  alt={name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-400 shrink-0 bg-white"
                />
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 text-sm truncate">{name || 'Jina Lako'}</div>
                  <div className="text-xs text-emerald-700 font-mono">@{handle || 'handle'}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md border border-amber-300 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-700" />
                      {title || 'Mwanafunzi'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Jina Kamili */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Jina Kamili (Full Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Mfano: Nicolous Amini Munisi"
                  required
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>

              {/* Wadhifu / Cheo / Nafasi */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Wadhifu / Cheo / Nafasi Yako</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">Itaonekana kwenye wasifu wako</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Mfano: Kiranja wa Masomo (Sayansi) au Mwanafunzi"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />

                {/* Quick Presets for Wadhifu */}
                <div className="mt-2">
                  <div className="text-[11px] text-gray-500 font-medium mb-1.5">
                    Chagua wadhifu wa haraka:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {WADHIFU_PRESETS.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setTitle(preset)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg transition-all border cursor-pointer ${
                          title === preset
                            ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold shadow-2xs'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Username / Handle */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Jina la Mtumiaji (Handle / Username)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="municryptrix"
                    className="w-full text-xs sm:text-sm pl-8 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Wasifu Mafupi (Bio) */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Wasifu / Maelezo Mafupi (Bio)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Eleza kwa ufupi ndoto zako za kimasomo, shauku yako au malengo..."
                  className="w-full text-xs sm:text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Picha ya Wasifu & Jalada */}
          {activeTab === 'photos' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Profile Avatar Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Picha ya Wasifu (Profile Picture)
                </label>

                {/* Avatar Preview & Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt="Preview"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-emerald-500 shadow-md bg-white shrink-0"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl shadow-md transition-colors cursor-pointer"
                      title="Pakia picha mpya kutoka kwenye simu/kifaa"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleAvatarFileUpload}
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pakia Picha Kutoka Kwenye Kifaa</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Unaweza kupakia picha yoyote (JPG au PNG) kutoka kwenye simu yako au kuchagua hapa chini.
                    </p>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div className="mt-4">
                  <div className="text-xs font-bold text-gray-700 mb-2">
                    Au chagua Avatar iliyo tayari:
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {PRESET_AVATARS.map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setAvatar(item.url)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 group cursor-pointer ${
                          avatar === item.url
                            ? 'border-emerald-600 ring-2 ring-emerald-300 scale-105 shadow-sm'
                            : 'border-gray-200 hover:border-emerald-400'
                        }`}
                        title={item.label}
                      >
                        <img
                          src={item.url}
                          alt={item.label}
                          className="w-full aspect-square rounded-lg object-cover"
                        />
                        {avatar === item.url && (
                          <div className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                        <span className="text-[9px] text-gray-600 line-clamp-1 mt-1 block text-center font-medium">
                          {item.label.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div className="mt-3">
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Au ingiza kiungo (URL) ya picha moja kwa moja:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customAvatarUrl.trim()) {
                          setAvatar(customAvatarUrl.trim());
                          setCustomAvatarUrl('');
                        }
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Tumia
                    </button>
                  </div>
                </div>
              </div>

              {/* Cover Photo */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-800 mb-2">
                  Picha ya Jalada (Cover Banner)
                </label>
                <div className="relative h-28 sm:h-32 rounded-2xl overflow-hidden border border-gray-200 mb-2">
                  <img
                    src={coverPhoto}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                    <input
                      type="file"
                      ref={coverInputRef}
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="bg-white/90 hover:bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Pakia Jalada Jipya</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {PRESET_COVERS.map((cov, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setCoverPhoto(cov)}
                      className={`h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        coverPhoto === cov ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-gray-200'
                      }`}
                    >
                      <img src={cov} alt="Preset Cover" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Shule & Mchepuo */}
          {activeTab === 'academic' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Shule */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Jina la Shule (School Community)
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Mfano: Malampaka Secondary School"
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Kidato / Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    Kidato / Ngazi (Level)
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Form I">Kidato cha Kwanza (Form I)</option>
                    <option value="Form II">Kidato cha Pili (Form II)</option>
                    <option value="Form III">Kidato cha Tatu (Form III)</option>
                    <option value="Form IV">Kidato cha Nne (Form IV)</option>
                    <option value="Form V">Kidato cha Tano (Form V)</option>
                    <option value="Form VI">Kidato cha Sita (Form VI)</option>
                    <option value="Chuo Kikuu (University)">Chuo Kikuu (University)</option>
                    <option value="Alumnus / Mhitimu">Alumnus / Mhitimu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    Mchepuo (Combination / Stream)
                  </label>
                  <input
                    type="text"
                    value={combination}
                    onChange={(e) => setCombination(e.target.value)}
                    placeholder="Mfano: PCB (Physics, Chemistry, Biology)"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Mkoa & Wilaya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    Mkoa (Region)
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={schoolRegion}
                      onChange={(e) => setSchoolRegion(e.target.value)}
                      placeholder="Shinyanga, Dar es Salaam, Arusha..."
                      className="w-full text-xs sm:text-sm pl-8 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    Wilaya (District)
                  </label>
                  <input
                    type="text"
                    value={schoolDistrict}
                    onChange={(e) => setSchoolDistrict(e.target.value)}
                    placeholder="Kishapu, Ilala, Arusha Mjini..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {isSaved && (
            <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Wasifu wako umesasishwa na kuhifadhiwa kikamilifu!</span>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Ghairi
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Hifadhi Mabadiliko</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
