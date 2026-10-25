/* =========================================================
   PUSHEEN FIT - ORQUESTADOR CENTRAL Y MOTORES DE HARDWARE
   ========================================================= */

let estado = {
    vista: 'dashboard', perfil: 'julio', rutina: 'M1_A', modoDensidad: false,
    modoGuardia: false, indices: {}, descanso: { fin: 0, intervalo: null },
    cardio: { fatmaxSecs: 0, fatmaxInterval: null, noruegoSecs: 600, noruegoInterval: null, faseNoruego: 'calentamiento' },
    db: null, metronomoPausadoPorDescanso: false, metronomoPausadoPorVideo: false
};

// --- POKA-YOKE 1: GESTIÓN DE ENERGÍA Y BACKGROUND DELTA TIMERS ---
let wakeLock = null;
async function mantenerPantallaActiva() {
    if ('wakeLock' in navigator) { 
        try { wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {} 
    }
}

document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
        await mantenerPantallaActiva();
        if (estado.descanso.fin > 0) {
            let restante = Math.ceil((estado.descanso.fin - Date.now()) / 1000);
            if (restante <= 0) {
                cancelarDescanso();
                dispararClick(440, 0.4);
                mostrarToast("⏱️ Recuperación completada en segundo plano.");
            }
        }
    }
});
document.body.addEventListener('click', mantenerPantallaActiva, { once: true });

function cargarDB() {
    let customDB = localStorage.getItem(`custom_db_${estado.perfil}`);
    try { estado.db = customDB ? JSON.parse(customDB) : DB_INICIAL; } catch(e) { estado.db = DB_INICIAL; }
    let k = Object.keys(estado.db.rutinas);
    if (!k.includes(estado.rutina)) estado.rutina = k[0];
    k.forEach(r => { if(estado.indices[r] === undefined) estado.indices[r] = 0; });
}

// --- POKA-YOKE 2: AUDIO Y METRÓNOMO ---
let audioCtx = null; let metronomoActivo = false; let loopMetronomo = null;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' }); if (audioCtx.state === 'suspended') audioCtx.resume(); }
function dispararClick(frecuencia, duracion) {
    initAudio(); const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
    osc.type = 'square'; osc.frequency.setValueAtTime(frecuencia, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracion);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime + duracion);
}
function controlMetronomo() {
    let btn = document.getElementById('btnMetro');
    if(metronomoActivo) { 
        clearInterval(loopMetronomo); metronomoActivo = false; btn.classList.remove('active'); 
        estado.metronomoPausadoPorDescanso = false; estado.metronomoPausadoPorVideo = false;
    } else { 
        initAudio(); loopMetronomo = setInterval(() => dispararClick(880, 0.05), 1000); 
        metronomoActivo = true; btn.classList.add('active'); 
    }
}

function toggleGuardia() {
    estado.modoGuardia = !estado.modoGuardia;
    document.getElementById('btnGuardia').classList.toggle('active', estado.modoGuardia);
    mostrarToast(estado.modoGuardia ? "🏥 MODO GUARDIA: Preservación de SNC." : "⚡ MODO NORMAL: Intensidad Base.");
    if(estado.vista === 'entrenar') renderEntrenar(document.getElementById('app-canvas'));
}

function mostrarToast(msg, esDorado = false) {
    let t = document.getElementById('toast-message'); t.textContent = msg; t.className = esDorado ? "toast-oro" : "";
    t.style.display = 'block'; t.style.opacity = '1';
    if(window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => { t.style.opacity = '0'; setTimeout(()=>t.style.display='none',300); }, esDorado ? 5000 : 2500);
}

// --- ENRUTADOR DE VISTAS ---
function cambiarVista(v) {
    cargarDB(); estado.vista = v;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`nav-${v}`).classList.add('active');
    const c = document.getElementById('app-canvas');
    
    if(v === 'dashboard') MOTOR_ADAPTATIVO.generarDashboard(c);
    else if(v === 'entrenar') renderEntrenar(c); 
    else if(v === 'cardio') renderCardio(c); 
    else if(v === 'planeacion') renderPlaneacion(c); 
    else if(v === 'auditoria') MOTOR_AUDITORIA.renderAuditoria(c);
}
function cambiarPerfil(p) { 
    estado.perfil = p; document.body.setAttribute('data-theme', p); 
    document.getElementById('prof-julio').classList.toggle('active', p==='julio'); 
    document.getElementById('prof-kenia').classList.toggle('active', p==='kenia'); 
    cambiarVista('dashboard'); 
}

