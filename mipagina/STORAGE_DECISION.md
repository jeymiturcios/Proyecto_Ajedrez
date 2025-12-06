# Decisión de Almacenamiento: LocalStorage vs IndexedDB

## Comparación

### LocalStorage ✅ (Elegido para este proyecto)

**Ventajas:**
- ✅ **Simplicidad**: API muy simple y directa
- ✅ **Sincrónico**: No necesita callbacks o promesas
- ✅ **Suficiente para este proyecto**: Los datos del juego no son extremadamente grandes
- ✅ **Compatibilidad**: Funciona en todos los navegadores modernos
- ✅ **Fácil de depurar**: Puedes ver los datos directamente en DevTools

**Limitaciones:**
- ⚠️ Límite de ~5-10MB (suficiente para cientos de partidas)
- ⚠️ Solo almacena strings (necesita JSON.stringify/parse)
- ⚠️ No permite búsquedas complejas
- ⚠️ Bloquea el hilo principal (pero es rápido)

**Ideal para:**
- Guardar estado de partida actual
- Guardar algunas partidas guardadas
- Configuraciones del juego
- Estadísticas básicas

### IndexedDB

**Ventajas:**
- ✅ Límite mucho mayor (~50% del disco duro)
- ✅ Almacena objetos complejos directamente
- ✅ Búsquedas e índices complejos
- ✅ Asíncrono (no bloquea el hilo principal)
- ✅ Transacciones

**Desventajas:**
- ❌ API más compleja
- ❌ Requiere callbacks/promesas
- ❌ Más difícil de depurar
- ❌ Overkill para este proyecto

**Ideal para:**
- Aplicaciones con miles de registros
- Búsquedas complejas por múltiples campos
- Datos binarios grandes
- Aplicaciones offline complejas

## Decisión Final

**Elegimos LocalStorage** porque:

1. **Tamaño de datos**: Una partida de ajedrez serializada ocupa ~5-20KB. Con LocalStorage puedes guardar cientos de partidas sin problemas.

2. **Simplicidad**: El código es más limpio y fácil de mantener.

3. **Rendimiento**: Para guardar/cargar partidas, LocalStorage es instantáneo.

4. **Casos de uso**: 
   - Guardar partida en progreso: ✅
   - Guardar algunas partidas favoritas: ✅
   - Estadísticas básicas: ✅
   - Configuraciones: ✅

## Cuándo considerar IndexedDB

Si en el futuro necesitas:
- Guardar **miles** de partidas
- Búsquedas complejas: "Todas las partidas donde gané con negras en menos de 30 movimientos"
- Análisis de partidas con datos complejos
- Sincronización con servidor

Entonces IndexedDB sería la mejor opción.

## Implementación

El código está en `src/utils/StorageManager.js` y proporciona:

- `saveCurrentGame()` - Guarda la partida actual
- `loadCurrentGame()` - Carga la partida actual
- `saveGame()` - Guarda una partida con nombre
- `getSavedGames()` - Lista todas las partidas guardadas
- `loadSavedGame()` - Carga una partida específica
- `deleteSavedGame()` - Elimina una partida guardada
- `saveGameSettings()` / `loadGameSettings()` - Configuraciones
- `saveStatistics()` / `loadStatistics()` - Estadísticas
