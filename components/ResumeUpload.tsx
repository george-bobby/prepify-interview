"use client";

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface ResumeUploadProps {
    onFileUpload: (file: File) => void;
    uploadedFile: File | null;
}

const ResumeUpload = ({ onFileUpload, uploadedFile }: ResumeUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileSelect = (file: File) => {
        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a PDF, DOC, DOCX, or TXT file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            return;
        }

        onFileUpload(file);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragOver(false);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-5">
            {/* Upload Area - Redesigned */}
            <div
                className={`relative border-3 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all duration-300 overflow-hidden ${isDragOver
                        ? 'border-[#c0fe72] bg-[#c0fe72]/10 scale-[1.02]'
                        : 'border-gray-700 hover:border-[#c0fe72]/60 bg-gradient-to-br from-gray-900/50 to-black/50'
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {/* Animated background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#c0fe72]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#9cd052]/5 rounded-full blur-3xl"></div>
                </div>

                {uploadedFile ? (
                    <div className="space-y-5 relative z-10">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto border-2 border-green-500/50 shadow-2xl shadow-green-500/30 animate-pulse">
                            <svg className="w-10 h-10 md:w-12 md:h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-[#c0fe72] font-bold text-xl md:text-2xl mb-3">✅ File Uploaded Successfully!</h3>
                            <div className="bg-black/60 border-2 border-green-500/30 rounded-xl p-5 max-w-md mx-auto backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-xl flex items-center justify-center border border-[#c0fe72]/40 flex-shrink-0">
                                        <svg className="w-6 h-6 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-white font-semibold text-sm md:text-base truncate">{uploadedFile.name}</p>
                                        <p className="text-gray-400 text-xs md:text-sm">{formatFileSize(uploadedFile.size)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 relative z-10">
                        <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-[#c0fe72]/20 to-[#9cd052]/20 rounded-3xl flex items-center justify-center mx-auto border-2 border-[#c0fe72]/40 shadow-2xl shadow-[#c0fe72]/30 animate-pulse">
                            <svg className="w-10 h-10 md:w-14 md:h-14 text-[#c0fe72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-xl md:text-2xl mb-3">
                                📄 Upload Your Resume
                            </h3>
                            <p className="text-gray-300 mb-2 text-base md:text-lg font-medium">
                                Drag and drop your resume here, or click to browse
                            </p>
                            <p className="text-gray-500 text-sm mb-6">
                                Get instant AI-powered feedback and improve your chances
                            </p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-gradient-to-r from-[#c0fe72] via-[#9cd052] to-[#c0fe72] hover:from-[#d4ff8f] hover:via-[#a8dc5f] hover:to-[#d4ff8f] text-black font-extrabold text-base md:text-lg px-8 md:px-12 py-6 md:py-7 rounded-xl shadow-2xl shadow-[#c0fe72]/40 transition-all duration-300 hover:scale-105"
                            >
                                <svg className="w-5 h-5 md:w-6 md:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Choose File to Upload
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* File Requirements - Enhanced */}
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-gray-700/50 rounded-2xl p-5 md:p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-500/40">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h4 className="text-white font-bold text-lg md:text-xl">📋 Supported Formats</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500/30 to-orange-500/30 rounded-lg flex items-center justify-center border border-red-500/40 flex-shrink-0">
                            <span className="text-xs font-bold text-red-400">PDF</span>
                        </div>
                        <span className="text-gray-300 font-medium text-sm">PDF Documents (.pdf)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg flex items-center justify-center border border-blue-500/40 flex-shrink-0">
                            <span className="text-xs font-bold text-blue-400">DOC</span>
                        </div>
                        <span className="text-gray-300 font-medium text-sm">Word Files (.doc, .docx)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-lg flex items-center justify-center border border-green-500/40 flex-shrink-0">
                            <span className="text-xs font-bold text-green-400">TXT</span>
                        </div>
                        <span className="text-gray-300 font-medium text-sm">Text Files (.txt)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center border border-purple-500/40 flex-shrink-0">
                            <span className="text-xs font-bold text-purple-400">5MB</span>
                        </div>
                        <span className="text-gray-300 font-medium text-sm">Maximum File Size</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;

