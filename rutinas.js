const DB_INICIAL = {
    "macro_activo": "M1: Fuerza Base y Acondicionamiento",
    "semanas": 24,
    "gratificacion": {
        "niveles": [
            { "max": 300, "msg": ["Una motocicleta de enduro.", "Un bloque V8.", "Un gorila lomo plateado."] },
            { "max": 800, "msg": ["Un Oso Polar adulto.", "Un piano de cola de concierto.", "Un cocodrilo de agua salada."] },
            { "max": 1500, "msg": ["Un rinoceronte negro africano.", "Un sedán compacto.", "Una campana de iglesia de bronce."] },
            { "max": 99999, "msg": ["Una camioneta blindada.", "Un hipopótamo adulto.", "El ancla de un destructor naval."] }
        ],
        "mensajes_pr": [
            "Has roto tu récord. Eres más fuerte y vivirás más. Verás la vida completa de Merly Jimena.",
            "Nuevo límite superado. El tejido nuevo es tu seguro contra la fragilidad. Serás su roca inamovible.",
            "Tu reserva metabólica acaba de expandirse. Le estás comprando años de calidad al reloj biológico.",
            "No solo levantas hierro, construyes el físico de un padre que la edad no podrá doblegar."
        ]
    },
    "rutinas": {
        "M1_A": {
            "titulo": "GYM - Torso 1 (Fuerza Pecho/Espalda)",
            "ejercicios": [
                {
                    "nombre": "Press Pecho Convergente", 
                    "musculo": "Pecho", 
                    "tipo": "compuesto", 
                    "esCasa": false, 
                    "esCompensatorio": false,
                    "recursos": { "video_url": "", "origen": "" },
                    "equipamiento": "Máquina de Placas", 
                    "badge": "3x6-8", 
                    "tempo": "[3-1-1-0]",
                    "setup_julio": "Asiento [Posición Alta]", 
                    "setup_kenia": "Asiento [Posición Media]",
                    "propiocepcion": "Codos viajan a la línea media.", 
                    "prevencion": "Cero despegue de hombros.", 
                    "siseo": "Inhala 360° → Sssss al empujar.",
                    "ejecucion": ["[1] Espalda inamovible.", "[2] Codos a 45 grados.", "[3] Esternón lidera."]
                },
                {
                    "nombre": "Jalón al Pecho Neutro", 
                    "musculo": "Espalda", 
                    "tipo": "compuesto", 
                    "esCasa": false, 
                    "esCompensatorio": false,
                    "recursos": { "video_url": "https://www.youtube.com/embed/J8-Rp8dLZjU", "origen": "Proet Clínico" },
                    "equipamiento": "Polea Alta + Straps", 
                    "badge": "3x8-10", 
                    "tempo": "[3-1-1-0]",
                    "setup_julio": "Rodillos sin holgura", 
                    "setup_kenia": "Rodillos bajos",
                    "propiocepcion": "Codos clavan hacia el esternón.", 
                    "prevencion": "Lumbar neutra.", 
                    "siseo": "Inhala arriba → Sssss.",
                    "ejecucion": ["[1] Deprime hombros.", "[2] Flexiona brazos.", "[3] Toca el esternón."]
                },
                {
                    "nombre": "Curl Bíceps Polea", 
                    "musculo": "Bíceps", 
                    "tipo": "aislamiento", 
                    "esCasa": false, 
                    "esCompensatorio": false,
                    "equipamiento": "Polea Baja + Cuffs", 
                    "badge": "3x10-12", 
                    "tempo": "[3-1-1-0]",
                    "setup_julio": "Polea al suelo", 
                    "setup_kenia": "Polea al suelo",
                    "propiocepcion": "Codo clavado.", 
                    "prevencion": "Cero inercia.", 
                    "siseo": "Inhala abajo → ¡SUSH!.",
                    "ejecucion": ["[1] Postura recta.", "[2] Codo inmovilizado.", "[3] Rango completo."]
                },
                {
                    "nombre": "Extensión Tríceps Polea", 
                    "musculo": "Tríceps", 
                    "tipo": "aislamiento", 
                    "esCasa": false, 
                    "esCompensatorio": false,
                    "equipamiento": "Polea Alta + Cuffs", 
                    "badge": "3x10-12", 
                    "tempo": "[3-1-1-0]",
                    "setup_julio": "Punto alto", 
                    "setup_kenia": "Altura frente",
                    "propiocepcion": "Rompe el cable hacia el piso.", 
                    "prevencion": "Codo anclado.", 
                    "siseo": "Inhala arriba → Sssss.",
                    "ejecucion": ["[1] Pecho alto.", "[2] Codos pivote estático.", "[3] Bloqueo total abajo."]
                }
            ]
        },
        "M1_B": {
            "titulo": "GYM - Pierna 1 (Cuádriceps/Isquios)",
            "ejercicios": [
                {
                    "nombre": "Prensa de Piernas", 
                    "musculo": "Pierna", 
                    "tipo": "compuesto", 
                    "esCasa": false, 
                    "esCompensatorio": false,
                    "equipamiento": "Prensa", 
                    "badge": "3x8-10", 
                    "tempo": "[3-1-1-0]",
                    "setup_julio": "Pies Altos", 
                    "setup_kenia": "Pies Altos",
                    "propiocepcion": "Empuja con talones.", 
                    "prevencion": "Cero guiño de glúteo.", 
                    "siseo": "Inhala bajando -> SSSS.",
                    "ejecucion": ["[1] Sacro soldado.", "[2] Rodillas alineadas.", "[3] Empuje fluido."]
                },
                {
                    "nombre": "Curl Femoral", 
                    "musculo": "Pierna", 
                    "tipo": "aislamiento", 
                    "esCasa": false, 
                    "esCompensatorio": false,
                    "equipamiento": "Máquina", 
                    "badge": "3x10-12", 
                    "tempo": "[3-1-1-0]",
                    "setup_julio": "Ajuste Y", 
                    "setup_kenia": "Ajuste Z",
                    "propiocepcion": "Arrastra talón.", 
                    "prevencion": "Lumbar inamovible.", 
                    "siseo": "Inhala -> SUSH.",
                    "ejecucion": ["[1] Eje alineado.", "[2] Flexión máxima.", "[3] Pausa 1s."]
                },
                {
                    "nombre": "Dead Hang (Agarre)", 
                    "musculo": "Agarre", 
                    "tipo": "agarre", 
                    "esCasa": false, 
                    "esCompensatorio": true,
                    "equipamiento": "Barra (Sin Straps)", 
                    "badge": "3x30-45s", 
                    "tempo": "Estático",
                    "setup_julio": "Barra Alta", 
                    "setup_kenia": "Barra Baja",
                    "propiocepcion": "Descompresión vertebral L4-L5.", 
                    "prevencion": "No balancearse.", 
                    "siseo": "Respiración diafragmática.",
                    "ejecucion": ["[1] Suspensión total.", "[2] Relaja hombros.", "[3] Resiste el fallo de agarre."]
                }
            ]
        },
        "FULL_BODY_RESCATE": {
            "titulo": "🏥 FULL BODY (Superseries Antagónicas)",
            "ejercicios": [
                {
                    "nombre": "[A1] Press Inclinado Máquina", 
                    "musculo": "Pecho", 
                    "tipo": "compuesto", 
                    "esCasa": false, 
                    "esCompensatorio": false,
                    "equipamiento": "Máquina Inclinada", 
                    "badge": "3x8-10", 
                    "tempo": "[3-1-1-0]",
                    "setup_julio": "Asiento X", 
                    "setup_kenia": "Asiento X",
                    "propiocepcion": "Empuje diagonal.", 
                    "prevencion": "⚠️ NO DESCANSES. Pasa a [A2].", 
                    "siseo": "Inhala -> Sssss.",
                    "ejecucion": ["[1] Glúteos base.", "[2] Empuje explosivo.", "[3] Salta a Remo."]
                },
                {
                    "nombre": "[A2] Remo Pecho Apoyado", 
                    "musculo": "Espalda", 
                    "tipo": "compuesto", 
                    "esCasa": false, 
                    "esCompensatorio": false,
                    "equipamiento": "Máquina Remo", 
                    "badge": "3x8-10", 
                    "tempo": "[3-1-1-0]",
                    "setup_julio": "Straps obligatorios", 
                    "setup_kenia": "Agarre firme",
                    "propiocepcion": "Junta escápulas.", 
                    "prevencion": "Descansa 90s DESPUÉS de este.", 
                    "siseo": "Inhala -> Sssss.",
                    "ejecucion": ["[1] Pecho aplastado.", "[2] Jala codos atrás.", "[3] Inicia descanso global."]
                }
            ]
        }
    }
};

