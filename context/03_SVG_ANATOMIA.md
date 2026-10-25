
---

## 📄 ARCHIVO 3: `context/03_SVG_ANATOMIA.md`

```markdown
# SVG Anatómico de Pusheen — Código Completo

## Paleta oficial
- Cuerpo base: `#9f8e81`
- Trazo/detalles: `#3E2723`
- Accesorios (gotas/mancuernas): `#7be1d1`
- Glow activo: `var(--accent)` (verde Julio / rosa Kenia)

## IDs exactos (12 total)
**Vista Anterior:** `m-pecho`, `m-hombro-frontal`, `m-biceps`, `m-antebrazo-frontal`, `m-core`, `m-pierna-frontal`

**Vista Posterior:** `m-espalda`, `m-hombro-trasero`, `m-triceps`, `m-antebrazo-trasero`, `m-gluteo`, `m-pierna-trasera`

## SVG completo (copiar y pegar en index.html o auditoria.js)

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%" aria-label="Mapa Anatómico de Pusheen">
  <defs>
    <style>
      .borde-exterior { stroke: #3E2723; stroke-width: 6px; stroke-linecap: round; stroke-linejoin: round; }
      .division-interna { stroke: #3E2723; stroke-width: 3px; stroke-linecap: round; stroke-linejoin: round; opacity: 0.85; }
      g[id^="m-"] { cursor: pointer; transition: filter 0.3s ease; }
      g[id^="m-"]:hover { filter: drop-shadow(0 0 8px rgba(62,39,35,0.5)); }
      .glow { animation: pulso-clinico 1.6s infinite ease-in-out; opacity: 1 !important; }
      @keyframes pulso-clinico {
        0% { filter: drop-shadow(0 0 4px var(--accent, #FF4081)) drop-shadow(0 0 10px var(--accent, #FF4081)); fill: #ff80ab; }
        50% { filter: drop-shadow(0 0 16px var(--accent, #FF4081)) drop-shadow(0 0 26px var(--accent, #FF4081)); fill: var(--accent, #FF4081); }
        100% { filter: drop-shadow(0 0 4px var(--accent, #FF4081)) drop-shadow(0 0 10px var(--accent, #FF4081)); fill: #ff80ab; }
      }
    </style>
  </defs>

  <!-- VISTA ANTERIOR -->
  <g id="vista-anterior" class="borde-exterior" transform="translate(10, 0)">
    <path d="M 120 160 C 110 80, 290 80, 280 160 C 290 220, 280 320, 250 340 C 230 350, 170 350, 150 340 C 120 320, 110 220, 120 160 Z" fill="#9f8e81" />
    <path d="M 140 100 L 160 70 L 185 95 Z" fill="#9f8e81" />
    <path d="M 260 100 L 240 70 L 215 95 Z" fill="#9f8e81" />
    <g id="m-pecho">
      <path d="M 200 185 C 195 170, 170 170, 155 180 C 150 185, 155 195, 170 200 C 185 200, 200 195, 200 185 Z" fill="#958477" class="division-interna" />
      <path d="M 200 185 C 205 170, 230 170, 245 180 C 250 185, 245 195, 230 200 C 215 200, 200 195, 200 185 Z" fill="#958477" class="division-interna" />
    </g>
    <g id="m-hombro-frontal">
      <path d="M 120 160 C 105 160, 105 185, 125 185 C 135 185, 140 175, 135 165 Z" fill="#a8988b" class="division-interna" />
      <path d="M 280 160 C 295 160, 295 185, 275 185 C 265 185, 260 175, 265 165 Z" fill="#a8988b" class="division-interna" />
    </g>
    <g id="m-biceps">
      <path d="M 125 185 C 112 185, 105 200, 120 205 C 132 205, 138 198, 132 188 Z" fill="#8e7e72" class="division-interna" />
      <path d="M 275 185 C 288 185, 295 200, 280 205 C 268 205, 262 198, 268 188 Z" fill="#8e7e72" class="division-interna" />
    </g>
    <g id="m-antebrazo-frontal">
      <path d="M 120 205 C 108 205, 98 220, 112 225 C 122 225, 128 215, 125 207 Z" fill="#847468" class="division-interna" />
      <path d="M 280 205 C 292 205, 302 220, 288 225 C 278 225, 272 215, 275 207 Z" fill="#847468" class="division-interna" />
    </g>
    <g id="m-core">
      <path d="M 200 215 L 163 222 C 158 245, 163 260, 200 260 Z" fill="#938275" class="division-interna" />
      <path d="M 200 215 L 237 222 C 242 245, 237 260, 200 260 Z" fill="#938275" class="division-interna" />
      <path d="M 200 260 C 163 260, 158 275, 172 315 C 185 322, 200 320, 200 260 Z" fill="#8a796c" class="division-interna" />
      <path d="M 200 260 C 237 260, 242 275, 228 315 C 215 322, 200 320, 200 260 Z" fill="#8a796c" class="division-interna" />
      <circle cx="200" cy="275" r="3" fill="#3E2723" stroke="none" />
    </g>
    <g id="m-pierna-frontal">
      <path d="M 145 330 C 135 340, 135 365, 155 365 C 165 365, 165 345, 160 330 Z" fill="#847468" class="division-interna" />
      <path d="M 255 330 C 265 340, 265 365, 245 365 C 235 365, 235 345, 240 330 Z" fill="#847468" class="division-interna" />
    </g>
    <g id="rostro-pusheen" fill="#3E2723" stroke="none">
      <circle cx="175" cy="130" r="4.5" /><circle cx="225" cy="130" r="4.5" />
      <path d="M 194 136 L 200 131 L 206 136 Z" />
      <path d="M 193 141 Q 197 146 200 142 Q 203 146 207 141" fill="none" stroke="#3E2723" stroke-width="3" stroke-linecap="round" />
      <path d="M 110 135 L 128 133 M 108 143 L 126 140 M 111 151 L 129 147" stroke="#3E2723" stroke-width="4" stroke-linecap="round" />
      <path d="M 290 135 L 272 133 M 292 143 L 274 140 M 289 151 L 271 147" stroke="#3E2723" stroke-width="4" stroke-linecap="round" />
    </g>
  </g>

  <!-- VISTA POSTERIOR -->
  <g id="vista-posterior" class="borde-exterior" transform="translate(390, 0)">
    <path d="M 120 160 C 110 80, 290 80, 280 160 C 290 220, 280 320, 250 340 C 230 350, 170 350, 150 340 C 120 320, 110 220, 120 160 Z" fill="#9f8e81" />
    <path d="M 140 100 L 160 70 L 185 95 Z" fill="#9f8e81" />
    <path d="M 260 100 L 240 70 L 215 95 Z" fill="#9f8e81" />
    <g id="m-espalda">
      <path d="M 200 145 C 165 145, 140 152, 135 165 L 265 165 C 260 152, 235 145, 200 145 Z" fill="#a29184" class="division-interna" />
      <path d="M 200 165 L 142 165 C 130 185, 130 215, 150 240 L 200 240 Z" fill="#958477" class="division-interna" />
      <path d="M 200 165 L 258 165 C 270 185, 270 215, 250 240 L 200 240 Z" fill="#958477" class="division-interna" />
      <path d="M 200 145 L 200 240" fill="none" stroke="#3E2723" stroke-width="2.5" opacity="0.5" />
      <path d="M 175 155 Q 200 160 225 155" fill="none" stroke-width="6.5" />
      <path d="M 170 185 Q 200 190 230 185" fill="none" stroke-width="6.5" />
      <path d="M 172 215 Q 200 220 228 215" fill="none" stroke-width="6.5" />
    </g>
    <g id="m-hombro-trasero">
      <path d="M 125 155 C 115 150, 105 165, 120 175 C 130 175, 135 165, 130 155 Z" fill="#a8988b" class="division-interna" />
      <path d="M 275 155 C 285 150, 295 165, 280 175 C 270 175, 265 165, 270 155 Z" fill="#a8988b" class="division-interna" />
    </g>
    <g id="m-triceps">
      <path d="M 115 175 C 98 172, 95 190, 110 195 C 122 195, 128 185, 120 175 Z" fill="#8e7e72" class="division-interna" />
      <path d="M 285 175 C 302 172, 305 190, 290 195 C 278 195, 272 185, 280 175 Z" fill="#8e7e72" class="division-interna" />
    </g>
    <g id="m-antebrazo-trasero">
      <path d="M 110 195 C 93 192, 90 210, 105 215 C 118 215, 120 205, 115 195 Z" fill="#847468" class="division-interna" />
      <path d="M 290 195 C 307 192, 310 210, 295 215 C 282 215, 280 205, 285 195 Z" fill="#847468" class="division-interna" />
    </g>
    <g id="m-gluteo">
      <path d="M 200 240 L 148 245 C 138 280, 150 315, 200 330 Z" fill="#8a796c" class="division-interna" />
      <path d="M 200 240 L 252 245 C 262 280, 250 315, 200 330 Z" fill="#8a796c" class="division-interna" />
      <g id="cola-con-marcas">
        <path d="M 255 275 C 290 275, 305 290, 310 310 C 295 325, 275 325, 250 300 Z" fill="#9f8e81" />
        <path d="M 270 279 L 265 295 M 283 285 L 275 304 M 294 295 L 285 315" stroke="#3E2723" stroke-width="5" stroke-linecap="round" fill="none" />
      </g>
    </g>
    <g id="m-pierna-trasera">
      <path d="M 145 330 C 135 340, 135 365, 155 365 C 165 365, 165 345, 160 330 Z" fill="#847468" class="division-interna" />
      <path d="M 255 330 C 265 340, 265 365, 245 365 C 235 365, 235 345, 240 330 Z" fill="#847468" class="division-interna" />
    </g>
  </g>
</svg>
Mapeo PUSHEEN_ANATOMY_MAP (copiar en app.js)
javascript
const PUSHEEN_ANATOMY_MAP = {
  "Pecho": ["m-pecho"],
  "Espalda": ["m-espalda"],
  "Hombro": ["m-hombro-frontal", "m-hombro-trasero"],
  "Bíceps": ["m-biceps"],
  "Tríceps": ["m-triceps"],
  "Agarre": ["m-antebrazo-frontal", "m-antebrazo-trasero"],
  "Antebrazo": ["m-antebrazo-frontal", "m-antebrazo-trasero"],
  "Core": ["m-core"],
  "Pierna": ["m-pierna-frontal", "m-pierna-trasera"],
  "Glúteo": ["m-gluteo"]
};

function iluminarMusculo(musculoDB) {
  document.querySelectorAll('g[id^="m-"]').forEach(el => el.classList.remove('glow'));
  const ids = PUSHEEN_ANATOMY_MAP[musculoDB] || [];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('glow');
  });
}