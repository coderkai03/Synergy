import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Eye, UserPlus } from 'lucide-react'
import { Post } from '@/types/Posts'

interface TeamInviteCardProps {
  post: Post
}

export function TeamInviteCard({ post }: TeamInviteCardProps) {

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg border-primary">
      <CardHeader className="bg-primary text-primary-foreground p-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{post.team.name}</CardTitle>
            <p className="text-xs opacity-80">{post.author.firstName}</p>
          </div>
          <Badge variant={status === 'open' ? "secondary" : "default"} className="bg-background text-foreground">
            {post.hackathon.date.toLocaleDateString()}
          </Badge>
        </div>
        <div className="mt-1 flex items-center space-x-2">
          <Calendar className="w-3 h-3" />
          <p className="text-xs">{post.hackathon.name}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4 bg-card text-card-foreground">
        <div className="flex items-start space-x-4">
          <div className="flex-grow">
            <p className="text-lg">{post.content}</p>
          </div>
          <Image 
            src={post.hackathon.image} 
            alt={post.hackathon.name} 
            width={80} 
            height={80} 
            className="rounded-md"
          />
        </div>
        <div className="space-y-2">
          {[
            ["Frontend", "Backend", "Full-stack"],
            ["AI", "Machine Learning", "Data Science"],
            ["Cloud", "DevOps", "Security"]
          ].map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap gap-2">
              {row.map((tag, index) => (
                post.preferences.technologies?.includes(tag) && (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className={`
                      ${rowIndex === 0 ? 'bg-blue-500' : ''}
                      ${rowIndex === 1 ? 'bg-green-500' : ''}
                      ${rowIndex === 2 ? 'bg-purple-500' : ''}
                      text-white
                    `}
                  >
                    {tag}
                  </Badge>
                )
              ))}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-muted p-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Current team: {post.team.members.length}</p>
        </div>
        <div className="flex space-x-2">
          <Link href={`/teams/${post.team.id}`}>
            <Button variant="outline" size="sm" className="bg-background hover:bg-background/90 text-foreground font-bold rounded-full transition-all duration-200 ease-in-out transform hover:scale-105">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </Link>
          <Button 
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
            disabled={post.team.members.length >= 4}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Join
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

