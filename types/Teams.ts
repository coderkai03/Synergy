export type Team = {
  id: string;
  name: string; // Team Name
  hackathonId: string;
  teammates: string[];
  hostId: string;

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
