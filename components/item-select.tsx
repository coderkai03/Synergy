import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Item {
  id: string;
  label: string;
}

interface ItemSelectProps {
  itemList: Item[];
  currentItem?: string | null;
  selectedItems: string[];
  onItemAdd: (itemId: string) => void;
  onItemRemove: (itemId: string) => void;
  maxItems?: number;
  placeholder?: string;
}

export function ItemSelect({
  itemList,
  currentItem,
  selectedItems,
  onItemAdd,
  onItemRemove,
  maxItems = 3,
  placeholder = "Search..."
}: ItemSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-2">
      <div className="space-y-4">
        <div className="flex flex-col relative">
          <Input
            maxLength={50}
            disabled={selectedItems.length === maxItems}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/2 bg-zinc-700 border-amber-500/50"
          />
          {searchTerm && itemList
            .filter(item => 
              item.label &&
              item.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
              item.label !== currentItem &&
              !selectedItems.includes(item.id)
            ).length > 0 && (
              <div className="absolute top-full z-10 w-1/2 bg-zinc-800 border border-amber-500/50 rounded-md mt-1 max-h-40 overflow-y-auto">
                {itemList
                  .filter(item => 
                    item.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    item.label !== currentItem &&
                    !selectedItems.includes(item.id)
                  )
                  .slice(0, 5)
                  .map(item => (
                    <div
                      key={item.id}
                      className="p-2 hover:bg-zinc-700 cursor-pointer"
                      onClick={() => {
                        onItemAdd(item.id);
                        setSearchTerm('');
                      }}
                    >
                      {item.label}
                    </div>
                  ))}
              </div>
            )}
        </div>
      </div>
      
      {/* Show selected items */}
      <div className="flex flex-wrap gap-2">
        {selectedItems.map(itemId => {
          const item = itemList.find(i => i.id === itemId);
          return item ? (
            <div key={itemId} className="flex items-center gap-1 bg-zinc-700 p-2 rounded">
              <span>{item.label}</span>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onItemRemove(itemId)}
                className="text-red-500 hover:bg-red-500 p-0.5 font-bold text-lg w-6 h-6 flex items-center justify-center flex-shrink-0"
              >
                ×
              </Button>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
} 