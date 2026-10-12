<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script src="./image-slot.js"></script>
<style>
body{margin:0;background:#fff9f5;font-family:Manrope,ui-sans-serif,system-ui,sans-serif;color:#252a31;-webkit-font-smoothing:antialiased}
a{color:#c2412f;text-decoration:none}a:hover{text-decoration:underline}
::selection{background:#ffe3dc;color:#252a31}
</style>
</helmet>
<div data-screen-label="Fiche poste" style="min-height:100vh;display:flex;flex-direction:column">

<header style="position:sticky;top:0;z-index:40;background:rgb(255 249 245 / 88%);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:1px solid rgb(232 226 218 / 80%)">
  <div style="max-width:1280px;margin:0 auto;padding:0 32px;height:76px;display:flex;align-items:center;justify-content:space-between;gap:24px">
    <a href="Accueil.dc.html" style="display:flex;align-items:center;gap:10px;flex-shrink:0;color:#252a31;text-decoration:none">
      <svg viewBox="0 0 48 56" style="height:32px;width:auto"><defs><linearGradient id="fpP" x1="8" y1="4" x2="40" y2="50" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FF8A72"></stop><stop offset="1" stop-color="#FF6B55"></stop></linearGradient></defs><path d="M24 2C12.4 2 3 11.3 3 22.8c0 8 5.1 14.4 10.4 20L21.9 51.7a2.9 2.9 0 0 0 4.2 0l8.5-8.9C39.9 37.2 45 30.8 45 22.8 45 11.3 35.6 2 24 2Z" fill="url(#fpP)"></path><g fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 35V18.8c0-2.4 1.9-4.3 4.3-4.3h8.7"></path><path d="M17.5 25h10.2a3.1 3.1 0 0 1 0 6.2h-3.4l4.4 4.3"></path></g></svg>
      <span style="font-size:19px;font-weight:800;letter-spacing:0.08em">FAUTEO</span>
    </a>
    <nav style="flex:1;min-width:0;height:40px;overflow:hidden;display:flex;gap:4px;flex-wrap:wrap;justify-content:center">
      <a href="Recherche.dc.html" style="padding:9px 14px;border-radius:999px;white-space:nowrap;font-size:15px;font-weight:600;color:#252a31;background:#f7f4ef;text-decoration:none">Trouver un poste</a>
      <a href="Accueil.dc.html#fonctionnement" style="padding:9px 14px;border-radius:999px;white-space:nowrap;font-size:15px;font-weight:500;color:#697078;text-decoration:none" style-hover="background:#f7f4ef;color:#252a31">Comment ça marche</a>
      <a href="Accueil.dc.html#hotes" style="padding:9px 14px;border-radius:999px;white-space:nowrap;font-size:15px;font-weight:500;color:#697078;text-decoration:none" style-hover="background:#f7f4ef;color:#252a31">Proposer un poste</a>
      <a href="Accueil.dc.html#confiance" style="padding:9px 14px;border-radius:999px;white-space:nowrap;font-size:15px;font-weight:500;color:#697078;text-decoration:none" style-hover="background:#f7f4ef;color:#252a31">Confiance et sécurité</a>
    </nav>
    <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
      <a href="Connexion.dc.html" style="height:40px;padding:0 18px;border-radius:999px;white-space:nowrap;display:flex;align-items:center;font-size:14px;font-weight:600;color:#252a31;text-decoration:none" style-hover="background:#f7f4ef">Connexion</a>
      <a href="Connexion.dc.html?mode=signup" style="height:40px;padding:0 20px;border-radius:999px;white-space:nowrap;display:flex;align-items:center;font-size:14px;font-weight:600;background:#ff6b55;color:#252a31;text-decoration:none" style-hover="background:#e85d49">Créer un compte</a>
    </div>
  </div>
</header>

<main style="flex:1;max-width:1216px;width:100%;box-sizing:border-box;margin:0 auto;padding:32px 32px 88px">
  <a href="Recherche.dc.html" style="display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#697078;text-decoration:none" style-hover="color:#252a31"><span style="display:block;width:16px;height:16px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/arrow-left.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/arrow-left.svg') center/contain no-repeat"></span>Retour aux résultats</a>

  <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:24px;flex-wrap:wrap;margin:20px 0 24px">
    <div>
      <h1 style="margin:0;font-size:40px;font-weight:700;letter-spacing:-0.02em">Poste barber, lumière naturelle</h1>
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px;margin-top:12px;font-size:15px">
        <span style="font-weight:600"><span style="color:#ff6b55">★</span> 4,9 <span style="font-weight:400;color:#697078">· 32 avis</span></span>
        <span style="display:flex;align-items:center;gap:6px;color:#697078"><span style="display:block;width:16px;height:16px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/map-pin.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/map-pin.svg') center/contain no-repeat"></span>Atelier Bastille · 75011 Paris</span>
        <span style="display:flex;align-items:center;gap:4px;padding:5px 10px;border-radius:999px;background:#e3f1eb;color:#347a62;font-size:12px;font-weight:700"><span style="display:block;width:14px;height:14px;background:#347a62;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/badge-check.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/badge-check.svg') center/contain no-repeat"></span>Hôte vérifié</span>
        <span style="display:flex;align-items:center;gap:4px;padding:5px 10px;border-radius:999px;background:#ffe3dc;color:#c2412f;font-size:12px;font-weight:700"><span style="display:block;width:14px;height:14px;background:#c2412f;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/zap.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/zap.svg') center/contain no-repeat"></span>Réservation instantanée</span>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button style="height:42px;padding:0 16px;border-radius:999px;border:1px solid #e8e2da;background:#ffffff;display:flex;align-items:center;gap:8px;font:600 14px Manrope,sans-serif;color:#252a31;cursor:pointer"><span style="display:block;width:16px;height:16px;background:#252a31;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/share.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/share.svg') center/contain no-repeat"></span>Partager</button>
      <button onClick="{{ toggleSaved }}" style="height:42px;padding:0 16px;border-radius:999px;border:1px solid #e8e2da;background:#ffffff;display:flex;align-items:center;gap:8px;font:600 14px Manrope,sans-serif;color:#252a31;cursor:pointer"><span style="display:block;width:16px;height:16px;background:{{ savedColor }};-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat"></span>{{ savedLabel }}</button>
    </div>
  </div>

  <div style="display:grid;grid-template-columns:2fr 1fr;grid-template-rows:240px 240px;gap:12px;border-radius:28px;overflow:hidden">
    <div style="grid-row:span 2;background:#f5e8e1"><image-slot id="photo-s1" shape="rect" placeholder="Photo principale du poste"></image-slot></div>
    <div style="background:#f5e8e1"><image-slot id="photo-s1-2" shape="rect" placeholder="Vue 2"></image-slot></div>
    <div style="background:#f5e8e1;position:relative"><image-slot id="photo-s1-3" shape="rect" placeholder="Vue 3"></image-slot><span style="position:absolute;right:14px;bottom:14px;padding:8px 14px;border-radius:999px;background:#ffffff;font-size:13px;font-weight:700;box-shadow:0 4px 20px rgb(37 42 49 / 10%)">Voir les 8 photos</span></div>
  </div>

  <div style="display:grid;grid-template-columns:minmax(0,1fr) 400px;gap:56px;margin-top:44px;align-items:start">
    <div style="display:flex;flex-direction:column;gap:32px">
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px">
        <div style="padding:18px;border-radius:20px;background:#ffffff;border:1px solid #e8e2da;display:flex;flex-direction:column;gap:10px"><span style="display:block;width:22px;height:22px;background:#c2412f;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/scissors.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/scissors.svg') center/contain no-repeat"></span><span style="font-size:15px;font-weight:600">Poste barber</span></div>
        <div style="padding:18px;border-radius:20px;background:#ffffff;border:1px solid #e8e2da;display:flex;flex-direction:column;gap:10px"><span style="display:block;width:22px;height:22px;background:#c2412f;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/ruler.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/ruler.svg') center/contain no-repeat"></span><span style="font-size:15px;font-weight:600">6 m²</span></div>
        <div style="padding:18px;border-radius:20px;background:#ffffff;border:1px solid #e8e2da;display:flex;flex-direction:column;gap:10px"><span style="display:block;width:22px;height:22px;background:#c2412f;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/calendar-clock.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/calendar-clock.svg') center/contain no-repeat"></span><span style="font-size:15px;font-weight:600">Annulation modérée</span></div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px"><span style="padding:7px 14px;border-radius:999px;background:#f7f4ef;font-size:14px;font-weight:500">Barbier</span><span style="padding:7px 14px;border-radius:999px;background:#f7f4ef;font-size:14px;font-weight:500">Coiffure</span></div>

      <section style="display:flex;flex-direction:column;gap:14px;padding-top:32px;border-top:1px solid #e8e2da">
        <h2 style="margin:0;font-size:22px;font-weight:700">Le poste et le lieu</h2>
        <p style="margin:0;font-size:16px;line-height:1.7">Un poste face à la vitrine, baigné de lumière naturelle toute la journée. Fauteuil hydraulique récent, miroir éclairé et rangement personnel fermant à clé.</p>
        <p style="margin:0;font-size:16px;line-height:1.7;color:#697078">L'Atelier Bastille réunit quatre indépendants dans un ancien atelier d'artisan, à deux minutes du métro Bastille.</p>
      </section>

      <section style="display:flex;flex-direction:column;gap:16px;padding-top:32px;border-top:1px solid #e8e2da">
        <h2 style="margin:0;font-size:22px;font-weight:700">Équipements inclus</h2>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 32px">
          <sc-for list="{{ amenities }}" as="a" hint-placeholder-count="8">
            <span style="display:flex;align-items:center;gap:12px;font-size:15px"><span style="width:6px;height:6px;border-radius:999px;background:#ff6b55"></span>{{ a }}</span>
          </sc-for>
        </div>
      </section>

      <section style="display:flex;flex-direction:column;gap:14px;padding-top:32px;border-top:1px solid #e8e2da">
        <h2 style="margin:0;font-size:22px;font-weight:700">Tarifs</h2>
        <div style="border-radius:20px;overflow:hidden;border:1px solid #e8e2da;background:#ffffff">
          <sc-for list="{{ priceRows }}" as="p" hint-placeholder-count="4">
            <div style="display:flex;justify-content:space-between;padding:15px 20px;border-bottom:1px solid #e8e2da;font-size:15px"><span style="color:#697078">{{ p.long }}</span><span style="font-weight:600;font-variant-numeric:tabular-nums">{{ p.fmt }}</span></div>
          </sc-for>
          <div style="display:flex;justify-content:space-between;padding:15px 20px;background:#fff9f5;font-size:14px"><span style="color:#697078">Majoration samedi et dimanche</span><span style="font-weight:600">+10 %</span></div>
        </div>
        <p style="margin:0;font-size:14px;color:#697078">Prix de la location, hors frais de service de 8 %. Caution : 200 €, par empreinte bancaire.</p>
      </section>

      <section style="display:flex;flex-direction:column;gap:14px;padding-top:32px;border-top:1px solid #e8e2da">
        <h2 style="margin:0;font-size:22px;font-weight:700">Horaires d'ouverture</h2>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 32px">
          <sc-for list="{{ hours }}" as="h" hint-placeholder-count="7">
            <div style="display:flex;justify-content:space-between;font-size:15px"><span style="color:#697078">{{ h.day }}</span><span style="font-weight:500;color:{{ h.color }}">{{ h.slots }}</span></div>
          </sc-for>
        </div>
      </section>

      <section style="display:flex;flex-direction:column;gap:10px;padding-top:32px;border-top:1px solid #e8e2da">
        <h2 style="margin:0;font-size:22px;font-weight:700">Règlement intérieur</h2>
        <p style="margin:0;font-size:16px;line-height:1.7">Matériel désinfecté après chaque client. Pas de produits colorants hors du bac. Musique à volume modéré.</p>
        <p style="margin:0;font-size:14px;color:#697078">Son acceptation est demandée au moment de réserver.</p>
      </section>

      <section style="display:flex;flex-direction:column;gap:10px;padding-top:32px;border-top:1px solid #e8e2da">
        <h2 style="margin:0;font-size:22px;font-weight:700">Annulation</h2>
        <p style="margin:0;font-size:16px;line-height:1.7"><b>Modérée.</b> Remboursement intégral jusqu'à 5 jours avant, 50 % jusqu'à 48 h avant, puis aucun. Les frais de service ne sont pas remboursés en cas d'annulation par le professionnel. Si l'hôte annule, vous êtes intégralement remboursé.</p>
      </section>

      <section style="display:flex;flex-direction:column;gap:14px;padding-top:32px;border-top:1px solid #e8e2da">
        <h2 style="margin:0;font-size:22px;font-weight:700">Localisation</h2>
        <div style="height:300px;border-radius:24px;border:1px solid #e8e2da;background:repeating-linear-gradient(135deg,#f7f4ef 0 14px,#f2ede6 14px 28px);position:relative">
          <span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:44px;height:44px;border-radius:999px;background:#ff6b55;border:4px solid #ffffff;box-shadow:0 8px 20px rgb(37 42 49 / 20%)"></span>
          <span style="position:absolute;left:16px;bottom:16px;font-family:ui-monospace,Menlo,monospace;font-size:12px;color:#697078;background:#fff9f5;padding:5px 9px;border-radius:8px">LocationMap · IGN</span>
        </div>
        <p style="margin:0;font-size:15px">12 rue de la Roquette, 75011 Paris</p>
      </section>

      <section style="display:flex;flex-direction:column;gap:16px;padding-top:32px;border-top:1px solid #e8e2da">
        <h2 style="margin:0;font-size:22px;font-weight:700">Votre hôte : Karim</h2>
        <div style="display:flex;align-items:center;gap:16px;padding:20px;border-radius:24px;background:#ffffff;border:1px solid #e8e2da">
          <span style="width:60px;height:60px;border-radius:999px;background:#ffe3dc;color:#c2412f;font-size:22px;font-weight:700;display:flex;align-items:center;justify-content:center">K</span>
          <div style="display:flex;flex-direction:column;gap:4px;font-size:15px">
            <b>Atelier Bastille</b>
            <span style="display:flex;align-items:center;gap:6px;color:#697078"><span style="display:block;width:16px;height:16px;background:#347a62;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/badge-check.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/badge-check.svg') center/contain no-repeat"></span>Identité, SIRET et assurance vérifiés</span>
            <span style="display:flex;align-items:center;gap:6px;color:#697078"><span style="display:block;width:16px;height:16px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/clock.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/clock.svg') center/contain no-repeat"></span>Sur Fauteo depuis mars 2026</span>
          </div>
        </div>
      </section>

      <section style="display:flex;flex-direction:column;gap:16px;padding-top:32px;border-top:1px solid #e8e2da">
        <h2 style="margin:0;font-size:22px;font-weight:700"><span style="color:#ff6b55">★</span> 4,9 · 32 avis</h2>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px">
          <sc-for list="{{ reviews }}" as="r" hint-placeholder-count="2">
            <div style="padding:20px;border-radius:20px;background:#ffffff;border:1px solid #e8e2da;display:flex;flex-direction:column;gap:8px">
              <p style="margin:0;font-size:14px;font-weight:600"><span style="color:#ff6b55">★</span> {{ r.rating }}/5 · {{ r.name }}</p>
              <p style="margin:0;font-size:15px;line-height:1.6">{{ r.text }}</p>
            </div>
          </sc-for>
        </div>
      </section>
    </div>

    <aside aria-label="Réserver" style="position:sticky;top:100px">
      <div style="border-radius:28px;background:#ffffff;border:1px solid #e8e2da;box-shadow:0 12px 32px rgb(37 42 49 / 8%);padding:26px;display:flex;flex-direction:column;gap:20px">
        <p style="margin:0"><span style="font-size:32px;font-weight:700;letter-spacing:-0.02em;font-variant-numeric:tabular-nums">{{ unitPrice }}</span><span style="font-size:16px;color:#697078"> / {{ unitShort }}</span></p>
        <div role="radiogroup" aria-label="Durée de location" style="display:flex;flex-wrap:wrap;gap:8px">
          <sc-for list="{{ units }}" as="u" hint-placeholder-count="4">
            <button onClick="{{ u.onClick }}" style="height:36px;padding:0 14px;border-radius:999px;border:1px solid {{ u.bd }};background:{{ u.bg }};color:{{ u.fg }};font:600 14px Manrope,sans-serif;cursor:pointer">{{ u.long }}</button>
          </sc-for>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div style="display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:600">{{ dateLabel }}<div style="height:48px;border-radius:14px;border:1px solid #e8e2da;display:flex;align-items:center;gap:8px;padding:0 12px;font-weight:400"><span style="display:block;width:16px;height:16px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/calendar.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/calendar.svg') center/contain no-repeat"></span>mar. 14 oct.</div></div>
          <sc-if value="{{ showQty }}" hint-placeholder-val="{{ true }}">
            <div style="display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:600">Durée<div style="height:48px;border-radius:14px;border:1px solid #e8e2da;display:flex;align-items:center;justify-content:space-between;padding:0 6px">
              <button onClick="{{ dec }}" aria-label="Moins" style="width:36px;height:36px;border:none;border-radius:10px;background:#f7f4ef;font:600 18px Manrope,sans-serif;color:#252a31;cursor:pointer">−</button>
              <span style="font-weight:600">{{ qtyLabel }}</span>
              <button onClick="{{ inc }}" aria-label="Plus" style="width:36px;height:36px;border:none;border-radius:10px;background:#f7f4ef;font:600 18px Manrope,sans-serif;color:#252a31;cursor:pointer">+</button>
            </div></div>
          </sc-if>
          <sc-if value="{{ showTime }}" hint-placeholder-val="{{ false }}">
            <div style="display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:600">Heure d'arrivée<div style="height:48px;border-radius:14px;border:1px solid #e8e2da;display:flex;align-items:center;padding:0 12px;font-weight:400">09:00</div></div>
          </sc-if>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px">
          <p style="margin:0;display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#347a62"><span style="display:block;width:16px;height:16px;background:#347a62;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/circle-check.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/circle-check.svg') center/contain no-repeat"></span>Disponible</p>
          <div style="display:flex;flex-direction:column;font-size:15px">
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e8e2da"><span style="color:#697078">Location · {{ qtyLabel }}</span><span style="font-variant-numeric:tabular-nums">{{ subtotal }}</span></div>
            <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e8e2da"><span style="color:#697078">Frais de service (8 %)</span><span style="font-variant-numeric:tabular-nums">{{ fee }}</span></div>
            <div style="display:flex;justify-content:space-between;padding:12px 0 0;font-weight:700;font-size:17px"><span>Total</span><span style="font-variant-numeric:tabular-nums">{{ total }}</span></div>
          </div>
        </div>
        <p style="margin:0;display:flex;gap:10px;padding:14px;border-radius:16px;background:#f7f4ef;font-size:14px;line-height:1.5"><span style="display:block;flex-shrink:0;margin-top:2px;width:16px;height:16px;background:#347a62;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/shield-check.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/shield-check.svg') center/contain no-repeat"></span><span>Caution de <b>200 €</b> : empreinte bancaire, non débitée sauf incident constaté, libérée 48 h après la fin.</span></p>
        <a href="#" style="height:54px;border-radius:999px;background:#ff6b55;color:#252a31;display:flex;align-items:center;justify-content:center;gap:8px;font-size:16px;font-weight:600;text-decoration:none" style-hover="background:#e85d49"><span style="display:block;width:16px;height:16px;background:#252a31;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/zap.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/zap.svg') center/contain no-repeat"></span>Réserver</a>
        <p style="margin:-6px 0 0;text-align:center;font-size:13px;color:#697078">Aucun débit avant la confirmation · contrat signé en ligne</p>
      </div>
    </aside>
  </div>
</main>

<footer style="border-top:1px solid #e8e2da;background:#f7f4ef">
  <div style="max-width:1280px;margin:0 auto;padding:28px 32px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px;font-size:14px;color:#697078">
    <span>© 2026 Fauteo. Tous droits réservés.</span>
    <span style="display:flex;gap:20px;flex-wrap:wrap"><span>Paiements sécurisés par Stripe</span><span>Données hébergées dans l'UE</span></span>
  </div>
</footer>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script>
const UNITS = [
  { k: 'hour', long: "À l'heure", short: 'heure', cents: 1500, q: ['heure', 'heures'], max: 11 },
  { k: 'half_day', long: 'À la demi-journée', short: 'demi-journée', cents: 4500, q: ['demi-journée', 'demi-journées'], max: 1 },
  { k: 'day', long: 'À la journée', short: 'jour', cents: 6000, q: ['jour', 'jours'], max: 14 },
  { k: 'week', long: 'À la semaine', short: 'semaine', cents: 28000, q: ['semaine', 'semaines'], max: 12 },
];
const fmt = (c) => (c / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: c % 100 ? 2 : 0, maximumFractionDigits: 2 });
const HOURS = [['Lundi', 'Fermé'], ['Mardi', '9 h – 19 h'], ['Mercredi', '9 h – 19 h'], ['Jeudi', '9 h – 21 h'], ['Vendredi', '9 h – 21 h'], ['Samedi', '10 h – 18 h'], ['Dimanche', 'Fermé']];

class Component extends DCLogic {
  state = { unit: 'day', qty: 2, saved: true };
  renderVals() {
    const { unit, qty: q0, saved } = this.state;
    const u = UNITS.find((x) => x.k === unit);
    const qty = u.k === 'half_day' ? 1 : Math.min(q0, u.max);
    const sub = u.cents * qty, fee = Math.round(sub * 0.08);
    return {
      units: UNITS.map((x) => {
        const on = x.k === unit;
        return { long: x.long, bg: on ? '#ffe3dc' : '#ffffff', fg: on ? '#c2412f' : '#252a31', bd: on ? '#ff6b55' : '#e8e2da', onClick: () => this.setState({ unit: x.k }) };
      }),
      unitPrice: fmt(u.cents), unitShort: u.short,
      dateLabel: u.k === 'hour' || u.k === 'half_day' ? 'Date' : 'Début',
      showQty: u.k !== 'half_day', showTime: u.k === 'hour' || u.k === 'half_day',
      qtyLabel: `${qty} ${u.q[qty > 1 ? 1 : 0]}`,
      inc: () => this.setState((p) => ({ qty: Math.min(p.qty + 1, u.max) })),
      dec: () => this.setState((p) => ({ qty: Math.max(1, p.qty - 1) })),
      subtotal: fmt(sub), fee: fmt(fee), total: fmt(sub + fee),
      priceRows: UNITS.map((x) => ({ long: x.long, fmt: fmt(x.cents) })),
      hours: HOURS.map(([day, slots]) => ({ day, slots, color: slots === 'Fermé' ? '#697078' : '#252a31' })),
      amenities: ['Fauteuil hydraulique', 'Miroir LED', 'Bac à shampoing', 'Stérilisateur UV', 'Rangement fermant à clé', 'Wi-Fi', 'Climatisation', 'Café et thé'],
      reviews: [
        { rating: 5, name: 'Yanis', text: 'Lumière parfaite, lieu impeccable et Karim très accueillant. Mes clients ont adoré.' },
        { rating: 5, name: 'Sofia', text: "Poste propre et bien équipé, réservation en deux minutes. J'y retourne chaque mardi." },
      ],
      savedColor: saved ? '#ff6b55' : '#252a31', savedLabel: saved ? 'Enregistré' : 'Enregistrer',
      toggleSaved: () => this.setState((p) => ({ saved: !p.saved })),
    };
  }
}
</script>
</body>
</html>
