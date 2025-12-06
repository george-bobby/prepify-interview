"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsArticle {
    id: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    source: {
        name: string;
    };
    category: string;
}

interface NewsCardProps {
    article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden border-2 border-[#c0fe72]/30 hover:border-[#c0fe72]/50 transition-all duration-300 group shadow-xl shadow-[#c0fe72]/10 hover:shadow-[#c0fe72]/20 hover:scale-[1.02]">
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
                {article.urlToImage ? (
                    <>
                        <Image
                            src={article.urlToImage}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#c0fe72]/20 via-[#9cd052]/10 to-[#7cb342]/20 flex flex-col items-center justify-center border-b-2 border-[#c0fe72]/30">
                        <div className="text-[#c0fe72] text-6xl mb-2 animate-pulse">📰</div>
                        <div className="text-[#c0fe72] text-sm font-semibold">News Article</div>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <span className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-[#c0fe72]/50 backdrop-blur-sm uppercase tracking-wide">
                        {article.category || 'News'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 space-y-4">
                {/* Title - Moved to top for better hierarchy */}
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2 group-hover:text-[#c0fe72] transition-colors leading-tight min-h-[3rem]">
                    {article.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed min-h-[3.5rem]">
                    {truncateText(article.description, 130)}
                </p>

                {/* Divider */}
                <div className="border-t border-[#c0fe72]/20"></div>

                {/* Source and Date */}
                <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#9cd052] flex items-center gap-1.5">
                        <span className="text-sm">📝</span>
                        <span className="truncate max-w-[150px]">{article.source.name}</span>
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                        <span>🕒</span>
                        <span>{formatDate(article.publishedAt)}</span>
                    </span>
                </div>

                {/* Read More Button */}
                <div className="pt-1">
                    <Link
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black font-bold text-sm px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-[#c0fe72]/50 transition-all group-hover:gap-3"
                    >
                        <span>Read Full Article</span>
                        <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export { NewsCard };

