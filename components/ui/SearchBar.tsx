import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="relative flex-grow">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        placeholder="Search..."
        className="pl-10 h-12 flex-1 bg-[#E4E4E4] border-amber-500/20"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
} 