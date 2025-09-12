"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/actions/auth.action";
import AutocompleteInput from "@/components/AutocompleteInput";

// Define types for projects and research papers
interface Project {
  id: string;
  name: string;
  description: string;
  teamMembers: number;
  skillsRequired: string[];
  createdBy: string;
  createdById: string;
  createdAt: string;
  status: "open" | "in-progress" | "completed";
  type: "project";
  requests: ProjectRequest[];
}

interface ResearchPaper {
  id: string;
  name: string;
  description: string;
  teamMembers: number;
  skillsRequired: string[];
  createdBy: string;
  createdById: string;
  createdAt: string;
  status: "open" | "in-progress" | "completed";
  type: "research";
  requests: ProjectRequest[];
}

interface ProjectRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userSkills: string[];
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email?: string;
  skills?: string[];
}

type ProjectOrResearch = Project | ResearchPaper;

// Replace localStorage functions with API calls
const fetchAllProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("Failed to fetch projects");
    return await response.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

const fetchAllResearch = async (): Promise<ResearchPaper[]> => {
  try {
    const response = await fetch("/api/research");
    if (!response.ok) throw new Error("Failed to fetch research");
    return await response.json();
  } catch (error) {
    console.error("Error fetching research:", error);
    return [];
  }
};

const ProjectsPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredResearch, setFilteredResearch] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [selectedProjectForRequests, setSelectedProjectForRequests] =
    useState<ProjectOrResearch | null>(null);
  const [createType, setCreateType] = useState<"project" | "research">(
    "project"
  );

  // Form state for creating new project/research
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teamMembers: 1,
    skillsRequired: [] as string[],
    skillInput: "",
  });

  // Refs for form inputs to maintain focus
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const skillInputRef = useRef<HTMLInputElement>(null);

  // Load current user and data from API
  useEffect(() => {
    const fetchUserAndData = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setCurrentUser(userData);
          console.log("Current user loaded:", userData);

          // Fetch all projects and research from API (shared data)
          const [allProjects, allResearch] = await Promise.all([
            fetchAllProjects(),
            fetchAllResearch(),
          ]);

          setProjects(allProjects);
          setResearchPapers(allResearch);
        } else {
          setProjects([]);
          setResearchPapers([]);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndData();
  }, []);

  // Calculate skill match score - exact matching for better accuracy
  const calculateSkillMatchScore = (
    userSkills: string[],
    requiredSkills: string[]
  ): number => {
    if (
      !userSkills ||
      userSkills.length === 0 ||
      !requiredSkills ||
      requiredSkills.length === 0
    ) {
      return 0;
    }

    // Normalize skills for comparison (lowercase and trim)
    const normalizedUserSkills = userSkills.map((skill) =>
      skill.toLowerCase().trim()
    );
    const normalizedRequiredSkills = requiredSkills.map((skill) =>
      skill.toLowerCase().trim()
    );

    // Count exact matches
    const matchingSkills = normalizedUserSkills.filter((userSkill) =>
      normalizedRequiredSkills.includes(userSkill)
    );

    return matchingSkills.length;
  };

  // Sort items by skill match score (highest match first)
  const sortBySkillMatch = (
    items: ProjectOrResearch[]
  ): ProjectOrResearch[] => {
    if (!currentUser?.skills || currentUser.skills.length === 0) {
      // If user has no skills, return items sorted by creation date (newest first)
      return [...items].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return [...items].sort((a, b) => {
      const scoreA = calculateSkillMatchScore(
        currentUser.skills || [],
        a.skillsRequired
      );
      const scoreB = calculateSkillMatchScore(
        currentUser.skills || [],
        b.skillsRequired
      );

      // If scores are equal, sort by creation date (newest first)
      if (scoreA === scoreB) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      return scoreB - scoreA; // Higher score first
    });
  };

  // Filter and sort projects and research papers based on search query and skill match
  useEffect(() => {
    const filterItems = (items: ProjectOrResearch[], query: string) => {
      let filtered = items;

      if (query.trim()) {
        const searchTerm = query.toLowerCase().trim();
        filtered = items.filter(
          (item) =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.createdBy.toLowerCase().includes(searchTerm) ||
            item.skillsRequired.some((skill) =>
              skill.toLowerCase().includes(searchTerm)
            )
        );
      }

      return sortBySkillMatch(filtered);
    };

    setFilteredProjects(filterItems(projects, searchQuery) as Project[]);
    setFilteredResearch(
      filterItems(researchPapers, searchQuery) as ResearchPaper[]
    );
  }, [searchQuery, projects, researchPapers, currentUser?.skills]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-green-400 bg-green-400/20";
      case "in-progress":
        return "text-yellow-400 bg-yellow-400/20";
      case "completed":
        return "text-blue-400 bg-blue-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSkill = () => {
    const skill = formData.skillInput.trim();
    if (skill && !formData.skillsRequired.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skill],
        skillInput: "",
      }));
      // Maintain focus on skill input
      setTimeout(() => {
        skillInputRef.current?.focus();
      }, 0);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  // Simplified form validation - removed minimum character requirements
  const isFormValid = () => {
    return (
      formData.name.trim().length > 0 &&
      formData.description.trim().length > 0 &&
      formData.skillsRequired.length > 0 &&
      formData.teamMembers >= 1 &&
      formData.teamMembers <= 20
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid() || !currentUser) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newItemData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        teamMembers: formData.teamMembers,
        skillsRequired: formData.skillsRequired,
        createdBy: currentUser.name,
        createdById: currentUser.id,
        status: "open" as const,
        requests: [],
      };

      const endpoint =
        createType === "project" ? "/api/projects" : "/api/research";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItemData),
      });

      if (!response.ok) throw new Error("Failed to create");

      const newItem = await response.json();

      if (createType === "project") {
        setProjects((prev) => [newItem, ...prev]);
      } else {
        setResearchPapers((prev) => [newItem, ...prev]);
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        teamMembers: 1,
        skillsRequired: [],
        skillInput: "",
      });
      setShowCreateModal(false);
      toast.success(
        `${
          createType === "project" ? "Project" : "Research paper"
        } created successfully!`
      );
    } catch (error) {
      console.error("Error creating:", error);
      toast.error("Failed to create. Please try again.");
    }
  };

  const handleJoinRequest = async (item: ProjectOrResearch) => {
    if (!currentUser) {
      toast.error("Please log in to join projects");
      return;
    }

    if (item.createdById === currentUser.id) {
      toast.error("You cannot request to join your own project");
      return;
    }

    // Check if already requested
    const existingRequest = item.requests.find(
      (req) => req.userId === currentUser.id
    );
    if (existingRequest) {
      if (existingRequest.status === "pending") {
        toast.error("You have already requested to join this project");
      } else if (existingRequest.status === "accepted") {
        toast.success("Your request has been accepted!");
      } else {
        toast.error("Your previous request was rejected");
      }
      return;
    }

    try {
      const newRequest: ProjectRequest = {
        id: `req-${Date.now()}-${currentUser.id}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email || "",
        userSkills: currentUser.skills || [],
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Make API call to send join request
      const endpoint =
        item.type === "project" ? "/api/projects" : "/api/research";
      const response = await fetch(`${endpoint}/${item.id}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest),
      });

      if (!response.ok) throw new Error("Failed to send join request");

      // Update local state
      if (item.type === "project") {
        const updatedProjects = projects.map((p) =>
          p.id === item.id ? { ...p, requests: [...p.requests, newRequest] } : p
        );
        setProjects(updatedProjects);
      } else {
        const updatedResearch = researchPapers.map((r) =>
          r.id === item.id ? { ...r, requests: [...r.requests, newRequest] } : r
        );
        setResearchPapers(updatedResearch);
      }

      toast.success("Join request sent successfully!");
    } catch (error) {
      console.error("Error sending join request:", error);
      toast.error("Failed to send join request. Please try again.");
    }
  };

  const handleRequestAction = async (
    projectId: string,
    requestId: string,
    action: "accept" | "reject"
  ) => {
    try {
      // Make API call to update request status
      const item = selectedProjectForRequests;
      if (!item) return;

      const endpoint =
        item.type === "project" ? "/api/projects" : "/api/research";
      const response = await fetch(
        `${endpoint}/${projectId}/requests/${requestId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: action === "accept" ? "accepted" : "rejected",
          }),
        }
      );

      if (!response.ok) throw new Error(`Failed to ${action} request`);

      // Update local state
      const updateRequests = (items: ProjectOrResearch[]) =>
        items.map((item) =>
          item.id === projectId
            ? {
                ...item,
                requests: item.requests.map((req) =>
                  req.id === requestId
                    ? {
                        ...req,
                        status:
                          action === "accept"
                            ? ("accepted" as const)
                            : ("rejected" as const),
                      }
                    : req
                ),
              }
            : item
        );

      if (selectedProjectForRequests?.type === "project") {
        const updatedProjects = updateRequests(projects) as Project[];
        setProjects(updatedProjects);
      } else {
        const updatedResearch = updateRequests(
          researchPapers
        ) as ResearchPaper[];
        setResearchPapers(updatedResearch);
      }

      toast.success(`Request ${action}ed successfully!`);

      // Update the selected project for the modal
      if (selectedProjectForRequests) {
        const updatedProject = {
          ...selectedProjectForRequests,
          requests: selectedProjectForRequests.requests.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status:
                    action === "accept"
                      ? ("accepted" as const)
                      : ("rejected" as const),
                }
              : req
          ),
        };
        setSelectedProjectForRequests(updatedProject);
      }

      // If accepting, optionally send notification to user
      if (action === "accept") {
        const acceptedRequest = selectedProjectForRequests?.requests.find(
          (req) => req.id === requestId
        );
        if (acceptedRequest) {
          // You could add notification logic here
          console.log(`Notifying ${acceptedRequest.userName} about acceptance`);
        }
      }
    } catch (error) {
      console.error("Error handling request:", error);
      toast.error("Failed to handle request. Please try again.");
    }
  };

  const openRequestsModal = (item: ProjectOrResearch) => {
    setSelectedProjectForRequests(item);
    setShowRequestsModal(true);
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const [allProjects, allResearch] = await Promise.all([
        fetchAllProjects(),
        fetchAllResearch(),
      ]);

      setProjects(allProjects);
      setResearchPapers(allResearch);
      console.log("Data refreshed:", {
        projects: allProjects,
        research: allResearch,
      });
      toast.success("Data refreshed!");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  const ProjectCard = ({
    item,
    type,
  }: {
    item: ProjectOrResearch;
    type: "project" | "research";
  }) => {
    const isOwner = currentUser && item.createdById === currentUser.id;
    const userRequest = currentUser
      ? item.requests.find((req) => req.userId === currentUser.id)
      : null;
    const pendingRequestsCount = item.requests.filter(
      (req) => req.status === "pending"
    ).length;
    const totalRequestsCount = item.requests.length;

    const getRequestButtonText = () => {
      if (!userRequest) return "Request to Join";
      switch (userRequest.status) {
        case "pending":
          return "Request Pending";
        case "accepted":
          return "Request Accepted ✓";
        case "rejected":
          return "Request Rejected";
        default:
          return "Request to Join";
      }
    };

    const getRequestButtonStyle = () => {
      if (!userRequest) {
        return "bg-primary-200 text-dark-100 hover:bg-primary-100";
      }
      switch (userRequest.status) {
        case "pending":
          return "bg-yellow-600 text-white cursor-not-allowed";
        case "accepted":
          return "bg-green-600 text-white cursor-not-allowed";
        case "rejected":
          return "bg-red-600 text-white cursor-not-allowed";
        default:
          return "bg-primary-200 text-dark-100 hover:bg-primary-100";
      }
    };

    return (
      <div className="bg-dark-300 rounded-lg p-6 border border-dark-400 hover:border-primary-300 transition-all duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-light-100 font-semibold text-lg mb-2 line-clamp-2">
              {item.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                  item.status
                )}`}
              >
                {item.status.replace("-", " ")}
              </span>
              <span className="text-light-400 text-xs">•</span>
              <span className="text-light-400 text-xs">
                {getTimeAgo(item.createdAt)}
              </span>
            </div>
            <div className="text-light-300 text-sm mb-3">
              By {item.createdBy}
              {isOwner && <span className="text-primary-200 ml-2">(You)</span>}
            </div>
          </div>
        </div>

        <div className="text-light-300 text-sm mb-4 line-clamp-3">
          {item.description}
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-light-400 text-sm">Team Members:</span>
            <span className="text-primary-200 font-medium">
              {item.teamMembers}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {item.skillsRequired.map((skill, index) => {
              // Check if current user has this skill
              const userHasSkill = currentUser?.skills?.some(
                (userSkill) =>
                  userSkill.toLowerCase().trim() === skill.toLowerCase().trim()
              );

              return (
                <span
                  key={index}
                  className={`inline-block px-2 py-1 rounded text-xs ${
                    userHasSkill
                      ? "bg-green-400/20 text-green-400 font-medium"
                      : "bg-primary-200/20 text-primary-200"
                  }`}
                >
                  {skill}
                  {userHasSkill && " ✓"}
                </span>
              );
            })}
          </div>
          {currentUser?.skills && (
            <p className="text-light-400 text-xs mt-1">
              Skill match:{" "}
              {calculateSkillMatchScore(
                currentUser.skills,
                item.skillsRequired
              )}{" "}
              / {item.skillsRequired.length}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="text-light-400 text-xs">
            {type === "project" ? "Project" : "Research"} ID: {item.id}
          </div>
          <div className="flex gap-2">
            {isOwner ? (
              <button
                onClick={() => openRequestsModal(item)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 relative"
              >
                Manage Requests
                {pendingRequestsCount > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingRequestsCount}
                  </span>
                )}
                <span className="text-xs opacity-75 ml-1">
                  ({totalRequestsCount} total)
                </span>
              </button>
            ) : (
              <button
                onClick={() => handleJoinRequest(item)}
                disabled={!!userRequest}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${getRequestButtonStyle()}`}
              >
                {getRequestButtonText()}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const RequestsModal = () =>
    showRequestsModal &&
    selectedProjectForRequests && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-200 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-light-100 font-semibold text-xl mb-2">
                Join Requests for "{selectedProjectForRequests.name}"
              </h3>
              <p className="text-light-300 text-sm">
                Total requests: {selectedProjectForRequests.requests.length} |
                Pending:{" "}
                {
                  selectedProjectForRequests.requests.filter(
                    (r) => r.status === "pending"
                  ).length
                }{" "}
                | Accepted:{" "}
                {
                  selectedProjectForRequests.requests.filter(
                    (r) => r.status === "accepted"
                  ).length
                }{" "}
                | Rejected:{" "}
                {
                  selectedProjectForRequests.requests.filter(
                    (r) => r.status === "rejected"
                  ).length
                }
              </p>
            </div>
            <button
              onClick={() => setShowRequestsModal(false)}
              className="text-light-400 hover:text-light-100 text-xl"
            >
              ✕
            </button>
          </div>

          {selectedProjectForRequests.requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📥</div>
              <p className="text-light-300 text-lg">No requests yet</p>
              <p className="text-light-400 text-sm mt-2">
                When people request to join your{" "}
                {selectedProjectForRequests.type}, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filter by status */}
              <div className="flex gap-2 mb-4">
                <span className="text-light-200 text-sm">
                  Filter by status:
                </span>
                {/* You could add filter buttons here */}
              </div>

              {selectedProjectForRequests.requests
                .sort((a, b) => {
                  // Sort by status priority: pending first, then by date
                  if (a.status === "pending" && b.status !== "pending")
                    return -1;
                  if (b.status === "pending" && a.status !== "pending")
                    return 1;
                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                })
                .map((request) => (
                  <div
                    key={request.id}
                    className={`bg-dark-300 rounded-lg p-6 border transition-all duration-200 ${
                      request.status === "pending"
                        ? "border-yellow-400/50 shadow-md"
                        : "border-dark-400"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-light-100 font-semibold text-lg">
                            {request.userName}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === "pending"
                                ? "bg-yellow-400/20 text-yellow-400"
                                : request.status === "accepted"
                                ? "bg-green-400/20 text-green-400"
                                : "bg-red-400/20 text-red-400"
                            }`}
                          >
                            {request.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-light-300 text-sm mb-1">
                          📧 {request.userEmail}
                        </p>
                        <p className="text-light-400 text-sm">
                          🕒 Requested {getTimeAgo(request.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-light-300 text-sm font-medium">
                          Skills:
                        </span>
                        <span className="text-light-400 text-xs">
                          ({request.userSkills.length} total)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {request.userSkills.map((skill, index) => {
                          const isMatchingSkill =
                            selectedProjectForRequests.skillsRequired.some(
                              (reqSkill) =>
                                reqSkill.toLowerCase().trim() ===
                                skill.toLowerCase().trim()
                            );

                          return (
                            <span
                              key={index}
                              className={`inline-block px-3 py-1 rounded-full text-sm ${
                                isMatchingSkill
                                  ? "bg-green-400/20 text-green-400 font-medium border border-green-400/30"
                                  : "bg-primary-200/20 text-primary-200"
                              }`}
                            >
                              {skill}
                              {isMatchingSkill && " ✓"}
                            </span>
                          );
                        })}
                      </div>
                      <div className="mt-2 p-3 bg-dark-400/50 rounded-lg">
                        <p className="text-light-400 text-sm">
                          <strong className="text-green-400">
                            {calculateSkillMatchScore(
                              request.userSkills,
                              selectedProjectForRequests.skillsRequired
                            )}
                          </strong>{" "}
                          out of{" "}
                          <strong className="text-light-300">
                            {selectedProjectForRequests.skillsRequired.length}
                          </strong>{" "}
                          required skills matched
                          <span className="ml-2 text-xs">
                            (
                            {Math.round(
                              (calculateSkillMatchScore(
                                request.userSkills,
                                selectedProjectForRequests.skillsRequired
                              ) /
                                selectedProjectForRequests.skillsRequired
                                  .length) *
                                100
                            )}
                            % match)
                          </span>
                        </p>
                      </div>
                    </div>

                    {request.message && (
                      <div className="mb-4 p-4 bg-dark-400/50 rounded-lg">
                        <p className="text-light-300 text-sm font-medium mb-2">
                          📝 Personal Message:
                        </p>
                        <p className="text-light-200 text-sm italic leading-relaxed">
                          "{request.message}"
                        </p>
                      </div>
                    )}

                    {request.status === "pending" && (
                      <div className="flex gap-3 pt-4 border-t border-dark-400">
                        <button
                          onClick={() => {
                            console.log(
                              "Accept button clicked for request:",
                              request.id
                            );
                            handleRequestAction(
                              selectedProjectForRequests.id,
                              request.id,
                              "accept"
                            );
                          }}
                          className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          ✓ Accept Request
                        </button>
                        <button
                          onClick={() => {
                            console.log(
                              "Reject button clicked for request:",
                              request.id
                            );
                            handleRequestAction(
                              selectedProjectForRequests.id,
                              request.id,
                              "reject"
                            );
                          }}
                          className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          ✕ Reject Request
                        </button>
                      </div>
                    )}

                    {request.status === "accepted" && (
                      <div className="pt-4 border-t border-dark-400">
                        <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
                          <p className="text-green-400 text-sm font-medium">
                            ✓ Request Accepted
                          </p>
                          <p className="text-light-300 text-xs mt-1">
                            This user has been accepted to join your{" "}
                            {selectedProjectForRequests.type}.
                          </p>
                        </div>
                      </div>
                    )}

                    {request.status === "rejected" && (
                      <div className="pt-4 border-t border-dark-400">
                        <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-3">
                          <p className="text-red-400 text-sm font-medium">
                            ✕ Request Rejected
                          </p>
                          <p className="text-light-300 text-xs mt-1">
                            This request has been declined.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-dark-400">
            <div className="flex justify-between items-center">
              <div className="text-light-400 text-sm">
                💡 Tip: Users with higher skill matches are more likely to
                contribute effectively
              </div>
              <button
                onClick={() => setShowRequestsModal(false)}
                className="bg-dark-400 text-light-300 px-6 py-2 rounded-lg hover:bg-dark-300 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  const CreateModal = () =>
    showCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-200 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-light-100 font-semibold text-lg">
              Create New{" "}
              {createType === "project" ? "Project" : "Research Paper"}
            </h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-light-400 hover:text-light-100"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-light-200 text-sm font-medium mb-2">
                Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="project"
                    checked={createType === "project"}
                    onChange={(e) =>
                      setCreateType(e.target.value as "project" | "research")
                    }
                    className="mr-2"
                  />
                  <span className="text-light-300">Project</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="research"
                    checked={createType === "research"}
                    onChange={(e) =>
                      setCreateType(e.target.value as "project" | "research")
                    }
                    className="mr-2"
                  />
                  <span className="text-light-300">Research Paper</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-light-200 text-sm font-medium mb-2">
                Name *
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-light-100 focus:outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200"
                placeholder={`Enter ${createType} name`}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-light-200 text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                ref={descriptionInputRef}
                value={formData.description}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-light-100 focus:outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200"
                placeholder={`Describe your ${createType}...`}
                required
              />
            </div>

            <div>
              <label className="block text-light-200 text-sm font-medium mb-2">
                Number of Team Members (1-20)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.teamMembers}
                onChange={(e) =>
                  handleFormChange("teamMembers", parseInt(e.target.value) || 1)
                }
                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg text-light-100 focus:outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200"
              />
            </div>

            <div>
              <label className="block text-light-200 text-sm font-medium mb-2">
                Skills Required *
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  ref={skillInputRef}
                  type="text"
                  value={formData.skillInput}
                  onChange={(e) =>
                    handleFormChange("skillInput", e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-dark-300 border border-dark-400 rounded-lg text-light-100 focus:outline-none focus:border-primary-200 focus:ring-1 focus:ring-primary-200"
                  placeholder="Add a skill and press Enter"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  disabled={!formData.skillInput.trim()}
                  className="px-4 py-2 bg-primary-200 text-dark-100 rounded-lg hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-primary-200/20 text-primary-200 px-2 py-1 rounded text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-primary-200 hover:text-primary-100"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              {formData.skillsRequired.length === 0 && (
                <p className="text-orange-400 text-sm mt-1">
                  At least one skill is required
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-dark-400 text-light-300 rounded-lg hover:bg-dark-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid()}
                className="flex-1 px-4 py-3 bg-primary-200 text-dark-100 rounded-lg hover:bg-primary-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create {createType === "project" ? "Project" : "Research Paper"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-200"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light-100 mb-2">
            Projects & Research
          </h1>
          <p className="text-light-200">
            Discover and collaborate on exciting projects and research papers
          </p>
          {currentUser && (
            <p className="text-light-300 text-sm mt-2">
              Welcome back, {currentUser.name}!{" "}
              {currentUser.skills && currentUser.skills.length > 0
                ? "Projects are sorted by skill match."
                : "Complete your profile skills to see personalized matches."}
            </p>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-dark-200 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="max-w-md flex-1">
              <AutocompleteInput
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search by title, description, creator, or skills..."
                label="Search Projects & Research"
                apiEndpoint="/api/projects/search"
              />
            </div>
            <button
              onClick={handleRefresh}
              className="ml-4 px-4 py-2 bg-primary-200 text-dark-100 rounded-lg hover:bg-primary-100 transition-colors"
            >
              Refresh
            </button>
          </div>
          <p className="text-light-400 text-sm mt-2">
            Total: {projects.length} projects, {researchPapers.length} research
            papers
          </p>
        </div>

        {/* Projects and Research Papers Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Projects Section */}
          <div className="bg-dark-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-light-100 font-semibold text-xl">Projects</h3>
              <span className="text-light-300 text-sm">
                {filteredProjects.length} projects
              </span>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} item={project} type="project" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🚀</div>
                <p className="text-light-300">
                  {searchQuery
                    ? "No projects found matching your search"
                    : "No projects available yet"}
                </p>
                {!searchQuery && (
                  <p className="text-light-400 text-sm mt-2">
                    Be the first to create a project!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Research Papers Section */}
          <div className="bg-dark-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-light-100 font-semibold text-xl">
                Research Papers
              </h3>
              <span className="text-light-300 text-sm">
                {filteredResearch.length} papers
              </span>
            </div>

            {filteredResearch.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredResearch.map((paper) => (
                  <ProjectCard key={paper.id} item={paper} type="research" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-light-300">
                  {searchQuery
                    ? "No research papers found matching your search"
                    : "No research papers available yet"}
                </p>
                {!searchQuery && (
                  <p className="text-light-400 text-sm mt-2">
                    Be the first to create a research paper!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Create Button */}
        <div className="text-center">
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!currentUser}
            className="bg-primary-200 text-dark-100 px-8 py-4 rounded-lg font-semibold hover:bg-primary-100 transition-colors duration-200 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentUser
              ? "Create New Project or Research Paper"
              : "Login to Create Projects"}
          </button>
          {!currentUser && (
            <p className="text-light-400 text-sm mt-2">
              Please log in to create and join projects
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateModal />
      <RequestsModal />
    </div>
  );
};

export default ProjectsPage;
