"use client"

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { interviewConfig } from '@/constants';
import { getSpeechSynthesisManager, SpeechSynthesisManager } from '@/lib/speech-synthesis';
import { errorHandler, getErrorMessage } from '@/lib/error-handling';
import type { AgentProps, InterviewResponse } from '@/types/interview';

// Extend Window interface for speech recognition
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

// ENUM: Define interview statuses
enum InterviewStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    LISTENING = 'LISTENING',
    PROCESSING = 'PROCESSING',
    SPEAKING = 'SPEAKING',
    FINISHED = 'FINISHED'
}



// Main Component: Agent
export const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {
    const router = useRouter();

    // State: Tracks interview status
    const [interviewStatus, setInterviewStatus] = useState<InterviewStatus>(InterviewStatus.INACTIVE);

    // State: Tracks if AI is speaking
    const [isSpeaking, setIsSpeaking] = useState(false);

    // State: Current question index
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // State: Current question being asked
    const [currentQuestion, setCurrentQuestion] = useState<string>('');

    // State: User's current response
    const [currentResponse, setCurrentResponse] = useState<string>('');

    // State: Interview responses
    const [responses, setResponses] = useState<InterviewResponse[]>([]);

    // State: Current AI message
    const [aiMessage, setAiMessage] = useState<string>('');

    // State: Error handling
    const [error, setError] = useState<string | null>(null);

    // Enhanced error handling
    const handleError = (error: any, context?: string) => {
        const enhancedError = errorHandler.handleError(error, {
            component: 'Agent',
            action: context,
            userId,
            interviewId,
        });
        setError(getErrorMessage(enhancedError));
    };

    // State: Speech recognition
    const [isListening, setIsListening] = useState(false);

    // State: Text input mode vs speech mode
    const [isTextMode, setIsTextMode] = useState(false);

    // State: Text input value
    const [textInput, setTextInput] = useState('');

    // State: AI speaker muted
    const [isMuted, setIsMuted] = useState(false);

    // Refs
    const speechSynthesisRef = useRef<SpeechSynthesisManager | null>(null);
    const speechRecognitionRef = useRef<any>(null);
    const interviewStartTimeRef = useRef<Date | null>(null);

    // Initialize speech synthesis
    useEffect(() => {
        if (typeof window !== 'undefined' && SpeechSynthesisManager.isSupported()) {
            try {
                speechSynthesisRef.current = getSpeechSynthesisManager();
            } catch (err) {
                console.error('Speech synthesis not supported:', err);
                setError('Speech synthesis is not supported in your browser');
            }
        }
    }, []);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => {
                setIsListening(true);
                setInterviewStatus(InterviewStatus.LISTENING);
            };

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setCurrentResponse(transcript);
                setIsListening(false);
                handleResponseSubmission(transcript);
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                setError('Speech recognition error. Please try again.');
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            speechRecognitionRef.current = recognition;
        }
    }, []);

    // Handler: Start interview
    const handleStartInterview = async () => {
        try {
            setInterviewStatus(InterviewStatus.CONNECTING);
            setError(null);
            interviewStartTimeRef.current = new Date();

            if (type === "generate") {
                // Redirect to interview generation
                router.push('/');
                return;
            }

            if (!questions || questions.length === 0) {
                setError('No questions available for this interview');
                return;
            }

            // Start with first question
            setCurrentQuestionIndex(0);
            setCurrentQuestion(questions[0]);
            setInterviewStatus(InterviewStatus.ACTIVE);

            // Speak the first question
            await speakText(interviewConfig.firstMessage);
            await speakText(questions[0]);
        } catch (err) {
            console.error('Error starting interview:', err);
            setError('Failed to start interview. Please try again.');
            setInterviewStatus(InterviewStatus.INACTIVE);
        }
    };

    // Handler: Speak text using speech synthesis
    const speakText = async (text: string) => {
        if (!speechSynthesisRef.current || isMuted) {
            // If muted, just update status without speaking
            setIsSpeaking(false);
            if (interviewStatus === InterviewStatus.SPEAKING) {
                setInterviewStatus(InterviewStatus.ACTIVE);
            }
            return;
        }

        try {
            setIsSpeaking(true);
            setInterviewStatus(InterviewStatus.SPEAKING);

            await speechSynthesisRef.current.speak(text, {
                rate: 0.9,
                pitch: 1.0,
                volume: 0.8,
            }, {
                onStart: () => setIsSpeaking(true),
                onEnd: () => {
                    setIsSpeaking(false);
                    if (interviewStatus === InterviewStatus.SPEAKING) {
                        setInterviewStatus(InterviewStatus.ACTIVE);
                    }
                },
                onError: (error) => {
                    console.error('Speech synthesis error:', error);
                    setIsSpeaking(false);
                    setError('Speech synthesis error');
                }
            });
        } catch (err) {
            console.error('Error speaking text:', err);
            setIsSpeaking(false);
            setError('Failed to speak text');
        }
    };

    // Handler: Start listening for user response
    const startListening = () => {
        if (!speechRecognitionRef.current) {
            setError('Speech recognition is not supported in your browser');
            return;
        }

        try {
            speechRecognitionRef.current.start();
        } catch (err) {
            console.error('Error starting speech recognition:', err);
            setError('Failed to start speech recognition');
        }
    };

    // Handler: Submit text input
    const handleTextSubmit = () => {
        if (!textInput.trim()) return;

        handleResponseSubmission(textInput);
        setTextInput('');
    };

    // Handler: Toggle mute
    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (!isMuted && speechSynthesisRef.current) {
            // If muting, stop current speech
            speechSynthesisRef.current.stop();
            setIsSpeaking(false);
        }
    };

    // Handler: Submit response (either from speech or text input)
    const handleResponseSubmission = async (response: string) => {
        if (!response.trim()) return;

        try {
            setInterviewStatus(InterviewStatus.PROCESSING);
            setCurrentResponse(response);

            // Call API to evaluate response
            const evaluationResponse = await fetch('/api/interviews/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interviewId,
                    questionIndex: currentQuestionIndex,
                    question: currentQuestion,
                    answer: response,
                    userId,
                }),
            });

            const evaluationData = await evaluationResponse.json();

            if (!evaluationData.success) {
                throw new Error(evaluationData.error || 'Failed to evaluate response');
            }

            // Store response
            const newResponse: InterviewResponse = {
                questionIndex: currentQuestionIndex,
                question: currentQuestion,
                answer: response,
                score: evaluationData.evaluation.score,
                feedback: evaluationData.evaluation.feedback,
                strengths: evaluationData.evaluation.strengths || [],
                improvements: evaluationData.evaluation.improvements || [],
                timestamp: new Date().toISOString(),
            };

            setResponses(prev => [...prev, newResponse]);

            // Speak AI response
            if (evaluationData.interviewerResponse) {
                await speakText(evaluationData.interviewerResponse);
            }

            // Move to next question or finish interview
            if (evaluationData.isLastQuestion) {
                await finishInterview();
            } else if (questions) {
                const nextQuestionIndex = currentQuestionIndex + 1;
                setCurrentQuestionIndex(nextQuestionIndex);
                setCurrentQuestion(questions[nextQuestionIndex]);
                setCurrentResponse('');

                // Speak next question
                await speakText(questions[nextQuestionIndex]);
            }
        } catch (err) {
            console.error('Error submitting response:', err);
            setError('Failed to submit response. Please try again.');
            setInterviewStatus(InterviewStatus.ACTIVE);
        }
    };

    // Handler: Finish interview and generate summary
    const finishInterview = async () => {
        try {
            setInterviewStatus(InterviewStatus.PROCESSING);

            const endTime = new Date();
            const duration = interviewStartTimeRef.current
                ? Math.round((endTime.getTime() - interviewStartTimeRef.current.getTime()) / 1000 / 60)
                : 0;

            // Generate final summary
            const summaryResponse = await fetch('/api/interviews/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interviewId,
                    userId,
                    duration: `${duration} minutes`,
                }),
            });

            const summaryData = await summaryResponse.json();

            if (!summaryData.success) {
                throw new Error(summaryData.error || 'Failed to generate summary');
            }

            setInterviewStatus(InterviewStatus.FINISHED);

            // Speak final message
            await speakText("Thank you for completing the interview. Your feedback is being generated.");

            // Redirect to feedback page
            router.push(`/interviews/${interviewId}/feedback`);
        } catch (err) {
            console.error('Error finishing interview:', err);
            setError('Failed to finish interview. Please try again.');
        }
    };

    // Handler: Stop interview
    const handleStopInterview = async () => {
        try {
            // Stop speech synthesis
            if (speechSynthesisRef.current) {
                speechSynthesisRef.current.stop();
            }

            // Stop speech recognition
            if (speechRecognitionRef.current && isListening) {
                speechRecognitionRef.current.stop();
            }

            setInterviewStatus(InterviewStatus.FINISHED);
            setIsSpeaking(false);
            setIsListening(false);

            // If we have responses, generate summary
            if (responses.length > 0) {
                await finishInterview();
            } else {
                router.push('/interviews');
            }
        } catch (err) {
            console.error('Error stopping interview:', err);
            router.push('/interviews');
        }
    };

    // Helper: Check if interview is active
    const isInterviewActive = interviewStatus === InterviewStatus.ACTIVE ||
        interviewStatus === InterviewStatus.LISTENING ||
        interviewStatus === InterviewStatus.SPEAKING ||
        interviewStatus === InterviewStatus.PROCESSING;

    // Helper: Get current display message
    const getCurrentMessage = () => {
        if (error) return error;
        if (aiMessage) return aiMessage;
        if (currentResponse) return `You said: "${currentResponse}"`;
        if (currentQuestion) return currentQuestion;
        return interviewConfig.firstMessage;
    };

    // JSX Rendering
    return (
        <>
            {/* Top Section: Interview View */}
            <div className="call-view">
                {/* AI Interviewer Card */}
                <div className="card-interviewer">
                    <div className="avatar bg-black">
                        <Image src="/ai-avatar.png" alt="AI avatar" width={65} height={54} className="object-cover" />
                        {/* Visual indicator: AI is speaking */}
                        {isSpeaking && <span className="animate-speak"></span>}
                        {/* Visual indicator: Listening */}
                        {isListening && <span className="animate-pulse bg-red-500 rounded-full w-3 h-3 absolute top-0 right-0"></span>}
                        {/* Visual indicator: Muted */}
                        {isMuted && <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs absolute top-0 left-0">🔇</span>}
                    </div>
                    <h3>AI Interviewer</h3>
                    <p className="text-sm text-gray-500">
                        {interviewStatus === InterviewStatus.SPEAKING && "Speaking..."}
                        {interviewStatus === InterviewStatus.LISTENING && "Listening..."}
                        {interviewStatus === InterviewStatus.PROCESSING && "Processing..."}
                        {interviewStatus === InterviewStatus.ACTIVE && "Ready"}
                        {interviewStatus === InterviewStatus.INACTIVE && "Waiting to start"}
                    </p>
                </div>

                {/* User Profile Card */}
                <div className="card-border">
                    <div className="card-content">
                        {typeof window !== 'undefined' && window.localStorage.getItem('profileImage') ? (
                            <Image
                                src={window.localStorage.getItem('profileImage')!}
                                alt="User profile image"
                                width={120}
                                height={120}
                                className="rounded-full object-cover size-[120px]"
                            />
                        ) : (
                            <div className="rounded-full bg-black flex items-center justify-center size-[120px] text-4xl font-bold object-cover text-white">
                                {userName ? userName[0].toUpperCase() : '?'}
                            </div>
                        )}
                        <h3>{userName}</h3>
                        {questions && (
                            <p className="text-sm text-gray-500">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Middle Section: Current Message Display */}
            <div className="transcript-border">
                <div className="transcript">
                    <p
                        className={cn(
                            'transition-opacity duration-500',
                            error ? 'text-red-500' : 'text-white'
                        )}
                    >
                        {getCurrentMessage()}
                    </p>
                </div>
            </div>

            {/* Bottom Section: Control Buttons */}
            <div className="w-full flex justify-center gap-4">
                {interviewStatus === InterviewStatus.INACTIVE ? (
                    <button
                        className="relative btn-call"
                        onClick={handleStartInterview}
                        disabled={!questions || questions.length === 0}
                    >
                        <span className={cn(
                            "absolute animate-ping rounded-full opacity-75",
                            interviewStatus === InterviewStatus.CONNECTING && 'block'
                        )} />
                        <span>
                            {interviewStatus === InterviewStatus.CONNECTING ? 'Starting...' : 'Start Interview'}
                        </span>
                    </button>
                ) : isInterviewActive ? (
                    <>
                        {/* Input Mode Toggle */}
                        <div className="flex gap-2 mb-4">
                            <button
                                className={`px-4 py-2 rounded ${!isTextMode ? 'bg-primary-200 text-dark-100' : 'bg-dark-300 text-light-400'}`}
                                onClick={() => setIsTextMode(false)}
                            >
                                🎤 Voice
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${isTextMode ? 'bg-primary-200 text-dark-100' : 'bg-dark-300 text-light-400'}`}
                                onClick={() => setIsTextMode(true)}
                            >
                                ⌨️ Text
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${isMuted ? 'bg-red-500 text-white' : 'bg-dark-300 text-light-400'}`}
                                onClick={toggleMute}
                                title={isMuted ? 'Unmute AI' : 'Mute AI'}
                            >
                                {isMuted ? '🔇' : '🔊'}
                            </button>
                        </div>

                        {/* Input Controls */}
                        {isTextMode ? (
                            <div className="flex gap-2 w-full max-w-md">
                                <input
                                    type="text"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                                    placeholder="Type your answer here..."
                                    className="flex-1 px-4 py-2 bg-dark-300 border border-dark-400 rounded text-light-100 placeholder-light-400 focus:outline-none focus:border-primary-200"
                                    disabled={interviewStatus === InterviewStatus.PROCESSING}
                                />
                                <button
                                    className="btn-primary"
                                    onClick={handleTextSubmit}
                                    disabled={!textInput.trim() || interviewStatus === InterviewStatus.PROCESSING}
                                >
                                    Submit
                                </button>
                            </div>
                        ) : (
                            <button
                                className="btn-primary"
                                onClick={startListening}
                                disabled={isListening || isSpeaking || interviewStatus === InterviewStatus.PROCESSING}
                            >
                                {isListening ? 'Listening...' : 'Speak Answer'}
                            </button>
                        )}

                        <button
                            className="btn-disconnect mt-4"
                            onClick={handleStopInterview}
                        >
                            End Interview
                        </button>
                    </>
                ) : (
                    <button
                        className="btn-primary"
                        onClick={() => router.push('/interviews')}
                    >
                        Back to Interviews
                    </button>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                    <button
                        className="ml-2 text-red-900 underline"
                        onClick={() => setError(null)}
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </>
    );
};
