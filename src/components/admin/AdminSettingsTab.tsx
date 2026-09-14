import React, { useState } from 'react';
import {
  Settings,
  ShieldAlert,
  Database,
  Download,
  Lock,
  Unlock,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Server,
  FileCheck,
  Zap,
  Globe,
  HardDrive
} from 'lucide-react';
import { UserProfile } from '../../types';

interface Props {
  currentUser: UserProfile;
  studentsCount: number;
  schoolsCount: number;
  postsCount: number;
  booksCount: number;
  onTriggerFeedback: (msg: string) => void;
  onAddAuditLog: (action: string, target: string, type: 'content' | 'school' | 'user' | 'broadcast' | 'system') => void;
}

export const AdminSettingsTab: React.FC<Props> = ({
  currentUser,
  studentsCount,
  schoolsCount,
  postsCount,
  booksCount,
  onTriggerFeedback,
  onAddAuditLog
}) => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [moderationLevel, setModerationLevel] = useState<'relaxed' | 'standard' | 'strict'>('standard');
  const [allowUploads, setAllowUploads] = useState(true);
  const [maxUploadMb, setMaxUploadMb] = useState('25');
  const [isExporting, setIsExporting] = useState(false);

  const handleToggleMaintenance = () => {
    const next = !maintenanceMode;
    setMaintenanceMode(next);
    onAddAuditLog(
      next ? 'Imewasha Hali ya Matengenezo (Maintenance Mode)' : 'Imezima Hali ya Matengenezo',
      'Mfumo Mzima wa EduKan',
      'system'
    );
    onTriggerFeedback(
      next
        ? 'Mfumo umewekwa kwenye hali ya matengenezo. Wanafunzi hawawezi kuchapisha maudhui mapya.'
        : 'Mfumo umerejea kawaida mtandaoni kikamilifu!'
    );
  };

  const handleToggleRegistration = () => {
    const next = !registrationOpen;
    setRegistrationOpen(next);
    onAddAuditLog(
      next ? 'Imeruhusu Usajili wa Wanafunzi Wapya' : 'Imefunga Usajili wa Wanafunzi Wapya',
      'Lango la Kuingia',
      'system'
    );
    onTriggerFeedback(
      next ? 'Usajili wa wanafunzi wapya umeruhusiwa!' : 'Usajili wa wanafunzi wapya umesitishwa kwa muda.'
    );
  };

  const handleSaveModeration = (level: 'relaxed' | 'standard' | 'strict') => {
    setModerationLevel(level);
    onAddAuditLog(`Imebadili Kiwango cha Ukaguzi: ${level}`, 'AI Filter & Moderation', 'system');
    onTriggerFeedback(`Kiwango cha ukaguzi wa maudhui kimewekwa kuwa: ${level.toUpperCase()}`);
  };

  const handleExportBackup = () => {
    setIsExporting(true);
    setTimeout(() => {
      const backupData = {
        exportDate: new Date().toISOString(),
        platform: 'EduKan Tanzania Educational Network',
        systemStatus: maintenanceMode ? 'maintenance' : 'online',
        registrationOpen,
        moderationLevel,
        adminUser: currentUser.name,
        metrics: {
          students: studentsCount,
          schools: schoolsCount,
          posts: postsCount,
          libraryBooks: booksCount
        },
        version: '2.4.0-tanzania'
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `edukan_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setIsExporting(false);
      onAddAuditLog('Imepakua Nakala ya Akiba (System Backup JSON)', 'Takwimu za Mfumo', 'system');
      onTriggerFeedback('Faili la akiba la mfumo limepakuliwa kwa mafanikio! 💾');
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-slate-800 shadow-2xs space-y-6 transition-colors">
      {/* Title */}
      <div>
        <h3 className="font-heading font-bold text-gray-900 dark:text-slate-100 text-base flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <span>Mipangilio ya Mfumo, Usalama na Sera (System Config & Security)</span>
        </h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
          Dhibiti upatikanaji wa huduma, vigezo vya usalama, uchujaji wa kiotomatiki, na utunzaji wa kumbukumbu za EduKan.
        </p>
      </div>

      {/* Control Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Maintenance Mode */}
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/60 flex flex-col justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              maintenanceMode ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-slate-100">
                Hali ya Matengenezo (Maintenance Mode)
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Washa hali hii unapotaka kuzuia watumiaji kuchapisha au kufanya miamala wakati mfumo unafanyiwa maboresho.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200/80 dark:border-slate-700/80">
            <span className={`text-xs font-bold ${maintenanceMode ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {maintenanceMode ? '⚠️ Matengenezo Yanayoendelea' : '✅ Mfumo Uko Mtandaoni (Normal)'}
            </span>
            <button
              onClick={handleToggleMaintenance}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                maintenanceMode
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-amber-100 dark:bg-amber-950/70 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
              }`}
            >
              {maintenanceMode ? 'Zima Matengenezo' : 'Washa Matengenezo'}
            </button>
          </div>
        </div>

        {/* User Registration Toggle */}
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/60 flex flex-col justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              registrationOpen ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
            }`}>
              {registrationOpen ? <Unlock className="w-5 h-5 text-emerald-700 dark:text-emerald-400" /> : <Lock className="w-5 h-5 text-red-700 dark:text-red-400" />}
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-slate-100">
                Lango la Usajili wa Wanafunzi Wapya
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Ruhusu au zuia wanafunzi na walimu wapya kufungua akaunti mpya kwenye mfumo.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200/80 dark:border-slate-700/80">
            <span className={`text-xs font-bold ${registrationOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
              {registrationOpen ? 'Fungua (Inaruhusiwa)' : 'Imefungwa (Usajili Umezuiwa)'}
            </span>
            <button
              onClick={handleToggleRegistration}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                registrationOpen
                  ? 'bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {registrationOpen ? 'Sitisha Usajili' : 'Ruhusu Usajili'}
            </button>
          </div>
        </div>

        {/* AI Content Moderation Sensitivity */}
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/60 flex flex-col justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5 text-purple-700 dark:text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-slate-100">
                Uchujaji wa Maudhui (Content Filter Sensitivity)
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Kiwango cha kuzuia lugha chafu, maudhui ya kibiashara yasiyoidhinishwa na picha zisizofaa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-3 border-t border-gray-200/80 dark:border-slate-700/80">
            {(['relaxed', 'standard', 'strict'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => handleSaveModeration(lvl)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  moderationLevel === lvl
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {lvl === 'relaxed' && 'Wastani'}
                {lvl === 'standard' && 'Kawaida ✓'}
                {lvl === 'strict' && 'Kali (Strict)'}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload Controls */}
        <div className="p-4 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/60 flex flex-col justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 dark:text-slate-100">
                Uwezo wa Kupakia Faili na Picha
              </h4>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Ruhusu wanafunzi kupakia picha za maswali, PDF na notisi hadi {maxUploadMb} MB.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200/80 dark:border-slate-700/80">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 dark:text-slate-300 font-semibold">Upeo wa Ukubwa:</label>
              <select
                value={maxUploadMb}
                onChange={(e) => {
                  setMaxUploadMb(e.target.value);
                  onTriggerFeedback(`Upeo wa faili umehifadhiwa kuwa ${e.target.value} MB`);
                }}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs rounded-lg px-2 py-1 font-bold text-gray-800 dark:text-slate-200"
              >
                <option value="10">10 MB</option>
                <option value="25">25 MB</option>
                <option value="50">50 MB</option>
                <option value="100">100 MB</option>
              </select>
            </div>

            <button
              onClick={() => {
                const next = !allowUploads;
                setAllowUploads(next);
                onTriggerFeedback(next ? 'Upakiaji wa faili umeruhusiwa!' : 'Upakiaji wa faili umezuiwa.');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                allowUploads ? 'bg-teal-700 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300'
              }`}
            >
              {allowUploads ? 'Inaruhusu Upakiaji' : 'Imesitishwa'}
            </button>
          </div>
        </div>
      </div>

      {/* System Diagnostics & Backup Section */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            <h4 className="font-bold text-sm font-heading">
              Kuhifadhi Akiba ya Takwimu za Mfumo (System Backup & Export)
            </h4>
          </div>
          <p className="text-xs text-emerald-200/80 max-w-xl">
            Pakua nakala kamili ya orodha ya wanafunzi ({studentsCount}), shule ({schoolsCount}), maktaba ({booksCount}), na ripoti zote kwa ajili ya uhifadhi salama.
          </p>
        </div>

        <button
          onClick={handleExportBackup}
          disabled={isExporting}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 self-start sm:self-center shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isExporting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4 stroke-[2.5]" />
          )}
          <span>{isExporting ? 'Inatayarisha...' : 'Pakua Backup (JSON)'}</span>
        </button>
      </div>
    </div>
  );
};
