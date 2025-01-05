"use client"

import { TeamInviteCard } from "@/components/team-invite-card";
import { usePosts } from "@/hooks/usePosts";
import { CreatePostDialog } from "@/components/create-post-dialog";

export default function Home() {
    const { posts } = usePosts();
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto p-4 max-w-4xl">
          <div className="space-y-6">
            <CreatePostDialog />
            {posts.map((post) => (
              <TeamInviteCard key={post.id} post={post} />
            ))}
          </div>
        </main>
      </div>
    )
  }