// --- MÉTRICAS ---
function calcularTonelaje(diasAtras) {
    let total = 0; let dias = new Set(); let limit = new Date(); limit.setDate(limit.getDate() - diasAtras);
    for (let r in estado.db.rutinas) {
        estado.db.rutinas[r].ejercicios.forEach(ej => {
            if(ej.esCasa) return;
            let logs = JSON.parse(localStorage.getItem(`logs_${estado.perfil}_${ej.nombre.replace(/[^a-zA-Z0-9]/g, '')}`)) || [];
            logs.forEach(l => { if(new Date(l.fecha) >= limit) { total += (l.val1 * l.val2); dias.add(l.fecha); } });
        });
    }
    return { total, diasActivos: dias.size };
}
function calcularTotalHoy() {
    let t = 0; let hoy = new Date().toISOString().slice(0,10);
    for (let r in estado.db.rutinas) { estado.db.rutinas[r].ejercicios.forEach(ej => { if(!ej.esCasa) { let logs = JSON.parse(localStorage.getItem(`logs_${estado.perfil}_${ej.nombre.replace(/[^a-zA-Z0-9]/g, '')}`)) || []; logs.filter(l => l.fecha === hoy).forEach(l => t += (l.val1 * l.val2)); } }); }
    return t;
}
function verificarPR(totalHoy) {
    if(totalHoy <= 0) return false; let hist = calcularTonelaje(10);
    if(hist.diasActivos < 2) return false; let prom = (hist.total - totalHoy) / (hist.diasActivos - 1);
    return prom > 0 && totalHoy > (prom * 1.03);
}

// --- MULTIMEDIA PROET ---
function abrirVideo(url) {
    if (metronomoActivo) { clearInterval(loopMetronomo); document.getElementById('btnMetro').classList.remove('active'); estado.metronomoPausadoPorVideo = true; }
    document.getElementById('video-frame').src = url;
    document.getElementById('video-modal').showModal();
}
function cerrarVideo() {
    document.getElementById('video-frame').src = ""; 
    document.getElementById('video-modal').close();
    if (estado.metronomoPausadoPorVideo) {
        initAudio(); loopMetronomo = setInterval(() => dispararClick(880, 0.05), 1000);
        document.getElementById('btnMetro').classList.add('active'); estado.metronomoPausadoPorVideo = false;
    }
}

