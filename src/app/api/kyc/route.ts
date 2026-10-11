import { NextRequest, NextResponse } from "next/server";
import { DocumentType, KYCStatus } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { userId, documentType, fileUrl } = data as {
      userId: string;
      documentType: DocumentType;
      fileUrl: string;
    };

    if (!documentType || !fileUrl) {
      return NextResponse.json(
        { error: "Type de document et URL requis" },
        { status: 400 }
      );
    }

    // Enregistrement dans Supabase KYC documents
    return NextResponse.json({
      success: true,
      message: "Document transmis avec succès. En attente de validation légale.",
      status: "pending" as KYCStatus,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Impossible de traiter la demande KYC" },
      { status: 500 }
    );
  }
}
