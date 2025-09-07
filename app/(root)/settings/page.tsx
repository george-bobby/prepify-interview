import React from 'react';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';

const AccountSettingsPage = async () => {
    const user = await getCurrentUser();
    
    if (!user) {
        redirect('/signin');
    }

    return (
        <div className="min-h-screen bg-dark-100 py-8">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-dark-200 rounded-lg border border-dark-300 p-6">
                    <h1 className="text-2xl font-bold text-light-100 mb-6">Account Settings</h1>
                    
                    {/* Profile Information */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-light-100 mb-4">Profile Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-light-200 mb-2">
                                    Name
                                </label>
                                <div className="bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-100">
                                    {user.name}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-light-200 mb-2">
                                    Email
                                </label>
                                <div className="bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-100">
                                    {user.email || 'Not provided'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-light-200 mb-2">
                                    User ID
                                </label>
                                <div className="bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-100 font-mono text-sm">
                                    {user.id}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Statistics */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-light-100 mb-4">Account Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-dark-300 rounded-lg p-4">
                                <div className="text-2xl font-bold text-primary-200">
                                    {user.credits || 0}
                                </div>
                                <div className="text-sm text-light-200">Credits Remaining</div>
                            </div>
                            
                            <div className="bg-dark-300 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-400">
                                    {user.completedInterviews || 0}
                                </div>
                                <div className="text-sm text-light-200">Interviews Completed</div>
                            </div>
                            
                            <div className="bg-dark-300 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-400">
                                    {user.coursesEnrolled || 0}
                                </div>
                                <div className="text-sm text-light-200">Courses Enrolled</div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-light-100 mb-4">Preferences</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-light-100 font-medium">Email Notifications</div>
                                    <div className="text-sm text-light-200">Receive updates about new features and courses</div>
                                </div>
                                <div className="bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-200 text-sm">
                                    Coming Soon
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-light-100 font-medium">Interview Reminders</div>
                                    <div className="text-sm text-light-200">Get reminded about scheduled practice sessions</div>
                                </div>
                                <div className="bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-200 text-sm">
                                    Coming Soon
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        <h2 className="text-lg font-semibold text-light-100 mb-4">Account Actions</h2>
                        <div className="space-y-3">
                            <button className="w-full sm:w-auto bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium py-2 px-4 rounded-md transition-colors">
                                Edit Profile (Coming Soon)
                            </button>
                            
                            <button className="w-full sm:w-auto bg-dark-300 hover:bg-dark-400 text-light-100 font-medium py-2 px-4 rounded-md transition-colors border border-dark-400">
                                Change Password (Coming Soon)
                            </button>
                            
                            <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                                Delete Account (Coming Soon)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsPage;
