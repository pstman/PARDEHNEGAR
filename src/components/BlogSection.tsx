/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * بخش عمومی وبلاگ و مقالات تخصصی پژوهشی پرده‌نگار • استودیو اینامیکس
 * نمایش مقالات، رندر مارک‌داون و HTML، پلیر صوتی شیک، تصاویر PNG/JPG و ویدیوهای یوتیوب
 */

import React, { useState, useEffect } from 'react';
import { BlogPost, getStoredBlogPosts, fetchRemoteBlogPosts } from '../utils/blogData';
import { AudioLinkPlayer } from './AudioLinkPlayer';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Heart, 
  Share2, 
  ArrowRight, 
  Search, 
  Youtube, 
  Music, 
  BookOpen 
} from 'lucide-react';

interface BlogSectionProps {
  onOpenTreatise: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenTreatise }) => {
  const [posts, setPosts] = useState<BlogPost[]>(getStoredBlogPosts());

  useEffect(() => {
    fetchRemoteBlogPosts().then(loadedPosts => {
      if (Array.isArray(loadedPosts) && loadedPosts.length > 0) {
        setPosts(loadedPosts);
      }
    });
  }, []);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copiedToast, setCopiedToast] = useState(false);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShare = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  // Convert youtube URL to safe embed URL
  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    try {
      if (url.includes('embed/')) return url;
      if (url.includes('watch?v=')) {
        const id = url.split('watch?v=')[1]?.split('&')[0];
        return `https://www.youtube-nocookie.com/embed/${id}`;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube-nocookie.com/embed/${id}`;
      }
    } catch {
      return null;
    }
    return null;
  };

  // Render markdown/HTML content safely
  const renderFormattedContent = (content: string) => {
    // If user provided HTML tags directly, render with dangerouslySetInnerHTML with basic styling
    return (
      <div 
        className="prose prose-invert max-w-none text-[#E8DCC8] leading-relaxed space-y-4 text-sm sm:text-base"
        dangerouslySetInnerHTML={{
          __html: formatMarkdownToHtml(content)
        }}
      />
    );
  };

  // Lightweight Markdown to HTML parser
  const formatMarkdownToHtml = (md: string) => {
    let html = md;
    
    // Headers
    html = html.replace(/### (.*?)\n/g, '<h3 class="text-lg sm:text-xl font-bold text-[#E5A836] mt-6 mb-2 border-b border-[#594234]/50 pb-1">$1</h3>');
    html = html.replace(/#### (.*?)\n/g, '<h4 class="text-base sm:text-lg font-bold text-[#FFF5E6] mt-4 mb-2">$1</h4>');
    
    // Blockquotes
    html = html.replace(/> (.*?)\n/g, '<blockquote class="border-r-4 border-[#E5A836] bg-[#241A14] p-3 rounded-lg my-3 text-[#D6C7B2] italic">$1</blockquote>');
    
    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#FFF5E6] font-bold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="text-[#E5A836]">$1</em>');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-[#120E0B] border border-[#594234]/70 p-3 rounded-xl overflow-x-auto text-xs font-mono text-[#34D399] my-3"><code>$1</code></pre>');
    
    // Bullet lists
    html = html.replace(/^\* (.*?)$/gm, '<li class="mr-4 list-disc text-[#D6C7B2]">$1</li>');
    
    // Tables
    html = html.replace(/\| (.*?) \|/g, (match) => {
      return match;
    });

    // Paragraph breaks
    html = html.replace(/\n\n/g, '<p class="my-3 leading-loose"></p>');

    return html;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 font-persian" dir="rtl">
      {/* Toast notification */}
      {copiedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#10B981] text-black px-4 py-2 rounded-xl text-xs font-bold shadow-2xl z-50 animate-bounce">
          ✓ لینک مقاله با موفقیت در کلیپ‌بورد کپی شد
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#241A14] via-[#1A130F] to-[#241A14] border border-[#594234] rounded-2xl p-5 sm:p-7 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center md:text-right">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-2xl">📰</span>
            <h2 className="text-lg sm:text-2xl font-black text-[#F5EEDB]">
              وبلاگ و پژوهش‌های تخصصی اتنوموزیکولوژی
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#C4B59D]">
            مقالات پژوهشی ایمان برزجان در باب فیزیک اصوات ردیف، ارگانولوژی و پیوستار اوراسیا
          </p>
        </div>

        <button
          onClick={onOpenTreatise}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B2635] hover:bg-[#A62F41] text-[#FFF5E6] font-bold text-xs border border-[#E5A836]/60 transition shadow shrink-0"
        >
          <BookOpen size={16} />
          <span>دانلود و مطالعه رساله‌های PDF</span>
        </button>
      </div>

      {/* Selected Post Full View */}
      {selectedPost ? (
        <article className="bg-[#18120E] border border-[#594234] rounded-2xl p-5 sm:p-8 space-y-6 shadow-2xl">
          {/* Back button */}
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2A1F18] hover:bg-[#3D2E24] text-[#E5A836] text-xs font-bold transition w-fit border border-[#594234]/60"
          >
            <ArrowRight size={16} />
            <span>بازگشت به فهرست مقالات</span>
          </button>

          {/* Cover image if available */}
          {selectedPost.coverImageUrl && (
            <div className="w-full h-56 sm:h-80 rounded-xl overflow-hidden border border-[#594234]/50 relative">
              <img
                src={selectedPost.coverImageUrl}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18120E] via-transparent to-transparent" />
            </div>
          )}

          {/* Post Header Details */}
          <div className="space-y-3 pb-4 border-b border-[#594234]/50">
            <span className="px-3 py-1 rounded-full bg-[#8B2635] text-[#FFF5E6] text-xs font-bold border border-[#E5A836]/40">
              {selectedPost.categoryLabelFa}
            </span>

            <h1 className="text-xl sm:text-3xl font-black text-[#F5EEDB] leading-tight">
              {selectedPost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#A6937C]">
              <div className="flex items-center gap-1.5 text-[#E5A836]">
                <User size={15} />
                <span>{selectedPost.author} ({selectedPost.authorRole})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={15} />
                <span>{selectedPost.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={15} />
                <span>زمان مطالعه: {selectedPost.readingTimeMinutes} دقیقه</span>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-[#241A14] border-r-4 border-[#E5A836] text-xs sm:text-sm text-[#D6C7B2] leading-relaxed">
            <strong>خلاصه پژوهش:</strong> {selectedPost.summary}
          </div>

          {/* Attached Audio Player Component */}
          {selectedPost.audioUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E5A836]">
                <Music size={16} />
                <span>شنیدن فایل صوتی پیوست مقاله:</span>
              </div>
              <AudioLinkPlayer
                audioUrl={selectedPost.audioUrl}
                title={selectedPost.audioTitle || selectedPost.title}
              />
            </div>
          )}

          {/* Attached YouTube Video Embed */}
          {selectedPost.youtubeUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#EF4444]">
                <Youtube size={16} />
                <span>ویدیوی یوتیوب پیوست:</span>
              </div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#594234] shadow-lg">
                <iframe
                  src={getYoutubeEmbedUrl(selectedPost.youtubeUrl) || ''}
                  title={selectedPost.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Rich Content */}
          <div className="pt-2">
            {renderFormattedContent(selectedPost.content)}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#594234]/50">
            <Tag size={15} className="text-[#E5A836]" />
            {selectedPost.tags.map((tag, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-[#2A1F18] text-[#C4B59D] border border-[#594234]/60">
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-[#594234]/50 text-xs">
            <button
              onClick={(e) => handleLike(selectedPost.id, e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition ${
                likedPosts[selectedPost.id]
                  ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836]'
                  : 'bg-[#2A1F18] text-[#C4B59D] border-[#594234] hover:text-[#FFF5E6]'
              }`}
            >
              <Heart size={16} className={likedPosts[selectedPost.id] ? 'fill-current text-red-400' : ''} />
              <span>پسندیدم ({selectedPost.likesCount + (likedPosts[selectedPost.id] ? 1 : 0)})</span>
            </button>

            <button
              onClick={(e) => handleShare(selectedPost, e)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A1F18] hover:bg-[#3D2E24] text-[#E5A836] border border-[#594234] transition"
            >
              <Share2 size={16} />
              <span>اشتراک‌گذاری مقاله</span>
            </button>
          </div>
        </article>
      ) : (
        /* Blog List View */
        <div className="space-y-6">
          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1C1410] p-3 rounded-xl border border-[#594234]/60">
            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A6937C]" />
              <input
                type="text"
                placeholder="جستجو در مقالات و واژگان..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2A1F18] border border-[#594234] rounded-lg pr-9 pl-3 py-1.5 text-xs text-[#F5EEDB] placeholder-[#A6937C] focus:border-[#E5A836] outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {[
                { id: 'all', label: 'همه موضوعات' },
                { id: 'acoustics', label: 'آکوستیک و تئوری' },
                { id: 'organology', label: 'سازشناسی' },
                { id: 'violin_technique', label: 'تکنیک ویولن' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap border ${
                    selectedCategory === cat.id
                      ? 'bg-[#8B2635] text-[#FFF5E6] border-[#E5A836]'
                      : 'bg-[#241A14] text-[#C4B59D] border-[#594234]/50 hover:bg-[#2C211B]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group bg-[#1A130F] hover:bg-[#241A14] border border-[#594234]/60 hover:border-[#E5A836] rounded-2xl overflow-hidden transition duration-300 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1"
              >
                <div>
                  {/* Card Image */}
                  {post.coverImageUrl && (
                    <div className="w-full h-44 overflow-hidden relative border-b border-[#594234]/40">
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-2.5 right-2.5 text-[10px] px-2.5 py-0.5 rounded-full bg-[#8B2635]/90 text-[#FFF5E6] font-bold border border-[#E5A836]/40 backdrop-blur-sm">
                        {post.categoryLabelFa}
                      </span>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    <h3 className="text-sm sm:text-base font-black text-[#F5EEDB] group-hover:text-[#E5A836] transition leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#C4B59D] line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 sm:p-5 pt-0 border-t border-[#594234]/30 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#A6937C] pt-2">
                    <span>{post.author}</span>
                    <span>{post.readingTimeMinutes} دقیقه مطالعه</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {post.audioUrl && (
                        <span className="text-[10px] flex items-center gap-1 text-[#E5A836] bg-[#2A1F18] px-2 py-0.5 rounded-md border border-[#594234]/50">
                          <Music size={11} /> صوت
                        </span>
                      )}
                      {post.youtubeUrl && (
                        <span className="text-[10px] flex items-center gap-1 text-red-400 bg-[#2A1F18] px-2 py-0.5 rounded-md border border-[#594234]/50">
                          <Youtube size={11} /> ویدیو
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-bold text-[#E5A836] group-hover:underline flex items-center gap-1">
                      <span>مطالعه مقاله</span>
                      <span>←</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="p-8 text-center text-xs text-[#A6937C] bg-[#16110E] rounded-xl border border-[#594234]/40">
              مقاله‌ای مطابق با عبارت جستجو یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
