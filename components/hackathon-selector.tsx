"use client";

import { Hackathon } from "@/types/Hackathons";
import { HackathonPreview } from "./hackathon-preview";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { useState } from "react";

interface HackathonSelectorProps {
  hackathons: Hackathon[];
  selectedHackathon: Hackathon | undefined;
  onSelect: (hackathonId: string) => void;
}

export function HackathonSelector({ 
  hackathons, 
  selectedHackathon, 
  onSelect 
}: HackathonSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-auto min-h-[2.5rem] py-2 bg-gray-800 border border-gray-700 hover:text-white text-white shadow-sm rounded-lg hover:bg-gray-700"
            >
              {selectedHackathon ? (
                <HackathonPreview hackathon={selectedHackathon} />
              ) : (
                "Select hackathon..."
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[600px] h-[250px] p-0">
            <Command>
              <CommandInput placeholder="Search hackathon..." />
              <CommandEmpty>No hackathon found.</CommandEmpty>
              <CommandGroup className="h-[200px] overflow-y-auto">
                {hackathons.map((hackathon) => (
                  <CommandItem
                    key={hackathon.id}
                    value={hackathon.name}
                    onSelect={() => {
                      onSelect(hackathon.id);
                      setOpen(false);
                    }}
                    className="py-2 text-black"
                  >
                    <HackathonPreview hackathon={hackathon} />
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedHackathon?.id === hackathon.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
    </div>
  );
} 