"use client";

import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, getDoc, doc } from '@firebase/firestore';
import { db } from '@/firebaseConfig';
import { Post } from '@/types/Posts';

// TODO: Add useCollection to this hook
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(
          postsRef,
          orderBy("createdAt", "desc"),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const postsData = await Promise.all(querySnapshot.docs.map(async (post) => {
          const data = post.data();

          // Fetch author details
          const authorDoc = await getDoc(doc(db, "users", data.authorId));
          const authorData = authorDoc.data();
          
          // Fetch team details
          const teamDoc = await getDoc(doc(db, "teams", data.teamId));
          const teamData = teamDoc.data();

          // Fetch team members details
          const teamMembersData = await Promise.all(
            teamData?.memberIds.map(async (memberId: string) => {
              const memberDoc = await getDoc(doc(db, "users", memberId));
              const memberData = memberDoc.data();
              return {
                profilePicture: memberData?.profilePicture
              };
            })
          );
          
          // Fetch hackathon details
          const hackathonDoc = await getDoc(doc(db, "hackathons", data.hackathonId));
          const hackathonData = hackathonDoc.data();

          return {
            ...data,
            id: post.id,
            createdAt: data.createdAt?.toDate(),
            author: {
              firstName: authorData?.firstName,
              id: data.authorId
            },
            team: {
              name: teamData?.name,
              id: data.teamId,
              members: teamMembersData
            },
            hackathon: {
              name: hackathonData?.name,
              image: hackathonData?.image,
              date: hackathonData?.date?.toDate(),
              location: hackathonData?.location,
              id: data.hackathonId
            }
          } as Post;
        }));
        
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}
