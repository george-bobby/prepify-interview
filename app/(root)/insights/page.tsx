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
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-light-100">
                    Industry Insights
                </h1>
                <p className="text-light-200 text-lg max-w-2xl mx-auto">
                    Stay updated with the latest news, trends, and insights in technology,
                    interviews, and career development.
                </p>
            </div>

            {/* Search and Filter */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={handleSearch}
                        placeholder="Search for articles..."
                        className="flex-1"
                    />

                    <div className="flex gap-2 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category.value
                                    ? 'bg-primary-200 text-dark-100'
                                    : 'bg-dark-200 text-light-100 hover:bg-dark-300'
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
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200"></div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={fetchNews}
                        className="bg-primary-200 text-dark-100 px-6 py-2 rounded-lg hover:bg-primary-300 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Articles Grid */}
            {!loading && !error && (
                <>
                    {filteredArticles.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-light-200 text-lg">
                                No articles found. Try adjusting your search or category filter.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.map((article) => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Refresh Button */}
            {!loading && !error && articles.length > 0 && (
                <div className="text-center pt-8">
                    <button
                        onClick={fetchNews}
                        className="bg-primary-200 text-dark-100 px-6 py-3 rounded-lg hover:bg-primary-300 transition-colors font-medium"
                    >
                        Refresh News
                    </button>
                </div>
            )}
        </div>
    );
};

export default InsightsPage;
