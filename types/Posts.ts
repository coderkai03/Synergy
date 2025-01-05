export type Post = {
  id: string;

  // references
  author: {
    firstName: string;
    id: string;
  }

  team: {
    name: string;
    id: string;
    members: {
      profilePicture: string;
    }[];
  }

  hackathon: {
    name: string;
    image: string;
    date: Date;
    location: string;
    id: string;
  }

  // content
  content: string;
  createdAt: Date;
  preferences: {
    roles?: string[];
    technologies?: string[];
    experience_level?: string;
  };
  status: 'open' | 'closed';
}
