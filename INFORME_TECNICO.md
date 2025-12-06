# Informe Técnico - Proyecto de Ajedrez

## 1. Descripción del Proyecto

### 1.1 Resumen General

El **Proyecto de Ajedrez** es una aplicación web desarrollada en React que implementa un juego de ajedrez completo para dos jugadores. La aplicación permite a los usuarios jugar partidas de ajedrez con todas las reglas oficiales del juego, incluyendo validación de movimientos, detección de jaque y jaque mate, y gestión del estado del juego.

### 1.2 Características Principales

- **Tablero Interactivo 8x8**: Interfaz visual que representa el tablero de ajedrez estándar
- **Todas las Piezas**: Implementación completa de las 6 piezas del ajedrez (Peón, Torre, Caballo, Alfil, Reina, Rey)
- **Validación de Movimientos**: Sistema que valida movimientos según las reglas del ajedrez
- **Detección de Jaque y Jaque Mate**: Algoritmos para detectar situaciones especiales del juego
- **Sistema de Deshacer**: Permite deshacer movimientos usando una estructura de datos tipo pila
- **Historial de Movimientos**: Registro cronológico de todos los movimientos realizados
- **Guardado y Carga de Partidas**: Persistencia de partidas usando LocalStorage
- **Interfaz de Usuario Moderna**: Diseño responsivo y atractivo con React

### 1.3 Tecnologías Utilizadas

- **React 19.2.0**: Biblioteca de JavaScript para construir interfaces de usuario
- **React Router DOM 6.28.0**: Manejo de navegación y rutas en la aplicación
- **JavaScript ES6+**: Lenguaje de programación con características modernas
- **LocalStorage API**: Almacenamiento local del navegador para persistencia de datos
- **CSS3**: Estilos y diseño visual de la aplicación

### 1.4 Arquitectura del Sistema

La aplicación sigue una arquitectura de componentes React con separación de responsabilidades:

- **Componentes de Presentación**: Manejan la interfaz de usuario (GameScreen, ColorSelectScreen)
- **Lógica de Negocio**: Clases que implementan las reglas del ajedrez (ChessGame, ChessPiece)
- **Gestión de Datos**: Utilidades para persistencia y almacenamiento (StorageManager)

---

## 2. Estructuras de Datos Empleadas

### 2.1 Matriz Bidimensional (Array 2D) - Tablero de Ajedrez

**Estructura**: `Array<Array<Object>>`

**Descripción**: Representa el tablero de ajedrez de 8x8 casillas. Cada celda contiene un objeto con información sobre la pieza que ocupa esa posición.

```javascript
// Estructura del tablero
board = [
  [{piece: ChessPiece|null}, {piece: ChessPiece|null}, ...], // Fila 0
  [{piece: ChessPiece|null}, {piece: ChessPiece|null}, ...], // Fila 1
  // ... 8 filas en total
]
```

**Propósito**:
- Almacenar el estado actual del tablero
- Facilitar acceso directo por coordenadas (row, col)
- Permitir iteración eficiente sobre todas las casillas

**Operaciones Principales**:
- `createBoard()`: Inicializa el tablero con piezas en posición inicial
- `getBoard()`: Obtiene el estado actual del tablero
- `cloneBoard()`: Crea una copia profunda para simulaciones

**Complejidad**:
- Acceso a una casilla: O(1)
- Creación inicial: O(64) = O(1) (constante para tablero 8x8)
- Clonado: O(64) = O(1)

---

### 2.2 Pila (Stack) - Sistema de Deshacer

**Estructura**: `Array` implementado como pila (LIFO - Last In, First Out)

**Descripción**: Almacena el historial de estados previos del juego para permitir deshacer movimientos.

```javascript
undoStack = [
  {
    from: {row, col, piece},
    to: {row, col, piece},
    turn: 'white'|'black',
    capturedPiece: ChessPiece|null,
    capturedPieces: {white: Array, black: Array}
  },
  // ... más estados anteriores
]
```

**Propósito**:
- Permitir deshacer el último movimiento
- Restaurar el estado completo del juego a un punto anterior
- Mantener la integridad del estado al deshacer

**Operaciones Principales**:
- `push()`: Agregar estado al deshacer (cuando se hace un movimiento)
- `pop()`: Obtener y remover el último estado (al deshacer)

