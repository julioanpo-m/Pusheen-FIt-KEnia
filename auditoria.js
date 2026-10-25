/* =========================================================
   MÓDULO 3: PACR (AUDITORÍA CLÍNICA Y MAPA ANATÓMICO)
   ========================================================= */

const PUSHEEN_ANATOMY_MAP = {
    "Pecho": ["m-pecho"],
    "Espalda": ["m-espalda"],
    "Hombro": ["m-hombro-frontal", "m-hombro-trasero"],
    "Brazo": ["m-biceps", "m-triceps"],
    "Bíceps": ["m-biceps"],
    "Tríceps": ["m-triceps"],
    "Agarre": ["m-antebrazo-frontal", "m-antebrazo-trasero"],
    "Core": ["m-core"],
    "Pierna": ["m-pierna-frontal", "m-pierna-trasera"],
    "Glúteo": ["m-gluteo"]
};

const MOTOR_AUDITORIA = {
    patronActivo: "empuje_h",

    CATALOGO_PATRONES: {
        empuje_h: { nombre: "Empuje Horizontal", ej: "Press Pecho" },
        traccion_v: { nombre: "Tracción Vertical", ej: "Jalón Neutro" },
        bisagra: { nombre: "Bisagra Cadera", ej: "Hip Thrust" },
        rodilla: { nombre: "Dominante Rodilla", ej: "Prensa" }
    },

    renderAuditoria: function(canvas) {
        let mF = Math.floor((parseInt(localStorage.getItem(`fatmax_semanal_${estado.perfil}`)) || 0) / 60);
        let sN = parseInt(localStorage.getItem(`vo2max_semanal_${estado.perfil}`)) || 0;
        
        let tonelajeAgudo = calcularTonelaje(7).total;
        let acwr = (calcularTonelaje(28).total / 4) === 0 ? 1.0 : (tonelajeAgudo / (calcularTonelaje(28).total / 4));
        let colorACWR = acwr > 1.5 ? "#ef4444" : (acwr < 0.8 ? "#f97316" : "#22c55e");

        let rmHistorico = localStorage.getItem(`par_1rm_${estado.perfil}_${this.patronActivo}`) || "60.0";
        
        canvas.innerHTML = `
            <div class="card-exercise">
                <div class="sets-header" style="justify-content:center; margin-bottom:4px;"><span>ÍNDICE DE LESIÓN ESPINAL (ACWR)</span></div>
                <div style="font-size: 2.5rem; font-weight: 900; text-align: center; color: ${colorACWR}; font-family: monospace;">${acwr.toFixed(2)}</div>
                <p style="font-size: 0.7rem; text-align: center; font-weight: 800; color: ${colorACWR}; margin-bottom:16px;">
                    ${acwr > 1.5 ? "⚠️ SOBRECARGA: SNC Saturado. Activa Modo Guardia." : "✅ OPTIMIZACIÓN: Tejido seguro."}
                </p>
                
                <!-- MAPA ANATÓMICO DE PUSHEEN -->
                <div class="pusheen-map-container" id="pusheen-map-container">
                    <!-- SVG INYECTADO VIA JS -->
                </div>
                <button class="btn-undo" style="margin-top:12px; font-size:0.7rem;" onclick="MOTOR_AUDITORIA.probarMapa()">🧪 PROBAR BRILLO MUSCULAR</button>
            </div>

            <div class="card-exercise" style="border-color: var(--azul-clinico);">
                <div class="card-header"><div class="card-title">🔬 AUDITORÍA DE PATRONES</div><div class="badge-musculo" style="color:var(--azul-clinico);">1RM LAB</div></div>
                
                <select onchange="MOTOR_AUDITORIA.cambiarPatron(this.value)" class="routine-selector" style="border-color: var(--borde); margin-bottom:14px;">
                    ${Object.keys(this.CATALOGO_PATRONES).map(k => `<option value="${k}" ${this.patronActivo===k?'selected':''}>${this.CATALOGO_PATRONES[k].nombre}</option>`).join('')}
                </select>

                <div class="grid-inputs" style="margin-bottom:12px;">
                    <div class="cell-input"><div class="cell-title">Carga Test</div><div class="flex-controls"><button class="btn-step" onclick="modificarVal('par-w', -2.5)">-</button><input type="number" id="par-w" value="${rmHistorico}"><button class="btn-step" onclick="modificarVal('par-w', 2.5)">+</button></div></div>
                    <div class="cell-input"><div class="cell-title">Reps Fallo</div><div class="flex-controls"><button class="btn-step" onclick="modificarVal('par-r', -1)">-</button><input type="number" id="par-r" value="5"><button class="btn-step" onclick="modificarVal('par-r', 1)">+</button></div></div>
                </div>

                <button class="btn-record" style="background:var(--azul-clinico); color:#000; height:46px; line-height:46px;" onclick="MOTOR_AUDITORIA.calcularPAR()">⚡ SELLAR CAPACIDAD MECÁNICA</button>
            </div>
        `;
        
        this.inyectarSVG();
    },

    inyectarSVG: function() {
        const contenedor = document.getElementById('pusheen-map-container');
        if (!contenedor) return;
        
        // SVG COMPLETO DE PUSHEEN (Doble vista)
        contenedor.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="100%">
              <defs>
                <style>
                  .contorno-pusheen { stroke: #4a3b32; stroke-width: 5px; stroke-linecap: round; stroke-linejoin: round; }
                  g[id^="m-"] { cursor: pointer; transition: filter 0.3s ease, opacity 0.3s ease; }
                  .glow { animation: pulso-brillo 1.8s infinite ease-in-out; opacity: 1 !important; z-index: 10; }
                  @keyframes pulso-brillo {
                    0% { filter: drop-shadow(0 0 4px var(--accent)) drop-shadow(0 0 8px var(--accent)); }
                    50% { filter: drop-shadow(0 0 14px var(--accent)) drop-shadow(0 0 22px var(--accent)); }
                    100% { filter: drop-shadow(0 0 4px var(--accent)) drop-shadow(0 0 8px var(--accent)); }
                  }
                </style>
              </defs>
            
              <!-- VISTA ANTERIOR -->
              <g id="vista-frontal" transform="translate(0, 0)">
                <path d="M 120 180 C 100 250, 120 340, 200 340 C 280 340, 300 250, 280 180 C 260 140, 140 140, 120 180 Z" fill="#9f8e81" class="contorno-pusheen" />
                <path d="M 140 100 C 130 130, 160 150, 200 150 C 240 150, 270 130, 260 100 C 250 70, 150 70, 140 100 Z" fill="#9f8e81" class="contorno-pusheen" />
                <path d="M 145 90 L 165 50 L 185 85 Z" fill="#9f8e81" class="contorno-pusheen" />
                <path d="M 255 90 L 235 50 L 215 85 Z" fill="#9f8e81" class="contorno-pusheen" />
                
                <g id="m-pecho">
                  <path d="M 150 180 C 170 160, 190 160, 200 180 C 190 195, 170 195, 150 180 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 250 180 C 230 160, 210 160, 200 180 C 210 195, 230 195, 250 180 Z" fill="currentColor" class="contorno-pusheen" />
                </g>
                <g id="m-hombro-frontal">
                  <path d="M 125 165 C 105 165, 105 190, 125 190 C 140 190, 140 165, 125 165 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 275 165 C 295 165, 295 190, 275 190 C 260 190, 260 165, 275 165 Z" fill="currentColor" class="contorno-pusheen" />
                </g>
                <g id="m-biceps">
                  <path d="M 115 190 C 95 190, 100 225, 125 225 C 135 215, 135 195, 115 190 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 285 190 C 305 190, 300 225, 275 225 C 265 215, 265 195, 285 190 Z" fill="currentColor" class="contorno-pusheen" />
                </g>
                <g id="m-antebrazo-frontal">
                  <path d="M 110 225 C 95 225, 100 255, 125 255 C 130 245, 130 230, 110 225 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 290 225 C 305 225, 300 255, 275 255 C 270 245, 270 230, 290 225 Z" fill="currentColor" class="contorno-pusheen" />
                </g>
                <g id="m-core">
                  <path d="M 155 210 C 150 260, 165 310, 200 310 C 235 310, 250 260, 245 210 C 220 200, 180 200, 155 210 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 185 235 Q 200 240 215 235 M 182 260 Q 200 266 218 260 M 185 285 Q 200 290 215 285" fill="none" stroke="#4a3b32" stroke-width="4" stroke-linecap="round" />
                </g>
                <g id="m-pierna-frontal">
                  <path d="M 150 320 C 140 350, 140 365, 160 365 C 175 365, 175 340, 170 320 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 250 320 C 260 350, 260 365, 240 365 C 225 365, 225 340, 230 320 Z" fill="currentColor" class="contorno-pusheen" />
                </g>
                <g id="rostro-pusheen" fill="#4a3b32" stroke="none">
                  <circle cx="175" cy="120" r="4.5" /><circle cx="225" cy="120" r="4.5" />
                  <path d="M 195 130 L 200 125 L 205 130 Z" />
                  <path d="M 193 135 Q 200 140 207 135" fill="none" stroke="#4a3b32" stroke-width="3" stroke-linecap="round" />
                  <path d="M 115 120 L 135 120 M 115 130 L 135 130 M 115 140 L 135 140" stroke="#4a3b32" stroke-width="4" stroke-linecap="round" />
                  <path d="M 285 120 L 265 120 M 285 130 L 265 130 M 285 140 L 265 140" stroke="#4a3b32" stroke-width="4" stroke-linecap="round" />
                </g>
              </g>
            
              <!-- VISTA POSTERIOR -->
              <g id="vista-trasera" transform="translate(400, 0)">
                <path d="M 120 180 C 100 250, 120 340, 200 340 C 280 340, 300 250, 280 180 C 260 140, 140 140, 120 180 Z" fill="#9f8e81" class="contorno-pusheen" />
                <path d="M 140 100 C 130 130, 160 150, 200 150 C 240 150, 270 130, 260 100 C 250 70, 150 70, 140 100 Z" fill="#9f8e81" class="contorno-pusheen" />
                <path d="M 145 90 L 165 50 L 185 85 Z" fill="#9f8e81" class="contorno-pusheen" />
                <path d="M 255 90 L 235 50 L 215 85 Z" fill="#9f8e81" class="contorno-pusheen" />
                
                <g id="m-espalda">
                  <path d="M 135 180 C 160 160, 240 160, 265 180 C 260 240, 230 260, 200 260 C 170 260, 140 240, 135 180 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 180 175 Q 200 180 220 175 M 175 200 Q 200 205 225 200 M 178 225 Q 200 230 222 225" fill="none" stroke="#4a3b32" stroke-width="5" stroke-linecap="round" />
                </g>
                <g id="m-hombro-trasero">
                  <path d="M 125 165 C 105 165, 105 190, 125 190 C 140 190, 140 165, 125 165 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 275 165 C 295 165, 295 190, 275 190 C 260 190, 260 165, 275 165 Z" fill="currentColor" class="contorno-pusheen" />
                </g>
                <g id="m-triceps">
                  <path d="M 115 190 C 95 190, 100 225, 125 225 C 135 215, 135 195, 115 190 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 285 190 C 305 190, 300 225, 275 225 C 265 215, 265 195, 285 190 Z" fill="currentColor" class="contorno-pusheen" />
                </g>
                <g id="m-antebrazo-trasero">
                  <path d="M 110 225 C 95 225, 100 255, 125 255 C 130 245, 130 230, 110 225 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 290 225 C 305 225, 300 255, 275 255 C 270 245, 270 230, 290 225 Z" fill="currentColor" class="contorno-pusheen" />
                </g>
                <g id="m-gluteo">
                  <path d="M 145 250 C 170 240, 230 240, 255 250 C 265 290, 240 320, 200 320 C 160 320, 135 290, 145 250 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 200 260 L 200 310" fill="none" stroke="#4a3b32" stroke-width="4" stroke-linecap="round" />
                  <path d="M 255 280 C 290 280, 310 300, 310 320 C 290 330, 270 320, 245 290" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 270 285 L 280 305 M 285 295 L 295 315" stroke="#4a3b32" stroke-width="4" stroke-linecap="round" />
                </g>
                <g id="m-pierna-trasera">
                  <path d="M 150 320 C 140 350, 140 365, 160 365 C 175 365, 175 340, 170 320 Z" fill="currentColor" class="contorno-pusheen" />
                  <path d="M 250 320 C 260 350, 260 365, 240 365 C 225 365, 225 340, 230 320 Z" fill="currentColor" class="contorno-pusheen" />
                </g>
              </g>
            </svg>
        `;
    },

    cambiarPatron: function(p) { 
        this.patronActivo = p; 
        this.renderAuditoria(document.getElementById('app-canvas')); 
    },

    calcularPAR: function() {
        let w = parseFloat(document.getElementById('par-w').value) || 0;
        let r = parseInt(document.getElementById('par-r').value) || 0;
        if(w <= 0 || r <= 0) return mostrarToast("⚠️ Parámetros clínicos incompletos.");

        // Epley: 1RM = W * (1 + 0.0333 * R)
        let rm = w * (1 + (0.0333 * r));
        localStorage.setItem(`par_1rm_${estado.perfil}_${this.patronActivo}`, rm.toFixed(1));
        mostrarToast(`🔬 1RM Estimado: ${rm.toFixed(1)}kg`, true);
        this.renderAuditoria(document.getElementById('app-canvas'));
    },

    probarMapa: function() {
        // Función de prueba para ver el brillo en acción
        let musculos = ["m-pecho", "m-espalda", "m-core", "m-gluteo", "m-biceps"];
        let randomMuscle = musculos[Math.floor(Math.random() * musculos.length)];
        iluminarMusculo(randomMuscle.replace("m-", "").charAt(0).toUpperCase() + randomMuscle.replace("m-", "").slice(1));
    }
};

// Función global para iluminar
function iluminarMusculo(grupo) {
    // 1. Limpiar todos los brillos
    document.querySelectorAll('g[id^="m-"]').forEach(el => el.classList.remove('glow'));
    
    // 2. Buscar IDs correspondientes
    let ids = PUSHEEN_ANATOMY_MAP[grupo] || [];
    
    // 3. Aplicar clase
    ids.forEach(id => {
        let el = document.getElementById(id);
        if (el) el.classList.add('glow');
    });
}