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
<meta name="design_doc_mode" content="canvas">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
<script src="./image-slot.js"></script>
<style>
body{margin:0;background:#efe8e1;font-family:Manrope,ui-sans-serif,system-ui,sans-serif;color:#252a31;-webkit-font-smoothing:antialiased}
a{color:#c2412f;text-decoration:none}a:hover{text-decoration:underline}
</style>
</helmet>
<section style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:72px;padding:72px">

<!-- ============ 1a MOBILE ============ -->
<div id="1a" style="display:flex;flex-direction:column;gap:16px">
  <div style="display:flex;align-items:center;gap:10px"><span style="background:#252a31;color:#fff9f5;font-weight:700;font-size:13px;padding:4px 10px;border-radius:999px">1a</span><span style="font-weight:700;font-size:15px">Mobile · 390</span></div>
  <div data-screen-label="Mobile accueil" style="width:390px;height:844px;border-radius:44px;background:#fff9f5;overflow:hidden;position:relative;box-shadow:0 30px 60px rgb(37 42 49 / 14%);border:8px solid #ffffff">
    <div style="position:absolute;inset:0;overflow-y:auto;scrollbar-width:none;padding-bottom:110px">
      <div style="display:flex;justify-content:space-between;padding:14px 26px 0;font-size:14px;font-weight:700"><span>9:41</span><span style="display:flex;gap:5px;align-items:center"><span style="width:16px;height:10px;border-radius:2px;background:#252a31"></span><span style="width:22px;height:11px;border-radius:3px;border:1.5px solid #252a31"></span></span></div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px 0">
        <div style="display:flex;align-items:center;gap:8px">
          <svg viewBox="0 0 48 56" style="height:30px;width:auto"><defs><linearGradient id="fp1" x1="8" y1="4" x2="40" y2="50" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FF8A72"></stop><stop offset="1" stop-color="#FF6B55"></stop></linearGradient></defs><path d="M24 2C12.4 2 3 11.3 3 22.8c0 8 5.1 14.4 10.4 20L21.9 51.7a2.9 2.9 0 0 0 4.2 0l8.5-8.9C39.9 37.2 45 30.8 45 22.8 45 11.3 35.6 2 24 2Z" fill="url(#fp1)"></path><g fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 35V18.8c0-2.4 1.9-4.3 4.3-4.3h8.7"></path><path d="M17.5 25h10.2a3.1 3.1 0 0 1 0 6.2h-3.4l4.4 4.3"></path></g></svg>
          <span style="font-size:18px;font-weight:800;letter-spacing:0.08em">FAUTEO</span>
        </div>
        <div style="display:flex;gap:6px">
          <div style="width:44px;height:44px;border-radius:999px;display:flex;align-items:center;justify-content:center;position:relative"><span style="display:block;width:22px;height:22px;background:#252a31;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bell.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bell.svg') center/contain no-repeat"></span><span style="position:absolute;top:10px;right:11px;width:8px;height:8px;border-radius:999px;background:#ff6b55;border:2px solid #fff9f5"></span></div>
          <div style="width:44px;height:44px;border-radius:999px;display:flex;align-items:center;justify-content:center"><span style="display:block;width:22px;height:22px;background:#252a31;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat"></span></div>
        </div>
      </div>
      <div style="padding:18px 20px 0">
        <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:-0.02em">Bonjour, Inès</h1>
        <p style="margin:4px 0 0;font-size:15px;color:#697078">Quel poste vous faut-il aujourd'hui ?</p>
      </div>
      <div style="padding:18px 20px 0">
        <div style="height:54px;border-radius:18px;background:#f7f4ef;display:flex;align-items:center;gap:12px;padding:0 8px 0 18px">
          <span style="display:block;width:20px;height:20px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/search.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/search.svg') center/contain no-repeat"></span>
          <span style="flex:1;font-size:15px;color:#697078">Métier, ville, quartier…</span>
          <div style="width:40px;height:40px;border-radius:12px;background:#ffffff;display:flex;align-items:center;justify-content:center"><span style="display:block;width:18px;height:18px;background:#c2412f;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/sliders-horizontal.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/sliders-horizontal.svg') center/contain no-repeat"></span></div>
        </div>
      </div>
      <div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:18px 20px 0">
        <sc-for list="{{ chips }}" as="c" hint-placeholder-count="6">
          <button onClick="{{ c.onClick }}" style="flex-shrink:0;height:38px;padding:0 16px;border-radius:999px;border:1.5px solid {{ c.bd }};background:{{ c.bg }};color:{{ c.fg }};font:600 14px Manrope,sans-serif;cursor:pointer">{{ c.label }}</button>
        </sc-for>
      </div>
      <div style="display:flex;gap:16px;overflow-x:auto;scrollbar-width:none;padding:20px 20px 4px;scroll-snap-type:x mandatory">
        <sc-for list="{{ featured }}" as="s" hint-placeholder-count="2">
          <div style="flex-shrink:0;width:272px;height:370px;border-radius:30px;overflow:hidden;position:relative;background:#f5e8e1;scroll-snap-align:start;box-shadow:0 12px 32px rgb(37 42 49 / 8%)">
            <image-slot id="{{ s.slotId }}" shape="rect" placeholder="Photo du poste"></image-slot>
            <div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgb(37 42 49 / 0%) 40%,rgb(37 42 49 / 88%) 100%)"></div>
            <span style="position:absolute;top:16px;right:16px;display:flex;align-items:center;gap:4px;background:#ff6b55;color:#252a31;font-size:13px;font-weight:700;padding:6px 10px;border-radius:999px;pointer-events:none">★ {{ s.rating }}</span>
            <sc-if value="{{ s.instant }}" hint-placeholder-val="{{ false }}"><span style="position:absolute;top:16px;left:16px;background:rgb(255 255 255 / 92%);color:#252a31;font-size:12px;font-weight:700;padding:6px 10px;border-radius:999px;pointer-events:none">Instantanée</span></sc-if>
            <div style="position:absolute;left:20px;right:20px;bottom:20px;color:#ffffff;pointer-events:none">
              <p style="margin:0;font-size:20px;font-weight:800;line-height:1.2;text-wrap:pretty">{{ s.title }}</p>
              <p style="margin:6px 0 0;font-size:13px;opacity:0.85">{{ s.venue }} · {{ s.city }}</p>
              <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:12px">
                <p style="margin:0"><span style="font-size:22px;font-weight:800;color:#ff8a77">{{ s.price }}</span><span style="font-size:13px;opacity:0.85"> / {{ s.unit }}</span></p>
                <button onClick="{{ s.onBm }}" style="pointer-events:auto;width:40px;height:40px;border:none;border-radius:999px;background:rgb(255 255 255 / 16%);display:flex;align-items:center;justify-content:center;cursor:pointer"><span style="display:block;width:20px;height:20px;background:{{ s.bmDark }};-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat"></span></button>
              </div>
            </div>
          </div>
        </sc-for>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:26px 20px 12px">
        <h2 style="margin:0;font-size:19px;font-weight:800">Près de chez vous</h2>
        <a href="#" style="font-size:14px;font-weight:700">Voir tout</a>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;padding:0 20px">
        <sc-for list="{{ nearbyMobile }}" as="s" hint-placeholder-count="4">
          <div style="display:flex;gap:14px;align-items:center;padding:12px;border-radius:22px;background:#ffffff;box-shadow:0 4px 20px rgb(37 42 49 / 5%)">
            <div style="width:84px;height:84px;flex-shrink:0;border-radius:16px;overflow:hidden;background:#f5e8e1"><image-slot id="{{ s.slotId }}" shape="rect" placeholder="Photo"></image-slot></div>
            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px">
              <p style="margin:0;font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ s.venue }}</p>
              <p style="margin:0;font-size:13px;color:#697078">{{ s.type }} · {{ s.city }}</p>
              <p style="margin:0;font-size:13px;color:#697078"><span style="color:#ff6b55">★</span> <b style="color:#252a31">{{ s.rating }}</b> ({{ s.count }} avis)</p>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
              <p style="margin:0;text-align:right"><span style="display:block;font-size:18px;font-weight:800;color:#c2412f">{{ s.price }}</span><span style="font-size:12px;color:#697078">/ {{ s.unit }}</span></p>
              <button onClick="{{ s.onBm }}" style="width:32px;height:32px;border:none;background:transparent;padding:0;display:flex;align-items:center;justify-content:flex-end;cursor:pointer"><span style="display:block;width:20px;height:20px;background:{{ s.bmLight }};-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat"></span></button>
            </div>
          </div>
        </sc-for>
      </div>
    </div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:86px;background:#ffffff;border-top:1px solid #e8e2da;display:grid;grid-template-columns:repeat(5,1fr);padding:10px 8px 0">
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px"><span style="display:block;width:24px;height:24px;background:#ff6b55;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/house.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/house.svg') center/contain no-repeat"></span><span style="font-size:11px;font-weight:700;color:#c2412f">Accueil</span></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px"><span style="display:block;width:24px;height:24px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/search.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/search.svg') center/contain no-repeat"></span><span style="font-size:11px;font-weight:600;color:#697078">Recherche</span></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px"><span style="display:block;width:24px;height:24px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/calendar-check.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/calendar-check.svg') center/contain no-repeat"></span><span style="font-size:11px;font-weight:600;color:#697078">Réservations</span></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px"><span style="display:block;width:24px;height:24px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/message-circle.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/message-circle.svg') center/contain no-repeat"></span><span style="font-size:11px;font-weight:600;color:#697078">Messages</span></div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:5px"><span style="display:block;width:24px;height:24px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/user.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/user.svg') center/contain no-repeat"></span><span style="font-size:11px;font-weight:600;color:#697078">Profil</span></div>
    </div>
  </div>
</div>

<!-- ============ 1b TABLETTE ============ -->


<!-- ============ 1c DESKTOP ============ -->


</section>
<div id="1b" style="display: flex; flex-direction: column; gap: 16px; position: absolute; left: 513px; top: 59px">
  <div style="display:flex;align-items:center;gap:10px"><span style="background:#252a31;color:#fff9f5;font-weight:700;font-size:13px;padding:4px 10px;border-radius:999px">1b</span><span style="font-weight:700;font-size:15px">Tablette · 834</span></div>
  <div data-screen-label="Tablette accueil" style="width:834px;height:1112px;border-radius:40px;background:#fff9f5;overflow:hidden;position:relative;box-shadow:0 30px 60px rgb(37 42 49 / 14%);border:10px solid #ffffff">
    <div style="position:absolute;inset:0;overflow-y:auto;scrollbar-width:none;padding-bottom:120px">
      <div style="display:flex;align-items:center;justify-content:space-between;padding:28px 36px 0">
        <div style="display:flex;align-items:center;gap:10px">
          <svg viewBox="0 0 48 56" style="height:34px;width:auto"><defs><linearGradient id="fp2" x1="8" y1="4" x2="40" y2="50" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FF8A72"></stop><stop offset="1" stop-color="#FF6B55"></stop></linearGradient></defs><path d="M24 2C12.4 2 3 11.3 3 22.8c0 8 5.1 14.4 10.4 20L21.9 51.7a2.9 2.9 0 0 0 4.2 0l8.5-8.9C39.9 37.2 45 30.8 45 22.8 45 11.3 35.6 2 24 2Z" fill="url(#fp2)"></path><g fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 35V18.8c0-2.4 1.9-4.3 4.3-4.3h8.7"></path><path d="M17.5 25h10.2a3.1 3.1 0 0 1 0 6.2h-3.4l4.4 4.3"></path></g></svg>
          <span style="display:flex;flex-direction:column;line-height:1"><span style="font-size:19px;font-weight:800;letter-spacing:0.08em">FAUTEO</span><span style="margin-top:4px;font-size:9px;font-weight:600;letter-spacing:0.28em;color:#697078">LA CONNEXION &amp; LE LIEU</span></span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:46px;height:46px;border-radius:999px;background:#ffffff;border:1px solid #e8e2da;display:flex;align-items:center;justify-content:center;position:relative"><span style="display:block;width:20px;height:20px;background:#252a31;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bell.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bell.svg') center/contain no-repeat"></span><span style="position:absolute;top:10px;right:11px;width:8px;height:8px;border-radius:999px;background:#ff6b55;border:2px solid #fff"></span></div>
          <div style="display:flex;align-items:center;gap:8px;padding:5px 14px 5px 5px;border-radius:999px;background:#ffffff;border:1px solid #e8e2da"><span style="width:36px;height:36px;border-radius:999px;background:#ffe3dc;color:#c2412f;font-weight:800;display:flex;align-items:center;justify-content:center">I</span><span style="font-size:14px;font-weight:700">Inès</span><span style="background:#f7f4ef;color:#697078;font-size:12px;font-weight:700;padding:3px 8px;border-radius:999px">Pro</span></div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:28px;align-items:end;padding:32px 36px 0">
        <div>
          <h1 style="margin:0;font-size:36px;font-weight:800;letter-spacing:-0.02em;line-height:1.1">Bonjour, Inès</h1>
          <p style="margin:8px 0 0;font-size:16px;color:#697078">Trouvez un poste équipé près de chez vous.</p>
        </div>
        <div style="height:56px;border-radius:18px;background:#ffffff;border:1px solid #e8e2da;display:flex;align-items:center;gap:12px;padding:0 8px 0 18px;box-shadow:0 4px 20px rgb(37 42 49 / 5%)">
          <span style="display:block;width:20px;height:20px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/search.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/search.svg') center/contain no-repeat"></span>
          <span style="flex:1;font-size:15px;color:#697078">Métier, ville, quartier…</span>
          <div style="width:42px;height:42px;border-radius:12px;background:#ff6b55;display:flex;align-items:center;justify-content:center"><span style="display:block;width:18px;height:18px;background:#252a31;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/sliders-horizontal.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/sliders-horizontal.svg') center/contain no-repeat"></span></div>
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;padding:24px 36px 0">
        <sc-for list="{{ chips }}" as="c" hint-placeholder-count="6">
          <button onClick="{{ c.onClick }}" style="height:40px;padding:0 18px;border-radius:999px;border:1.5px solid {{ c.bd }};background:{{ c.bg }};color:{{ c.fg }};font:600 14px Manrope,sans-serif;cursor:pointer">{{ c.label }}</button>
        </sc-for>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:30px 36px 14px">
        <h2 style="margin:0;font-size:22px;font-weight:800">Recommandés pour vous</h2>
        <a href="#" style="font-size:14px;font-weight:700">Voir tout</a>
      </div>
      <div style="display:flex;gap:20px;overflow-x:auto;scrollbar-width:none;padding:0 36px 4px">
        <sc-for list="{{ featured }}" as="s" hint-placeholder-count="3">
          <div style="flex-shrink:0;width:300px;height:400px;border-radius:32px;overflow:hidden;position:relative;background:#f5e8e1;box-shadow:0 12px 32px rgb(37 42 49 / 8%)">
            <image-slot id="{{ s.slotId }}" shape="rect" placeholder="Photo du poste"></image-slot>
            <div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgb(37 42 49 / 0%) 40%,rgb(37 42 49 / 88%) 100%)"></div>
            <span style="position:absolute;top:18px;right:18px;background:#ff6b55;color:#252a31;font-size:13px;font-weight:700;padding:6px 10px;border-radius:999px;pointer-events:none">★ {{ s.rating }}</span>
            <div style="position:absolute;left:22px;right:22px;bottom:22px;color:#ffffff;pointer-events:none">
              <p style="margin:0;font-size:21px;font-weight:800;line-height:1.2;text-wrap:pretty">{{ s.title }}</p>
              <p style="margin:6px 0 0;font-size:13px;opacity:0.85">{{ s.venue }} · {{ s.city }}</p>
              <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:12px">
                <p style="margin:0"><span style="font-size:22px;font-weight:800;color:#ff8a77">{{ s.price }}</span><span style="font-size:13px;opacity:0.85"> / {{ s.unit }}</span></p>
                <button onClick="{{ s.onBm }}" style="pointer-events:auto;width:42px;height:42px;border:none;border-radius:999px;background:rgb(255 255 255 / 16%);display:flex;align-items:center;justify-content:center;cursor:pointer"><span style="display:block;width:20px;height:20px;background:{{ s.bmDark }};-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat"></span></button>
              </div>
            </div>
          </div>
        </sc-for>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:32px 36px 14px">
        <h2 style="margin:0;font-size:22px;font-weight:800">Près de chez vous</h2>
        <a href="#" style="font-size:14px;font-weight:700">Voir la carte</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;padding:0 36px">
        <sc-for list="{{ nearbyTablet }}" as="s" hint-placeholder-count="6">
          <div style="display:flex;gap:14px;align-items:center;padding:12px;border-radius:22px;background:#ffffff;box-shadow:0 4px 20px rgb(37 42 49 / 5%)">
            <div style="width:88px;height:88px;flex-shrink:0;border-radius:16px;overflow:hidden;background:#f5e8e1"><image-slot id="{{ s.slotId }}" shape="rect" placeholder="Photo"></image-slot></div>
            <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:4px">
              <p style="margin:0;font-size:15px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ s.venue }}</p>
              <p style="margin:0;font-size:13px;color:#697078">{{ s.city }}</p>
              <p style="margin:0;font-size:13px;color:#697078"><span style="color:#ff6b55">★</span> <b style="color:#252a31">{{ s.rating }}</b> ({{ s.count }})</p>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
              <p style="margin:0;text-align:right"><span style="display:block;font-size:18px;font-weight:800;color:#c2412f">{{ s.price }}</span><span style="font-size:12px;color:#697078">/ {{ s.unit }}</span></p>
              <button onClick="{{ s.onBm }}" style="width:32px;height:32px;border:none;background:transparent;padding:0;display:flex;align-items:center;justify-content:flex-end;cursor:pointer"><span style="display:block;width:20px;height:20px;background:{{ s.bmLight }};-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat"></span></button>
            </div>
          </div>
        </sc-for>
      </div>
    </div>
    <div style="position:absolute;left:50%;bottom:24px;transform:translateX(-50%);display:flex;gap:4px;padding:8px;border-radius:999px;background:#252a31;box-shadow:0 12px 32px rgb(37 42 49 / 20%)">
      <div style="display:flex;align-items:center;gap:8px;height:48px;padding:0 20px;border-radius:999px;background:#ff6b55"><span style="display:block;width:20px;height:20px;background:#252a31;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/house.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/house.svg') center/contain no-repeat"></span><span style="font-size:14px;font-weight:700;color:#252a31">Accueil</span></div>
      <div style="width:56px;height:48px;display:flex;align-items:center;justify-content:center"><span style="display:block;width:22px;height:22px;background:#fff9f5;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/search.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/search.svg') center/contain no-repeat"></span></div>
      <div style="width:56px;height:48px;display:flex;align-items:center;justify-content:center"><span style="display:block;width:22px;height:22px;background:#fff9f5;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/calendar-check.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/calendar-check.svg') center/contain no-repeat"></span></div>
      <div style="width:56px;height:48px;display:flex;align-items:center;justify-content:center"><span style="display:block;width:22px;height:22px;background:#fff9f5;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/message-circle.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/message-circle.svg') center/contain no-repeat"></span></div>
      <div style="width:56px;height:48px;display:flex;align-items:center;justify-content:center"><span style="display:block;width:22px;height:22px;background:#fff9f5;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/user.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/user.svg') center/contain no-repeat"></span></div>
    </div>
  </div>
