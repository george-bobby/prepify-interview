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
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                        ? 'border-primary-200 bg-primary-200/10'
                        : 'border-dark-300 hover:border-primary-100'
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {uploadedFile ? (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-success-100/20 rounded-lg flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-success-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-primary-100 font-semibold mb-2">File Uploaded Successfully</h3>
                            <div className="bg-dark-300 rounded-lg p-4 max-w-md mx-auto">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary-200/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-primary-100 font-medium">{uploadedFile.name}</p>
                                        <p className="text-light-400 text-sm">{formatFileSize(uploadedFile.size)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-primary-200/20 rounded-lg flex items-center justify-center mx-auto">
                            <svg className="w-8 h-8 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-primary-100 font-semibold mb-2">Upload Your Resume</h3>
                            <p className="text-light-400 mb-4">
                                Drag and drop your resume here, or click to browse
                            </p>
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-primary-200 hover:bg-primary-100 text-dark-100"
                            >
                                Choose File
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

            {/* File Requirements */}
            <div className="bg-dark-300 rounded-lg p-4">
                <h4 className="text-primary-100 font-medium mb-2">Supported Formats</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-light-400">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                        <span>PDF (.pdf)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                        <span>Word (.doc, .docx)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                        <span>Text (.txt)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-200 rounded-full"></div>
                        <span>Max size: 5MB</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;

