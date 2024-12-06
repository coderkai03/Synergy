export default interface User {
  full_name: string;
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