</div><div id="1c" style="display: flex; flex-direction: column; gap: 16px; position: absolute; left: 1405px; top: 62px">
  <div style="display:flex;align-items:center;gap:10px"><span style="background:#252a31;color:#fff9f5;font-weight:700;font-size:13px;padding:4px 10px;border-radius:999px">1c</span><span style="font-weight:700;font-size:15px">Desktop · 1440</span></div>
  <div data-screen-label="Desktop accueil" style="width:1440px;border-radius:24px;background:#fff9f5;overflow:hidden;box-shadow:0 30px 60px rgb(37 42 49 / 14%)">
    <header style="display:flex;align-items:center;justify-content:space-between;gap:24px;height:76px;padding:0 48px;border-bottom:1px solid #e8e2da">
      <div style="display:flex;align-items:center;gap:10px">
        <svg viewBox="0 0 48 56" style="height:32px;width:auto"><defs><linearGradient id="fp3" x1="8" y1="4" x2="40" y2="50" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FF8A72"></stop><stop offset="1" stop-color="#FF6B55"></stop></linearGradient></defs><path d="M24 2C12.4 2 3 11.3 3 22.8c0 8 5.1 14.4 10.4 20L21.9 51.7a2.9 2.9 0 0 0 4.2 0l8.5-8.9C39.9 37.2 45 30.8 45 22.8 45 11.3 35.6 2 24 2Z" fill="url(#fp3)"></path><g fill="none" stroke="#fff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 35V18.8c0-2.4 1.9-4.3 4.3-4.3h8.7"></path><path d="M17.5 25h10.2a3.1 3.1 0 0 1 0 6.2h-3.4l4.4 4.3"></path></g></svg>
        <span style="font-size:19px;font-weight:800;letter-spacing:0.08em">FAUTEO</span>
      </div>
      <nav style="display:flex;gap:4px">
        <span style="padding:9px 14px;border-radius:999px;font-size:15px;font-weight:600;color:#252a31;background:#f7f4ef">Trouver un poste</span>
        <span style="padding:9px 14px;border-radius:999px;font-size:15px;font-weight:500;color:#697078">Comment ça marche</span>
        <span style="padding:9px 14px;border-radius:999px;font-size:15px;font-weight:500;color:#697078">Proposer un poste</span>
        <span style="padding:9px 14px;border-radius:999px;font-size:15px;font-weight:500;color:#697078">Confiance et sécurité</span>
      </nav>
      <div style="display:flex;align-items:center;gap:8px">
        <span style="height:40px;padding:0 18px;border-radius:999px;display:flex;align-items:center;font-size:14px;font-weight:600">Connexion</span>
        <span style="height:40px;padding:0 20px;border-radius:999px;display:flex;align-items:center;font-size:14px;font-weight:700;background:#ff6b55;color:#252a31">Créer un compte</span>
      </div>
    </header>

    <div style="padding:24px 32px 0">
      <div style="position:relative;height:600px;border-radius:40px;overflow:hidden;background:#f5e8e1">
        <image-slot id="hero-desktop" shape="rect" placeholder="Photo d'ambiance : salon lumineux, fauteuil de coiffure"></image-slot>
        <div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgb(37 42 49 / 82%) 0%,rgb(37 42 49 / 50%) 45%,rgb(37 42 49 / 0%) 75%)"></div>
        <div style="position:absolute;left:64px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center;gap:24px;pointer-events:none">
          <span style="align-self:flex-start;display:flex;align-items:center;gap:8px;padding:7px 14px;border-radius:999px;background:rgb(255 255 255 / 14%);color:#fff9f5;font-size:14px;font-weight:600"><span style="width:8px;height:8px;border-radius:999px;background:#ff6b55"></span>Location de postes beauté et bien-être</span>
          <h1 style="margin:0;font-size:64px;line-height:1.05;font-weight:800;letter-spacing:-0.03em;color:#ffffff;text-wrap:pretty">Le bon poste, dans un lieu qui vous ressemble.</h1>
          <p style="margin:0;font-size:18px;line-height:1.6;color:rgb(255 249 245 / 88%);max-width:520px">Salons, barbershops, instituts, ongleries et shops de tatouage ouvrent leurs postes aux indépendants, sans engagement long.</p>
          <div style="pointer-events:auto;display:grid;grid-template-columns:0.9fr 1.4fr auto;gap:8px;padding:8px;border-radius:28px;background:#ffffff;box-shadow:0 12px 32px rgb(37 42 49 / 18%);width:640px">
            <div style="height:52px;border-radius:999px;background:#fff9f5;display:flex;align-items:center;justify-content:space-between;padding:0 18px;font-size:15px">Tous les métiers<span style="display:block;width:16px;height:16px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/chevron-down.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/chevron-down.svg') center/contain no-repeat"></span></div>
            <div style="height:52px;border-radius:999px;background:#fff9f5;display:flex;align-items:center;gap:10px;padding:0 18px;font-size:15px;color:#697078"><span style="display:block;width:18px;height:18px;background:#697078;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/map-pin.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/map-pin.svg') center/contain no-repeat"></span>Ville, adresse ou autour de moi</div>
            <div style="height:52px;border-radius:999px;background:#ff6b55;color:#252a31;display:flex;align-items:center;gap:8px;padding:0 26px;font-size:16px;font-weight:700"><span style="display:block;width:16px;height:16px;background:#252a31;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/search.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/search.svg') center/contain no-repeat"></span>Rechercher</div>
          </div>
        </div>
        <div style="position:absolute;right:40px;bottom:40px;display:flex;align-items:center;gap:12px;padding:14px 18px;border-radius:20px;background:#ffffff;box-shadow:0 12px 32px rgb(37 42 49 / 12%);pointer-events:none">
          <span style="width:40px;height:40px;border-radius:12px;background:#e3f1eb;display:flex;align-items:center;justify-content:center"><span style="display:block;width:20px;height:20px;background:#347a62;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/circle-check.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/circle-check.svg') center/contain no-repeat"></span></span>
          <div style="font-size:14px"><p style="margin:0;font-weight:700">Réservation confirmée</p><p style="margin:2px 0 0;color:#697078">Contrat signé · mardi 9 h – 19 h</p></div>
        </div>
      </div>
    </div>

    <div style="padding:56px 64px 0">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:24px">
        <div>
          <h2 style="margin:0;font-size:36px;font-weight:800;letter-spacing:-0.02em">Recommandés pour vous</h2>
          <p style="margin:8px 0 0;font-size:17px;color:#697078">Des postes bien notés, prêts à vous accueillir.</p>
        </div>
        <div style="display:flex;gap:8px">
          <sc-for list="{{ chips }}" as="c" hint-placeholder-count="6">
            <button onClick="{{ c.onClick }}" style="height:40px;padding:0 18px;border-radius:999px;border:1.5px solid {{ c.bd }};background:{{ c.bg }};color:{{ c.fg }};font:600 14px Manrope,sans-serif;cursor:pointer">{{ c.label }}</button>
          </sc-for>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;margin-top:28px">
        <sc-for list="{{ featuredDesk }}" as="s" hint-placeholder-count="4">
          <div style="height:420px;border-radius:32px;overflow:hidden;position:relative;background:#f5e8e1;box-shadow:0 12px 32px rgb(37 42 49 / 8%)">
            <image-slot id="{{ s.slotId }}" shape="rect" placeholder="Photo du poste"></image-slot>
            <div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgb(37 42 49 / 0%) 40%,rgb(37 42 49 / 88%) 100%)"></div>
            <span style="position:absolute;top:18px;right:18px;background:#ff6b55;color:#252a31;font-size:13px;font-weight:700;padding:6px 10px;border-radius:999px;pointer-events:none">★ {{ s.rating }}</span>
            <span style="position:absolute;top:18px;left:18px;display:flex;align-items:center;gap:5px;background:rgb(255 255 255 / 94%);color:#347a62;font-size:12px;font-weight:700;padding:6px 10px;border-radius:999px;pointer-events:none"><span style="display:block;width:14px;height:14px;background:#347a62;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/badge-check.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/badge-check.svg') center/contain no-repeat"></span>Vérifié</span>
            <div style="position:absolute;left:22px;right:22px;bottom:22px;color:#ffffff;pointer-events:none">
              <p style="margin:0;font-size:21px;font-weight:800;line-height:1.2;text-wrap:pretty">{{ s.title }}</p>
              <p style="margin:6px 0 0;font-size:13px;opacity:0.85">{{ s.venue }} · {{ s.city }}</p>
              <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-top:12px">
                <p style="margin:0"><span style="font-size:22px;font-weight:800;color:#ff8a77">{{ s.price }}</span><span style="font-size:13px;opacity:0.85"> / {{ s.unit }}</span></p>
                <button onClick="{{ s.onBm }}" style="pointer-events:auto;width:42px;height:42px;border:none;border-radius:999px;background:rgb(255 255 255 / 16%);display:flex;align-items:center;justify-content:center;cursor:pointer"><span style="display:block;width:20px;height:20px;background:{{ s.bmDark }};-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat"></span></button>
              </div>
            </div>
          </div>
        </sc-for>
      </div>
    </div>

    <div style="padding:72px 64px 0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:32px">
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
          <h2 style="margin:0;font-size:28px;font-weight:800;letter-spacing:-0.02em">Près de chez vous</h2>
          <a href="#" style="font-size:15px;font-weight:700">Voir tout</a>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          <sc-for list="{{ nearbyDesk }}" as="s" hint-placeholder-count="4">
            <div style="display:flex;gap:16px;align-items:center;padding:14px;border-radius:24px;background:#ffffff;border:1px solid #e8e2da">
              <div style="width:96px;height:96px;flex-shrink:0;border-radius:18px;overflow:hidden;background:#f5e8e1"><image-slot id="{{ s.slotId }}" shape="rect" placeholder="Photo"></image-slot></div>
              <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:5px">
                <p style="margin:0;font-size:16px;font-weight:700">{{ s.title }}</p>
                <p style="margin:0;font-size:14px;color:#697078">{{ s.venue }} · {{ s.city }}</p>
                <p style="margin:0;font-size:14px;color:#697078"><span style="color:#ff6b55">★</span> <b style="color:#252a31">{{ s.rating }}</b> ({{ s.count }} avis) · {{ s.type }}</p>
              </div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px;padding-right:6px">
                <p style="margin:0;text-align:right"><span style="display:block;font-size:20px;font-weight:800;color:#c2412f">{{ s.price }}</span><span style="font-size:13px;color:#697078">/ {{ s.unit }}</span></p>
                <button onClick="{{ s.onBm }}" style="width:32px;height:32px;border:none;background:transparent;padding:0;display:flex;align-items:center;justify-content:flex-end;cursor:pointer"><span style="display:block;width:20px;height:20px;background:{{ s.bmLight }};-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/bookmark.svg') center/contain no-repeat"></span></button>
              </div>
            </div>
          </sc-for>
        </div>
      </div>
      <div style="border-radius:32px;overflow:hidden;min-height:480px;background:repeating-linear-gradient(135deg,#f7f4ef 0 12px,#f5e8e1 12px 24px);border:1px solid #e8e2da;display:flex;align-items:center;justify-content:center;position:relative">
        <span style="font-family:ui-monospace,Menlo,monospace;font-size:13px;color:#697078;background:#fff9f5;padding:6px 10px;border-radius:8px">carte des postes (ResultsMap)</span>
      </div>
    </div>

    <div style="margin:80px 0 0;background:#f7f4ef;padding:72px 64px">
      <h2 style="margin:0;font-size:36px;font-weight:800;letter-spacing:-0.02em">Un cadre de confiance</h2>
      <p style="margin:10px 0 0;font-size:18px;color:#697078">Chaque location est vérifiée, payée et encadrée par un contrat.</p>
      <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px;margin-top:36px">
        <div style="padding:26px;border-radius:24px;background:#ffffff;box-shadow:0 4px 20px rgb(37 42 49 / 5%)"><span style="width:48px;height:48px;border-radius:16px;background:#ffe3dc;display:flex;align-items:center;justify-content:center"><span style="display:block;width:22px;height:22px;background:#c2412f;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/badge-check.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/badge-check.svg') center/contain no-repeat"></span></span><p style="margin:18px 0 0;font-size:17px;font-weight:700">Profils vérifiés</p><p style="margin:6px 0 0;font-size:15px;line-height:1.6;color:#697078">Identité, SIRET et assurance contrôlés pour chaque hôte et chaque pro.</p></div>
        <div style="padding:26px;border-radius:24px;background:#ffffff;box-shadow:0 4px 20px rgb(37 42 49 / 5%)"><span style="width:48px;height:48px;border-radius:16px;background:#ffe3dc;display:flex;align-items:center;justify-content:center"><span style="display:block;width:22px;height:22px;background:#c2412f;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/lock.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/lock.svg') center/contain no-repeat"></span></span><p style="margin:18px 0 0;font-size:17px;font-weight:700">Paiement sécurisé</p><p style="margin:6px 0 0;font-size:15px;line-height:1.6;color:#697078">Tout passe par Stripe, avec 3-D Secure.</p></div>
        <div style="padding:26px;border-radius:24px;background:#ffffff;box-shadow:0 4px 20px rgb(37 42 49 / 5%)"><span style="width:48px;height:48px;border-radius:16px;background:#ffe3dc;display:flex;align-items:center;justify-content:center"><span style="display:block;width:22px;height:22px;background:#c2412f;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/shield-check.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/shield-check.svg') center/contain no-repeat"></span></span><p style="margin:18px 0 0;font-size:17px;font-weight:700">Caution par empreinte</p><p style="margin:6px 0 0;font-size:15px;line-height:1.6;color:#697078">Bloquée sur la carte, jamais débitée sans incident, libérée sous 48 h.</p></div>
        <div style="padding:26px;border-radius:24px;background:#ffffff;box-shadow:0 4px 20px rgb(37 42 49 / 5%)"><span style="width:48px;height:48px;border-radius:16px;background:#ffe3dc;display:flex;align-items:center;justify-content:center"><span style="display:block;width:22px;height:22px;background:#c2412f;-webkit-mask:url('https://unpkg.com/lucide-static@0.469.0/icons/file-signature.svg') center/contain no-repeat;mask:url('https://unpkg.com/lucide-static@0.469.0/icons/file-signature.svg') center/contain no-repeat"></span></span><p style="margin:18px 0 0;font-size:17px;font-weight:700">Contrat à chaque réservation</p><p style="margin:6px 0 0;font-size:15px;line-height:1.6;color:#697078">Mise à disposition d'emplacement entre indépendants, signée en ligne.</p></div>
      </div>
    </div>

    <div style="padding:72px 64px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:24px;padding:48px 56px;border-radius:36px;background:#ff6b55">
        <div>
          <h2 style="margin:0;font-size:34px;font-weight:800;letter-spacing:-0.02em;color:#252a31">Prêt à trouver votre place ?</h2>
          <p style="margin:8px 0 0;font-size:18px;color:#252a31">Créez votre compte en deux minutes. Vous choisirez ensuite vos rôles.</p>
        </div>
        <span style="height:56px;padding:0 30px;border-radius:999px;background:#252a31;color:#fff9f5;display:flex;align-items:center;font-size:16px;font-weight:700;flex-shrink:0">Créer mon compte</span>
      </div>
    </div>

    <footer style="border-top:1px solid #e8e2da;background:#f7f4ef;padding:56px 64px 32px">
      <div style="display:grid;grid-template-columns:1.4fr repeat(3,1fr);gap:40px">
        <div style="max-width:300px">
          <span style="display:flex;flex-direction:column;line-height:1"><span style="font-size:19px;font-weight:800;letter-spacing:0.08em">FAUTEO</span><span style="margin-top:4px;font-size:9px;font-weight:600;letter-spacing:0.28em;color:#697078">LA CONNEXION &amp; LE LIEU</span></span>
          <p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#697078">Des postes équipés dans des lieux de confiance, pour les indépendants de la beauté et du bien-être.</p>
        </div>
        <div><p style="margin:0;font-size:14px;font-weight:700">Professionnels</p><div style="display:flex;flex-direction:column;gap:12px;margin-top:16px;font-size:14px;color:#697078"><span>Trouver un poste</span><span>Vérification des profils</span><span>Créer un compte pro</span></div></div>
        <div><p style="margin:0;font-size:14px;font-weight:700">Hôtes</p><div style="display:flex;flex-direction:column;gap:12px;margin-top:16px;font-size:14px;color:#697078"><span>Proposer un poste</span><span>Paiements et caution</span><span>Créer un compte hôte</span></div></div>
        <div><p style="margin:0;font-size:14px;font-weight:700">Fauteo</p><div style="display:flex;flex-direction:column;gap:12px;margin-top:16px;font-size:14px;color:#697078"><span>Conditions générales</span><span>Confidentialité et RGPD</span><span>Mentions légales</span></div></div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:48px;padding-top:24px;border-top:1px solid #e8e2da;font-size:14px;color:#697078"><span>© 2026 Fauteo. Tous droits réservés.</span><span style="display:flex;gap:20px"><span>Paiements sécurisés par Stripe</span><span>Données hébergées dans l'UE</span></span></div>
    </footer>
  </div>
