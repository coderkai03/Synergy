export interface Hackathon {
  id: string;
  name: string;
  date: string;
  endDate: string;
  location: string;
  website: string;
  image: string;
  isOnline: boolean;
  prizePool?: string;
  participants?: number;
  daysLeft?: number;
}

export const problemSpaceOptions = [
  "Healthcare",
  "Education",
  "Fintech",
  "Sustainability",
  "Social Impact",
  "AI/ML",
  "Developer Tools",
  "Entertainment",
  "E-commerce",
  "Productivity",
  "PNC",
  "Piñata",
  "EOG Resources",
  "Goldman Sachs",
  "Infosys",
  "CBRE",
  "Frontier",
  "Veolia",
  "Toyota",
  "Design",
  "Beginner",
  "Hardware",
  "Samba Nova",
];