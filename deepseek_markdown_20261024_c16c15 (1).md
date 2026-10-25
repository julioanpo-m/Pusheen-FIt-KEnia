# ROL Y CONTEXTO
Actúa como un Ingeniero de Software Senior y Arquitecto de Sistemas Clínicos, experto en Lean Software Development y PWAs (Progressive Web Apps) optimizadas para iOS (Safari/iPhone 15 Pro/17).

Tu tarea es AUDITAR, REFACTORIZAR y MEJORAR la aplicación "Pusheen Fit (S.O.E. 3.1418)" que ya existe en el archivo `app-funcional.html` de este proyecto. 

El sistema es 100% Vanilla JS (cero dependencias como React, Vue, Tailwind o Chart.js). El usuario es médico (Julio) y su esposa es enfermera (Kenia), por lo que el rigor clínico, la biomecánica y la eficiencia operativa (cero desperdicio/Muda) son mandatorios.

# 1. ARCHIVO BASE: LO QUE YA FUNCIONA (NO ROMPER)

Lee el archivo `app-funcional.html` (o `src_gemini-code-1784996246629.html`). Contiene la base funcional que DEBES PRESERVAR:

**Arquitectura de datos:**
- `RAW_JSON`: array de rutinas con estructura `blocks[] → exercises[]`.
- `procesarJSON()`: función que aplana los bloques a `ejercicios[]`. **Es el motor que permite que todo cargue.**
- `verificarResetMatutino(hash)`: corte de las 6 AM. Mueve los valores del día anterior a `ghost_*` y reinicia inputs.
- Progresión con `ghost_*`: si se supera `max_reps`, suma 2.5 kg y baja a `min_reps`; si no, suma 1 repetición.
- Botón `⚖️ APROXIMACIÓN`: series marcadas `is_aprox` no suman al tonelaje ni cuentan como efectivas.
- Caso `HRR`: inputs de "Pulso PICO" y "Pulso 60s" con validación de caída vagal.

**Persistencia y hardware:**
- `localStorage` con llaves prefijadas por perfil: `logs_${perfil}_*`, `t_${perfil}_*`, `ghost_${perfil}_*`.
- `Wake Lock API` para mantener pantalla activa.
- `Web Audio API` para metrónomo (60 BPM, onda cuadrada, volumen 0.08).
- Delta Timers con marcas de tiempo absolutas (`Date.now() + ms`).
- `sincronizarNubeSilenciosa()`: POST `no-cors` a webhook de Google Sheets.
- Gráficos con Canvas 2D nativo: `dibujarGrafico()` para Tonelaje, HRR y FatMax.

# 2. LO QUE DEBES AGREGAR (NUEVAS FUNCIONALIDADES)

## 2.1 Mapa Anatómico de Pusheen (SVG Interactivo de Doble Vista)
- Genera un `<svg>` con `viewBox="0 0 800 400"`.
- **Vista Anterior (Izquierda):** `<g transform="translate(0, 0)">` con IDs: `m-pecho`, `m-hombro-frontal`, `m-biceps`, `m-antebrazo-frontal`, `m-core`, `m-pierna-frontal`.
- **Vista Posterior (Derecha):** `<g transform="translate(400, 0)">` (NO superpongas) con IDs: `m-espalda`, `m-hombro-trasero`, `m-triceps`, `m-antebrazo-trasero`, `m-gluteo`, `m-pierna-trasera`.
- **Colores exactos:** `fill="currentColor"` (base `#9f8e81`), `stroke="#4a3b32"`, accesorios `#7be1d1`.
- **Animación `.glow`:** `@keyframes pulso-brillo` con `drop-shadow` intenso.
- **Lógica:** Objeto `PUSHEEN_ANATOMY_MAP` que traduzca `"Pecho"`, `"Espalda"`, `"Agarre"`, etc., a los IDs del SVG. Al registrar serie, limpiar brillos anteriores y añadir `.glow` al músculo correspondiente.

