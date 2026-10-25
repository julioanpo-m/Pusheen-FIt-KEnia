# Estado Actual del Proyecto

## ✅ Funciona (app-funcional.html)
- Carga de rutinas vía `procesarJSON(RAW_JSON)`.
- Reset matutino de inputs (6 AM) y progresión con `ghost_*`.
- Registro de series con prefijo de perfil.
- Botón "Aproximación" (series `is_aprox` no suman).
- Temporizador de descanso con `Date.now() + ms` (sobrevive a background iOS).
- Metrónomo con Web Audio API + Wake Lock.
- Gráficos Canvas 2D (Tonelaje, HRR, FatMax).
- Modal de video (iframe) con destrucción de `src` al cerrar.
- Exportar/Importar JSON manual.
- Webhook a Google Sheets.

## ⚠️ Deuda técnica / en progreso
- **Monolítico**: todo en app-funcional.html (~2000 líneas). Necesita modularse.
- **Sin mapa de Pusheen**: no hay SVG anatómico integrado aún.
- **Gráficas parcialmente simuladas**: algunas usan datos hardcodeados hacia atrás en lugar de leer `par_historial_${perfil}`.
- **Sin separación real de perfiles**: el cambio Julio/Kenia solo cambia colores, no aísla datos.

## ❌ Roto / sin integrar
- Modulares: `index.html`, `style.css`, `rutinas.js`, `adaptador.js`, `auditoria.js`, `app.js` están vacíos o con stubs.
- Error `SyntaxError: Unexpected token ':'` en el primer intento modular (se resolvió copiando limpio `DB_INICIAL`).

## 🎯 Prioridad inmediata (siguiente sprint)
1. **Inyectar SVG anatómico** en app-funcional.html (vista Auditoría).
2. **Añadir `iluminarMusculo()`** al registrar serie.
4. **Verificar con el checklist Poka-Yoke** (ver 04_REGLAS_CLINICAS.md).
5. **Commit Git + push Vercel** para desplegar.

## 🧪 Cómo verificar que funciona
1. Abrir Live Server → ver la app cargada.
2. Ir a "Auditoría" → debe verse el SVG de Pusheen en doble vista.
3. Ir a "Entrenar" → registrar serie de "Press Pecho" → volver a Auditoría → `m-pecho` debe brillar con `var(--accent)`.
4. Cambiar perfil a Kenia → el brillo debe ser rosa chicle.
5. Registrar serie de "Dead Hang" → deben brillar antebrazos, NO bíceps.