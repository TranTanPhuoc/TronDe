"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, ChevronDown, Check } from "lucide-react";
import { useTheme, Theme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  showDropdown?: boolean;
  className?: string;
}

export default function ThemeToggle({
  showDropdown = false,
  className = "",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const isDark = resolvedTheme === "dark";

  if (!showDropdown) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all cursor-pointer group ${
          isDark
            ? "bg-slate-800 hover:bg-slate-700/80 text-amber-400 border border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] hover:scale-105 active:scale-95"
            : "bg-white hover:bg-slate-100/90 text-slate-700 hover:text-indigo-600 border border-slate-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] hover:scale-105 active:scale-95"
        } ${className}`}
        title={isDark ? "Chuyển sang chế độ Sáng (Light mode)" : "Chuyển sang chế độ Tối (Dark mode)"}
        aria-label="Đổi chế độ sáng tối"
      >
        <span className="sr-only">Đổi chế độ sáng tối</span>
        <div className="relative w-5 h-5 flex items-center justify-center">
          {/* Sun icon for dark mode */}
          <Sun
            className={`w-4.5 h-4.5 transition-all duration-300 absolute ${
              isDark
                ? "rotate-0 scale-100 opacity-100 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                : "-rotate-90 scale-0 opacity-0"
            }`}
          />
          {/* Moon icon for light mode */}
          <Moon
            className={`w-4.5 h-4.5 transition-all duration-300 absolute ${
              isDark
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100 text-slate-600 group-hover:text-indigo-600"
            }`}
          />
        </div>
      </button>
    );
  }

  // Extended Toggle with Dropdown option
  const themeOptions: { id: Theme; label: string; icon: React.ReactNode }[] = [
    {
      id: "light",
      label: "Giao diện Sáng",
      icon: <Sun className="w-4 h-4 text-amber-500" />,
    },
    {
      id: "dark",
      label: "Giao diện Tối",
      icon: <Moon className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: "system",
      label: "Theo hệ thống",
      icon: <Laptop className="w-4 h-4 text-slate-400" />,
    },
  ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          isDark
            ? "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 shadow-xs"
            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shadow-xs"
        }`}
        title="Tùy chọn giao diện Sáng / Tối"
      >
        {isDark ? (
          <Sun className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-slate-600" />
        )}
        <span className="hidden sm:inline">
          {theme === "system" ? "Hệ thống" : isDark ? "Tối" : "Sáng"}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-44 rounded-2xl shadow-2xl border py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
            isDark
              ? "bg-slate-800/95 border-slate-700 backdrop-blur-md text-slate-200 shadow-black/40"
              : "bg-white/95 border-slate-200 backdrop-blur-md text-slate-700 shadow-slate-200/50"
          }`}
        >
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-700/60 mb-1">
            Chế độ giao diện
          </div>
          {themeOptions.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? isDark
                      ? "bg-indigo-950/70 text-indigo-300 font-bold"
                      : "bg-indigo-50 text-indigo-700 font-bold"
                    : isDark
                    ? "hover:bg-slate-700/60 text-slate-300"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
