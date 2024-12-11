export type User = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  gradYear: string;
  school: string;
  degree: string;
  programming_languages: string[];
  category_experience: string[];
  devpost: string;
  github: string;
  number_of_hackathons: string;
  role_experience: {
    product_management: number;
    software: number;
    hardware: number;
    uiux_design: number;
  }
  teams: string[];
}

export const defaultUser: User = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  phone: "",
  gradYear: "",
  school: "",
  degree: "",
  programming_languages: [],
  category_experience: [],
  devpost: "",
  github: "",
  number_of_hackathons: "",
  role_experience: {
    product_management: 0,
    software: 0,
    hardware: 0,
    uiux_design: 0,
  },
  teams: [],
}

export const programming_languages = [
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

export const category_experience = [
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