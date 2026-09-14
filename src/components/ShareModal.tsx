import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  MessageSquare,
  Globe,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Post } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onShareSuccess?: (postId: string) => void;
}

export const ShareModal: React.FC<Props> = ({
  isOpen,
  onClose,
  post,
  onShareSuccess
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !post) return null;

  const shareUrl = `${window.location.origin}/#post-${post.id}`;
  const shareText = `📚 *EduKan Tanzania* - Chapisho la Masomo:\n"${post.content.slice(0, 150)}..."\n\nSoma zaidi na shirikiana na wanafunzi hapa: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      if (onShareSuccess) onShareSuccess(post.id);
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedText(true);
      if (onShareSuccess) onShareSuccess(post.id);
      setTimeout(() => setCopiedText(false), 3000);
    });
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    if (onShareSuccess) onShareSuccess(post.id);
  };

  const handleTwitterShare = () => {
    const text = `Soma mjadala huu wa masomo kwenye EduKan Tanzania: "${post.content.slice(0, 100)}..."`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=EduKan,ElimuTanzania,NECTA`;
    window.open(url, '_blank');
    if (onShareSuccess) onShareSuccess(post.id);
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    if (onShareSuccess) onShareSuccess(post.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm font-heading">Shiriki Chapisho</h3>
              <p className="text-[11px] text-gray-500">Sambaza maarifa kwa wanafunzi wengine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Preview Snippet */}
        <div className="p-6 space-y-5">
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-emerald-500/30"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-gray-900 truncate">{post.author.name}</span>
                <span className="text-[10px] text-emerald-700 font-medium">@{post.author.handle}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                {post.content}
              </p>
              {post.subject && (
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {post.subject}
                </span>
              )}
            </div>
          </div>

          {/* Quick Sharing Options Grid */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-2.5">
              Chagua Njia ya Kushiriki:
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppShare}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5 fill-white" />
                </div>
                <span className="text-xs font-bold">WhatsApp</span>
                <span className="text-[10px] text-emerald-700">Vikundi & DM</span>
              </button>

              {/* X / Twitter */}
              <button
                onClick={handleTwitterShare}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                  <span className="font-bold text-sm">𝕏</span>
                </div>
                <span className="text-xs font-bold">X (Twitter)</span>
                <span className="text-[10px] text-gray-500">Mjadala</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebookShare}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold">Facebook</span>
                <span className="text-[10px] text-blue-700">Wanafunzi</span>
              </button>
            </div>
          </div>

          {/* Copy Link Input Bar */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Au Nakili Kiungo cha Moja kwa Moja:
            </span>
            <div className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-xl">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent text-xs text-gray-600 px-2 font-mono truncate focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200 shadow-2xs'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Kimenakiliwa!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Nakili</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Copy Full Text for Discussion Button */}
          <button
            onClick={handleCopyText}
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800 font-bold">Maandishi Kamili Yamewekwa kwenye Clipboard!</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>Nakili Maandishi Kamili kwa Vikundi vya Masomo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
