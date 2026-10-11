"use client";

import { useActionState, useState } from "react";
import { Check, X } from "lucide-react";
import { reviewDocument } from "./actions";
import { initialFormState } from "@/lib/validation/form-state";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";

const REASONS = [
  "Document illisible ou incomplet",
  "Document expiré",
  "Le nom ne correspond pas au compte",
  "Ce n'est pas le document demandé",
  "SIRET inactif ou ne correspondant pas",
];

export function ReviewForm({ documentId }: { documentId: string }) {
  const [state, action, pending] = useActionState(reviewDocument, initialFormState);
  const [rejecting, setRejecting] = useState(false);

  return (
    <form action={action} className="space-y-3 lg:w-80">
      <input type="hidden" name="document_id" value={documentId} />
      {state.message && <Alert tone="danger">{state.message}</Alert>}
      {rejecting ? (
        <>
          <input type="hidden" name="decision" value="reject" />
          <Select name="reason" label="Motif du refus" defaultValue="" error={state.fieldErrors?.reason}>
            <option value="" disabled>
              Choisir un motif
            </option>
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
          <div className="flex gap-2">
            <Button type="submit" variant="danger" size="sm" isLoading={pending}>
              Confirmer le refus
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setRejecting(false)}>
              Annuler
            </Button>
          </div>
        </>
      ) : (
        <div className="flex gap-2">
          <Button type="submit" name="decision" value="approve" size="sm" isLoading={pending}>
            <Check className="h-4 w-4" aria-hidden /> Valider
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setRejecting(true)}>
            <X className="h-4 w-4" aria-hidden /> Refuser
          </Button>
        </div>
      )}
    </form>
  );
}
