/**
 * Fond de carte : Plan IGN (Géoplateforme), gratuit et sans clé, couverture
 * France. Adouci en CSS (classe .fauteo-tiles) pour s'accorder à la palette.
 * Les fonds CARTO exigent désormais une clé d'API.
 */
export const TILE_URL =
  "https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2" +
  "&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}";

export const TILE_ATTRIBUTION = '&copy; <a href="https://www.ign.fr/" target="_blank" rel="noopener">IGN</a> – Géoplateforme';

export const TILE_MAX_ZOOM = 18;
