# Arquitectura — Pusheen Fit

## Estructura objetivo (módulos)
index.html → chasis semántico + contenedor SVG + modal video
style.css → variables CSS por perfil, mapa SVG, timer, barra gatos
rutinas.js → RAW_JSON (rutinas → blocks → exercises) + SISTEMA_CONTROL
adaptador.js → MOTOR_ADAPTATIVO (triage semanal, FULL_BODY_RESCATE)
auditoria.js → MOTOR_AUDITORIA (ACWR, 1RM, HRR, gráficas SVG, inyecta SVG)
app.js → orquestador (estado, WakeLock, metrónomo, iluminarMusculo)
app-funcional.html → versión monolítica FUNCIONAL (referencia)

text

## Funciones críticas que NO se deben romper
| Función | Archivo | Propósito |
|---|---|---|
| `procesarJSON(raw)` | app-funcional | Aplana blocks→ejercicios. Sin esto, no carga nada. |
| `verificarResetMatutino(hash)` | app-funcional | Corte 6 AM: mueve valores a `ghost_*` y reinicia inputs. |
| Progresión `ghost_*` | app-funcional | Si supera max_reps → +2.5kg y baja a min. Si no → +1 rep. |
| `is_aprox` en series | app-funcional | Series de aproximación NO suman tonelaje. |
| `dibujarGrafico()` | app-funcional | Canvas 2D nativo (Tonelaje, HRR, FatMax). |

## Estructura de datos clave
```json
RAW_JSON = [
  {
    "routine_id": "TORSO_A_v1.0",
    "name": "SOEH: Torso A",
    "frequency_type": "Frecuencia 2",
    "blocks": [
      { "block_id": "A", "block_type": "APS", "rest_after_exercise_seconds": 90,
        "exercises": [
          { "id": "A1", "name": "Press Convergente", "musculo": "Pecho",
            "total_sets": 3, "target_rir": 1, "metric_type": "reps",
            "rep_range": {"min": 6, "max": 10}, "tempo": [3,1,1,0] }
        ]
      }
    ]
  }
]
localStorage — prefijos por perfil
logs_${perfil}_${hashEjercicio} → array de series registradas

t_${perfil}_1_${hash} → peso actual

t_${perfil}_2_${hash} → reps actuales

ghost_${perfil}_1_${hash} → peso del día anterior

ghost_${perfil}_2_${hash} → reps del día anterior

date_${perfil}_${hash} → fecha última captura (para reset 6 AM)

par_1rm_${perfil}_${patron} → 1RM por patrón

par_historial_${perfil} → array histórico de tests

fatmax_semanal_${perfil}_${fecha} → segundos acumulados por día

custom_exercises_${perfil} → overrides de instrucciones

Poka-Yoke de Hardware (NO tocar)
Delta Timers: Date.now() + ms (NO setInterval). Sobrevive a bloqueo de pantalla.

Wake Lock API: mantiene pantalla activa durante entrenamiento.

Web Audio API: metrónomo 60 BPM, square, volumen 0.08, latencyHint: 'interactive'.

visibilitychange: al volver a la pestaña, recalcula el timer y dispara audio si expiró