## 2.2 Doble Perfil Estricto (Julio vs. Kenia)
- **Julio:** Tema oscuro clínico (`#000000`, verde neón `#22c55e`). SVG en tono gris oscuro. Mensajes de longevidad y protección L4-L5.
- **Kenia:** Tema pastel (rosas, lavandas). SVG con colores originales de Pusheen. Brillo rosa chicle (`#FF4081`). "Semáforo Pélvico" y adaptaciones en sofá.
- **Regla:** Al cambiar perfil, limpiar memoria volátil, recargar DOM y traer solo los logs del perfil seleccionado.

## 2.3 Dashboard Ejecutivo (Triage Visual)
- Un panel en la vista "Comando" que lea la frecuencia semanal de entrenamiento.
- Si entrena ≥ 3 días: flujo Torso/Pierna.
- Si entrena < 3 días: sugerir `FULL_BODY_RESCATE` (superseries antagónicas Push/Pull).
- Mostrar alerta visual si el ACWR (carga aguda / carga crónica) supera 1.5.

# 3. EXPERIENCIA DE USUARIO (UX): REGLAS DE ORO

Aplica estas mejoras de UX sin romper la estética clínica:
1. **Feedback inmediato:** Cada acción (registrar serie, borrar, cambiar vista) debe producir una respuesta visual o sonora en < 100 ms.
2. **Thumb Zone:** Todos los botones táctiles ≥ 44x44 px. Los inputs numéricos deben estar en la mitad inferior de la pantalla.
3. **Prevención de errores (Poka-Yoke):** Si el usuario intenta registrar una serie con `val1=0` o `val2=0`, bloquear la acción y mostrar un toast explicativo.
4. **Carga cognitiva mínima:** Un solo foco a la vez. La vista "Entrenar" debe mostrar SOLO el ejercicio activo, con navegación ◀ ANT / SIG ▶.
5. **Persistencia silenciosa:** El guardado en `localStorage` ocurre sin intervención del usuario. El respaldo en la nube (webhook) se dispara al terminar sesión o al guardar cardio.
6. **Modo Guardia (🏥):** Toggle que muta la rutina activa: baja series, sube RIR a 4, prohíbe el fallo muscular. Diseñado para post-turno en el IMSS.

# 4. RESTRICCIONES TÉCNICAS (OBLIGATORIO)

- **NO uses frameworks** (React, Vue, Angular). Todo Vanilla JS.
- **NO uses librerías de gráficas** (Chart.js, D3). Canvas 2D o SVG crudo generado por código.
- **Mobile-first:** La UI debe funcionar en iPhone 15 Pro / 17 sin zoom ni scroll horizontal.
- **Cero bases de datos externas.** Todo en `localStorage` + webhook opcional.
- **Comentarios clínicos:** Cada función que toque lógica de entrenamiento debe tener un comentario explicando el Poka-Yoke o la razón biomecánica.

# 5. VALIDACIÓN (CÓMO SABRÉ QUE FUNCIONA)

Antes de dar por terminada una tarea, ejecuta estas verificaciones:
1. **Carga inicial:** Abrir `index.html` con Live Server. La app debe renderizar la vista "Comando" sin errores en consola.
2. **Registro de serie:** Ir a "Entrenar", seleccionar un ejercicio, pulsar "TERMINAR SERIE EFECTIVA". El tonelaje debe actualizarse y el temporizador de descanso debe aparecer.
3. **Mapa de Pusheen:** Registrar una serie de "Pecho". El grupo `#m-pecho` debe iluminarse con `.glow`. Luego registrar "Espalda": el pecho debe apagarse y la espalda iluminarse.
4. **Cambio de perfil:** Alternar Julio/Kenia. Los colores deben cambiar y los logs deben ser independientes.

# 6. FLUJO DE TRABAJO RECOMENDADO

1. **Explora** el archivo `app-funcional.html` y confirma que entiendes `procesarJSON()`.
2. **Planifica** en un mensaje aparte qué archivos vas a modificar (ej. `index.html`, `style.css`, `app.js`).
3. **Codifica** una funcionalidad a la vez. No intentes reescribir todo de golpe.
4. **Verifica** con los 4 puntos de la sección 5.

Empieza por confirmar que has leído y entendido el archivo base. Luego procede con la primera tarea: **inyectar el SVG de Pusheen en la vista de "Auditoría" o "Comando"**.