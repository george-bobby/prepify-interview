"use client";

import React, { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";
import SubscriptionSection from "@/components/SubscriptionSection";

const AccountSettingsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Edit profile states
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>("");
  const [editedEmail, setEditedEmail] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      if (!userData) {
        redirect("/signin");
        return;
      }
      setUser(userData);
      setSkills(userData.skills || []);
      setEditedName(userData.name || "");
      setEditedEmail(userData.email || "");
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Skills management functions
  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill: string) => skill !== skillToRemove));
  };

  // Profile editing functions
  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail,
          skills: skills,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditingProfile(false);

      // Show success message (you can add a toast library for better UX)
      console.log("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      // Show error message (you can add a toast library for better UX)
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || "");
    setEditedEmail(user?.email || "");
    setSkills(user?.skills || []);
    setIsEditingProfile(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="text-light-100">Loading...</div>
      </div>
    );
  }

  if (!user) {
    redirect("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-100 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-dark-200 rounded-lg border border-dark-300 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-light-100">
              Account Settings
            </h1>
            {!isEditingProfile ? (
              <button
                onClick={handleEditProfile}
                className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProfile}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-light-100 mb-4">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-200 mb-2">
                  Name
                </label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-100 focus:border-primary-200 focus:outline-none"
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-100">
                    {user.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-light-200 mb-2">
                  Email
                </label>
                {isEditingProfile ? (
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-100 focus:border-primary-200 focus:outline-none"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-100">
                    {user.email || "Not provided"}
                  </div>
                )}
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

          {/* Skills Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-light-100 mb-4">
              Skills
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-light-200 mb-2">
                  Current Skills
                </label>
                <div className="bg-dark-300 border border-dark-400 rounded-md p-3 min-h-[100px]">
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-200 text-dark-100 font-medium"
                        >
                          {skill}
                          <button
                            className="ml-2 hover:bg-primary-300 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                            title="Remove skill"
                            onClick={() => removeSkill(skill)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-light-200 text-sm italic">
                      No skills added yet. Start by adding your first skill
                      below.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-light-200 mb-2">
                  Add New Skill
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., JavaScript, React, Node.js"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-100 placeholder-light-300 focus:border-primary-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium py-2 px-4 rounded-md transition-colors whitespace-nowrap"
                  >
                    Add Skill
                  </button>
                </div>
                <div className="mt-2 text-xs text-light-300">
                  Press Enter or click "Add Skill" to add. You can add technical
                  skills, soft skills, or any expertise relevant to your career.
                </div>
              </div>

              {/* Suggested Skills */}
              <div>
                <label className="block text-sm font-medium text-light-200 mb-2">
                  Suggested Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "JavaScript",
                    "Python",
                    "React",
                    "Node.js",
                    "SQL",
                    "Git",
                    "AWS",
                    "Docker",
                    "Communication",
                    "Leadership",
                    "Problem Solving",
                    "Team Work",
                  ].map((skill: string) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSuggestedSkill(skill)}
                      disabled={skills.includes(skill)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors border border-dark-500 ${skills.includes(skill)
                        ? "bg-dark-500 text-light-300 cursor-not-allowed"
                        : "bg-dark-400 hover:bg-primary-200 hover:text-dark-100 text-light-200"
                        }`}
                    >
                      {skill}
                      {!skills.includes(skill) && (
                        <span className="ml-1 text-xs">+</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-xs text-light-300">
                  Click on any suggested skill to add it to your profile.
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Information */}
          <SubscriptionSection />

          {/* Account Statistics */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-light-100 mb-4">
              Account Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-300 rounded-lg p-4">
                <div className="text-2xl font-bold text-primary-200">
                  {user.isProSubscriber ? "∞" : user.credits || 0}
                </div>
                <div className="text-sm text-light-200">
                  {user.isProSubscriber
                    ? "100 Credits"
                    : "100 Remaining"}
                </div>
              </div>

              <div className="bg-dark-300 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  {user.completedInterviews || 0}
                </div>
                <div className="text-sm text-light-200">
                  Interviews Completed
                </div>
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
          {/* <div className="mb-8">
            <h2 className="text-lg font-semibold text-light-100 mb-4">
              Preferences
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-light-100 font-medium">
                    Email Notifications
                  </div>
                  <div className="text-sm text-light-200">
                    Receive updates about new features and courses
                  </div>
                </div>
                <div className="bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-200 text-sm">
                  Coming Soon
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-light-100 font-medium">
                    Interview Reminders
                  </div>
                  <div className="text-sm text-light-200">
                    Get reminded about scheduled practice sessions
                  </div>
                </div>
                <div className="bg-dark-300 border border-dark-400 rounded-md px-3 py-2 text-light-200 text-sm">
                  Coming Soon
                </div>
              </div>
            </div>
          </div> */}

          {/* Actions */}
          {/* <div>
            <h2 className="text-lg font-semibold text-light-100 mb-4">
              Account Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full sm:w-auto bg-dark-300 hover:bg-dark-400 text-light-100 font-medium py-2 px-4 rounded-md transition-colors border border-dark-400">
                Change Password (Coming Soon)
              </button>

              <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Delete Account (Coming Soon)
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
