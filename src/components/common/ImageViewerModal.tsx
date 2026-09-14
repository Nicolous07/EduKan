import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize2,
  Download,
  RotateCcw,
  Move,
  Compass,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  Crosshair
} from 'lucide-react';

export interface ImageViewerData {
  url: string;
  caption?: string;
  authorName?: string;
  title?: string;
}

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: ImageViewerData | null;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  imageData
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showCornerHelper, setShowCornerHelper] = useState<boolean>(true);

  // References for touch pinch-to-zoom
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const lastTouchDistRef = useRef<number | null>(null);
  const lastTouchPosRef = useRef<{ x: number; y: number } | null>(null);

  // Reset view whenever modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setIsDragging(false);
      lastTouchDistRef.current = null;
      lastTouchPosRef.current = null;
    }
  }, [isOpen, imageData?.url]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        zoomOut();
      } else if (e.key === '0' || e.key === 'r') {
        resetView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, scale]);

  const zoomIn = () => {
    setScale((prev) => Math.min(5, Number((prev + 0.5).toFixed(1))));
  };

  const zoomOut = () => {
    setScale((prev) => {
      const next = Math.max(1, Number((prev - 0.5).toFixed(1)));
      if (next === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Jump to specific corners so user can inspect every corner to the very edge
  const jumpToCorner = (corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center') => {
    const currentScale = Math.max(2, scale);
    setScale(currentScale);

    if (corner === 'center') {
      setPosition({ x: 0, y: 0 });
      return;
    }

    const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
    const containerHeight = containerRef.current?.clientHeight || window.innerHeight;

    // Calculate maximum pan offset for the corner at current scale
    const panOffsetLimitX = (containerWidth * (currentScale - 1)) / 2;
    const panOffsetLimitY = (containerHeight * (currentScale - 1)) / 2;

    switch (corner) {
      case 'top-left':
        setPosition({ x: panOffsetLimitX, y: panOffsetLimitY });
        break;
      case 'top-right':
        setPosition({ x: -panOffsetLimitX, y: panOffsetLimitY });
        break;
      case 'bottom-left':
        setPosition({ x: panOffsetLimitX, y: -panOffsetLimitY });
        break;
      case 'bottom-right':
        setPosition({ x: -panOffsetLimitX, y: -panOffsetLimitY });
        break;
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(5, Number((prev + 0.25).toFixed(2))));
    } else {
      setScale((prev) => {
        const next = Math.max(1, Number((prev - 0.25).toFixed(2)));
        if (next === 1) {
          setPosition({ x: 0, y: 0 });
        }
        return next;
      });
    }
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers (Single finger pan & 2-finger pinch-to-zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2 fingers: pinch to zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistRef.current = dist;
    } else if (e.touches.length === 1) {
      // 1 finger: pan
      const touch = e.touches[0];
      lastTouchPosRef.current = { x: touch.clientX, y: touch.clientY };
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistRef.current !== null) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / lastTouchDistRef.current;
      setScale((prev) => {
        const next = Math.min(5, Math.max(1, Number((prev * factor).toFixed(2))));
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
      lastTouchDistRef.current = dist;
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistRef.current = null;
    lastTouchPosRef.current = null;
    setIsDragging(false);
  };

  // Double tap to quick zoom in/out
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scale > 1) {
      resetView();
    } else {
      setScale(2.5);
      // Zoom into clicked area
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = e.clientX - (rect.left + rect.width / 2);
        const offsetY = e.clientY - (rect.top + rect.height / 2);
        setPosition({
          x: -offsetX * 1.5,
          y: -offsetY * 1.5
        });
      }
    }
  };

  if (!isOpen || !imageData) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      id="fullscreen-image-viewer-modal"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200 overflow-hidden"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="px-3 sm:px-5 py-3 flex items-center justify-between text-white border-b border-white/10 bg-black/80 z-30 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            🖼️
          </div>
          <div className="truncate">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              {imageData.title || (imageData.authorName ? `Picha ya ${imageData.authorName}` : 'Picha Kamili')}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
              Bofya mara mbili au vuta kwa kidole/mouse ili kuzoom kila pembe
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom Level Indicator */}
          <span className="hidden xs:inline-flex px-2 py-1 bg-white/10 text-emerald-400 font-mono text-[11px] font-bold rounded-lg border border-white/10">
            {Math.round(scale * 100)}%
          </span>

          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 1}
            className={`p-2 rounded-xl transition-all ${
              scale <= 1
                ? 'text-gray-500 bg-white/5 cursor-not-allowed'
                : 'text-white bg-white/10 hover:bg-white/20 active:scale-95 cursor-pointer'
            }`}
            title="Punguza (Zoom Out -)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 5}
            className={`p-2 rounded-xl transition-all ${
              scale >= 5
                ? 'text-gray-500 bg-white/5 cursor-not-allowed'
                : 'text-white bg-white/10 hover:bg-white/20 active:scale-95 cursor-pointer'
            }`}
            title="Ongeza (Zoom In +)"
          >
            <ZoomIn className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Rotate Button */}
          <button
            type="button"
            onClick={rotate}
            className="p-2 rounded-xl text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            title="Zungusha digrii 90 (Rotate)"
          >
            <RotateCw className="w-4 h-4 text-teal-400" />
          </button>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={resetView}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-xs font-semibold cursor-pointer"
            title="Weka picha sawa sawa (Reset 100%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>100%</span>
          </button>

          {/* Download Button */}
          <a
            href={imageData.url}
            target="_blank"
            rel="noreferrer"
            download
            className="p-2 rounded-xl text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all cursor-pointer"
            title="Pakua picha halisi (Download)"
          >
            <Download className="w-4 h-4 text-emerald-400" />
          </a>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white bg-white/10 hover:bg-rose-600 active:scale-95 transition-all cursor-pointer ml-1"
            title="Funga (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        ref={containerRef}
        className={`flex-1 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none ${
          scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
        }`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative flex items-center justify-center transition-transform duration-75 will-change-transform"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale}) rotate(${rotation}deg)`
          }}
        >
          <img
            ref={imgRef}
            src={imageData.url}
            alt={imageData.caption || 'Academic Image Preview'}
            onDoubleClick={handleDoubleClick}
            draggable={false}
            className="max-w-[92vw] max-h-[75vh] object-contain rounded-lg shadow-2xl pointer-events-auto select-none"
          />
        </div>

        {/* Quick Corner Navigation Overlay Pill (Corner Jump Controls) */}
        {scale > 1 && showCornerHelper && (
          <div
            className="absolute bottom-4 right-4 z-40 bg-black/85 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase px-1">
              Pembe za Picha (Corners)
            </div>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => jumpToCorner('top-left')}
                className="p-2 rounded-lg bg-white/10 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                title="Pembe ya Juu Kushoto"
              >
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => jumpToCorner('center')}
                className="p-2 rounded-lg bg-white/10 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                title="Katikati (Center)"
              >
                <Crosshair className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => jumpToCorner('top-right')}
                className="p-2 rounded-lg bg-white/10 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                title="Pembe ya Juu Kulia"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => jumpToCorner('bottom-left')}
                className="p-2 rounded-lg bg-white/10 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                title="Pembe ya Chini Kushoto"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center justify-center text-[10px] text-gray-400 font-mono">
                {Math.round(scale * 100)}%
              </div>
              <button
                type="button"
                onClick={() => jumpToCorner('bottom-right')}
                className="p-2 rounded-lg bg-white/10 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
                title="Pembe ya Chini Kulia"
              >
                <ArrowDownRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5">
              <Move className="w-3 h-3 text-emerald-400" />
              <span>Au vuta popote kwa kidole</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Caption & Instruction Bar */}
      <div
        className="px-4 py-2.5 sm:py-3 border-t border-white/10 bg-black/80 text-center text-xs text-gray-300 z-30 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {imageData.caption ? (
          <p className="max-w-3xl mx-auto text-gray-200 line-clamp-2 text-xs leading-relaxed italic">
            "{imageData.caption}"
          </p>
        ) : (
          <div className="flex items-center justify-center gap-3 text-[11px] text-gray-400 flex-wrap">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              ✨ Uwezo Kamili wa Zoom (1x - 5x)
            </span>
            <span>•</span>
            <span>Vuta kwa kidole kuona kila pembe hadi mwisho</span>
            <span>•</span>
            <span>Bofya mara mbili kuweka sawa (Reset)</span>
          </div>
        )}
      </div>
    </div>
  );
};