// ==========================================
// RENDERIZADO DE ENTRENAMIENTO (CON TRACKER VISUAL)
// ==========================================
function renderEntrenar(canvas) {
    const bloque = SISTEMA_CONTROL.cargarRutina(estado.rutina, estado.db, estado.modoGuardia);
    if (!bloque) { canvas.innerHTML = `<p style="text-align:center; margin-top:50px;">Rutina no encontrada.</p>`; return; }
    
    const idx = estado.indices[estado.rutina]; const ej = bloque.ejercicios[idx];
    const hash = ej.nombre.replace(/[^a-zA-Z0-9]/g, '');

    let v1 = localStorage.getItem(`t_${estado.perfil}_1_${hash}`) || (ej.esCasa ? "2" : "60"); 
    let v2 = localStorage.getItem(`t_${estado.perfil}_2_${hash}`) || "10";
    let hoy = new Date().toISOString().slice(0,10); let logsHoy = (JSON.parse(localStorage.getItem(`logs_${estado.perfil}_${hash}`)) || []).filter(l => l.fecha === hoy);

    // TRACKER VISUAL
    let matchSets = ej.badge.match(/(?:.*-)?(\d+)x/);
    let targetSets = matchSets ? parseInt(matchSets[1]) : 3;
    let totalCajas = Math.max(targetSets, logsHoy.length + 1);
    let porcentajeCarga = (logsHoy.length / targetSets) * 100;
    
    let avatarGato = porcentajeCarga >= 100 ? "👑🐱" : (porcentajeCarga >= 50 ? "🐯" : (porcentajeCarga > 0 ? "🐈" : "🐾"));

    let cajasGatunasHTML = '<div class="grid-gatos-series">';
    for(let i = 1; i <= totalCajas; i++) {
        if (i <= logsHoy.length) cajasGatunasHTML += `<div class="caja-gato-serie done">🍳</div>`;
        else if (i === logsHoy.length + 1) cajasGatunasHTML += `<div class="caja-gato-serie active">🔥</div>`;
        else cajasGatunasHTML += `<div class="caja-gato-serie">😴</div>`;
    }
    cajasGatunasHTML += '</div>';

    let btnVideoHTML = ej.recursos && ej.recursos.video_url ? `<button onclick="abrirVideo('${ej.recursos.video_url}')" style="width:100%; margin-bottom:12px; padding:12px; background:var(--azul-clinico); color:#000; border:none; border-radius:12px; font-weight:900; font-size:0.8rem; cursor:pointer;">▶ VER EJECUCIÓN (${ej.recursos.origen})</button>` : '';
    let esTotalPR = verificarPR(calcularTotalHoy());

    canvas.innerHTML = `
        <div style="font-size:0.75rem; text-align:center; color:var(--texto-sec); margin-bottom:12px; font-weight:900; text-transform:uppercase; letter-spacing:1px;">Lienzo Operativo: ${estado.modoDensidad ? '⚡ DENSIDAD MAX' : '⏱️ FUERZA BASE'}</div>
        <select onchange="estado.rutina=this.value; renderEntrenar(document.getElementById('app-canvas'));" class="routine-selector">
            ${Object.keys(estado.db.rutinas).map(k => `<option value="${k}" ${estado.rutina===k?'selected':''}>${estado.db.rutinas[k].titulo}</option>`).join('')}
        </select>
        
        <div class="card-exercise ${esTotalPR ? 'card-golden' : ''}">
            <div class="card-header">
                <div class="card-title">${ej.nombre}</div>
                <div class="badge-musculo" style="background:var(--bg-puro); border:1px solid var(--borde);">${ej.musculo}</div>
            </div>
            
            ${btnVideoHTML}
            
            <div class="cat-track-container">
                <div class="cat-track-fill" style="width: ${Math.min(porcentajeCarga, 100)}%;"></div>
                <div class="cat-avatar-walker" style="left: ${Math.min(porcentajeCarga, 100)}%;">${avatarGato}</div>
            </div>

            ${cajasGatunasHTML}

            <div class="clinical-box">
                <p style="font-size:0.85rem; font-weight:900; margin-bottom:6px; color:var(--azul-clinico);">${estado.perfil === 'julio' ? ej.setup_julio : ej.setup_kenia}</p>
                <div style="display:flex; gap:12px; font-size:0.7rem; color:var(--texto-sec); margin-bottom:6px;">
                    ${ej.tempo ? `<span>⏱️ Tempo: <strong>${ej.tempo}</strong></span>` : ''}
                    ${ej.siseo ? `<span>🫁 Neumática: <strong>${ej.siseo}</strong></span>` : ''}
                </div>
                <p style="border-top:1px solid var(--borde); padding-top:6px; font-size:0.75rem;"><strong>🎯 Foco:</strong> ${ej.propiocepcion}</p>
                ${ej.prevencion ? `<p style="margin-top:6px; font-size:0.75rem; color:#ef4444; font-weight:bold;">⚠️ Evitar: ${ej.prevencion}</p>` : ''}
            </div>
            
            <div class="grid-inputs">
                <div class="cell-input"><div class="cell-title">${ej.esCasa ? "Pausa (s)" : "Carga (kg)"}</div><div class="flex-controls"><button class="btn-step" onclick="modificarVal('val1', ${ej.esCasa?-1:-1.25})">-</button><input type="number" id="val1" value="${v1}"><button class="btn-step" onclick="modificarVal('val1', ${ej.esCasa?1:1.25})">+</button></div></div>
                <div class="cell-input"><div class="cell-title">${ej.esCompensatorio ? "Segundos" : "Reps"}</div><div class="flex-controls"><button class="btn-step" onclick="modificarVal('val2', -1)">-</button><input type="number" id="val2" value="${v2}"><button class="btn-step" onclick="modificarVal('val2', 1)">+</button></div></div>
            </div>
            
            <button class="btn-record" style="box-shadow:0 6px 20px rgba(34,197,94,0.3);" onclick="registrarSerie('${ej.nombre}', ${ej.esCasa}, '${ej.musculo}')">✓ SELLAR SERIE ${logsHoy.length + 1}</button>
            <button class="btn-undo" style="border-radius:12px; height:44px;" onclick="deshacerSerie('${ej.nombre}')">↩️ CORREGIR ERROR</button>
        </div>
        
        <div class="focus-nav-bar">
            <button class="btn-focus-nav" onclick="cambiarEjercicio(-1)" ${idx===0?'disabled':''}>◀</button>
            <div class="focus-indicator">${idx+1} / ${bloque.ejercicios.length}</div>
            <button class="btn-focus-nav" onclick="cambiarEjercicio(1)" ${idx===bloque.ejercicios.length-1?'disabled':''}>▶</button>
        </div>
    `;
}