**Complejidad**:
- Push: O(1) amortizado
- Pop: O(1)

---

### 2.3 Lista/Cola - Historial de Movimientos

**Estructura**: `Array` implementado como lista/cola (FIFO - First In, First Out)

**Descripción**: Almacena el historial cronológico de todos los movimientos realizados en la partida.

```javascript
gameHistory = [
  {
    id: timestamp,
    player: 'white'|'black',
    playerName: string,
    move: string,  // Ej: "Rey e1e2"
    timestamp: string,
    moveState: Object
  },
  // ... más movimientos en orden cronológico
]
```

**Propósito**:
- Registrar todos los movimientos de la partida
- Mostrar el historial al usuario
- Permitir análisis de la partida

**Operaciones Principales**:
- `push()`: Agregar movimiento al final
- `map()`: Iterar para mostrar en la interfaz
- `pop()`: Remover último movimiento (al deshacer)

**Complejidad**:
- Agregar movimiento: O(1)
- Mostrar historial completo: O(n) donde n es el número de movimientos

---

### 2.4 Objeto/Mapa - Piezas Capturadas

**Estructura**: `Object` con claves por color

**Descripción**: Almacena las piezas capturadas organizadas por color del jugador que las capturó.

```javascript
capturedPieces = {
  white: [ChessPiece, ChessPiece, ...],  // Piezas capturadas por el jugador blanco
  black: [ChessPiece, ChessPiece, ...]   // Piezas capturadas por el jugador negro
}
```

**Propósito**:
- Rastrear piezas eliminadas del tablero
- Mostrar piezas capturadas en la interfaz
- Restaurar piezas al deshacer una captura

**Operaciones Principales**:
- Agregar pieza: `capturedPieces[color].push(piece)`
- Obtener piezas: `capturedPieces[color]`
- Restaurar desde estado guardado

**Complejidad**:
- Agregar pieza: O(1)
- Obtener todas las piezas de un color: O(n) donde n es el número de piezas capturadas

---

### 2.5 Árbol/Grafo - Análisis de Movimientos

**Estructura**: Estructura implícita durante el cálculo de movimientos válidos

**Descripción**: Aunque no se implementa explícitamente como estructura, el algoritmo de validación de movimientos utiliza un enfoque tipo árbol/grafo para analizar las posibles jugadas.

**Propósito**:
- Calcular todos los movimientos posibles de una pieza
- Validar que los movimientos no dejen al rey en jaque
- Simular movimientos en un tablero temporal

**Algoritmo**:
```
Para cada pieza del tablero:
  Para cada movimiento posible de la pieza:
    Simular el movimiento en tablero temporal
    Verificar si deja al rey en jaque
    Si no deja en jaque, agregar a movimientos válidos
```

**Complejidad**:
- Calcular movimientos de una pieza: O(m) donde m es el número de movimientos posibles
- Validar si deja en jaque: O(p) donde p es el número de piezas enemigas
- Total: O(m * p) en el peor caso

---

### 2.6 LocalStorage - Persistencia de Datos

**Estructura**: Almacenamiento clave-valor del navegador

**Descripción**: Utiliza la API LocalStorage para guardar y cargar partidas de forma persistente.

```javascript
// Estructura de datos guardados
localStorage = {
  'chess_current_game': JSON.stringify(gameState),
  'chess_saved_games': JSON.stringify([game1, game2, ...]),
  'chess_game_settings': JSON.stringify(settings),
  'chess_statistics': JSON.stringify(stats)
}
```

**Propósito**:
- Guardar partidas en progreso
- Permitir continuar partidas después de cerrar el navegador
- Almacenar múltiples partidas guardadas

**Limitaciones**:
- Capacidad máxima: ~5-10 MB (dependiendo del navegador)
- Solo almacena strings (necesita serialización JSON)
- Almacenamiento local (no se sincroniza entre dispositivos)

---

## 3. Diagrama de Clases

### 3.1 Diagrama UML

