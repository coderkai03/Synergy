import React from 'react';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function SkillSlider({ 
  label, 
  description, 
  value, 
  onValueChange, 
  id 
}: {
  label: string;
  description: string;
  value: number;
  onValueChange: (value: number[]) => void;
  id: string;
}) {
  console.log(value);
  return (
    <div className="mb-8">
      <div className="flex items-center w-full">
        <div className="flex items-center gap-2 w-1/5">
          <Label htmlFor={id}>{label}</Label>
          <div className="relative group">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 cursor-help">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-zinc-800 text-zinc-200 text-sm rounded-md py-1 px-2 w-48">
              {description}
            </div>
          </div>
        </div>
        <RadioGroup
          value={value.toString()}
          onValueChange={(val) => onValueChange([parseInt(val)])}
          className="flex justify-evenly flex-1"
        >
          {[1, 2, 3].map((index) => (
            <RadioGroupItem 
              key={index}
              value={index.toString()} 
              id={`${id}-${index}`}
              className={`border-amber-500 text-amber-500 ${value === index ? 'bg-amber-500' : ''} h-5 w-5`}
            />
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

export default SkillSlider;
