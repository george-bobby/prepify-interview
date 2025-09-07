// Course API integration with multiple data sources
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: number;
  category: string;
  image: string;
  rating?: number;
  students?: number;
  price?: string;
  url?: string;
  source: 'internal' | 'freeCodeCamp' | 'edX' | 'coursera' | 'udemy';
  tags?: string[];
  lastUpdated?: string;
}

// Free educational content from various sources
const freeCodeCampCourses: Course[] = [
  {
    id: 'fcc-1',
    title: 'JavaScript Algorithms and Data Structures',
    description: 'Learn JavaScript fundamentals and solve algorithmic challenges to prepare for technical interviews.',
    instructor: 'freeCodeCamp',
    duration: '300 hours',
    level: 'Intermediate',
    lessons: 50,
    category: 'Technical',
    image: '💻',
    rating: 4.8,
    students: 500000,
    price: 'Free',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
    source: 'freeCodeCamp',
    tags: ['JavaScript', 'Algorithms', 'Data Structures'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'fcc-2',
    title: 'Responsive Web Design',
    description: 'Master HTML, CSS, and responsive design principles for front-end development interviews.',
    instructor: 'freeCodeCamp',
    duration: '300 hours',
    level: 'Beginner',
    lessons: 45,
    category: 'Technical',
    image: '🎨',
    rating: 4.7,
    students: 800000,
    price: 'Free',
    url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
    source: 'freeCodeCamp',
    tags: ['HTML', 'CSS', 'Responsive Design'],
    lastUpdated: '2024-02-01'
  },
  {
    id: 'fcc-3',
    title: 'Back End Development and APIs',
    description: 'Learn Node.js, Express, and database management for backend engineering roles.',
    instructor: 'freeCodeCamp',
    duration: '200 hours',
    level: 'Intermediate',
    lessons: 35,
    category: 'Technical',
    image: '⚙️',
    rating: 4.6,
    students: 300000,
    price: 'Free',
    url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
    source: 'freeCodeCamp',
    tags: ['Node.js', 'Express', 'APIs'],
    lastUpdated: '2024-01-20'
  },
  {
    id: 'fcc-4',
    title: 'Front End Development Libraries',
    description: 'Master React, Redux, and modern front-end frameworks for web development interviews.',
    instructor: 'freeCodeCamp',
    duration: '300 hours',
    level: 'Intermediate',
    lessons: 40,
    category: 'Technical',
    image: '⚛️',
    rating: 4.7,
    students: 450000,
    price: 'Free',
    url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
    source: 'freeCodeCamp',
    tags: ['React', 'Redux', 'Frontend'],
    lastUpdated: '2024-01-25'
  },
  {
    id: 'fcc-5',
    title: 'Data Visualization',
    description: 'Learn D3.js and data visualization techniques for technical interviews.',
    instructor: 'freeCodeCamp',
    duration: '300 hours',
    level: 'Advanced',
    lessons: 35,
    category: 'Technical',
    image: '📊',
    rating: 4.5,
    students: 200000,
    price: 'Free',
    url: 'https://www.freecodecamp.org/learn/data-visualization/',
    source: 'freeCodeCamp',
    tags: ['D3.js', 'Data Visualization', 'Charts'],
    lastUpdated: '2024-01-18'
  },
  {
    id: 'fcc-6',
    title: 'Machine Learning with Python',
    description: 'Introduction to machine learning concepts and Python libraries for ML interviews.',
    instructor: 'freeCodeCamp',
    duration: '300 hours',
    level: 'Advanced',
    lessons: 45,
    category: 'Technical',
    image: '🤖',
    rating: 4.6,
    students: 350000,
    price: 'Free',
    url: 'https://www.freecodecamp.org/learn/machine-learning-with-python/',
    source: 'freeCodeCamp',
    tags: ['Python', 'Machine Learning', 'AI'],
    lastUpdated: '2024-02-05'
  }
];

const edXCourses: Course[] = [
  {
    id: 'edx-1',
    title: 'Introduction to Computer Science',
    description: 'Harvard\'s CS50 - Learn computational thinking and problem-solving skills.',
    instructor: 'Harvard University',
    duration: '12 weeks',
    level: 'Beginner',
    lessons: 24,
    category: 'Technical',
    image: '🎓',
    rating: 4.9,
    students: 1000000,
    price: 'Free (Certificate: $99)',
    url: 'https://www.edx.org/course/introduction-computer-science-harvardx-cs50x',
    source: 'edX',
    tags: ['Computer Science', 'Programming', 'Problem Solving'],
    lastUpdated: '2024-01-10'
  },
  {
    id: 'edx-2',
    title: 'Data Structures and Algorithms',
    description: 'MIT\'s comprehensive course on algorithms and data structures for technical interviews.',
    instructor: 'MIT',
    duration: '16 weeks',
    level: 'Advanced',
    lessons: 32,
    category: 'Technical',
    image: '🧮',
    rating: 4.8,
    students: 250000,
    price: 'Free (Certificate: $149)',
    url: 'https://www.edx.org/course/introduction-to-algorithms',
    source: 'edX',
    tags: ['Algorithms', 'Data Structures', 'MIT'],
    lastUpdated: '2024-02-05'
  },
  {
    id: 'edx-3',
    title: 'System Design and Architecture',
    description: 'Learn to design scalable systems and prepare for system design interviews.',
    instructor: 'UC San Diego',
    duration: '10 weeks',
    level: 'Advanced',
    lessons: 20,
    category: 'System Design',
    image: '🏗️',
    rating: 4.7,
    students: 150000,
    price: 'Free (Certificate: $99)',
    url: 'https://www.edx.org/course/software-engineering',
    source: 'edX',
    tags: ['System Design', 'Architecture', 'Scalability'],
    lastUpdated: '2024-01-25'
  },
  {
    id: 'edx-4',
    title: 'Python for Data Science',
    description: 'Microsoft\'s comprehensive Python course for data science and analytics interviews.',
    instructor: 'Microsoft',
    duration: '8 weeks',
    level: 'Intermediate',
    lessons: 28,
    category: 'Technical',
    image: '🐍',
    rating: 4.6,
    students: 180000,
    price: 'Free (Certificate: $99)',
    url: 'https://www.edx.org/course/python-for-data-science',
    source: 'edX',
    tags: ['Python', 'Data Science', 'Analytics'],
    lastUpdated: '2024-01-30'
  },
  {
    id: 'edx-5',
    title: 'Cloud Computing Fundamentals',
    description: 'AWS fundamentals and cloud architecture for cloud engineering interviews.',
    instructor: 'Amazon Web Services',
    duration: '6 weeks',
    level: 'Intermediate',
    lessons: 18,
    category: 'Technical',
    image: '☁️',
    rating: 4.5,
    students: 120000,
    price: 'Free (Certificate: $79)',
    url: 'https://www.edx.org/course/aws-cloud-fundamentals',
    source: 'edX',
    tags: ['AWS', 'Cloud Computing', 'DevOps'],
    lastUpdated: '2024-02-12'
  }
];

const behavioralCourses: Course[] = [
  {
    id: 'behavioral-1',
    title: 'Mastering Behavioral Interviews',
    description: 'Learn the STAR method and practice common behavioral interview questions.',
    instructor: 'Interview Experts',
    duration: '4 weeks',
    level: 'Beginner',
    lessons: 16,
    category: 'Behavioral',
    image: '💬',
    rating: 4.5,
    students: 75000,
    price: 'Free',
    source: 'internal',
    tags: ['STAR Method', 'Communication', 'Leadership'],
    lastUpdated: '2024-02-10'
  },
  {
    id: 'behavioral-2',
    title: 'Leadership and Management Skills',
    description: 'Develop leadership qualities and management skills for senior-level positions.',
    instructor: 'Career Coaches',
    duration: '6 weeks',
    level: 'Advanced',
    lessons: 24,
    category: 'Leadership',
    image: '👥',
    rating: 4.6,
    students: 45000,
    price: 'Free',
    source: 'internal',
    tags: ['Leadership', 'Management', 'Team Building'],
    lastUpdated: '2024-01-30'
  },
  {
    id: 'behavioral-3',
    title: 'Emotional Intelligence at Work',
    description: 'Develop emotional intelligence skills for better workplace relationships and interviews.',
    instructor: 'Psychology Experts',
    duration: '3 weeks',
    level: 'Beginner',
    lessons: 12,
    category: 'Behavioral',
    image: '🧠',
    rating: 4.4,
    students: 32000,
    price: 'Free',
    source: 'internal',
    tags: ['Emotional Intelligence', 'Soft Skills', 'Psychology'],
    lastUpdated: '2024-02-08'
  },
  {
    id: 'behavioral-4',
    title: 'Conflict Resolution and Teamwork',
    description: 'Master conflict resolution and collaborative skills for team-based interviews.',
    instructor: 'HR Specialists',
    duration: '4 weeks',
    level: 'Intermediate',
    lessons: 18,
    category: 'Behavioral',
    image: '🤝',
    rating: 4.3,
    students: 28000,
    price: 'Free',
    source: 'internal',
    tags: ['Conflict Resolution', 'Teamwork', 'Collaboration'],
    lastUpdated: '2024-01-28'
  }
];

const careerCourses: Course[] = [
  {
    id: 'career-1',
    title: 'Resume Writing and Optimization',
    description: 'Create ATS-friendly resumes that get you noticed by recruiters.',
    instructor: 'HR Professionals',
    duration: '2 weeks',
    level: 'Beginner',
    lessons: 8,
    category: 'Career',
    image: '📄',
    rating: 4.4,
    students: 120000,
    price: 'Free',
    source: 'internal',
    tags: ['Resume', 'ATS', 'Career Development'],
    lastUpdated: '2024-02-15'
  },
  {
    id: 'career-2',
    title: 'Salary Negotiation Mastery',
    description: 'Learn proven strategies to negotiate better compensation packages.',
    instructor: 'Negotiation Experts',
    duration: '3 weeks',
    level: 'Intermediate',
    lessons: 12,
    category: 'Negotiation',
    image: '💰',
    rating: 4.7,
    students: 85000,
    price: 'Free',
    source: 'internal',
    tags: ['Negotiation', 'Salary', 'Compensation'],
    lastUpdated: '2024-02-08'
  },
  {
    id: 'career-3',
    title: 'LinkedIn Profile Optimization',
    description: 'Build a compelling LinkedIn profile that attracts recruiters and opportunities.',
    instructor: 'Social Media Experts',
    duration: '1 week',
    level: 'Beginner',
    lessons: 6,
    category: 'Career',
    image: '💼',
    rating: 4.2,
    students: 95000,
    price: 'Free',
    source: 'internal',
    tags: ['LinkedIn', 'Personal Branding', 'Networking'],
    lastUpdated: '2024-02-12'
  },
  {
    id: 'career-4',
    title: 'Portfolio Development for Developers',
    description: 'Create an impressive portfolio that showcases your technical skills and projects.',
    instructor: 'Senior Developers',
    duration: '3 weeks',
    level: 'Intermediate',
    lessons: 15,
    category: 'Career',
    image: '🎨',
    rating: 4.6,
    students: 67000,
    price: 'Free',
    source: 'internal',
    tags: ['Portfolio', 'Projects', 'Showcase'],
    lastUpdated: '2024-01-22'
  }
];

// Additional courses from various online platforms
const youtubeCourses: Course[] = [
  {
    id: 'yt-1',
    title: 'Complete React Course',
    description: 'Full React.js course covering hooks, context, and modern patterns for frontend interviews.',
    instructor: 'Traversy Media',
    duration: '12 hours',
    level: 'Intermediate',
    lessons: 25,
    category: 'Technical',
    image: '⚛️',
    rating: 4.8,
    students: 890000,
    price: 'Free',
    url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
    source: 'freeCodeCamp',
    tags: ['React', 'JavaScript', 'Frontend'],
    lastUpdated: '2024-01-15'
  },
  {
    id: 'yt-2',
    title: 'Python Full Course for Beginners',
    description: 'Complete Python programming course from basics to advanced concepts.',
    instructor: 'Programming with Mosh',
    duration: '6 hours',
    level: 'Beginner',
    lessons: 20,
    category: 'Technical',
    image: '🐍',
    rating: 4.9,
    students: 1200000,
    price: 'Free',
    url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
    source: 'freeCodeCamp',
    tags: ['Python', 'Programming', 'Basics'],
    lastUpdated: '2024-01-20'
  },
  {
    id: 'yt-3',
    title: 'Docker Tutorial for Beginners',
    description: 'Learn Docker containerization for DevOps and deployment interviews.',
    instructor: 'TechWorld with Nana',
    duration: '3 hours',
    level: 'Beginner',
    lessons: 12,
    category: 'Technical',
    image: '🐳',
    rating: 4.7,
    students: 450000,
    price: 'Free',
    url: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
    source: 'freeCodeCamp',
    tags: ['Docker', 'DevOps', 'Containers'],
    lastUpdated: '2024-02-01'
  },
  {
    id: 'yt-4',
    title: 'System Design Interview Prep',
    description: 'Comprehensive system design concepts for senior engineering interviews.',
    instructor: 'Gaurav Sen',
    duration: '8 hours',
    level: 'Advanced',
    lessons: 16,
    category: 'System Design',
    image: '🏗️',
    rating: 4.8,
    students: 320000,
    price: 'Free',
    url: 'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX',
    source: 'freeCodeCamp',
    tags: ['System Design', 'Scalability', 'Architecture'],
    lastUpdated: '2024-01-28'
  },
  {
    id: 'yt-5',
    title: 'Git and GitHub Complete Course',
    description: 'Master version control with Git and GitHub for collaborative development.',
    instructor: 'Kunal Kushwaha',
    duration: '4 hours',
    level: 'Beginner',
    lessons: 15,
    category: 'Technical',
    image: '📚',
    rating: 4.6,
    students: 280000,
    price: 'Free',
    url: 'https://www.youtube.com/watch?v=apGV9Kg7ics',
    source: 'freeCodeCamp',
    tags: ['Git', 'GitHub', 'Version Control'],
    lastUpdated: '2024-02-05'
  }
];

const courseraFreeCourses: Course[] = [
  {
    id: 'coursera-1',
    title: 'Google IT Support Professional Certificate',
    description: 'Comprehensive IT support training covering troubleshooting and customer service.',
    instructor: 'Google',
    duration: '6 months',
    level: 'Beginner',
    lessons: 120,
    category: 'Technical',
    image: '🔧',
    rating: 4.6,
    students: 500000,
    price: 'Free (7-day trial)',
    url: 'https://www.coursera.org/professional-certificates/google-it-support',
    source: 'coursera',
    tags: ['IT Support', 'Google', 'Troubleshooting'],
    lastUpdated: '2024-01-10'
  },
  {
    id: 'coursera-2',
    title: 'IBM Data Science Professional Certificate',
    description: 'Complete data science program covering Python, SQL, and machine learning.',
    instructor: 'IBM',
    duration: '11 months',
    level: 'Intermediate',
    lessons: 150,
    category: 'Technical',
    image: '📊',
    rating: 4.5,
    students: 380000,
    price: 'Free (7-day trial)',
    url: 'https://www.coursera.org/professional-certificates/ibm-data-science',
    source: 'coursera',
    tags: ['Data Science', 'Python', 'Machine Learning'],
    lastUpdated: '2024-01-25'
  },
  {
    id: 'coursera-3',
    title: 'Meta Front-End Developer Certificate',
    description: 'Learn React, JavaScript, and modern frontend development from Meta.',
    instructor: 'Meta',
    duration: '7 months',
    level: 'Intermediate',
    lessons: 100,
    category: 'Technical',
    image: '💻',
    rating: 4.7,
    students: 290000,
    price: 'Free (7-day trial)',
    url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    source: 'coursera',
    tags: ['React', 'Frontend', 'Meta'],
    lastUpdated: '2024-02-08'
  }
];

const udemyFreeCourses: Course[] = [
  {
    id: 'udemy-1',
    title: 'Java Programming for Complete Beginners',
    description: 'Learn Java programming from scratch with hands-on exercises.',
    instructor: 'in28Minutes',
    duration: '16 hours',
    level: 'Beginner',
    lessons: 80,
    category: 'Technical',
    image: '☕',
    rating: 4.4,
    students: 150000,
    price: 'Free',
    url: 'https://www.udemy.com/course/java-programming-tutorial-for-beginners/',
    source: 'udemy',
    tags: ['Java', 'Programming', 'OOP'],
    lastUpdated: '2024-01-18'
  },
  {
    id: 'udemy-2',
    title: 'SQL for Beginners',
    description: 'Master SQL queries and database management for data-related interviews.',
    instructor: 'Mike Dane',
    duration: '4 hours',
    level: 'Beginner',
    lessons: 25,
    category: 'Technical',
    image: '🗄️',
    rating: 4.3,
    students: 95000,
    price: 'Free',
    url: 'https://www.udemy.com/course/sql-for-beginners-course/',
    source: 'udemy',
    tags: ['SQL', 'Database', 'Queries'],
    lastUpdated: '2024-02-02'
  },
  {
    id: 'udemy-3',
    title: 'Introduction to Cybersecurity',
    description: 'Learn cybersecurity fundamentals and best practices for security interviews.',
    instructor: 'Nathan House',
    duration: '2 hours',
    level: 'Beginner',
    lessons: 15,
    category: 'Technical',
    image: '🔒',
    rating: 4.2,
    students: 78000,
    price: 'Free',
    url: 'https://www.udemy.com/course/introduction-to-cybersecurity/',
    source: 'udemy',
    tags: ['Cybersecurity', 'Security', 'Network'],
    lastUpdated: '2024-01-30'
  }
];

// Simulate API calls with realistic delays
const simulateApiCall = <T>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// Fetch courses from different sources
export const fetchCoursesByCategory = async (category: string = 'All'): Promise<Course[]> => {
  try {
    // Simulate multiple API calls
    const [fccCourses, edxCourses, behavioralData, careerData, ytCourses, courseraCourses, udemyCourses] = await Promise.all([
      simulateApiCall(freeCodeCampCourses, 800),
      simulateApiCall(edXCourses, 1200),
      simulateApiCall(behavioralCourses, 600),
      simulateApiCall(careerCourses, 900),
      simulateApiCall(youtubeCourses, 700),
      simulateApiCall(courseraFreeCourses, 1000),
      simulateApiCall(udemyFreeCourses, 650)
    ]);

    const allCourses = [...fccCourses, ...edxCourses, ...behavioralData, ...careerData, ...ytCourses, ...courseraCourses, ...udemyCourses];

    if (category === 'All') {
      return allCourses;
    }

    return allCourses.filter(course => course.category === category);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses');
  }
};

// Get featured courses (highest rated)
export const getFeaturedCourses = async (): Promise<Course[]> => {
  const allCourses = await fetchCoursesByCategory('All');
  return allCourses
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);
};

// Search courses by title or tags
export const searchCourses = async (query: string): Promise<Course[]> => {
  const allCourses = await fetchCoursesByCategory('All');
  const searchTerm = query.toLowerCase();
  
  return allCourses.filter(course => 
    course.title.toLowerCase().includes(searchTerm) ||
    course.description.toLowerCase().includes(searchTerm) ||
    course.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    course.category.toLowerCase().includes(searchTerm)
  );
};


// Get trending courses (recently updated with high ratings)
export const getTrendingCourses = async (): Promise<Course[]> => {
  const allCourses = await fetchCoursesByCategory('All');
  
  return allCourses
    .filter(course => course.rating && course.rating >= 4.5)
    .sort((a, b) => {
      const dateA = new Date(a.lastUpdated || '2024-01-01');
      const dateB = new Date(b.lastUpdated || '2024-01-01');
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 4);
};
