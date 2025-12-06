"use client";

import React, { useState, useEffect } from 'react';
import { NewsCard } from '@/components/NewsCard';
import SearchBar from '@/components/SearchBar';

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

const InsightsPage = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { value: 'all', label: 'All News' },
        { value: 'technology', label: 'Technology' },
        { value: 'interview', label: 'Interview Tips' },
        { value: 'career', label: 'Career' },
        { value: 'programming', label: 'Programming' },
        { value: 'ai', label: 'AI & ML' },
    ];

    useEffect(() => {
        fetchNews();
    }, [selectedCategory]);

    const fetchNews = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/news', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: selectedCategory,
                    query: searchQuery,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch news');
            }

            const data = await response.json();
            setArticles(data.articles || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching news:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchNews();
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#c0fe72]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#9cd052]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#7cb342]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10 space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#c0fe72]/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 bg-[#c0fe72]/10 border border-[#c0fe72]/30 rounded-full px-4 py-2">
                                <span className="text-[#c0fe72]">⭐</span>
                                <span className="text-[#c0fe72] font-bold text-sm uppercase tracking-wide">Industry News & Trends</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                                <span className="text-white">Stay Ahead with </span>
                                <span className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] bg-clip-text text-transparent">Latest Insights</span>
                            </h1>
                            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
                                Get the latest news, trends, and insights in technology, career development, and interview preparation
                            </p>
                            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-[#c0fe72]">✓</span>
                                    <span>Daily Updates</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-[#c0fe72]">✓</span>
                                    <span>Expert Analysis</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="text-[#c0fe72]">✓</span>
                                    <span>Career Tips</span>
                                </div>
                            </div>
                        </div>
                        {/* Animated Newspaper/Articles */}
                        <div className="hidden md:block relative w-64 h-64 flex-shrink-0">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-48 h-48">
                                    {/* Outer glow rings */}
                                    <div className="absolute inset-0 rounded-full bg-[#c0fe72]/5 animate-pulse"></div>
                                    <div className="absolute inset-4 rounded-full bg-[#9cd052]/5 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                                    <div className="absolute inset-8 rounded-full bg-[#7cb342]/5 animate-pulse" style={{animationDelay: '1s'}}></div>
                                    
                                    {/* Floating Articles */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            {/* Article 1 - Back */}
                                            <div className="absolute top-0 left-0 w-24 h-32 bg-gradient-to-br from-[#c0fe72]/10 to-[#9cd052]/20 rounded-lg border-2 border-[#c0fe72]/30 p-2 transform rotate-12 animate-pulse">
                                                <div className="h-2 bg-[#c0fe72]/40 rounded mb-1"></div>
                                                <div className="h-1 bg-[#c0fe72]/30 rounded mb-1"></div>
                                                <div className="h-1 bg-[#c0fe72]/30 rounded mb-1"></div>
                                                <div className="h-1 bg-[#c0fe72]/30 rounded"></div>
                                            </div>
                                            {/* Article 2 - Middle */}
                                            <div className="absolute top-2 left-4 w-24 h-32 bg-gradient-to-br from-[#9cd052]/10 to-[#7cb342]/20 rounded-lg border-2 border-[#9cd052]/30 p-2 transform -rotate-6 animate-pulse" style={{animationDelay: '0.3s'}}>
                                                <div className="h-2 bg-[#9cd052]/40 rounded mb-1"></div>
                                                <div className="h-1 bg-[#9cd052]/30 rounded mb-1"></div>
                                                <div className="h-1 bg-[#9cd052]/30 rounded mb-1"></div>
                                                <div className="h-1 bg-[#9cd052]/30 rounded"></div>
                                            </div>
                                            {/* Article 3 - Front with float animation */}
                                            <div className="relative w-24 h-32 bg-gradient-to-br from-[#7cb342]/10 to-[#c0fe72]/20 rounded-lg border-2 border-[#7cb342]/30 p-2 shadow-xl shadow-[#c0fe72]/20 animate-bounce" style={{animationDuration: '3s'}}>
                                                <div className="h-3 bg-[#c0fe72]/50 rounded mb-2"></div>
                                                <div className="h-1.5 bg-[#c0fe72]/40 rounded mb-1"></div>
                                                <div className="h-1.5 bg-[#c0fe72]/40 rounded mb-1"></div>
                                                <div className="h-1.5 bg-[#c0fe72]/40 rounded mb-2"></div>
                                                <div className="h-1 bg-[#c0fe72]/30 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/20 rounded-2xl p-4 sm:p-6 shadow-xl shadow-[#c0fe72]/10">
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                        <div className="flex-1 w-full lg:max-w-md">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                onSearch={handleSearch}
                                placeholder="🔍 Search for articles..."
                                className="w-full"
                            />
                        </div>

                        <div className="flex gap-2 flex-wrap justify-center lg:justify-end">
                            {categories.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => setSelectedCategory(category.value)}
                                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                                        selectedCategory === category.value
                                            ? 'bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black shadow-lg shadow-[#c0fe72]/30 scale-105'
                                            : 'bg-gray-800/50 text-gray-300 border border-[#c0fe72]/20 hover:border-[#c0fe72]/40 hover:bg-gray-800'
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col justify-center items-center py-12 sm:py-16">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-[#c0fe72]"></div>
                        <p className="mt-4 text-gray-300 text-sm sm:text-base">Loading latest insights...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-gradient-to-br from-red-950/50 to-red-900/30 border-2 border-red-500/30 rounded-2xl p-6 sm:p-8 text-center max-w-md mx-auto shadow-xl">
                        <div className="text-4xl sm:text-5xl mb-4">⚠️</div>
                        <p className="text-red-400 mb-6 text-base sm:text-lg font-medium">{error}</p>
                        <button
                            onClick={fetchNews}
                            className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:shadow-lg hover:shadow-[#c0fe72]/30 transition-all font-semibold text-sm sm:text-base"
                        >
                            🔄 Try Again
                        </button>
                    </div>
                )}

                {/* Articles Grid */}
                {!loading && !error && (
                    <>
                        {filteredArticles.length === 0 ? (
                            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/20 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xl">
                                <div className="text-5xl sm:text-6xl mb-4">📭</div>
                                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                                    No articles found. Try adjusting your search or category filter.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl sm:text-2xl font-bold text-[#c0fe72] flex items-center gap-2">
                                        <span>📚</span>
                                        <span>Latest Articles</span>
                                        <span className="bg-[#c0fe72]/20 text-[#c0fe72] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border border-[#c0fe72]/30">
                                            {filteredArticles.length}
                                        </span>
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                                    {filteredArticles.map((article) => (
                                        <NewsCard key={article.id} article={article} />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Refresh Button */}
                {!loading && !error && articles.length > 0 && (
                    <div className="text-center pt-8 sm:pt-12">
                        <button
                            onClick={fetchNews}
                            className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl hover:shadow-lg hover:shadow-[#c0fe72]/40 transition-all font-semibold text-sm sm:text-base flex items-center gap-2 mx-auto"
                        >
                            <span>🔄</span>
                            <span>Refresh News</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InsightsPage;

