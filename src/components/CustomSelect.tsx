"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  badge?: string;
  subLabel?: string;
}

interface CustomSelectProps<T = string | number> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export default function CustomSelect<T extends string | number>({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  disabled = false,
  className = "",
  size = "md",
  icon,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Check positioning (open upward if too close to bottom)
  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 240px below and more room above, open upward
      if (spaceBelow < 240 && rect.top > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
  };

  const isSmall = size === "sm";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* 3D Tactile Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`w-full group relative flex items-center justify-between text-left transition-all select-none cursor-pointer rounded-xl font-medium text-xs ${
          isSmall ? "px-2 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
        } ${
          disabled
            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
            : isOpen
            ? "bg-white text-indigo-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-[0_2px_8px_rgba(79,70,229,0.12),inset_0_1px_1px_rgba(255,255,255,1)]"
            : "bg-gradient-to-b from-white via-white to-slate-50/90 text-slate-700 border border-slate-300/80 hover:border-indigo-400 hover:text-slate-900 shadow-[0_2px_4px_rgba(15,23,42,0.05),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-1px_0_rgba(15,23,42,0.06)] active:translate-y-0.5"
        }`}
      >
        {/* Left: Optional icon & selected label */}
        <div className="flex items-center gap-2 min-w-0 flex-1 pr-1">
          {icon && <span className="text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">{icon}</span>}
          <span className="truncate text-xs font-medium text-slate-800">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="ml-1.5 px-1.5 py-0.2 text-[10px] bg-indigo-50 text-indigo-700 rounded font-black border border-indigo-100 shrink-0">
              {selectedOption.badge}
            </span>
          )}
        </div>

        {/* Right: 3D Chevron pill */}
        <div
          className={`rounded-md flex items-center justify-center transition-all shrink-0 ${
            isSmall ? "w-4 h-4 ml-1" : "w-5 h-5 ml-2"
          } ${
            isOpen
              ? "bg-indigo-50 text-indigo-600"
              : "bg-slate-100/90 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50/60"
          }`}
        >
          <ChevronDown
            className={`transition-transform duration-200 ${
              isSmall ? "w-3 h-3" : "w-3.5 h-3.5"
            } ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* 3D Floating Popover Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-50 min-w-[160px] p-1.5 bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-[0_12px_32px_rgba(15,23,42,0.15),0_4px_12px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,1)] animate-in fade-in zoom-in-95 duration-150 ${
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          }`}
        >
          {/* Scrollable Options List */}
          <div className="max-h-56 overflow-y-auto overscroll-contain space-y-0.5 scrollbar-thin">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 text-left rounded-xl transition-all select-none cursor-pointer text-xs ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-50 via-indigo-50/80 to-white text-indigo-700 font-bold border border-indigo-100 shadow-[0_1px_2px_rgba(79,70,229,0.08)]"
                      : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 font-semibold"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                    <span className="truncate">{option.label}</span>
                    {option.subLabel && (
                      <span className="text-[10px] text-slate-400 font-normal truncate">
                        {option.subLabel}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