const SISTEMA_CONTROL = {
    fechaInicio: new Date("2026-06-22"),
    
    obtenerSemanaActual: function() {
        const hoy = new Date();
        const dias = Math.floor((hoy - this.fechaInicio) / (1000 * 60 * 60 * 24));
        return Math.max(1, Math.ceil(dias / 7));
    },

    cargarRutina: function(idRutina, baseDatosLocal, modoGuardiaActivo) {
        const semana = this.obtenerSemanaActual();
        let rutinaOriginal = baseDatosLocal.rutinas[idRutina];
        if (!rutinaOriginal) return null;
        
        let rutinaProcesada = JSON.parse(JSON.stringify(rutinaOriginal));
        
        if (semana >= 13) {
            rutinaProcesada.titulo += " [FASE PEGADA]";
            rutinaProcesada.ejercicios.forEach(ej => {
                if (ej.tipo === "compuesto" && !ej.esCompensatorio) {
                    ej.tempo = "[3-1-X-0]"; 
                    ej.siseo = "Inhala 360° → ¡SSH! (Siseo corto explosivo)";
                }
            });
        }

        if (modoGuardiaActivo) {
            rutinaProcesada.titulo = "🏥 [GUARDIA] " + rutinaProcesada.titulo;
            rutinaProcesada.ejercicios.forEach(ej => {
                if (!ej.esCompensatorio) {
                    ej.badge = "2 Series (RIR 4)";
                    ej.prevencion = "MODO GUARDIA: Evita el fallo muscular hoy. " + ej.prevencion;
                }
            });
        }
        return rutinaProcesada;
    }
};