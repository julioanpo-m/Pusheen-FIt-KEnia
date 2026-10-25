
---

## 📄 ARCHIVO 4: `context/04_REGLAS_CLINICAS.md`

```markdown
# Reglas Clínicas — Pusheen Fit


## Triage Semanal (MOTOR_ADAPTATIVO)
- Si entrena ≥ 3 días/semana → sugerir Torso/Pierna (especialización).
- Si entrena < 3 días/semana → sugerir FULL_BODY_RESCATE (superseries antagónicas).
- **El usuario siempre decide** (hay un botón "Ignorar y forzar rutina base").

## ACWR (Acute:Chronic Workload Ratio)
- ACWR = tonelaje(últimos 7 días) / (tonelaje(últimos 28 días) / 4)
- ACWR < 0.8 → desentrenamiento (naranja).
- ACWR 0.8-1.5 → zona segura (verde).
- ACWR > 1.5 → sobrecarga (rojo), sugerir descarga.

## 1RM — Fórmula de Epley
`1RM = peso × (1 + 0.0333 × reps)`
- Guardar en `par_historial_${perfil}` con `{fecha, patron, rm}`.
- La gráfica SVG lee este array REAL, no datos simulados.

## HRR (Heart Rate Recovery)
- Input 1: pulso PICO tras serie.
- Input 2: pulso tras 60s de reposo.
- Delta = PICO - 60s.
- Delta > 25 lpm → recuperación vagal óptima.
- Delta < 15 lpm → alerta SNC.

## FatMax y 4x4 Noruego
- FatMax: acumular minutos en Zona 2 (Z2). Objetivo: >120 min/semana.
- 4x4 Noruego: 4 intervalos de 4 min al 90% VO2Max, con 3 min de recuperación al 65%.

## Poka-Yoke de la Serie
Antes de guardar una serie en `localStorage`:
- ❌ Bloquear si `val1 <= 0` o `val2 <= 0` (excepto si `es_tiempo === true`).
- ❌ Bloquear si `val1 > 500` kg (posible typo).
- ❌ Bloquear si `val2 > 100` reps.
- ✅ Si pasa, guardar y disparar `iluminarMusculo(ej.musculo)`.

## Antagonistas (para superseries del FULL_BODY_RESCATE)
Pecho ↔ Espalda
Bíceps ↔ Tríceps
Cuádriceps ↔ Isquios
Hombro Frontal ↔ Hombro Posterior
Core Frontal ↔ Erectores Espinales

text

## Doble Perfil — Aislamiento de Datos
- Todas las llaves de `localStorage` DEBEN llevar prefijo de perfil.
- Al cambiar de perfil: limpiar DOM volátil, recargar logs, reiniciar estado en memoria.
- Nunca mezclar `logs_julio_*` con `logs_kenia_*`.