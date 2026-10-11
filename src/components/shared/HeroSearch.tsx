"use client";

import React, { useState } from "react";
import { Search, MapPin, Calendar, Sparkles, Scissors, Store, UserCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BeautyCategory, SearchTarget } from "@/types";
import { cn } from "@/lib/utils";

interface HeroSearchProps {
  initialTarget?: SearchTarget;
  onSearch?: (filters: {
    target: SearchTarget;
    category: BeautyCategory;
    city: string;
    date: string;
    query?: string;
  }) => void;
  onTargetChange?: (target: SearchTarget) => void;
}

export function HeroSearch({
  initialTarget = "chair",
  onSearch,
  onTargetChange,
}: HeroSearchProps) {
  const [target, setTarget] = useState<SearchTarget>(initialTarget);
  const [category, setCategory] = useState<BeautyCategory>("all");
  const [city, setCity] = useState("Paris");
  const [date, setDate] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");

  const handleTargetSwitch = (newTarget: SearchTarget) => {
    setTarget(newTarget);
    if (onTargetChange) {
      onTargetChange(newTarget);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        target,
        category,
        city,
        date,
        query: serviceQuery,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Dual Tab Switcher: Louer un fauteuil VS Trouver un pro */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="inline-flex p-1 rounded-full bg-gray-100/90 dark:bg-[#12151c]/90 border border-gray-200/80 dark:border-gray-800 backdrop-blur shadow-sm">
          <button
            type="button"
            onClick={() => handleTargetSwitch("chair")}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none",
              target === "chair"
                ? "bg-gray-950 text-white dark:bg-white dark:text-black shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            )}
          >
            <Store className="h-3.5 w-3.5 text-[#b58e6d]" />
            <span>Louer un fauteuil</span>
            <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(Espace Pro)</span>
          </button>

          <button
            type="button"
            onClick={() => handleTargetSwitch("pro")}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none",
              target === "pro"
                ? "bg-gray-950 text-white dark:bg-white dark:text-black shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
            )}
          >
            <Scissors className="h-3.5 w-3.5 text-[#b58e6d]" />
            <span>Trouver un coiffeur / pro</span>
            <span className="text-[10px] opacity-75 font-normal hidden sm:inline">(Pour Clients)</span>
          </button>
        </div>
      </div>

      {/* Main Search Form Bar */}
      <form
        onSubmit={handleSearch}
        className="w-full rounded-2xl bg-white/95 dark:bg-[#11141b]/95 p-2 sm:p-3 shadow-premium dark:shadow-premium-dark border border-gray-200/80 dark:border-gray-800 backdrop-blur-xl transition-all"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
          {/* Field 1: Category / Service */}
          <div className="md:col-span-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {target === "chair" ? "Spécialité du poste" : "Prestation recherchée"}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Sparkles className="h-4 w-4 text-[#b58e6d] shrink-0" />
              {target === "chair" ? (
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
              ) : (
                <input
                  type="text"
                  placeholder="Ex: Dégradé, Balayage, Flash tattoo..."
                  value={serviceQuery}
                  onChange={(e) => setServiceQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-gray-950 dark:text-white placeholder:text-gray-400 outline-none"
                />
              )}
            </div>
          </div>

          {/* Field 2: Ville / Localisation */}
          <div className="md:col-span-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Ville / Arrondissement
            </label>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Ex: Paris 11e, Lyon..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-gray-950 dark:text-white placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Field 3: Quand ? */}
          <div className="md:col-span-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {target === "chair" ? "Début de location" : "Date du rendez-vous"}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Dès aujourd'hui"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-gray-950 dark:text-white placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Field 4: Bouton de validation */}
          <div className="md:col-span-2 p-1.5 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="w-full h-12 rounded-xl text-sm font-bold gap-2"
            >
              <Search className="h-4 w-4" />
              <span>{target === "chair" ? "Postes" : "Coiffeurs"}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
