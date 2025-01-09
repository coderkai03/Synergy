import { Invite } from "./Teams";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  bio: string;
  // phone: string;
  // gradYear: string;
  school: string;
  major: string;
  technologies: string[];
  category_experience: string[];
  interests: string[];
  linkedin: string;
  devpost: string;
  github: string;
  number_of_hackathons: string;
  role_experience: {
    product_management: number;
    software: number;
    hardware: number;
    design: number;
  }
  teams: string[];
  invites: Invite[];
}

export const defaultUser: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  profilePicture: "",
  bio: "",
  // phone: "",
  // gradYear: "",
  school: "",
  major: "",
  technologies: [],
  category_experience: [],
  interests: [],
  linkedin: "",
  devpost: "",
  github: "",
  number_of_hackathons: "",
  role_experience: {
    product_management: 0,
    software: 0,
    hardware: 0,
    design: 0,
  },
  teams: [],
  invites: [],
}

export const getMatchScoreColor = (score: number): string => {
  // switch (true) {
  //   case score >= 80:
  //     return "bg-emerald-500/50 text-emerald-500"; // High match - green
  //   case score >= 60:
  //     return "bg-amber-500 text-amber-500"; // Good match - yellow
  //   default:
      return "bg-zinc-700 text-zinc-400"; // Plain match - black & white
  // }
};


export const technologies_options = [
  "JavaScript",
  "Python",
  "Java", 
  "C++",
  "C",
  "C#",
  "TypeScript",
  "Ruby",
  "Swift",
  "Kotlin",
  "Go",
  "Rust",
  "PHP",
  "R",
  "MATLAB",
  "Assembly",
  "Scala",
  "Dart",
  "Haskell",
  "Perl",
  "Julia",
  "Lua",
  "Objective-C",
  "Shell Script",
  "SQL",
  "COBOL",
  "Fortran",
  "Visual Basic",
  "None",

  // Frontend Frameworks & Libraries
  "React",
  "Angular",
  "Vue.js",
  "Next.js",
  "Svelte",
  "jQuery",
  "Bootstrap",
  "Tailwind CSS",
  "Material UI",
  "Redux",
  
  // Backend Frameworks
  "Node.js",
  "Django",
  "Flask",
  "Spring",
  "Express.js",
  "Laravel",
  "Ruby on Rails",
  "ASP.NET",
  "FastAPI",
  
  // Mobile Frameworks
  "React Native",
  "Flutter",
  "Xamarin",
  "Ionic",
  
  // Database & ORM
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "Redis",
  "Prisma",
  "Sequelize",
  "Mongoose",
  
  // AI/ML Frameworks
  "TensorFlow",
  "PyTorch",
  "Keras",
  "Scikit-learn",
  "OpenCV",
  
  // Cloud Platforms
  "AWS",
  "Google Cloud",
  "Azure",
  "Heroku",
  "Vercel",
  
  // DevOps Tools
  "Docker",
  "Kubernetes",
  "Jenkins",
  "Git",
  "GitHub Actions",
  
  // Testing Frameworks
  "Jest",
  "Mocha",
  "Cypress",
  "Selenium",
  
  "None"
];

export const category_experience_options = [
  "Web Development",
  "Mobile Development",
  "AI/Machine Learning",
  "Data Science",
  "IoT",
  "Blockchain",
  "Cybersecurity",
  "Cloud Computing",
  "AR/VR",
  "Game Development",
];

export const mockHackers: User[] = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@example.com",
    profilePicture: "https://example.com/alice.jpg",
    bio: "Aspiring web developer passionate about frontend technologies.",
    school: "MIT",
    major: "Computer Science",
    technologies: ["JavaScript", "React", "Next.js"],
    category_experience: ["Web Development"],
    interests: ["Gaming", "Music", "Art"],
    linkedin: "https://linkedin.com/in/alicejohnson",
    devpost: "https://devpost.com/alicejohnson",
    github: "https://github.com/alicejohnson",
    number_of_hackathons: "5",
    role_experience: {
      product_management: 2,
      software: 3,
      hardware: 1,
      design: 2
    },
    teams: [],
    invites: []
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@example.com",
    profilePicture: "https://example.com/bob.jpg",
    bio: "Machine learning enthusiast and Python expert.",
    school: "Stanford",
    major: "Artificial Intelligence",
    technologies: ["Python", "TensorFlow", "PyTorch"],
    category_experience: ["AI/Machine Learning"],
    interests: ["AI Ethics", "Robotics"],
    linkedin: "https://linkedin.com/in/bobsmith",
    devpost: "https://devpost.com/bobsmith",
    github: "https://github.com/bobsmith",
    number_of_hackathons: "3",
    role_experience: {
      product_management: 1,
      software: 3,
      hardware: 1,
      design: 1
    },
    teams: [],
    invites: []
  },
  {
    id: "3",
    firstName: "Charlie",
    lastName: "Brown",
    email: "charlie.brown@example.com",
    profilePicture: "https://example.com/charlie.jpg",
    bio: "Full stack engineer focusing on cloud infrastructure.",
    school: "UC Berkeley",
    major: "Software Engineering",
    technologies: ["Node.js", "MongoDB", "AWS"],
    category_experience: ["Cloud Computing"],
    interests: ["Hiking", "Photography"],
    linkedin: "https://linkedin.com/in/charliebrown",
    devpost: "https://devpost.com/charliebrown",
    github: "https://github.com/charliebrown",
    number_of_hackathons: "7",
    role_experience: {
      product_management: 2,
      software: 3,
      hardware: 2,
      design: 1
    },
    teams: [],
    invites: []
  },
  {
    id: "4",
    firstName: "Dana",
    lastName: "White",
    email: "dana.white@example.com",
    profilePicture: "https://example.com/dana.jpg",
    bio: "Game developer with a passion for AR/VR technologies.",
    school: "NYU",
    major: "Game Development",
    technologies: ["Unity", "C#", "Blender"],
    category_experience: ["Game Development"],
    interests: ["AR", "VR", "Storytelling"],
    linkedin: "https://linkedin.com/in/danawhite",
    devpost: "https://devpost.com/danawhite",
    github: "https://github.com/danawhite",
    number_of_hackathons: "4",
    role_experience: {
      product_management: 2,
      software: 2,
      hardware: 1,
      design: 3
    },
    teams: [],
    invites: []
  },
  {
    id: "5",
    firstName: "Eve",
    lastName: "Taylor",
    email: "eve.taylor@example.com",
    profilePicture: "https://example.com/eve.jpg",
    bio: "Cybersecurity enthusiast with a knack for ethical hacking.",
    school: "Georgia Tech",
    major: "Information Security",
    technologies: ["Python", "Kali Linux", "Wireshark"],
    category_experience: ["Cybersecurity"],
    interests: ["Pen Testing", "CTFs"],
    linkedin: "https://linkedin.com/in/evetaylor",
    devpost: "https://devpost.com/evetaylor",
    github: "https://github.com/evetaylor",
    number_of_hackathons: "6",
    role_experience: {
      product_management: 1,
      software: 2,
      hardware: 2,
      design: 2
    },
    teams: [],
    invites: []
  }
];