```
┌─────────────────────────────────────────────────────────────┐
│                         ChessPiece                           │
├─────────────────────────────────────────────────────────────┤
│ - type: string                                               │
│ - color: string                                              │
│ - position: {row: number, col: number}                      │
│ - hasMoved: boolean                                          │
├─────────────────────────────────────────────────────────────┤
│ + constructor(type, color, position)                         │
│ + getSymbol(): string                                        │
│ + getName(): string                                          │
│ + clone(): ChessPiece                                        │
│ + moveTo(row, col): void                                     │
│ + getPossibleMoves(board): Array<Object>                     │
│ + getPawnMoves(board): Array<Object>                         │
│ + getRookMoves(board): Array<Object>                         │
│ + getKnightMoves(board): Array<Object>                       │
│ + getBishopMoves(board): Array<Object>                       │
│ + getQueenMoves(board): Array<Object>                        │
│ + getKingMoves(board): Array<Object>                         │
│ + isValidSquare(row, col, board, isCapture): boolean         │
│ + isInBounds(row, col): boolean                              │
└─────────────────────────────────────────────────────────────┘
                                ▲
                                │
                                │ usa
                                │
┌─────────────────────────────────────────────────────────────┐
│                          ChessGame                           │
├─────────────────────────────────────────────────────────────┤
│ - player1Color: string                                       │
│ - player1Name: string                                        │
│ - player2Name: string                                        │
│ - player2Color: string                                       │
│ - board: Array<Array<Object>>                                │
│ - undoStack: Array<Object>                                   │
│ - gameHistory: Array<Object>                                 │
│ - capturedPieces: {white: Array, black: Array}              │
│ - currentTurn: string                                        │
│ - selectedPiece: Object|null                                 │
│ - validMoves: Array<Object>                                  │
├─────────────────────────────────────────────────────────────┤
│ + constructor(player1Color, player1Name, player2Name,        │
│              savedState)                                     │
│ + restoreFromState(savedState): void                         │
│ + createBoard(): Array<Array<Object>>                        │
│ + selectPiece(row, col): boolean                             │
│ + calculateValidMoves(row, col): Array<Object>               │
│ + wouldMovePutKingInCheck(fromRow, fromCol, toRow, toCol):   │
│   boolean                                                     │
│ + isSquareUnderAttack(row, col, attackingColor, board):      │
│   boolean                                                     │
│ + movePiece(fromRow, fromCol, toRow, toCol): boolean         │
│ + formatMove(piece, fromRow, fromCol, toRow, toCol,          │
│            isCapture): string                                 │
│ + undoMove(): boolean                                        │
│ + cloneBoard(): Array<Array<Object>>                         │
│ + getBoard(): Array<Array<Object>>                           │
│ + getHistory(): Array<Object>                                │
│ + getCurrentTurn(): string                                   │
│ + getSelectedPiece(): Object|null                            │
│ + getValidMoves(): Array<Object>                             │
│ + getCapturedPieces(): Object                                │
│ + findKingPosition(color, board): Object|null                │
│ + isKingInCheck(color): boolean                              │
│ + isKingInCheckmate(color): boolean                          │
│ + isStalemate(color): boolean                                │
│ + getGameStatus(): Object                                    │
└─────────────────────────────────────────────────────────────┘
                                ▲
                                │
                                │ usa
                                │
┌─────────────────────────────────────────────────────────────┐
│                       StorageManager                         │
├─────────────────────────────────────────────────────────────┤
│ (módulo con funciones estáticas)                             │
├─────────────────────────────────────────────────────────────┤
│ + serializeGameState(game): Object                           │
│ + deserializeGameState(serializedState): Object              │
│ + saveCurrentGame(game): boolean                             │
│ + loadCurrentGame(): Object|null                             │
│ + clearCurrentGame(): boolean                                │
│ + saveGame(game, gameName): string|null                      │
│ + getSavedGames(): Array<Object>                             │
│ + loadSavedGame(gameId): Object|null                         │
│ + deleteSavedGame(gameId): boolean                           │
│ + saveGameSettings(settings): boolean                        │
│ + loadGameSettings(): Object|null                            │
│ + saveStatistics(stats): boolean                             │
│ + loadStatistics(): Object                                   │
│ + isStorageAvailable(): boolean                              │
└─────────────────────────────────────────────────────────────┘
                                ▲
                                │
                                │ usa
                                │
┌─────────────────────────────────────────────────────────────┐
│                        GameScreen                            │
├─────────────────────────────────────────────────────────────┤
│ (Componente React)                                           │
├─────────────────────────────────────────────────────────────┤
│ - game: ChessGame                                            │
│ - board: Array<Array<Object>>                                │
│ - gameHistory: Array<Object>                                 │
│ - currentTurn: string                                        │
│ - selectedPiece: Object|null                                 │
│ - validMoves: Array<Object>                                  │
│ - capturedPieces: Object                                     │
│ - gameStatus: Object                                         │
├─────────────────────────────────────────────────────────────┤
│ + handleSquareClick(row, col): void                          │
│ + handleMoveFromPanel(fromRow, fromCol, toRow, toCol): void  │
│ + undoMove(): void                                           │
│ + handleSaveGame(): void                                     │
│ + handleLoadSavedGame(savedState): void                      │
│ + updateGameState(): void                                    │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Relaciones entre Clases

1. **ChessGame** utiliza **ChessPiece**: 
   - ChessGame crea y gestiona instancias de ChessPiece
   - ChessGame llama métodos de ChessPiece para calcular movimientos

2. **GameScreen** utiliza **ChessGame**:
   - GameScreen crea una instancia de ChessGame
   - GameScreen usa los métodos de ChessGame para manejar la lógica del juego

3. **GameScreen** utiliza **StorageManager**:
   - GameScreen usa funciones de StorageManager para guardar/cargar partidas

4. **StorageManager** serializa/deserializa **ChessGame**:
   - StorageManager convierte el estado de ChessGame a JSON y viceversa

---

## 4. Diagrama de Pseudocódigo

### 4.1 Algoritmo Principal del Juego

```
ALGORITMO: Juego de Ajedrez
ENTRADA: Nombres de jugadores, color elegido por jugador 1
SALIDA: Partida de ajedrez interactiva

