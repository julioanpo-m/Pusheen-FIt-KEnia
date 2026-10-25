# Pusheen Fit — Contexto del Proyecto

## Quiénes somos
- **Julio**: médico, usuario principal. Perfil "Máxima Lean" (tema oscuro, verde neón #22c55e). Objetivo: longevidad, protección L4-L5, rendimiento clínico.
- **Kenia**: enfermera, esposa. Perfil "Pusheen & K-Pop" (tema pastel, rosa chicle #FF4081). Objetivo: adaptaciones en casa, sofá, Semáforo Pélvico.
- **Contexto clínico**: Julio trabaja turnos en IMSS. Pero debe hacer ejerciciso  

## Qué es Pusheen Fit (S.O.E. 3.1418)
PWA Vanilla JS (cero frameworks) de entrenamiento clínico. Se despliega en Vercel. Corre 100% en localStorage + webhook opcional a Google Sheets. Optimizada para iPhone 15 Pro/17 (Safari).

## Principios de diseño
1. **Lean**: cero desperdicio (Muda). No se carga código que no se usa.
2. **Poka-Yoke**: el sistema previene errores clínicos (bloquea series con peso=0, recuerda progresión con ghost_,).
3. **Clínico**: la biomecánica manda. ACWR, 1RM Epley, HRR, FatMax.
4. **Mobile-first**: botones ≥44px, thumb zone, cero scroll horizontal.

## Estado del proyecto
- **app-funcional.html**: versión monolítica VERIFICADA que funciona. Fuente de verdad.
- **Versión modular** (index.html + app.js + rutinas.js + ...): en construcción, con errores.
- **Regla de oro**: NO romper `procesarJSON()`, `verificarResetMatutino()`, ni la lógica `ghost_*` de app-funcional.html.

## Infraestructura del usuario
- Windows 11, VS Code, PowerShell
- Claude Code 2.1.310 configurado con DeepSeek (endpoint Anthropic-compatible)
- Ollama local (phi4-mini instalado)
- Git 2.56, Node 24.21, npm 11.19
- Skills ECC enlazados: tdd-workflow, security-review, frontend-patterns