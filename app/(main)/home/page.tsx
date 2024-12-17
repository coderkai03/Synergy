import { PostComposer } from '@/components/post-composer'
import { TeamInviteCard } from '@/components/team-invite-card'

const teamInvites = [
  { 
    id: 1, 
    author: "Alice Johnson", 
    teamName: "CodeCrusaders", 
    hackathonName: "Global Tech Hackathon 2023",
    openSpots: 2,
    description: "Looking for frontend devs with React experience and UI/UX designers."
  },
  { 
    id: 2, 
    author: "Bob Smith", 
    teamName: "DataDynamos", 
    hackathonName: "AI for Good Hackathon",
    openSpots: 1,
    description: "Seeking a machine learning expert with experience in NLP."
  },
  { 
    id: 3, 
    author: "Charlie Brown", 
    teamName: "CloudComets", 
    hackathonName: "Cloud Innovation Challenge",
    openSpots: 3,
    description: "Need cloud architects and backend developers familiar with AWS."
  },
  { 
    id: 4, 
    author: "Diana Prince", 
    teamName: "BlockchainBuddies", 
    hackathonName: "Crypto Hackathon 2023",
    openSpots: 2,
    description: "Looking for blockchain developers and cryptography enthusiasts."
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <main className="container mx-auto p-4 max-w-xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-800 shadow-text">Hackathon Team Invites</h1>
        <PostComposer/>
        <div className="grid gap-6 md:grid-cols-1">
          {teamInvites.map((invite) => (
            <TeamInviteCard key={invite.id} {...invite} />
          ))}
        </div>
      </main>
    </div>
  )
}

