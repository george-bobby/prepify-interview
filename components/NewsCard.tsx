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
        <div className="bg-dark-200 rounded-lg overflow-hidden hover:bg-dark-300 transition-colors duration-200 group">
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
                {article.urlToImage ? (
                    <Image
                        src={article.urlToImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-200/20 to-primary-300/20 flex items-center justify-center">
                        <div className="text-primary-200 text-4xl">📰</div>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-primary-200 text-dark-100 px-2 py-1 rounded-full text-xs font-medium">
                        {article.category || 'News'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
                {/* Source and Date */}
                <div className="flex items-center justify-between text-sm text-light-300">
                    <span className="font-medium">{article.source.name}</span>
                    <span>{formatDate(article.publishedAt)}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-light-100 line-clamp-2 group-hover:text-primary-100 transition-colors">
                    {article.title}
                </h3>

                {/* Description */}
                <p className="text-light-200 text-sm line-clamp-3">
                    {truncateText(article.description, 120)}
                </p>

                {/* Read More Button */}
                <div className="pt-2">
                    <Link
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-200 hover:text-primary-100 font-medium text-sm transition-colors"
                    >
                        Read More
                        <svg
                            className="ml-1 w-4 h-4"
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