function modificarVal(id, s) { 
    let e = document.getElementById(id); 
    let esCasa = estado.db.rutinas[estado.rutina].ejercicios[estado.indices[estado.rutina]].esCasa;
    let decimales = (id === 'val1' && !esCasa) ? 2 : 0;
    e.value = Math.max(0, (parseFloat(e.value)||0) + s).toFixed(decimales); 
}

function cambiarEjercicio(dir) { 
    let r = estado.db.rutinas[estado.rutina]; let n = estado.indices[estado.rutina] + dir; 
    if(n>=0 && n<r.ejercicios.length) { 
        let h = r.ejercicios[estado.indices[estado.rutina]].nombre.replace(/[^a-zA-Z0-9]/g, ''); 
        localStorage.setItem(`t_${estado.perfil}_1_${h}`, document.getElementById('val1').value); 
        localStorage.setItem(`t_${estado.perfil}_2_${h}`, document.getElementById('val2').value); 
        estado.indices[estado.rutina] = n; renderEntrenar(document.getElementById('app-canvas')); 
    } 
}

function registrarSerie(n, casa, musculo) {
    let h = n.replace(/[^a-zA-Z0-9]/g, ''); let v1 = parseFloat(document.getElementById('val1').value)||0; let v2 = parseInt(document.getElementById('val2').value)||0;
    let logs = JSON.parse(localStorage.getItem(`logs_${estado.perfil}_${h}`)) || []; 
    logs.push({fecha: new Date().toISOString().slice(0,10), val1: v1, val2: v2}); 
    localStorage.setItem(`logs_${estado.perfil}_${h}`, JSON.stringify(logs));
    localStorage.setItem(`t_${estado.perfil}_1_${h}`, v1); localStorage.setItem(`t_${estado.perfil}_2_${h}`, v2);

    mostrarToast("✓ Estímulo registrado en bitácora.");
    
    // Iluminar el mapa anatómico si es que está renderizado
    if(typeof iluminarMusculo === 'function') iluminarMusculo(musculo);

    let totalHoy = calcularTotalHoy();
    if (verificarPR(totalHoy)) {
        let leg = estado.db.gratificacion.mensajes_pr[Math.floor(Math.random()*estado.db.gratificacion.mensajes_pr.length)];
        mostrarToast(`🔥 NUEVO PR LOGRADO.\n${leg}`, true);
    }
    
    if (!estado.modoDensidad) { iniciarDescansoGlobal(casa ? 90 : 120); }
    renderEntrenar(document.getElementById('app-canvas'));
}

function deshacerSerie(n) {
    let h = n.replace(/[^a-zA-Z0-9]/g, ''); let hoy = new Date().toISOString().slice(0,10);
    let logs = JSON.parse(localStorage.getItem(`logs_${estado.perfil}_${h}`)) || [];
    if (logs.length > 0 && logs[logs.length-1].fecha === hoy) {
        logs.pop(); localStorage.setItem(`logs_${estado.perfil}_${h}`, JSON.stringify(logs));
        mostrarToast("↩️ Última serie eliminada del registro.");
        renderEntrenar(document.getElementById('app-canvas'));
    }
}

