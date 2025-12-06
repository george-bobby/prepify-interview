"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/actions/auth.action";
import AutocompleteInput from "@/components/AutocompleteInput";
import { db } from "@/firebase/client";
import { collection, onSnapshot, query, where } from "firebase/firestore";

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
  desiredRole?: string; // optional role intent provided by requester
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
  // Filter state
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSkill, setFilterSkill] = useState<string>("");
  const [filterTeamMin, setFilterTeamMin] = useState<number>(1);
  const [filterTeamMax, setFilterTeamMax] = useState<number>(50);
  const [projects, setProjects] = useState<Project[]>([]);
  const [researchPapers, setResearchPapers] = useState<ResearchPaper[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredResearch, setFilteredResearch] = useState<ResearchPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFloatingInput, setShowFloatingInput] = useState(true); // Always show floating input
  const [floatingInputExpanded, setFloatingInputExpanded] = useState<false | "description" | "team" | "skills">(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [selectedProjectForRequests, setSelectedProjectForRequests] =
    useState<ProjectOrResearch | null>(null);
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [selectedProjectForAccepted, setSelectedProjectForAccepted] =
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
    let initialLoaded = false;
    const initialFetch = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) setCurrentUser(userData);
        const [allProjects, allResearch] = await Promise.all([
          fetchAllProjects(),
          fetchAllResearch(),
        ]);
        setProjects(allProjects);
        setResearchPapers(allResearch);
      } catch (e) {
        console.error("Initial load failed", e);
      } finally {
        initialLoaded = true;
        setIsLoading(false);
      }
    };
    initialFetch();
    // Real-time listener for project & research updates (single collection filtered by type)
    const projectsRef = collection(db, "projects");
    const q = query(projectsRef);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const all = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
        const proj = all.filter((d) => d.type === "project");
        const research = all.filter((d) => d.type === "research");
        // If initial fetch not yet finished, skip overriding to prevent flicker
        setProjects(proj as Project[]);
        setResearchPapers(research as ResearchPaper[]);
      },
      (error) => {
        console.error("Realtime subscription error", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isLoading]);

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

      // Status filter
      if (filterStatus !== "all") {
        filtered = filtered.filter((item) => item.status === filterStatus);
      }

      // Skill filter
      if (filterSkill.trim()) {
        const skillTerm = filterSkill.toLowerCase().trim();
        filtered = filtered.filter((item) =>
          item.skillsRequired.some(
            (skill) => skill.toLowerCase().trim() === skillTerm
          )
        );
      }

      // Team size filter
      filtered = filtered.filter(
        (item) => item.teamMembers >= filterTeamMin && item.teamMembers <= filterTeamMax
      );

      return sortBySkillMatch(filtered);
    };

    setFilteredProjects(filterItems(projects, searchQuery) as Project[]);
    setFilteredResearch(
      filterItems(researchPapers, searchQuery) as ResearchPaper[]
    );
  }, [searchQuery, projects, researchPapers, currentUser?.skills, filterStatus, filterSkill, filterTeamMin, filterTeamMax]);

  // Combine all items for unified display
  const allFilteredItems = [...filteredProjects, ...filteredResearch];
  const sortedAllItems = sortBySkillMatch(allFilteredItems);

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
        return "text-success-100 bg-success-100/20";
      case "in-progress":
        return "text-yellow-400 bg-yellow-400/20";
      case "completed":
        return "text-primary-200 bg-primary-200/20";
      default:
        return "text-light-400 bg-light-400/20";
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
      setShowFloatingInput(false);
      setFloatingInputExpanded(false);
      toast.success(
        `${createType === "project" ? "Project" : "Research paper"
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
      toast.error(
        "You cannot request to join your own " +
        (item.type === "project" ? "project" : "research paper")
      );
      return;
    }

    try {
      // Capture desired role intent (simple prompt for initial implementation)
      const desiredRoleRaw = window.prompt(
        `Optional: What role or contribution focus do you intend for this ${item.type === "project" ? "project" : "research paper"
        }? (e.g., Frontend, Data, Writing)`
      );
      const desiredRole = desiredRoleRaw?.trim() || undefined;

      const newRequest: ProjectRequest = {
        id: `req-${Date.now()}-${currentUser.id}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email || "",
        userSkills: currentUser.skills || [],
        desiredRole,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Make API call to send join request
      const endpoint =
        item.type === "project"
          ? `/api/projects/${item.id}/requests`
          : `/api/research/${item.id}/requests`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send join request");
      }

      const updatedItem = await response.json();

      // Update local state
      if (item.type === "project") {
        setProjects((prev) =>
          prev.map((p) => (p.id === item.id ? updatedItem : p))
        );
        setFilteredProjects((prev) =>
          prev.map((p) => (p.id === item.id ? updatedItem : p))
        );
      } else {
        setResearchPapers((prev) =>
          prev.map((r) => (r.id === item.id ? updatedItem : r))
        );
        setFilteredResearch((prev) =>
          prev.map((r) => (r.id === item.id ? updatedItem : r))
        );
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${action} request`);
      }

      const updatedItem = await response.json();

      // Immediately update all related state
      if (item.type === "project") {
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updatedItem : p))
        );
        setFilteredProjects((prev) =>
          prev.map((p) => (p.id === projectId ? updatedItem : p))
        );
      } else {
        setResearchPapers((prev) =>
          prev.map((r) => (r.id === projectId ? updatedItem : r))
        );
        setFilteredResearch((prev) =>
          prev.map((r) => (r.id === projectId ? updatedItem : r))
        );
      }

      // Update the selected project for the modal
      setSelectedProjectForRequests(updatedItem);

      toast.success(`Request ${action}ed successfully!`);

      // Force a complete refresh to ensure all users see the update
      setTimeout(async () => {
        try {
          const [allProjects, allResearch] = await Promise.all([
            fetchAllProjects(),
            fetchAllResearch(),
          ]);
          setProjects(allProjects);
          setResearchPapers(allResearch);
        } catch (error) {
          console.error("Error during global refresh:", error);
        }
      }, 1000);
    } catch (error) {
      console.error("Error handling request:", error);
      toast.error("Failed to handle request. Please try again.");
    }
  };

  const openRequestsModal = (item: ProjectOrResearch) => {
    setSelectedProjectForRequests(item);
    setShowRequestsModal(true);
  };

  const openAcceptedModal = (item: ProjectOrResearch) => {
    setSelectedProjectForAccepted(item);
    setShowAcceptedModal(true);
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
      toast.success("Data refreshed!");
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (item: ProjectOrResearch) => {
    if (!currentUser || item.createdById !== currentUser.id) {
      toast.error("You can only delete your own projects");
      return;
    }

    const itemType = item.type === "project" ? "Project" : "Research paper";
    if (
      !confirm(
        `Are you sure you want to delete "${item.name}"?\n\nThis action cannot be undone and will remove all associated requests.`
      )
    ) {
      return;
    }

    try {
      const endpoint =
        item.type === "project"
          ? `/api/projects/${item.id}`
          : `/api/research/${item.id}`;

      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete");
      }

      // Update local state
      if (item.type === "project") {
        setProjects((prev) => prev.filter((p) => p.id !== item.id));
        setFilteredProjects((prev) => prev.filter((p) => p.id !== item.id));
      } else {
        setResearchPapers((prev) => prev.filter((r) => r.id !== item.id));
        setFilteredResearch((prev) => prev.filter((r) => r.id !== item.id));
      }

      toast.success(`${itemType} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error(
        `Failed to delete ${itemType.toLowerCase()}. Please try again.`
      );
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
    const acceptedCount = item.requests.filter(
      (req) => req.status === "accepted"
    ).length;
    const remainingSlots = Math.max(item.teamMembers - acceptedCount, 0);

    const getRequestButtonText = () => {
      if (!userRequest) return "Request to Join";
      switch (userRequest.status) {
        case "pending":
          return "Request Pending ⏳";
        case "accepted":
          return "Request Accepted ✅";
        case "rejected":
          return "Request Rejected ❌";
        default:
          return "Request to Join";
      }
    };

    const getRequestButtonStyle = () => {
      if (!userRequest) {
        return "bg-primary-200 text-dark-100";
      }
      switch (userRequest.status) {
        case "pending":
          return "bg-yellow-600/80 text-white cursor-not-allowed";
        case "accepted":
          return "bg-success-100/80 text-white cursor-not-allowed";
        case "rejected":
          return "bg-destructive-100/80 text-white cursor-not-allowed";
        default:
          return "bg-primary-200 text-dark-100";
      }
    };

    return (
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-2xl p-6 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
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
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-400 text-xs">
                {getTimeAgo(item.createdAt)}
              </span>
              {currentUser?.skills && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#c0fe72]/10 text-xs text-gray-300 border border-[#c0fe72]/30">
                  Match:
                  <span className="text-[#c0fe72] font-semibold">
                    {calculateSkillMatchScore(
                      currentUser.skills,
                      item.skillsRequired
                    )}
                    /{item.skillsRequired.length}
                  </span>
                  <span className="text-gray-400">
                    ({Math.round(
                      (calculateSkillMatchScore(
                        currentUser.skills,
                        item.skillsRequired
                      ) /
                        item.skillsRequired.length) * 100
                    )}% )
                  </span>
                </span>
              )}
            </div>
            <div className="text-gray-300 text-sm mb-3">
              By {item.createdBy}
              {isOwner && <span className="text-[#c0fe72] ml-2 font-semibold">(You)</span>}
            </div>
          </div>
          <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold shadow-lg ${type === "project"
            ? "bg-gradient-to-r from-[#c0fe72]/20 to-[#9cd052]/20 text-[#c0fe72] border border-[#c0fe72]/30"
            : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30"
            }`}>
            {type === "project" ? "Project" : "Research"}
          </span>
        </div>

        <div className="text-gray-300 text-sm mb-4 line-clamp-3">
          {item.description}
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-gray-400 text-sm">Team Members:</span>
            <span className="text-[#c0fe72] font-bold">
              {acceptedCount}/{item.teamMembers}
            </span>
            {remainingSlots > 0 ? (
              <span className="text-xs text-gray-400 ml-2">
                {remainingSlots} slot{remainingSlots === 1 ? "" : "s"} open
              </span>
            ) : (
              <span className="text-xs text-green-400 font-semibold ml-2">Full</span>
            )}
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
                  className={`inline-block px-2 py-1 rounded-lg text-xs ${userHasSkill
                    ? "bg-success-100/20 text-success-100 font-medium"
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
          <div className="flex gap-2">
            {isOwner ? (
              <>
                <button
                  onClick={() => openRequestsModal(item)}
                  className="bg-gradient-to-r from-[#c0fe72] to-[#9cd052] text-black px-4 py-2 rounded-lg font-bold transition-all duration-200 flex items-center"
                >
                  Manage Requests
                  {pendingRequestsCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
                {acceptedCount > 0 && (
                  <button
                    onClick={() => openAcceptedModal(item)}
                    className="bg-white/5 border border-[#c0fe72]/30 text-[#c0fe72] px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    View Team ({acceptedCount})
                  </button>
                )}
              </>
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-dark-200 border border-dark-300 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
              className="text-light-400 text-xl"
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
                    className={`bg-dark-300 rounded-2xl p-6 border transition-all duration-200 ${request.status === "pending"
                      ? "border-yellow-400/50 shadow-md"
                      : "border-dark-300"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-light-100 font-semibold text-lg">
                            {request.userName}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === "pending"
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
                              className={`inline-block px-3 py-1 rounded-full text-sm ${isMatchingSkill
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
                            handleRequestAction(
                              selectedProjectForRequests.id,
                              request.id,
                              "accept"
                            );
                          }}
                          className="flex-1 bg-success-100 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          ✓ Accept Request
                        </button>
                        <button
                          onClick={() => {
                            handleRequestAction(
                              selectedProjectForRequests.id,
                              request.id,
                              "reject"
                            );
                          }}
                          className="flex-1 bg-destructive-100 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          ✕ Reject Request
                        </button>
                      </div>
                    )}

                    {request.status === "accepted" && (
                      <div className="pt-4 border-t border-dark-400">
                        <div className="bg-success-100/10 border border-success-100/30 rounded-lg p-3">
                          <p className="text-success-100 text-sm font-medium">
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
                        <div className="bg-destructive-100/10 border border-destructive-100/30 rounded-lg p-3">
                          <p className="text-destructive-100 text-sm font-medium">
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
                className="bg-dark-300 text-light-100 px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );

  const AcceptedModal = () =>
    showAcceptedModal &&
    selectedProjectForAccepted && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-dark-200 border border-dark-300 rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-light-100 font-semibold text-xl mb-2">
                Team Members for "{selectedProjectForAccepted.name}"
              </h3>
              <p className="text-light-300 text-sm">
                Accepted: {
                  selectedProjectForAccepted.requests.filter(
                    (r) => r.status === "accepted"
                  ).length
                }
                /{selectedProjectForAccepted.teamMembers} &middot; Open Slots: {Math.max(
                  selectedProjectForAccepted.teamMembers -
                  selectedProjectForAccepted.requests.filter(
                    (r) => r.status === "accepted"
                  ).length,
                  0
                )}
              </p>
            </div>
            <button
              onClick={() => setShowAcceptedModal(false)}
              className="text-light-400 text-xl"
            >
              ✕
            </button>
          </div>

          {selectedProjectForAccepted.requests.filter(
            (r) => r.status === "accepted"
          ).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-light-300 text-lg">No team members yet</p>
              <p className="text-light-400 text-sm mt-2">
                Accept requests from contributors to build your team.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedProjectForAccepted.requests
                .filter((r) => r.status === "accepted")
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((member) => (
                  <div
                    key={member.id}
                    className="bg-dark-300 rounded-2xl p-6 border border-success-100/30"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-light-100 font-semibold text-lg">
                            {member.userName}
                          </h4>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-success-100/20 text-success-100">
                            ACCEPTED
                          </span>
                        </div>
                        <p className="text-light-300 text-sm mb-1">
                          📧 {member.userEmail}
                        </p>
                        {member.desiredRole && (
                          <p className="text-primary-200 text-xs mb-1">
                            Role Intent: {member.desiredRole}
                          </p>
                        )}
                        <p className="text-light-400 text-sm">
                          Joined {getTimeAgo(member.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-light-300 text-sm font-medium">
                          Skills:
                        </span>
                        <span className="text-light-400 text-xs">
                          ({member.userSkills.length} total)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.userSkills.map((skill, idx) => {
                          const matchesRequired =
                            selectedProjectForAccepted.skillsRequired.some(
                              (reqSkill) =>
                                reqSkill.toLowerCase().trim() ===
                                skill.toLowerCase().trim()
                            );
                          return (
                            <span
                              key={idx}
                              className={`inline-block px-3 py-1 rounded-full text-sm ${matchesRequired
                                  ? "bg-success-100/20 text-success-100 border border-success-100/30"
                                  : "bg-primary-200/20 text-primary-200"
                                }`}
                            >
                              {skill}
                              {matchesRequired && " ✓"}
                            </span>
                          );
                        })}
                      </div>
                      <div className="mt-3 p-3 bg-dark-400/40 rounded-lg text-xs text-light-400">
                        Match: {calculateSkillMatchScore(
                          member.userSkills,
                          selectedProjectForAccepted.skillsRequired
                        )}/{selectedProjectForAccepted.skillsRequired.length}
                        ({
                          Math.round(
                            (calculateSkillMatchScore(
                              member.userSkills,
                              selectedProjectForAccepted.skillsRequired
                            ) /
                              selectedProjectForAccepted.skillsRequired
                                .length) * 100
                          )
                        }%)
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-dark-400">
            <div className="flex justify-between items-center">
              <div className="text-light-400 text-sm">
                ✅ Tip: Cover remaining required skills to speed progress.
              </div>
              <button
                onClick={() => setShowAcceptedModal(false)}
                className="bg-dark-300 text-light-100 px-6 py-2 rounded-lg transition-colors duration-200"
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-dark-200 border border-dark-300 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-light-100 font-semibold text-lg">
              Create New{" "}
              {createType === "project" ? "Project" : "Research Paper"}
            </h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-light-400"
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
                className="w-full px-4 py-3 bg-dark-300 border border-input rounded-lg text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-200"
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
                className="w-full px-4 py-3 bg-dark-300 border border-input rounded-lg text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-200"
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
                className="w-full px-4 py-3 bg-dark-300 border border-input rounded-lg text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-200"
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
                  className="flex-1 px-4 py-2 bg-dark-300 border border-input rounded-lg text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  placeholder="Add a skill and press Enter"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  disabled={!formData.skillInput.trim()}
                  className="px-4 py-2 bg-primary-200 text-dark-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="text-primary-200"
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
                className="flex-1 px-4 py-3 bg-dark-300 text-light-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid()}
                className="flex-1 px-4 py-3 bg-primary-200 text-dark-100 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-700"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#c0fe72] absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-6 md:gap-10 relative min-h-screen bg-black">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0fe72]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 relative z-10">
        {/* Hero Banner Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#c0fe72]/30 rounded-3xl p-6 md:p-10 shadow-2xl shadow-[#c0fe72]/20 mb-8">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full w-fit">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <span className="text-purple-400 font-semibold text-sm">COLLABORATIVE IDEAS</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                Find Your Next{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c0fe72] to-purple-400">
                  Project Partner
                </span>
              </h1>
              <p className="text-lg text-gray-300">
                Discover projects and research opportunities that match your skills. Collaborate with talented individuals worldwide.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Skill Matching</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Real-time Updates</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Easy Collaboration</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-[#c0fe72] to-purple-500 rounded-full opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute inset-8 bg-gradient-to-br from-blue-500 to-[#c0fe72] rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute inset-0 flex items-center justify-center text-8xl">💡</div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <div className="bg-white/5 backdrop-blur-sm border border-[#c0fe72]/30 rounded-2xl p-4 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#c0fe72]">{sortedAllItems.length}</div>
              <div className="text-sm text-gray-400">Total Opportunities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-400">{filteredProjects.length}</div>
              <div className="text-sm text-gray-400">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-400">{filteredResearch.length}</div>
              <div className="text-sm text-gray-400">Research Papers</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <AutocompleteInput
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search projects and research papers by title, skills, or creator..."
              label=""
              apiEndpoint="/api/projects/search"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-900/90 to-black/90 border-2 border-gray-700/50 rounded-2xl p-5 md:p-6 mb-8 shadow-2xl">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#c0fe72]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter Options
          </h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 font-medium">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-black/60 border-2 border-gray-700/50 focus:border-[#c0fe72]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#c0fe72]/30 transition-all"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 font-medium">Exact Skill</label>
              <input
                type="text"
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                placeholder="e.g. React, Python"
                className="bg-black/60 border-2 border-gray-700/50 focus:border-[#c0fe72]/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c0fe72]/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 font-medium">Min Team Size</label>
              <input
                type="number"
                min={1}
                max={50}
                value={filterTeamMin}
                onChange={(e) => setFilterTeamMin(parseInt(e.target.value) || 1)}
                className="bg-black/60 border-2 border-gray-700/50 focus:border-[#c0fe72]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#c0fe72]/30 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-400 font-medium">Max Team Size</label>
              <input
                type="number"
                min={filterTeamMin}
                max={200}
                value={filterTeamMax}
                onChange={(e) => setFilterTeamMax(parseInt(e.target.value) || filterTeamMin)}
                className="bg-black/60 border-2 border-gray-700/50 focus:border-[#c0fe72]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#c0fe72]/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Projects & Research Papers Section */}
        <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border-2 border-gray-700/30 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm">

          {sortedAllItems.length > 0 ? (
            <div className="grid gap-5 md:gap-6">
              {sortedAllItems.map((item) => (
                <ProjectCard
                  key={item.id}
                  item={item}
                  type={item.type === "project" ? "project" : "research"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-primary-100 mb-2">
                {searchQuery
                  ? "No matches found"
                  : "No projects or research papers yet"}
              </h3>
              <p className="text-light-400">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Be the first to create a project or research paper!"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Input Container*/}
      {showFloatingInput && currentUser && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
          <div className="bg-dark-200 border-2 border-primary-200/30 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {/* Expanded Content - Now appears above the main input */}
            {floatingInputExpanded && (
              <div className="border-b border-dark-300 p-4">
                {floatingInputExpanded === "description" && (
                  <div>
                    <label className="block text-light-200 text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange("description", e.target.value)}
                      placeholder={`Describe your ${createType} in detail...`}
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-300 border border-input rounded-lg text-light-100 placeholder-light-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                  </div>
                )}

                {floatingInputExpanded === "team" && (
                  <div>
                    <label className="block text-light-200 text-sm font-medium mb-2">
                      Team Size
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={formData.teamMembers}
                        onChange={(e) => handleFormChange("teamMembers", parseInt(e.target.value))}
                        className="flex-1 h-2 bg-dark-300 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-light-100 font-medium w-12 text-center">
                        {formData.teamMembers}
                      </span>
                    </div>
                  </div>
                )}

                {floatingInputExpanded === "skills" && (
                  <div>
                    <label className="block text-light-200 text-sm font-medium mb-2">
                      Required Skills
                    </label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={formData.skillInput}
                        onChange={(e) => handleFormChange("skillInput", e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="Type a skill and press Enter"
                        className="flex-1 px-4 py-2 bg-dark-300 border border-input rounded-lg text-light-100 placeholder-light-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        disabled={!formData.skillInput.trim()}
                        className="px-4 py-2 bg-primary-200 text-dark-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                    {formData.skillsRequired.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.skillsRequired.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 bg-primary-200/20 text-primary-200 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="text-primary-200/70"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Main Input Container */}
            <div className="relative">
              <div className="flex items-center p-4">
                {/* Toggle Pills */}
                <div className="flex bg-dark-300 rounded-full p-1 mr-3">
                  <button
                    onClick={() => setCreateType("project")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${createType === "project"
                      ? "bg-primary-200 text-dark-100 shadow-md"
                      : "text-light-400"
                      }`}
                  >
                    Project
                  </button>
                  <button
                    onClick={() => setCreateType("research")}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${createType === "research"
                      ? "bg-purple-500 text-white shadow-md"
                      : "text-light-400"
                      }`}
                  >
                    Research
                  </button>
                </div>

                {/* Main Input */}
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder={createType === "project" ? "Project title" : "Research title"}
                  className="flex-1 bg-transparent text-light-100 placeholder-light-400 text-lg focus:outline-none"
                />

                {/* Action Icons */}
                <div className="flex items-center gap-2 ml-3">
                  <button
                    type="button"
                    onClick={() => setFloatingInputExpanded(floatingInputExpanded === "description" ? false : "description")}
                    className={`p-2 rounded-lg transition-all duration-200 ${floatingInputExpanded === "description"
                      ? "bg-primary-200/20 text-primary-200"
                      : "text-light-400"
                      }`}
                    title="Add Description"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFloatingInputExpanded(floatingInputExpanded === "team" ? false : "team")}
                    className={`p-2 rounded-lg transition-all duration-200 ${floatingInputExpanded === "team"
                      ? "bg-primary-200/20 text-primary-200"
                      : "text-light-400"
                      }`}
                    title="Set Team Size"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFloatingInputExpanded(floatingInputExpanded === "skills" ? false : "skills")}
                    className={`p-2 rounded-lg transition-all duration-200 ${floatingInputExpanded === "skills"
                      ? "bg-primary-200/20 text-primary-200"
                      : "text-light-400"
                      }`}
                    title="Add Skills"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z" />
                    </svg>
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    className="p-2 rounded-lg bg-primary-200 text-dark-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Create"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateModal />
      <RequestsModal />
    </main>
  );
};

export default ProjectsPage;