INICIO
    // Configuración inicial
    jugador1Color ← Color elegido
    jugador2Color ← Color opuesto
    jugador1Nombre ← Nombre del jugador 1
    jugador2Nombre ← Nombre del jugador 2
    
    // Crear juego
    juego ← NUEVO ChessGame(jugador1Color, jugador1Nombre, jugador2Nombre)
    
    // Verificar si hay partida guardada
    SI existe partida guardada ENTONCES
        estadoGuardado ← cargarPartidaGuardada()
        juego.restaurarEstado(estadoGuardado)
    FIN SI
    
    turnoActual ← 'white'  // Siempre empiezan las blancas
    
    // Bucle principal del juego
    MIENTRAS juego no haya terminado HACER
        // Mostrar estado actual
        mostrarTablero(juego.obtenerTablero())
        mostrarTurno(turnoActual)
        mostrarEstadoJuego(juego.obtenerEstadoJuego())
        
        // Esperar acción del jugador
        accion ← esperarAccionUsuario()
        
        SEGÚN tipo de accion:
            CASO 'clic en casilla':
                SI hay pieza seleccionada ENTONCES
                    // Intentar mover
                    movimientoValido ← juego.moverPieza(
                        piezaSeleccionada.fila,
                        piezaSeleccionada.columna,
                        accion.fila,
                        accion.columna
                    )
                    
                    SI movimientoValido ENTONCES
                        // Guardar estado en pila de deshacer
                        juego.agregarAPilaDeshacer()
                        
                        // Agregar al historial
                        juego.agregarAlHistorial(movimiento)
                        
                        // Cambiar turno
                        turnoActual ← cambiarTurno(turnoActual)
                        
                        // Verificar estado del juego
                        estadoJuego ← juego.obtenerEstadoJuego()
                        
                        SI estadoJuego.esJaqueMate ENTONCES
                            mostrarMensaje("¡Jaque Mate!")
                            terminarJuego()
                        FIN SI
                        
                        SI estadoJuego.esEmpate ENTONCES
                            mostrarMensaje("¡Empate!")
                            terminarJuego()
                        FIN SI
                        
                        // Guardar automáticamente
                        guardarPartidaActual(juego)
                    SINO
                        // Intentar seleccionar otra pieza
                        juego.seleccionarPieza(accion.fila, accion.columna)
                    FIN SI
                SINO
                    // Seleccionar pieza
                    juego.seleccionarPieza(accion.fila, accion.columna)
                    mostrarMovimientosValidos(juego.obtenerMovimientosValidos())
                FIN SI
                
            CASO 'deshacer movimiento':
                juego.deshacerMovimiento()
                turnoActual ← cambiarTurno(turnoActual)
                guardarPartidaActual(juego)
                
            CASO 'guardar partida':
                nombrePartida ← solicitarNombrePartida()
                guardarPartidaConNombre(juego, nombrePartida)
                
            CASO 'cargar partida':
                partidaGuardada ← seleccionarPartidaGuardada()
                juego ← cargarPartida(partidaGuardada)
        FIN SEGÚN
    FIN MIENTRAS
