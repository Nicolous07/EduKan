import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  Building,
  Award,
  X,
  Clock,
  Briefcase,
  Edit3,
  Upload,
  FileText,
  Paperclip
} from 'lucide-react';
import { OpportunityItem, UserProfile } from '../../types';

interface Props {
  opportunities: OpportunityItem[];
  currentUser: UserProfile;
  onAddOpportunity?: (opp: OpportunityItem) => void;
  onDeleteOpportunity?: (oppId: string) => void;
  onEditOpportunity?: (oppId: string, updated: Partial<OpportunityItem>) => void;
  onTriggerFeedback: (msg: string) => void;
  onAddAuditLog: (action: string, target: string, type: 'content' | 'school' | 'user' | 'broadcast' | 'system') => void;
}

export const AdminOpportunitiesTab: React.FC<Props> = ({
  opportunities,
  currentUser,
  onAddOpportunity,
  onDeleteOpportunity,
  onEditOpportunity,
  onTriggerFeedback,
  onAddAuditLog
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<OpportunityItem | null>(null);

  // File upload input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Add
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Scholarship' | 'Competition' | 'Hackathon' | 'Internship' | 'Bootcamp' | 'Fellowship'>('Scholarship');
  const [organizer, setOrganizer] = useState('');
  const [deadline, setDeadline] = useState('');
  const [eligibility, setEligibility] = useState('Wanafunzi wote wa Kidato cha 6 na Vyuo Vikuu');
  const [location, setLocation] = useState('Tanzania / Online');
  const [rewardOrStipend, setRewardOrStipend] = useState('Ada Yote + Malazi');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('https://');
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  // Form State for Edit
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<'Scholarship' | 'Competition' | 'Hackathon' | 'Internship' | 'Bootcamp' | 'Fellowship'>('Scholarship');
  const [editOrganizer, setEditOrganizer] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editEligibility, setEditEligibility] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editRewardOrStipend, setEditRewardOrStipend] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editAttachmentUrl, setEditAttachmentUrl] = useState<string | null>(null);
  const [editAttachmentName, setEditAttachmentName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      onTriggerFeedback('Faili ni kubwa mno! Tafadhali chagua faili chini ya 20MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (isEdit) {
        setEditAttachmentUrl(result);
        setEditAttachmentName(file.name);
      } else {
        setAttachmentUrl(result);
        setAttachmentName(file.name);
      }
      onTriggerFeedback(`Faili "${file.name}" limepakiwa kikamilifu! 📎`);
    };
    reader.readAsDataURL(file);
  };

  const startEditOpp = (opp: OpportunityItem) => {
    setEditingOpp(opp);
    setEditTitle(opp.title);
    setEditCategory(opp.category);
    setEditOrganizer(opp.organizer);
    setEditDeadline(opp.deadline);
    setEditEligibility(opp.eligibility || '');
    setEditLocation(opp.location || '');
    setEditRewardOrStipend(opp.rewardOrStipend || '');
    setEditDescription(opp.description);
    setEditLink(opp.link || '');
    setEditAttachmentUrl(opp.attachmentUrl || null);
    setEditAttachmentName(opp.attachmentName || null);
  };

  const handleSaveEditOpp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp || !editTitle.trim()) return;

    if (onEditOpportunity) {
      onEditOpportunity(editingOpp.id, {
        title: editTitle.trim(),
        category: editCategory,
        organizer: editOrganizer.trim() || 'EduKan Network',
        deadline: editDeadline || 'Haijaainishwa',
        eligibility: editEligibility.trim(),
        location: editLocation.trim(),
        rewardOrStipend: editRewardOrStipend.trim(),
        description: editDescription.trim(),
        link: editLink.trim(),
        attachmentUrl: editAttachmentUrl || undefined,
        attachmentName: editAttachmentName || undefined
      });
    }

    onAddAuditLog('Imehariri Fursa', editTitle.trim(), 'content');
    onTriggerFeedback(`Fursa "${editTitle.trim()}" imesasishwa kikamilifu!`);
    setEditingOpp(null);
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (categoryFilter !== 'all' && opp.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        opp.title.toLowerCase().includes(q) ||
        opp.organizer.toLowerCase().includes(q) ||
        opp.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateOpp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !organizer.trim()) return;

    const newOpp: OpportunityItem = {
      id: `opp-${Date.now()}`,
      title: title.trim(),
      category,
      organizer: organizer.trim(),
      deadline: deadline.trim() || 'Hadi nafasi zijae',
      eligibility: eligibility.trim(),
      location: location.trim(),
      rewardOrStipend: rewardOrStipend.trim(),
      description: description.trim() || 'Fursa maalum ya kimasomo na mafunzo kwa wanafunzi wa Tanzania.',
      link: link.trim() || 'https://edukan.tz',
      attachmentUrl: attachmentUrl || undefined,
      attachmentName: attachmentName || undefined,
      applicationsCount: 0,
      tags: [category, 'Tanzania', 'EduKan Verified']
    };

    if (onAddOpportunity) {
      onAddOpportunity(newOpp);
    }

    onAddAuditLog('Imechapisha Fursa Mpya', title.trim(), 'content');
    onTriggerFeedback(`Fursa ya "${title.trim()}" imechapishwa kwa mafanikio! 🌟`);

    setTitle('');
    setOrganizer('');
    setDescription('');
    setDeadline('');
    setAttachmentUrl(null);
    setAttachmentName(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-4 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading font-bold text-gray-900 dark:text-slate-100 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Usimamizi wa Fursa, Scholarships na Mafunzo ({opportunities.length})</span>
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Chapisha fursa za udhamini wa masomo, mashindano ya kitaifa, kazi za vitendo (internships) na ruzuku za utafiti.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Tafuta fursa au taasisi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">Ongeza Fursa</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
        {['all', 'Scholarship', 'Internship', 'Competition', 'Hackathon', 'Bootcamp'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
              categoryFilter === cat
                ? 'bg-amber-700 dark:bg-amber-600 text-white font-semibold shadow-2xs'
                : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
            }`}
          >
            {cat === 'all' ? 'Fursa Zote' : cat}
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      <div className="space-y-3 pt-1">
        {filteredOpportunities.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 dark:bg-slate-800/60 rounded-2xl text-gray-500 dark:text-slate-400 text-xs border border-gray-200 dark:border-slate-800">
            Hakuna fursa zinazolingana na kichujio hiki.
          </div>
        ) : (
          filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-600 bg-white dark:bg-slate-850 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-800 font-bold">
                  <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-slate-100 font-heading">
                      {opp.title}
                    </h4>
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-bold px-2 py-0.2 rounded-md">
                      {opp.category}
                    </span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.2 rounded-md">
                      {opp.rewardOrStipend}
                    </span>
                    {opp.attachmentName && (
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 font-semibold px-2 py-0.2 rounded-md flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        <span>{opp.attachmentName}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-slate-400 mt-1.5 flex-wrap">
                    <span>Mtoa Fursa: <strong className="text-gray-700 dark:text-slate-200">{opp.organizer}</strong></span>
                    <span>•</span>
                    <span>Hadhira: {opp.eligibility}</span>
                    <span>•</span>
                    <span className="text-amber-700 dark:text-amber-400 font-medium">Mwisho wa Maombi: {opp.deadline}</span>
                    <span>•</span>
                    <span>Maombi: {opp.applicationsCount}</span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => startEditOpp(opp)}
                  className="p-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 transition-colors cursor-pointer"
                  title="Hariri Fursa Hii"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <a
                  href={opp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                  title="Tembelea Kiungo"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kiungo</span>
                </a>

                {onDeleteOpportunity && (
                  <button
                    onClick={() => {
                      onDeleteOpportunity(opp.id);
                      onAddAuditLog('Imefuta Fursa', opp.title, 'content');
                      onTriggerFeedback(`Fursa ya "${opp.title}" imeondolewa.`);
                    }}
                    className="p-2 rounded-xl text-xs font-semibold bg-red-50 dark:bg-red-950/60 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                    title="Futa Fursa Hii"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Add Opportunity */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-amber-50 dark:bg-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm font-heading">
                  Chapisha Fursa Mpya ya Masomo / Kazi
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOpp} className="p-6 space-y-3.5 text-xs overflow-y-auto">
              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Jina la Fursa:</label>
                <input
                  type="text"
                  placeholder="Mfano: Udhamini wa Masomo wa Samia Scholarship 2025/2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Aina ya Fursa:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                  >
                    <option value="Scholarship">Scholarship (Udhamini wa Masomo)</option>
                    <option value="Internship">Internship (Mafunzo kwa Vitendo)</option>
                    <option value="Competition">Competition (Shindano la Kitaifa)</option>
                    <option value="Hackathon">Hackathon (Teknolojia & Ubunifu)</option>
                    <option value="Bootcamp">Bootcamp (Kambi ya Mafunzo)</option>
                    <option value="Fellowship">Fellowship</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Taasisi / Mfadhili:</label>
                  <input
                    type="text"
                    placeholder="Mfano: Wizara ya Elimu (MoEST) au Vodacom"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Mwisho wa Maombi (Deadline):</label>
                  <input
                    type="text"
                    placeholder="Mfano: 30 Oktoba 2025"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Kiwango cha Thawabu / Malipo:</label>
                  <input
                    type="text"
                    placeholder="Mfano: Ada 100% + Posho TZS 500,000/mwezi"
                    value={rewardOrStipend}
                    onChange={(e) => setRewardOrStipend(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Sifa za Muombaji (Eligibility):</label>
                <input
                  type="text"
                  placeholder="Mfano: Wanafunzi wa Kidato cha 6 wenye ufaulu wa Daraja la Kwanza katika masomo ya Sayansi"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Kiungo cha Kuomba (Application Link):</label>
                <input
                  type="url"
                  placeholder="https://tcu.go.tz au https://scholarships.tz"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              {/* Upload Attachment Button for Opportunity Document / Poster */}
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-slate-800 border border-amber-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    Ambatisha Tangazo Rasmi (PDF au Picha ya Poster)
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, false)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Pakia Faili</span>
                  </button>
                </div>
                {attachmentName && (
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-slate-700 text-[11px]">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold truncate flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {attachmentName}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachmentUrl(null);
                        setAttachmentName(null);
                      }}
                      className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-gray-700 dark:text-slate-300 block mb-1">Maelezo Kamili ya Fursa:</label>
                <textarea
                  rows={2}
                  placeholder="Eleza faida za fursa hii na namna ya kuwasilisha maombi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-xl font-semibold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Chapisha Fursa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Opportunity */}
      {editingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-blue-50 dark:bg-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-slate-100 text-sm font-heading">
                    Hariri Fursa / Scholarship
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">Mabadiliko yataonekana mara moja kwa wanafunzi wote</p>
                </div>
              </div>
              <button
                onClick={() => setEditingOpp(null)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditOpp} className="p-6 space-y-3.5 text-xs overflow-y-auto">
              <div>
                <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Jina la Fursa / Shindano</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Kundi (Category)</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                  >
                    <option value="Scholarship">Udhamini (Scholarship)</option>
                    <option value="Competition">Mashindano (Competition)</option>
                    <option value="Hackathon">Hackathon & Innovation</option>
                    <option value="Internship">Mafunzo Kazini (Internship)</option>
                    <option value="Bootcamp">Bootcamp & Tech</option>
                    <option value="Fellowship">Fellowship</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Mtoa Fursa (Organizer)</label>
                  <input
                    type="text"
                    required
                    value={editOrganizer}
                    onChange={(e) => setEditOrganizer(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Mwisho wa Kutuma (Deadline)</label>
                  <input
                    type="text"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    placeholder="k.m. 30 Aprili 2026"
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Zawadi / Malipo</label>
                  <input
                    type="text"
                    value={editRewardOrStipend}
                    onChange={(e) => setEditRewardOrStipend(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Walengwa (Eligibility)</label>
                <input
                  type="text"
                  value={editEligibility}
                  onChange={(e) => setEditEligibility(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Kiungo cha Kuomba (Application URL)</label>
                <input
                  type="url"
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              {/* Upload Attachment in Edit Modal */}
              <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-slate-800 border border-blue-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Ambatisha Tangazo Rasmi (PDF au Picha ya Poster)
                  </span>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, true)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Pakia Faili</span>
                  </button>
                </div>
                {editAttachmentName && (
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-slate-700 text-[11px]">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold truncate flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {editAttachmentName}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditAttachmentUrl(null);
                        setEditAttachmentName(null);
                      }}
                      className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-slate-300 block mb-1">Maelezo Kamili</label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-slate-100 rounded-xl focus:bg-white dark:focus:bg-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingOpp(null)}
                  className="px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-xl font-semibold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Hifadhi Mabadiliko</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
