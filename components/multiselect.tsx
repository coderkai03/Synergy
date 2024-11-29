"use client";

import React, { useRef, useEffect } from "react";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { CheckIcon } from "@radix-ui/react-icons";

interface MultiSelectProps {
  options: string[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}

export function Multiselect({
  options,
  selectedItems = [],
  setSelectedItems,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const addItem = (item: string) => {
    if (!selectedItems.includes(item)) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
    }
  };

  const removeItem = (item: string) => {
    const newSelectedItems = selectedItems.filter((i) => i !== item);
    setSelectedItems(newSelectedItems);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="w-full md:w-1/2 flex flex-col items-center mx-auto"
      ref={dropdownRef}
    >
      <div className="w-full px-4">
        <div className="flex flex-col items-center relative">
          <div className="w-full">
            <div className="my-2 p-1 flex border border-gray-200 bg-[#111119] rounded">
              <div className="flex flex-auto flex-wrap">
                {selectedItems.map((item) => (
                  <div
                    key={item}
                    className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-amber-600 text-white rounded-full border border-amber-600"
                  >
                    <div className="text-xs font-normal leading-none max-w-full flex-initial">
                      {item}
                    </div>
                    <div className="flex flex-auto flex-row-reverse">
                      <button
                        type="button"
                        onClick={() => removeItem(item)}
                        aria-label={`Remove ${item}`}
                      >
                        <X className="cursor-pointer hover:text-zinc-800 rounded-full w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
                <button
                  type="button"
                  className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                  onClick={toggleDropdown}
                  aria-haspopup="listbox"
                  aria-expanded={isOpen}
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          {isOpen && (
            <div
              className="absolute shadow top-full left-0 bg-zinc-800 z-40 w-full rounded max-h-60 overflow-y-auto"
              style={{ maxHeight: "160px" }}
            >
              <div className="flex flex-col w-full">
                {options.map((item) => (
                  <div
                    key={item}
                    className={`cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-amber-100 ${
                      selectedItems.includes(item) ? "bg-amber-600 text-white" : "text-white"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(item);
                    }}
                  >
                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-amber-600 hover:text-zinc-800">
                      <div className="w-full flex items-center">
                        <div className="mx-2 leading-6">{item}</div>
                        {selectedItems.includes(item) && (
                          <CheckIcon className="w-4 h-4 text-amber-600 ml-auto" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
