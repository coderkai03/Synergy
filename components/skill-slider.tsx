import React from 'react';
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

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
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-zinc-400 text-sm">{description}</span>
      </div>
      <Slider
        id={id}
        min={0}
        max={4}
        step={1}
        value={[value]}
        onValueChange={onValueChange}
        className="[&_[role=slider]]:bg-amber-500"
      />
      <div className="flex justify-between text-xs text-zinc-400">
        {[0, 1, 2, 3, 4].map((num) => (
          <span key={num}>{num}</span>
        ))}
      </div>
    </div>
  );
}

export default SkillSlider;
