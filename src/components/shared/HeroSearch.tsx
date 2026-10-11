"use client";

import React, { useState } from "react";
import { Search, MapPin, Calendar, Sparkles, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BeautyCategory } from "@/types";

interface HeroSearchProps {
  onSearch?: (filters: { category: BeautyCategory; city: string; date: string }) => void;
}

export function HeroSearch({ onSearch }: HeroSearchProps) {
  const [category, setCategory] = useState<BeautyCategory>("all");
  const [city, setCity] = useState("Paris");
  const [date, setDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ category, city, date });
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl mx-auto rounded-2xl bg-white/95 dark:bg-[#11141b]/95 p-2 sm:p-3 shadow-premium dark:shadow-premium-dark border border-gray-200/80 dark:border-gray-800 backdrop-blur-xl transition-all"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
        {/* Metier / Spécialité */}
        <div className="md:col-span-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Spécialité beauté
          </label>
          <div className="flex items-center gap-2 mt-1">
            <Sparkles className="h-4 w-4 text-[#b58e6d] shrink-0" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BeautyCategory)}
              className="w-full bg-transparent text-sm font-semibold text-gray-950 dark:text-white outline-none cursor-pointer"
            >
              <option value="all" className="dark:bg-[#11141b]">Toutes les spécialités</option>
              <option value="coiffure" className="dark:bg-[#11141b]">Coiffure & Coloration</option>
              <option value="barbier" className="dark:bg-[#11141b]">Barbier & Coupe Homme</option>
              <option value="tatouage" className="dark:bg-[#11141b]">Tatouage (Norme ARS)</option>
              <option value="onglerie" className="dark:bg-[#11141b]">Onglerie & Manucure</option>
              <option value="esthetique" className="dark:bg-[#11141b]">Esthétique & Soins visage</option>
              <option value="massage" className="dark:bg-[#11141b]">Massage & Pratiques bien-être</option>
            </select>
          </div>
        </div>

        {/* Localisation */}
        <div className="md:col-span-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Ville / Quartier
          </label>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Ex: Paris 3e, Lyon..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-gray-950 dark:text-white placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Date ou créneau */}
        <div className="md:col-span-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Quand ?
          </label>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="À partir de demain"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-gray-950 dark:text-white placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Submit Search Button */}
        <div className="md:col-span-2 p-1.5 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            className="w-full h-12 rounded-xl text-sm font-bold gap-2"
          >
            <Search className="h-4 w-4" />
            <span>Chercher</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