FIN
```

### 4.2 Algoritmo de Validación de Movimientos

```
ALGORITMO: Calcular Movimientos Válidos
ENTRADA: fila, columna (posición de la pieza), tablero
SALIDA: Lista de movimientos válidos

FUNCIÓN calcularMovimientosValidos(fila, columna, tablero):
    INICIO
        casilla ← tablero[fila][columna]
        
        SI NO existe pieza en casilla ENTONCES
            RETORNAR []
        FIN SI
        
        pieza ← casilla.pieza
        colorJugador ← pieza.color
        
        // Obtener movimientos posibles básicos
        movimientosPosibles ← pieza.obtenerMovimientosPosibles(tablero)
        movimientosValidos ← []
        
        // Filtrar movimientos que dejarían al rey en jaque
        PARA CADA movimiento EN movimientosPosibles HACER
            SI NO dejaríaReyEnJaque(fila, columna, movimiento.fila, movimiento.columna) ENTONCES
                agregar movimientosValidos, movimiento
            FIN SI
        FIN PARA
        
        RETORNAR movimientosValidos
    FIN
FIN FUNCIÓN

FUNCIÓN dejaríaReyEnJaque(filaOrigen, colOrigen, filaDestino, colDestino):
    INICIO
        // Crear tablero temporal
        tableroTemporal ← clonarTablero(tablero)
        
        // Realizar movimiento temporal
        piezaMovida ← tableroTemporal[filaOrigen][colOrigen].pieza
        tableroTemporal[filaDestino][colDestino].pieza ← piezaMovida
        tableroTemporal[filaOrigen][colOrigen].pieza ← null
        piezaMovida.posicion ← {fila: filaDestino, col: colDestino}
        
        // Encontrar posición del rey
        colorRey ← colorJugadorActual
        posicionRey ← encontrarRey(colorRey, tableroTemporal)
        
        SI posicionRey es null ENTONCES
            RETORNAR false
        FIN SI
        
        // Verificar si el rey está bajo ataque
        colorOponente ← oponerColor(colorRey)
        estaEnJaque ← estaCasillaBajoAtaque(
            posicionRey.fila,
            posicionRey.columna,
            colorOponente,
            tableroTemporal
        )
        
        RETORNAR estaEnJaque
    FIN
FIN FUNCIÓN
```

### 4.3 Algoritmo de Detección de Jaque Mate

```
ALGORITMO: Verificar Jaque Mate
ENTRADA: color (color del rey a verificar)
SALIDA: verdadero si hay jaque mate, falso en caso contrario

FUNCIÓN verificarJaqueMate(color):
    INICIO
        // Primero verificar si está en jaque
        SI NO estaReyEnJaque(color) ENTONCES
            RETORNAR false
        FIN SI
        
        // Verificar si hay algún movimiento legal disponible
        PARA CADA fila EN 0..7 HACER
            PARA CADA columna EN 0..7 HACER
                casilla ← tablero[fila][columna]
                
                SI casilla tiene pieza Y casilla.pieza.color = color ENTONCES
                    movimientosValidos ← calcularMovimientosValidos(fila, columna, tablero)
                    
                    SI movimientosValidos tiene elementos ENTONCES
                        // Hay al menos un movimiento válido, no es jaque mate
                        RETORNAR false
                    FIN SI
                FIN SI
            FIN PARA
        FIN PARA
        
        // Está en jaque y no hay movimientos válidos = jaque mate
        RETORNAR true
    FIN
FIN FUNCIÓN
```

### 4.4 Algoritmo de Movimiento de Pieza

```
ALGORITMO: Mover Pieza
ENTRADA: filaOrigen, colOrigen, filaDestino, colDestino
SALIDA: verdadero si el movimiento fue exitoso

