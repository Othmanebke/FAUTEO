"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Fenêtre modale basée sur <dialog> : piège du focus, touche Échap et
 * fond inerte gérés nativement par le navigateur.
 */
export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={cn(
        "m-auto w-[calc(100%-2rem)] max-w-lg rounded-[var(--radius-card)] border border-line bg-surface p-0 text-ink shadow-raised backdrop:bg-ink/40 backdrop:backdrop-blur-[2px]",
        className
      )}
    >
      <div className="p-6 sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 id={titleId} className="text-xl font-bold tracking-tight">
              {title}
            </h2>
            {description && <p className="text-sm text-ink-muted">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="-m-1.5 rounded-full p-1.5 text-ink-muted hover:bg-canvas-alt hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
