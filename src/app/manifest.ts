import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fauteo",
    short_name: "Fauteo",
    description: "Louez un poste équipé près de chez vous : coiffure, barbier, esthétique, onglerie, tatouage.",
    start_url: "/",
    display: "standalone",
    theme_color: "#FF6B55",
    background_color: "#FFF9F5",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