FUNCIÓN moverPieza(filaOrigen, colOrigen, filaDestino, colDestino):
    INICIO
        casillaOrigen ← tablero[filaOrigen][colOrigen]
        casillaDestino ← tablero[filaDestino][colDestino]
        
        SI NO existe pieza en casillaOrigen ENTONCES
            RETORNAR false
        FIN SI
        
        // Verificar que el movimiento es válido
        movimientosValidos ← calcularMovimientosValidos(filaOrigen, colOrigen, tablero)
        esMovimientoValido ← false
        
        PARA CADA movimiento EN movimientosValidos HACER
            SI movimiento.fila = filaDestino Y movimiento.columna = colDestino ENTONCES
                esMovimientoValido ← true
                SALIR DEL BUCLE
            FIN SI
        FIN PARA
        
        SI NO esMovimientoValido ENTONCES
            RETORNAR false
        FIN SI
        
        // Guardar estado para deshacer
        piezaCapturada ← SI casillaDestino tiene pieza ENTONCES clonar(casillaDestino.pieza) SINO null
        esCaptura ← piezaCapturada NO es null
        
        estadoMovimiento ← {
            origen: {fila: filaOrigen, columna: colOrigen, pieza: clonar(casillaOrigen.pieza)},
            destino: {fila: filaDestino, columna: colDestino, pieza: piezaCapturada},
            turno: turnoActual,
            piezaCapturada: piezaCapturada,
            piezasCapturadas: clonar(piezasCapturadas)
        }
        
        // Si hay captura, agregar a piezas capturadas
        SI esCaptura ENTONCES
            piezasCapturadas[piezaCapturada.color].agregar(piezaCapturada)
        FIN SI
        
        // Realizar el movimiento
        pieza ← casillaOrigen.pieza
        casillaDestino.pieza ← pieza
        casillaOrigen.pieza ← null
        pieza.moverA(filaDestino, colDestino)
        
        // Agregar a pila de deshacer
        pilaDeshacer.agregar(estadoMovimiento)
        
        // Agregar al historial
        movimientoFormateado ← formatearMovimiento(pieza, filaOrigen, colOrigen, filaDestino, colDestino, esCaptura)
        historial.agregar({
            id: timestamp(),
            jugador: turnoActual,
            nombreJugador: obtenerNombreJugador(turnoActual),
            movimiento: movimientoFormateado,
            timestamp: horaActual(),
            estadoMovimiento: estadoMovimiento
        })
        
        // Cambiar turno
        turnoActual ← SI turnoActual = 'white' ENTONCES 'black' SINO 'white'
        
        // Limpiar selección
        piezaSeleccionada ← null
        movimientosValidos ← []
        
        RETORNAR true
    FIN
FIN FUNCIÓN
```

### 4.5 Algoritmo de Deshacer Movimiento

```
ALGORITMO: Deshacer Último Movimiento
ENTRADA: Ninguna (usa la pila de deshacer)
SALIDA: verdadero si se deshizo exitosamente

FUNCIÓN deshacerMovimiento():
    INICIO
        SI pilaDeshacer está vacía ENTONCES
            RETORNAR false
        FIN SI
        
        // Obtener último movimiento de la pila (LIFO)
        ultimoMovimiento ← pilaDeshacer.removerUltimo()
        
        // Restaurar pieza en posición origen
        tablero[ultimoMovimiento.origen.fila][ultimoMovimiento.origen.columna].pieza ← ultimoMovimiento.origen.pieza
        SI ultimoMovimiento.origen.pieza NO es null ENTONCES
            ultimoMovimiento.origen.pieza.posicion ← {
                fila: ultimoMovimiento.origen.fila,
                columna: ultimoMovimiento.origen.columna
            }
        FIN SI
        
        // Restaurar pieza en posición destino
        tablero[ultimoMovimiento.destino.fila][ultimoMovimiento.destino.columna].pieza ← ultimoMovimiento.destino.pieza
        SI ultimoMovimiento.destino.pieza NO es null ENTONCES
            ultimoMovimiento.destino.pieza.posicion ← {
                fila: ultimoMovimiento.destino.fila,
                columna: ultimoMovimiento.destino.columna
            }
        FIN SI
        
        // Restaurar piezas capturadas
        piezasCapturadas ← clonar(ultimoMovimiento.piezasCapturadas)
        
        // Restaurar turno
        turnoActual ← ultimoMovimiento.turno
        
        // Remover del historial
        historial.removerUltimo()
        
        // Limpiar selección
        piezaSeleccionada ← null
        movimientosValidos ← []
        
        RETORNAR true
    FIN
