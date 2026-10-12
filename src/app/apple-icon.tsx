import { ImageResponse } from "next/og";

// Icône d'application (iOS) : carré corail arrondi, symbole « inverse » à 54 % de la hauteur
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const markHeight = Math.round(size.height * 0.54);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FF6B55", borderRadius: 40 }}>
        <svg viewBox="0 0 48 56" width={(markHeight * 48) / 56} height={markHeight}>
          <path d="M4 51V24a20 20 0 0 1 40 0v27a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" fill="#FFFFFF" />
          <g fill="none" stroke="#FF6B55" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 44V23.5a5 5 0 0 1 5-5h9" />
            <path d="M17 33h14v11" />
          </g>
        </svg>
      </div>
    ),
    size
  );
}
