"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'

interface RequestButtonProps {
  teamName: string
  disabled?: boolean
}

export function RequestButton({ teamName, disabled = false }: RequestButtonProps) {
  const [requested, setRequested] = useState(false)

  const handleRequest = () => {
    console.log(`Requested to join team: ${teamName}`)
    setRequested(true)
  }

  return (
    <Button 
      onClick={handleRequest} 
      disabled={disabled || requested}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
    >
      {requested ? "Requested" : "Request to Join"}
      <Send className="w-4 h-4 ml-2" />
    </Button>
  )
}