function iniciarDescansoGlobal(s) {
    estado.descanso.fin = Date.now() + (s * 1000); 
    document.getElementById('global-rest-timer').style.display = 'block';
    
    if (metronomoActivo && loopMetronomo) {
        clearInterval(loopMetronomo); document.getElementById('btnMetro').classList.remove('active');
        estado.metronomoPausadoPorDescanso = true;
    }

    if(estado.descanso.intervalo) clearInterval(estado.descanso.intervalo);
    estado.descanso.intervalo = setInterval(() => { 
        let r = Math.ceil((estado.descanso.fin - Date.now()) / 1000); 
        if(r <= 0) { 
            cancelarDescanso(); dispararClick(440, 0.4); mostrarToast("⏰ Reanudación autorizada. Ejecuta."); return; 
        } 
        document.getElementById('rest-time-display').textContent = `${Math.floor(r/60).toString().padStart(2,'0')}:${(r%60).toString().padStart(2,'0')}`; 
        document.getElementById('rest-progress-fill').style.width = `${(r/s)*100}%`; 
    }, 250); 
}
function ajustarDescanso(s) { estado.descanso.fin += (s*1000); } 
function cancelarDescanso() { 
    clearInterval(estado.descanso.intervalo); document.getElementById('global-rest-timer').style.display = 'none'; 
    estado.descanso.fin = 0;
    if (estado.metronomoPausadoPorDescanso) {
        initAudio(); loopMetronomo = setInterval(() => dispararClick(880, 0.05), 1000);
        document.getElementById('btnMetro').classList.add('active'); estado.metronomoPausadoPorDescanso = false; metronomoActivo = true;
    }
}

// ==========================================
// RENDERIZADO DE CARDIO (FATMAX Y 4x4)
// ==========================================
const FASES_NOR = { calentamiento:{t:600, sig:"e1", txt:"CALENTAMIENTO (Z1)", c:"#a1a1aa"}, e1:{t:240, sig:"r1", txt:"ESFUERZO 1 (90% VO2Max)", c:"#ef4444"}, r1:{t:180, sig:"e2", txt:"RECUP. 1 (65%)", c:"#22c55e"}, e2:{t:240, sig:"r2", txt:"ESFUERZO 2 (90% VO2Max)", c:"#ef4444"}, r2:{t:180, sig:"e3", txt:"RECUP. 2 (65%)", c:"#22c55e"}, e3:{t:240, sig:"r3", txt:"ESFUERZO 3 (90% VO2Max)", c:"#ef4444"}, r3:{t:180, sig:"e4", txt:"RECUP. 3 (65%)", c:"#22c55e"}, e4:{t:240, sig:"enf", txt:"ESFUERZO FINAL (90% VO2Max)", c:"#ef4444"}, enf:{t:180, sig:"fin", txt:"ENFRIAMIENTO", c:"#38bdf8"} };

