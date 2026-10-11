import React from "react";
import { CheckCircle2, MapPin, Calendar, Clock, Star, Scissors } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { ProfessionalWithServices } from "@/types";

interface ProfessionalCardProps {
  pro: ProfessionalWithServices;
  onBookAppointment: (pro: ProfessionalWithServices) => void;
}

export function ProfessionalCard({ pro, onBookAppointment }: ProfessionalCardProps) {
  return (
    <Card hoverEffect className="flex flex-col justify-between overflow-hidden p-0 border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1117] group">
      {/* Photo & Portfolio Header */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={pro.avatarUrl}
          alt={pro.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          {pro.isVerified && (
            <Badge variant="verified" size="sm" className="bg-white/95 text-emerald-800 backdrop-blur shadow-sm dark:bg-black/80 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              Pro Certifié KYC
            </Badge>
          )}
        </div>
        <div className="absolute top-3.5 right-3.5 bg-black/75 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>{pro.rating}</span>
          <span className="text-gray-400 font-normal">({pro.reviewsCount})</span>
        </div>
      </div>

      {/* Body info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#b58e6d]">
              {pro.specialty}
            </span>
          </div>

          <h4 className="text-lg font-bold text-gray-950 dark:text-white mt-1">
            {pro.name}
          </h4>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span>Exerce chez <strong>{pro.currentSalon}</strong> ({pro.city})</span>
          </p>

          {/* Services list */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800/80 space-y-2">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Prestations populaires :
            </span>
            {pro.services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between text-xs py-1 rounded px-2 bg-gray-50 dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <Scissors className="h-3 w-3 text-gray-400 shrink-0" />
                  <span className="text-gray-800 dark:text-gray-200 truncate">{service.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-gray-400">{service.duration}</span>
                  <span className="font-bold text-gray-950 dark:text-white">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Dès <span className="font-bold text-gray-950 dark:text-white">{formatCurrency(pro.services[0]?.price || 35)}</span>
          </div>
          <Button
            variant="gold"
            size="sm"
            onClick={() => onBookAppointment(pro)}
            className="gap-1.5"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Prendre RDV</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
