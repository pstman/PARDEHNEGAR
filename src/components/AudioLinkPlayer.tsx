/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * پلیر صوتی شیک، مینیمال و واکنشی برای پخش صوت‌های پژوهشی و پیوست‌های صوتی وبلاگ
 * طراحی اختصاصی استودیو اینامیکس
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface AudioLinkPlayerProps {
  audioUrl: string;
  title?: string;
  className?: string;
}

export const AudioLinkPlayer: React.FC<AudioLinkPlayerProps> = ({
  audioUrl,
  title = 'فایل صوتی پیوست',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [useSynthFallback, setUseSynthFallback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset state on URL change
    setIsPlaying(false);
    setCurrentTime(0);
    setUseSynthFallback(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [audioUrl]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleError = () => {
    // If external audio fails to load or CORS blocks it, switch to synthetic demonstration
    setUseSynthFallback(true);
  };

  const togglePlay = () => {
    audioEngine.initContext();

    if (useSynthFallback) {
      if (isPlaying) {
        audioEngine.stopAll();
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        // Play acoustic demonstration motif
        audioEngine.playScaleSequence(
          [69, 71, 72, 74, 76, 74, 72, 71, 69],
          { 71: -45 },
          'santur',
          'glissando',
          () => {},
          () => setIsPlaying(false)
        );
      }
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setUseSynthFallback(true);
          setIsPlaying(true);
          audioEngine.playScaleSequence(
            [69, 71, 72, 74, 76, 74, 72, 71, 69],
            { 71: -45 },
            'santur',
            'glissando',
            () => {},
            () => setIsPlaying(false)
          );
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current && !useSynthFallback) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (isMuted && val > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === 0) return '۰۰:۰۰';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const faMins = mins.toString().padStart(2, '0');
    const faSecs = secs.toString().padStart(2, '0');
    return `${faMins}:${faSecs}`;
  };

  return (
    <div
      className={`w-full bg-gradient-to-r from-[#1E1612] via-[#2A1F18] to-[#1E1612] border border-[#E5A836]/40 rounded-xl p-3 sm:p-4 shadow-lg text-[#F5EEDB] ${className}`}
      dir="rtl"
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Play/Pause Button & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition shadow-md shrink-0 border ${
              isPlaying
                ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836] shadow-[#8B2635]/50 scale-105'
                : 'bg-[#D97706] hover:bg-[#E5A836] text-black border-amber-300'
            }`}
            title={isPlaying ? 'توقف' : 'پخش'}
          >
            {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-0.5" />}
          </button>

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-[#F5EEDB] truncate">
              {title}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-[#A6937C] mt-0.5">
              <span>{useSynthFallback ? 'پیش‌نمایش آکوستیک زنده' : 'فایل صوتی استودیویی'}</span>
              <span>•</span>
              <span className="font-mono text-[#E5A836]">{formatTime(currentTime)} / {formatTime(duration || 30)}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Waveform Bars Animation during playback */}
        <div className="flex items-center justify-center gap-0.5 h-6 px-3 bg-[#140F0C] rounded-lg border border-[#594234]/40 shrink-0">
          {[12, 18, 24, 16, 20, 26, 14, 22, 10, 18].map((h, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlaying ? 'bg-[#E5A836] animate-pulse' : 'bg-[#594234]/60'
              }`}
              style={{
                height: isPlaying ? `${Math.max(6, (h * (i % 2 === 0 ? 1.2 : 0.8)) % 24)}px` : '6px',
                animationDelay: `${i * 90}ms`
              }}
            />
          ))}
        </div>

        {/* Volume & Reset Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleMute}
            className="text-[#C4B59D] hover:text-[#FFF5E6] p-1.5 transition"
            title={isMuted ? 'روشن کردن صدا' : 'بی‌صدا'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 accent-[#E5A836] bg-[#3D2E24] rounded-lg cursor-pointer"
            title="میزان صدای پلیر"
          />

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
              }
            }}
            className="text-[#C4B59D] hover:text-[#FFF5E6] p-1.5 transition"
            title="شروع مجدد"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Progress Track Seekbar */}
      <div className="mt-2.5 flex items-center gap-2">
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 accent-[#E5A836] bg-[#3D2E24] rounded-lg cursor-pointer"
        />
      </div>
    </div>
  );
};