</div></x-dc>
<script type="text/x-dc" data-dc-script>
const STATIONS = [
  { id: 's1', trade: 'barbier', title: 'Poste barber, lumière naturelle', venue: 'Atelier Bastille', city: 'Paris 11e', type: 'Poste barber', price: '60 €', unit: 'jour', rating: '4,9', count: 32, instant: true },
  { id: 's2', trade: 'coiffure', title: 'Fauteuil coiffure vue jardin', venue: 'Maison Lumière', city: 'Lyon 2e', type: 'Fauteuil de coiffure', price: '25 €', unit: 'heure', rating: '4,8', count: 18, instant: false },
  { id: 's3', trade: 'esthetique', title: 'Cabine de soins cocooning', venue: 'Institut Rose', city: 'Bordeaux', type: 'Cabine de soins', price: '45 €', unit: 'demi-journée', rating: '4,7', count: 24, instant: true },
  { id: 's4', trade: 'tatouage', title: 'Box de tatouage privé', venue: 'Encre Noire', city: 'Marseille 6e', type: 'Box de tatouage', price: '90 €', unit: 'jour', rating: '5,0', count: 11, instant: false },
  { id: 's5', trade: 'onglerie', title: "Table d'onglerie lumineuse", venue: 'Nail Studio Oberkampf', city: 'Paris 11e', type: "Table d'onglerie", price: '350 €', unit: 'semaine', rating: '4,6', count: 40, instant: true },
  { id: 's6', trade: 'barbier', title: 'Fauteuil barbier vintage', venue: 'Le Comptoir', city: 'Nantes', type: 'Poste barber', price: '55 €', unit: 'jour', rating: '4,8', count: 27, instant: false },
  { id: 's7', trade: 'coiffure', title: 'Poste coiffure en centre-ville', venue: 'Studio Garance', city: 'Lille', type: 'Fauteuil de coiffure', price: '900 €', unit: 'mois', rating: '4,9', count: 15, instant: false },
];
const TRADES = [['all', 'Tous'], ['coiffure', 'Coiffure'], ['barbier', 'Barbier'], ['esthetique', 'Esthétique'], ['onglerie', 'Onglerie'], ['tatouage', 'Tatouage']];