FIN FUNCIÓN
```

### 4.6 Algoritmo de Guardado de Partida

```
ALGORITMO: Guardar Partida en LocalStorage
ENTRADA: juego (instancia de ChessGame), nombrePartida
SALIDA: identificador de la partida guardada

FUNCIÓN guardarPartida(juego, nombrePartida):
    INICIO
        // Serializar estado del juego
        tablero ← juego.obtenerTablero()
        tableroSerializado ← []
        
        PARA CADA fila EN tablero HACER
            filaSerializada ← []
            PARA CADA casilla EN fila HACER
                SI casilla tiene pieza ENTONCES
                    datosPieza ← {
                        tipo: casilla.pieza.tipo,
                        color: casilla.pieza.color,
                        posicion: casilla.pieza.posicion,
                        haMovido: casilla.pieza.haMovido
                    }
                SINO
                    datosPieza ← null
                FIN SI
                agregar filaSerializada, {pieza: datosPieza}
            FIN PARA
            agregar tableroSerializado, filaSerializada
        FIN PARA
        
        estadoJuego ← {
            colorJugador1: juego.colorJugador1,
            nombreJugador1: juego.nombreJugador1,
            nombreJugador2: juego.nombreJugador2,
            turnoActual: juego.obtenerTurnoActual(),
            tablero: tableroSerializado,
            historial: juego.obtenerHistorial(),
            piezasCapturadas: juego.obtenerPiezasCapturadas(),
            pilaDeshacer: serializarPilaDeshacer(juego.pilaDeshacer),
            timestamp: horaActualISO()
        }
        
        // Guardar en LocalStorage
        partidasGuardadas ← cargarPartidasGuardadas()
        
        datosPartida ← {
            id: generarId(),
            nombre: nombrePartida,
            estado: estadoJuego,
            fechaCreacion: horaActualISO(),
            ultimaJugada: horaActualISO()
        }
        
        agregar partidasGuardadas, datosPartida
        localStorage.guardar('chess_saved_games', convertirAJSON(partidasGuardadas))
        
        RETORNAR datosPartida.id
    FIN
FIN FUNCIÓN
```

---

## 5. Complejidad de Algoritmos

### 5.1 Análisis de Complejidad Temporal

| Operación | Complejidad | Descripción |
|-----------|-------------|-------------|
| `createBoard()` | O(64) = O(1) | Constante para tablero 8x8 |
| `selectPiece()` | O(1) | Acceso directo a casilla |
| `calculateValidMoves()` | O(m × p) | m = movimientos posibles, p = piezas enemigas |
| `movePiece()` | O(m × p) | Depende de la validación |
| `undoMove()` | O(1) | Operación de pila |
| `isKingInCheck()` | O(p × m) | Verificar ataque de todas las piezas enemigas |
| `isKingInCheckmate()` | O(64 × m × p) | Verificar todas las piezas propias |
| `cloneBoard()` | O(64) = O(1) | Constante para tablero 8x8 |

### 5.2 Análisis de Complejidad Espacial

| Estructura | Complejidad | Descripción |
|------------|-------------|-------------|
| Tablero (board) | O(64) = O(1) | Matriz 8x8 fija |
| Pila de deshacer | O(n) | n = número de movimientos |
| Historial | O(n) | n = número de movimientos |
| Piezas capturadas | O(c) | c = número de piezas capturadas |

---

## 6. Conclusión

El Proyecto de Ajedrez implementa un sistema completo de gestión de juego utilizando diversas estructuras de datos fundamentales:

1. **Matriz bidimensional** para representar el tablero
2. **Pila (Stack)** para el sistema de deshacer
3. **Lista/Cola** para el historial de movimientos
4. **Objetos/Mapas** para organizar datos relacionados
5. **Análisis tipo árbol/grafo** para validación de movimientos
6. **LocalStorage** para persistencia de datos

La aplicación demuestra un uso efectivo de estructuras de datos en un contexto práctico, manteniendo un código limpio, modular y bien documentado.
