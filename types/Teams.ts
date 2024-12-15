export type Team = {
  id: string;
  name: string; // Team Name
  hackathonId: string;
  alreadyInTeam: string;
  hasProjectIdea: string;
  projectIdea: string;
  problemSpaces: string[];
  teamDescription: string;
  goals: string[];
  teammates: string[];
  status: string;
  hostId: string;
}

export type Invite = {
  inviterId: string;
  teamId: string;
}