class Component extends DCLogic {
  state = { trade: 'all', saved: { s1: true, s4: true } };
  renderVals() {
    const { trade, saved } = this.state;
    const mk = (s) => ({
      ...s,
      slotId: 'photo-' + s.id,
      bmDark: saved[s.id] ? '#ff6b55' : '#ffffff',
      bmLight: saved[s.id] ? '#ff6b55' : '#697078',
      onBm: (e) => { e && e.stopPropagation && e.stopPropagation(); this.setState((p) => ({ saved: { ...p.saved, [s.id]: !p.saved[s.id] } })); },
    });
    const all = STATIONS.map(mk);
    const filtered = trade === 'all' ? all : all.filter((s) => s.trade === trade);
    const featured = filtered.length ? filtered : all;
    const chips = TRADES.map(([key, label]) => {
      const on = key === trade;
      return { key, label, bg: on ? '#ff6b55' : 'transparent', fg: on ? '#252a31' : '#c2412f', bd: on ? '#ff6b55' : '#ffb8ab', onClick: () => this.setState({ trade: key }) };
    });
    const desk = featured.slice(0, 4);
    return {
      chips,
      featured,
      featuredDesk: desk.length < 4 ? desk.concat(all.filter((s) => !desk.includes(s)).slice(0, 4 - desk.length)) : desk,
      nearbyMobile: all.slice(0, 4),
      nearbyTablet: all.slice(0, 6),
      nearbyDesk: all.slice(0, 4),
    };
  }
}
</script>
</body>
</html>
