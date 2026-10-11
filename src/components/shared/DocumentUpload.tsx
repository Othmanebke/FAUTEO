"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, FileText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DocumentType, KYCStatus } from "@/types";

interface DocumentUploadProps {
  documentType: DocumentType;
  title: string;
  description: string;
  isMandatory?: boolean;
  requiresHygieneSpecialization?: boolean;
  onUploaded?: (fileUrl: string) => void;
}

export function DocumentUpload({
  documentType,
  title,
  description,
  isMandatory = true,
  requiresHygieneSpecialization = false,
  onUploaded,
}: DocumentUploadProps) {
  const [status, setStatus] = useState<KYCStatus>("missing_documents");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulation d'upload sécurisé vers Supabase Storage
    setTimeout(() => {
      setFileName(file.name);
      setStatus("pending");
      setIsUploading(false);
      if (onUploaded) onUploaded(`https://storage.fauteo.fr/kyc/${file.name}`);
    }, 1200);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#12151c] transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-gray-100 p-2 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {title}
              </h4>
              {isMandatory && (
                <Badge variant="luxury" size="sm">
                  Obligatoire
                </Badge>
              )}
              {requiresHygieneSpecialization && (
                <Badge variant="warning" size="sm">
                  Spécifique Tatouage
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>

        {status === "approved" && (
          <Badge variant="verified">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Vérifié
          </Badge>
        )}
        {status === "pending" && (
          <Badge variant="warning">
            En cours d&apos;analyse
          </Badge>
        )}
        {status === "missing_documents" && (
          <Badge variant="outline">
            À fournir
          </Badge>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        {fileName ? (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[240px]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{fileName}</span>
          </div>
        ) : (
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            Formats acceptés : PDF, PNG, JPG (max 5 Mo)
          </span>
        )}

        <label className="relative cursor-pointer">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleSimulatedUpload}
            className="sr-only"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isUploading}
            className="pointer-events-none gap-1.5"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>{fileName ? "Remplacer" : "Téléverser"}</span>
          </Button>
        </label>
      </div>
    </div>
  );
}
