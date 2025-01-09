"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}

export function Combobox({ value, onChange, options, placeholder = "Select an option..." }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [cbValue, setCbValue] = React.useState(value || "")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-zinc-700 border-amber-500/50 text-white-500"
        >
          {cbValue
            ? options.find((option) => option.value === cbValue)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className="bg-zinc-700 border-amber-500/50">
          <CommandInput placeholder={placeholder} className="bg-zinc-700 text-white" />
          <CommandList className="bg-zinc-700">
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setCbValue(currentValue === cbValue ? "" : currentValue)
                    onChange(currentValue === cbValue ? "" : currentValue)
                    setOpen(false)
                  }}
                  className="text-white hover:bg-[#FFAD08]"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      cbValue === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
