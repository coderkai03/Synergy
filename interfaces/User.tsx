export interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  gradYear: string;
  school: string;
  degree: string;
  programming_languages: string[];
  frameworks_and_tools: string[];
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
  frameworks_and_tools: [],
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
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "PHP",
  "TypeScript",
  "None"
];

export const frameworks_and_tools = [
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Django",
  "Flask",
  "Spring",
  "Express.js",
  "TensorFlow",
  "PyTorch",
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