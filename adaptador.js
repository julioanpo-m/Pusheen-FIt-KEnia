/* =========================================================
   MÓDULO 2: ADAPTADOR Y TRIAGE EJECUTIVO (DASHBOARD)
   ========================================================= */

const MOTOR_ADAPTATIVO = {
    UMBRAL_COMPROMISO: 3,
    configTemp: { entorno: null, dinamica: null },

    // 1. Analiza el localStorage para contar los días entrenados en los últimos 7 días
    obtenerFrecuenciaSemanal: function(perfil) {
        let hoy = new Date();
        let limite = new Date(); 
        limite.setDate(hoy.getDate() - 7);
        let diasUnicos = new Set();

        for (let i = 0; i < localStorage.length; i++) {
            let llave = localStorage.key(i);
            if (llave.startsWith(`logs_${perfil}_`)) {
                let logs = JSON.parse(localStorage.getItem(llave)) || [];
                logs.forEach(l => { 
                    if (new Date(l.fecha) >= limite) diasUnicos.add(l.fecha); 
                });
            }
        }
        return diasUnicos.size;
    },

    // 2. Renderiza el Executive Dashboard al abrir la app
    generarDashboard: function(canvas) {
        let freq = this.obtenerFrecuenciaSemanal(estado.perfil);
        let flujoSugerido = freq >= this.UMBRAL_COMPROMISO ? "DIVISIÓN T/P (Especialización)" : "FULL BODY (Rescate Metabólico)";
        let colorFlujo = freq >= this.UMBRAL_COMPROMISO ? "var(--accent)" : "#ef4444";
        
        let alertaRescate = freq < this.UMBRAL_COMPROMISO ? 
            `<div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; padding:12px; border-radius:12px; margin-bottom:16px; font-size:0.75rem; color:#fff;">
                <strong>🏥 NOTA DE ADAPTACIÓN:</strong> Frecuencia operativa baja (${freq}/7 días). El sistema sugiere pivotar a Full Body para rescatar estímulo sin sobreentrenar.
            </div>` : "";

        canvas.innerHTML = `
            <div class="card-exercise">
                <h3 style="text-align:center; font-size:1.1rem; margin-bottom:16px;">🎛️ EXECUTIVE DASHBOARD</h3>
                ${alertaRescate}
                
                <div style="font-size:0.7rem; font-weight:900; color:var(--texto-sec); margin-bottom:6px;">1. ENTORNO OPERATIVO</div>
                <div style="display:flex; gap:8px; margin-bottom:16px;">
                    <button class="btn-record" id="btn-env-gym" style="flex:1; background:var(--bg-control); color:var(--texto-prio);" onclick="MOTOR_ADAPTATIVO.setEntorno('GYM')">🏢 GYM</button>
                    <button class="btn-record" id="btn-env-casa" style="flex:1; background:var(--bg-control); color:var(--texto-prio);" onclick="MOTOR_ADAPTATIVO.setEntorno('CASA')">🏠 CASA</button>
                </div>

                <div style="font-size:0.7rem; font-weight:900; color:var(--texto-sec); margin-bottom:6px;">2. DINÁMICA DE TIEMPO</div>
                <div style="display:flex; gap:8px; margin-bottom:16px;">
                    <button class="btn-record" id="btn-dyn-std" style="flex:1; background:var(--bg-control); color:var(--texto-prio); font-size:0.8rem;" onclick="MOTOR_ADAPTATIVO.setDinamica('ESTANDAR')">⏱️ ESTÁNDAR</button>
                    <button class="btn-record" id="btn-dyn-den" style="flex:1; background:var(--bg-control); color:var(--texto-prio); font-size:0.8rem;" onclick="MOTOR_ADAPTATIVO.setDinamica('DENSIDAD')">🔄 DENSIDAD</button>
                </div>

                <div style="border-top:1px solid var(--borde); margin:16px 0;"></div>
                
                <div style="text-align:center; margin-bottom:16px;">
                    <div style="font-size:0.65rem; font-weight:900; color:var(--texto-sec);">FLUJO ASIGNADO POR ALGORITMO:</div>
                    <div style="font-size:1.1rem; font-weight:900; color:${colorFlujo}; margin-top:4px;">${flujoSugerido}</div>
                </div>

                <button class="btn-record" style="width:100%; height:50px; box-shadow:0 6px 15px rgba(34,197,94,0.3);" onclick="MOTOR_ADAPTATIVO.iniciarProtocolo(${freq < this.UMBRAL_COMPROMISO})">✓ INICIAR PROTOCOLO</button>
                ${freq < this.UMBRAL_COMPROMISO ? `<button class="btn-undo" style="width:100%; margin-top:8px; font-size:0.7rem;" onclick="MOTOR_ADAPTATIVO.iniciarProtocolo(false)">❌ IGNORAR Y FORZAR RUTINA BASE</button>` : ""}
            </div>
        `;
    },

    setEntorno: function(e) {
        this.configTemp.entorno = e;
        document.getElementById('btn-env-gym').style.background = e === 'GYM' ? 'var(--accent)' : 'var(--bg-control)';
        document.getElementById('btn-env-casa').style.background = e === 'CASA' ? 'var(--accent)' : 'var(--bg-control)';
    },

    setDinamica: function(d) {
        this.configTemp.dinamica = d;
        document.getElementById('btn-dyn-std').style.background = d === 'ESTANDAR' ? 'var(--azul-clinico)' : 'var(--bg-control)';
        document.getElementById('btn-dyn-den').style.background = d === 'DENSIDAD' ? 'var(--azul-clinico)' : 'var(--bg-control)';
    },

    iniciarProtocolo: function(forzarFullBody) {
        if(!this.configTemp.entorno || !this.configTemp.dinamica) return mostrarToast("⚠️ Selecciona Entorno y Dinámica primero.");
        
        let keys = Object.keys(estado.db.rutinas);
        let keyDestino = keys[0];

        if (forzarFullBody) {
            keyDestino = keys.find(k => k.includes("FULL_BODY")) || keys[0];
        } else {
            keyDestino = keys.find(k => k.includes("M1_A")) || keys[0]; // Simplificado para el ejemplo
        }

        estado.rutina = keyDestino;
        estado.modoDensidad = (this.configTemp.dinamica === 'DENSIDAD');
        
        cambiarVista('entrenar');
    }
};