function renderCardio(c) {
    let fn = FASES_NOR[estado.cardio.faseNoruego]; let s = estado.cardio.noruegoSecs; let mF = Math.floor((parseInt(localStorage.getItem(`fatmax_semanal_${estado.perfil}`))||0)/60); let sN = parseInt(localStorage.getItem(`vo2max_semanal_${estado.perfil}`))||0;
    c.innerHTML = `
        <div class="card-exercise">
            <div class="card-title" style="text-align:center;">🔬 ZONA 2 (FatMax)</div>
            <div style="font-size:0.85rem; font-weight:900; text-align:center; color:var(--accent); margin-top:8px;">Acumulado: ${mF} Minutos Semanales</div>
            <div id="fatmax-display" style="text-align:center; font-size:3.2rem; font-weight:900; color:var(--texto-prio); margin:12px 0; font-family:monospace;">00:00:00</div>
            <button class="btn-record" id="btn-fatmax" style="margin: 0 auto 12px auto;" onclick="toggleFatmax()">INICIAR ZONA 2</button>
            <button class="btn-undo" onclick="guardarSesionFatmax()">📥 GUARDAR MINUTOS</button>
        </div>
        <div class="card-exercise">
            <div class="card-title" style="text-align:center;">🇳🇴 4x4 NORUEGO</div>
            <p style="font-size:0.75rem; color:var(--texto-sec); text-align:center; font-weight:900; margin-top:6px;" id="nor-txt">${fn.txt}</p>
            <div style="font-size:0.8rem; font-weight:900; text-align:center; color:var(--azul-clinico); margin:4px 0;">Sesiones Completadas: ${sN}</div>
            <div id="nor-display" style="text-align:center; font-size:3.5rem; font-weight:900; color:${fn.c}; margin:8px 0; font-family:monospace;">${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}</div>
            <div class="sets-bar-bg" style="margin-bottom:16px; height:6px;"><div class="sets-bar-segment filled" id="nor-bar" style="background:${fn.c}; width:${((fn.t-s)/fn.t)*100}%;"></div></div>
            <div style="display:block; width:100%;">
                <button class="btn-record" id="btn-nor" style="background:#ef4444;" onclick="toggleNoruego()">EJECUTAR 4x4</button>
                <button class="btn-undo" onclick="resetNoruego()">🔄 RESETEAR</button>
            </div>
        </div>
    `; updateFatmaxUI(); updateNoruegoUI();
}
function toggleFatmax() { if(estado.cardio.fatmaxInterval) { clearInterval(estado.cardio.fatmaxInterval); estado.cardio.fatmaxInterval=null; } else { estado.cardio.fatmaxInterval = setInterval(()=>{estado.cardio.fatmaxSecs++; if(estado.vista==='cardio') updateFatmaxUI();},1000); } if(estado.vista==='cardio') updateFatmaxUI(); }
function updateFatmaxUI() { let d=document.getElementById('fatmax-display'), b=document.getElementById('btn-fatmax'); if(!d) return; let s=estado.cardio.fatmaxSecs; d.textContent=`${Math.floor(s/3600).toString().padStart(2,'0')}:${Math.floor((s%3600)/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`; if(estado.cardio.fatmaxInterval){b.textContent="🛑 PAUSAR ZONA 2"; b.style.background="#ef4444";}else{b.textContent="▶ INICIAR ZONA 2"; b.style.background="#8b5cf6";} }
function guardarSesionFatmax() { if(estado.cardio.fatmaxSecs<60) return mostrarToast("⚠️ Mínimo 1 min."); localStorage.setItem(`fatmax_semanal_${estado.perfil}`, (parseInt(localStorage.getItem(`fatmax_semanal_${estado.perfil}`))||0)+estado.cardio.fatmaxSecs); estado.cardio.fatmaxSecs=0; if(estado.cardio.fatmaxInterval) toggleFatmax(); mostrarToast("📥 Minutos guardados."); renderCardio(document.getElementById('app-canvas')); }
function toggleNoruego() { if(estado.cardio.noruegoInterval) { clearInterval(estado.cardio.noruegoInterval); estado.cardio.noruegoInterval=null; } else { estado.cardio.noruegoInterval = setInterval(procesarFaseNor,1000); } if(estado.vista==='cardio') updateNoruegoUI(); }
function procesarFaseNor() { estado.cardio.noruegoSecs--; let fn=FASES_NOR[estado.cardio.faseNoruego]; if(estado.cardio.noruegoSecs>0 && estado.cardio.noruegoSecs<=3) dispararClick(900,0.1); if(estado.cardio.noruegoSecs<=0){ let sig=fn.sig; if(sig==="fin"){ clearInterval(estado.cardio.noruegoInterval); estado.cardio.noruegoInterval=null; dispararClick(1200,0.8); mostrarToast("🏆 ¡4x4 COMPLETADO!", true); localStorage.setItem(`vo2max_semanal_${estado.perfil}`, (parseInt(localStorage.getItem(`vo2max_semanal_${estado.perfil}`))||0)+1); resetNoruego(); return; } estado.cardio.faseNoruego=sig; estado.cardio.noruegoSecs=FASES_NOR[sig].t; dispararClick(1500,0.5); } if(estado.vista==='cardio') updateNoruegoUI(); }
function updateNoruegoUI() { let d=document.getElementById('nor-display'), b=document.getElementById('btn-nor'), l=document.getElementById('nor-txt'), bar=document.getElementById('nor-bar'); if(!d) return; let s=estado.cardio.noruegoSecs, fn=FASES_NOR[estado.cardio.faseNoruego]; d.textContent=`${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`; d.style.color=fn.c; l.textContent=fn.txt; bar.style.background=fn.c; bar.style.width=`${((fn.t-s)/fn.t)*100}%`; if(estado.cardio.noruegoInterval){b.textContent="🛑 PAUSAR 4x4"; b.style.background="var(--bg-control)"; b.style.color="var(--texto-prio)";}else{b.textContent="▶ EJECUTAR 4x4"; b.style.background="#ef4444"; b.style.color="#fff";} }
function resetNoruego() { clearInterval(estado.cardio.noruegoInterval); estado.cardio.noruegoInterval=null; estado.cardio.faseNoruego='calentamiento'; estado.cardio.noruegoSecs=FASES_NOR['calentamiento'].t; if(estado.vista==='cardio') renderCardio(document.getElementById('app-canvas')); }

