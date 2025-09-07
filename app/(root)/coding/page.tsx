import React from 'react';
import CodingProblems from '@/components/CodingProblems';

const CodingPage = () => {
    return (
        <div className="min-h-screen bg-dark-100 py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-light-100 mb-2">
                        Coding Practice
                    </h1>
                    <p className="text-light-200">
                        Practice coding problems from LeetCode to sharpen your algorithmic skills
                    </p>
                </div>

                <CodingProblems />
            </div>
        </div>
    );
};

export default CodingPage;
