"use client";

import { useState } from "react";
import { KYCStatus, DocumentType } from "@/types";

export interface KYCRequirementsState {
  siret: boolean;
  identity: boolean;
  rc_pro: boolean;
  hygiene_cert: boolean; // Obligatoire si catégorie tatouage
}

export function useKYC(isTattooArtist: boolean = false) {
  const [documentsState, setDocumentsState] = useState<KYCRequirementsState>({
    siret: false,
    identity: false,
    rc_pro: false,
    hygiene_cert: false,
  });

  const markDocumentUploaded = (type: DocumentType) => {
    setDocumentsState((prev) => ({
      ...prev,
      [type]: true,
    }));
  };

  // Le profil est vérifiable si tous les documents obligatoires sont fournis
  const isComplete =
    documentsState.siret &&
    documentsState.identity &&
    documentsState.rc_pro &&
    (!isTattooArtist || documentsState.hygiene_cert);

  const pendingCount = [
    !documentsState.siret,
    !documentsState.identity,
    !documentsState.rc_pro,
    isTattooArtist && !documentsState.hygiene_cert,
  ].filter(Boolean).length;

  return {
    documentsState,
    isComplete,
    pendingCount,
    markDocumentUploaded,
    status: isComplete ? ("pending" as KYCStatus) : ("missing_documents" as KYCStatus),
  };
}
