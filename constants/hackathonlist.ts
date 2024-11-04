// JSON with hackathon data

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

export const hackathons: Hackathon[] = [
  {
    id: "1",
    name: "HackMLH",
    date: "2024-05-20",
    endDate: "2024-05-21",
    location: "Online",
    website: "https://mlh.io/",
    image: "/path/to/image.jpg",
    isOnline: true,
    prizePool: "$5,000",
    participants: 500,
    daysLeft: 30,
  },
  {
    id: "2",
    name: "HackSomeWhere",
    date: "2024-06-15",
    endDate: "2024-06-16",
    location: "New York",
    website: "https://hacksomewhere.com/",
    image: "/path/to/image.jpg",
    isOnline: false,
    prizePool: "$10,000",
    participants: 700,
    daysLeft: 20,
  },
  // Add more hackathons as needed
];
