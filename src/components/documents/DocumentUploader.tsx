"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import type { DocumentType } from "@/types";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic"];

interface Props {
  userId: string;
  type: DocumentType;
  needsExpiry: boolean;
  /** Document en attente remplacé par ce nouvel envoi. */
  replaceDocumentId?: string | null;
  replacePath?: string | null;
  label?: string;
  variant?: "primary" | "secondary";
}

/**
 * Dépôt d'un justificatif : fichier envoyé dans le bucket privé
 * « documents/<userId>/… », puis ligne créée dans `documents` (statut
 * « pending », validé ensuite par l'équipe Fauteo).
 */
export function DocumentUploader({ userId, type, needsExpiry, replaceDocumentId, replacePath, label = "Déposer le document", variant = "primary" }: Props) {
  const router = useRouter();
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const selected = e.target.files?.[0] ?? null;
    if (selected && !ACCEPT.includes(selected.type)) {
      setError("Format non accepté. Utilisez un PDF ou une photo (JPG, PNG, HEIC).");
      e.target.value = "";
      return;
    }
    if (selected && selected.size > MAX_BYTES) {
      setError("Fichier trop lourd : 10 Mo maximum.");
      e.target.value = "";
      return;
    }
    setFile(selected);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Choisissez un fichier.");
    if (needsExpiry && !expiresAt) return setError("Indiquez la date de fin de validité.");
    // Date du jour lue à l'envoi (et non au rendu) pour éviter un écart serveur / navigateur
    if (needsExpiry && expiresAt < new Date().toISOString().slice(0, 10)) return setError("Ce document est déjà expiré.");

    setPending(true);
    setError(null);
    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const path = `${userId}/${type}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file, { contentType: file.type });
    if (uploadError) {
      setPending(false);
      return setError("L'envoi du fichier a échoué. Vérifiez votre connexion et réessayez.");
    }

    const { error: insertError } = await supabase
      .from("documents")
      .insert({ owner_id: userId, type, storage_path: path, expires_at: needsExpiry ? expiresAt : null });
    if (insertError) {
      await supabase.storage.from("documents").remove([path]);
      setPending(false);
      return setError("Le document n'a pas pu être enregistré. Réessayez.");
    }

    if (replaceDocumentId) {
      await supabase.from("documents").delete().eq("id", replaceDocumentId);
      if (replacePath) await supabase.storage.from("documents").remove([replacePath]);
    }

    setFile(null);
    setExpiresAt("");
    if (fileRef.current) fileRef.current.value = "";
    setPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <input ref={fileRef} id={inputId} type="file" accept={ACCEPT.join(",")} onChange={onFileChange} className="peer sr-only" />
          <label
            htmlFor={inputId}
            className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line-strong bg-canvas px-4 text-sm text-ink-muted transition-colors hover:border-primary hover:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-primary-ink"
          >
            <Paperclip className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">{file ? file.name : "Choisir un fichier (PDF, JPG, PNG — 10 Mo max.)"}</span>
          </label>
        </div>
        {needsExpiry && (
          <div className="sm:w-48">
            <Input type="date" label="Valable jusqu'au" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>
        )}
        <Button type="submit" variant={variant} isLoading={pending} disabled={!file} className="sm:w-auto">
          <Upload className="h-4 w-4" aria-hidden />
          {label}
        </Button>
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
    </form>
  );
}
