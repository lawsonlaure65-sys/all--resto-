import React, { useState } from "react";
import { X, BookOpen, Clock, Calendar, User, ArrowRight, Share2, Sparkles } from "lucide-react";
import { BLOG_POSTS_DATA } from "../data/allorestoData";
import { BlogPost } from "../types";

interface CulinaryBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CulinaryBlogModal: React.FC<CulinaryBlogModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-orange-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-orange-500/25 shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Blog Culinaire &amp; Saveurs du Sahel
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-950 text-orange-400 border border-orange-500/30 text-[10px] font-bold">
                Niamey Gastronomie 🇳🇪
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secrets de recettes, culture culinaire du fleuve Niger, astuces de conservation et actualités.
            </p>
          </div>
        </div>

        {selectedPost ? (
          /* Article Detail View */
          <div className="space-y-4 text-xs">
            <button
              onClick={() => setSelectedPost(null)}
              className="text-orange-400 font-bold hover:underline flex items-center gap-1 cursor-pointer mb-2"
            >
              &larr; Retour aux articles
            </button>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md text-amber-300 font-bold text-[11px]">
                {selectedPost.category}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {selectedPost.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 border-b border-slate-800 pb-3">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-orange-400" />
                  <span>{selectedPost.author}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{selectedPost.date}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedPost.readTime}</span>
                </span>
              </div>
            </div>

            <div className="text-slate-300 leading-relaxed space-y-3 text-xs sm:text-sm pt-2">
              <p className="font-semibold text-white bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {selectedPost.excerpt}
              </p>
              <p>
                La gastronomie nigérienne est l'une des plus riches et généreuses d'Afrique de l'Ouest. En associant les produits frais du fleuve Niger (capitaine, carpe) et les viandes savoureuses du Sahel (agneau, pintade, bœuf), nos maîtres rôtisseurs ont su élever le braisage et les sauces mijotées au rang d'art véritable.
              </p>
              <p>
                Chez Allôresto, nous travaillons main dans la main avec les meilleurs restaurants et cuisiniers traditionnels de Niamey pour garantir une fraîcheur absolue à chaque livraison Billo Express.
              </p>
            </div>
          </div>
        ) : (
          /* Articles List */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BLOG_POSTS_DATA.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group rounded-2xl bg-slate-950 border border-slate-800 hover:border-orange-500/40 p-3.5 space-y-3 cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[9px] font-bold text-amber-300">
                      {post.category}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                    {post.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{post.readTime}</span>
                  <span className="text-orange-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>Lire</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