// ==========================================
// RENDERIZADO DE PLANEACIÓN (TÁCTICA)
// ==========================================
function renderPlaneacion(c) {
    let jsonActual = JSON.stringify(estado.db, null, 2);
    let semActual = SISTEMA_CONTROL.obtenerSemanaActual();
    let totalSemanas = estado.db.semanas || 24;
    
    let fTexto = semActual <= 4 ? "FASE 1: Acondicionamiento Anabólico" : semActual <= 12 ? "FASE 2: Hipertrofia Densa" : semActual <= 20 ? "FASE 3: Fuerza Balística (Pegada)" : "FASE 4: Regeneración";
    let fColor = semActual >= 13 ? "#ef4444" : "var(--oro)";
    
    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    let fechaIteracion = new Date(SISTEMA_CONTROL.fechaInicio);
    
    let htmlMatriz = "";
    let semanaContador = 1;
    
    while(semanaContador <= totalSemanas) {
        let mesIndex = fechaIteracion.getMonth();
        let anioIndex = fechaIteracion.getFullYear();
        let nombreMes = nombresMeses[mesIndex];
        
        htmlMatriz += `<div class="bloque-mes"><div class="titulo-mes"><span>📅 ${nombreMes} ${anioIndex}</span></div><div class="cuadricula-semanas">`;
        
        for(let i = 0; i < 4 && semanaContador <= totalSemanas; i++) {
            let claseSemana = "";
            if (semanaContador < semActual) claseSemana = "completada";
            if (semanaContador === semActual) claseSemana = "actual";
            if (semanaContador >= 13) claseSemana += " balistica"; 
            
            htmlMatriz += `<div class="casilla-semana ${claseSemana}">Sem ${semanaContador}</div>`;
            semanaContador++;
            fechaIteracion.setDate(fechaIteracion.getDate() + 7);
        }
        htmlMatriz += `</div></div>`;
    }

    c.innerHTML = `
        <div class="card-exercise">
            <h3 style="text-align:center; font-size:1.1rem; margin-bottom:4px;">🗺️ MAPA TÁCTICO</h3>
            <p style="text-align:center; font-size:0.75rem; font-weight:900; color:var(--texto-sec); margin-bottom:12px;">${estado.db.macro_activo}</p>
            
            <div style="background:var(--bg-puro); border:1px solid ${fColor}; padding:10px; border-radius:12px; text-align:center; margin-bottom:12px; box-shadow:0 0 10px ${fColor}33;">
                <div style="font-size:0.65rem; color:var(--texto-sec); font-weight:900; text-transform:uppercase;">Mesociclo Activo</div>
                <div style="font-size:1rem; font-weight:900; color:${fColor}; margin-top:2px;">${fTexto}</div>
                <div style="font-size:0.75rem; font-weight:900; color:var(--texto-prio); margin-top:4px;">Semana del Ecosistema: ${semActual} / ${totalSemanas}</div>
            </div>

            <div class="contenedor-meses">${htmlMatriz}</div>
        </div>
        
        <div class="card-exercise">
            <h3 style="text-align:center; margin-bottom:12px; font-size:0.9rem;">💻 Puerto de Inyección JSON</h3>
            <textarea id="json-input" class="terminal-textarea" spellcheck="false">${jsonActual}</textarea>
            <button class="btn-record" style="width:100%; height:45px; background:var(--oro); color:#000; margin:0;" onclick="inyectarJSON()">SOBRESCRIBIR MAPA</button>
        </div>
    `;
}

function inyectarJSON() {
    try {
        let nDB = JSON.parse(document.getElementById('json-input').value);
        if(!nDB.rutinas || !nDB.semanas || !nDB.macro_activo) throw new Error("Estructura clínica incompleta.");
        localStorage.setItem(`custom_db_${estado.perfil}`, JSON.stringify(nDB));
        cargarDB(); mostrarToast("✅ Base de datos sobrescrita y validada.", true); renderPlaneacion(document.getElementById('app-canvas'));
    } catch(e) { mostrarToast(`❌ BLOQUEO: ${e.message || "Error de sintaxis JSON."}`); }
}

function exportarBackup() {
    let data={}; for(let i=0; i<localStorage.length; i++){let k=localStorage.key(i); data[k]=localStorage.getItem(k);}
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:"application/json"}));
    a.download=`PusheenFit_Data_${estado.perfil}.json`; a.click(); mostrarToast("💾 Historial respaldado.");
}

window.onload = () => { cargarDB(); cambiarVista('dashboard'); };