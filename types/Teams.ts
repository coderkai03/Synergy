export type Team = {
  id: string;
  name: string; // Team Name
  hackathonId: string;
  teammates: string[];
  hostId: string;
  requests: string[];

  // add later?
  // hasProjectIdea: string;
  // projectIdea: string;
  // problemSpaces: string[];
  // goals: string[];
}

export type Invite = {
  inviterId: string;
  teamId: string;
}

export const mockTeams: Team[] = [
  {
    id: "1",
    name: "Code Crusaders",
    hackathonId: "hack2024",
    teammates: ["1", "2", "3"],
    hostId: "1",
    requests: []
  },
  {
    id: "2", 
    name: "Binary Bandits",
    hackathonId: "hack2024",
    teammates: ["4", "5"],
    hostId: "4",
    requests: []
  },
  {
    id: "3",
    name: "Tech Titans",
    hackathonId: "hack2024", 
    teammates: ["2"],
    hostId: "2",
    requests: []
  },
  {
    id: "4",
    name: "Data Dragons",
    hackathonId: "hack2024",
    teammates: ["3", "4"],
    hostId: "3",
    requests: []
  },
  {
    id: "5",
    name: "Algorithm Aces",
    hackathonId: "hack2024",
    teammates: ["1", "5"],
    hostId: "5",
    requests: []
  },
  {
    id: "6",
    name: "Pixel Pirates",
    hackathonId: "hack2024",
    teammates: ["2", "3", "4"],
    hostId: "2",
    requests: []
  },
  {
    id: "7",
    name: "Neural Ninjas",
    hackathonId: "hack2024",
    teammates: ["1", "4"],
    hostId: "1",
    requests: []
  },
  {
    id: "8",
    name: "Cloud Champions",
    hackathonId: "hack2024",
    teammates: ["3", "5"],
    hostId: "3",
    requests: []
  },
  {
    id: "9",
    name: "DevOps Defenders",
    hackathonId: "hack2024",
    teammates: ["2", "4", "5"],
    hostId: "4",
    requests: []
  },
  {
    id: "10",
    name: "Web Warriors",
    hackathonId: "hack2024",
    teammates: ["1", "3", "5"],
    hostId: "5",
    requests: []
  }
];
