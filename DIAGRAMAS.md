# Diagramas del Proyecto de Ajedrez

## 1. Diagrama de Clases Detallado

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              ChessPiece                                  │
│                         (Modelo de Datos)                                │
├─────────────────────────────────────────────────────────────────────────┤
│ ATRIBUTOS:                                                               │
│  • type: string           → Tipo: 'pawn', 'rook', 'knight', etc.        │
│  • color: string          → Color: 'white' o 'black'                    │
│  • position: Object       → {row: number, col: number}                  │
│  • hasMoved: boolean      → Indica si la pieza se ha movido             │
├─────────────────────────────────────────────────────────────────────────┤
│ MÉTODOS PRINCIPALES:                                                     │
│                                                                          │
│  + getSymbol(): string                                                   │
│    └─ Retorna el símbolo Unicode de la pieza                            │
│                                                                          │
│  + getName(): string                                                     │
│    └─ Retorna el nombre en español de la pieza                          │
│                                                                          │
│  + clone(): ChessPiece                                                   │
│    └─ Crea una copia de la pieza                                        │
│                                                                          │
│  + moveTo(row: number, col: number): void                               │
│    └─ Mueve la pieza a una nueva posición                               │
│                                                                          │
│  + getPossibleMoves(board): Array<Object>                                │
│    └─ Calcula movimientos posibles según el tipo de pieza               │
│                                                                          │
│  + getPawnMoves(board): Array<Object>                                    │
│  + getRookMoves(board): Array<Object>                                    │
│  + getKnightMoves(board): Array<Object>                                  │
│  + getBishopMoves(board): Array<Object>                                  │
│  + getQueenMoves(board): Array<Object>                                   │
│  + getKingMoves(board): Array<Object>                                    │
│    └─ Métodos específicos para cada tipo de pieza                       │
│                                                                          │
│  + isValidSquare(row, col, board, isCapture): boolean                   │
│  + isInBounds(row, col): boolean                                         │
│    └─ Métodos auxiliares de validación                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ COMPUESTA POR
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              ChessGame                                   │
│                       (Lógica del Juego)                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ ATRIBUTOS:                                                               │
│  • player1Color: string                                                  │
│  • player1Name: string                                                   │
│  • player2Name: string                                                   │
│  • player2Color: string                                                  │
│  • board: Array<Array<Object>>        → MATRIZ 8x8                      │
│  • undoStack: Array<Object>           → PILA (Stack)                    │
│  • gameHistory: Array<Object>         → LISTA/COLA                      │
│  • capturedPieces: Object             → MAPA por color                  │
│  • currentTurn: string                                                   │
│  • selectedPiece: Object|null                                            │
│  • validMoves: Array<Object>                                             │
├─────────────────────────────────────────────────────────────────────────┤
│ MÉTODOS PRINCIPALES:                                                     │
│                                                                          │
│  + constructor(...)                                                      │
│    └─ Inicializa el juego o restaura desde estado guardado              │
│                                                                          │
│  + createBoard(): Array<Array<Object>>                                   │
│    └─ Crea el tablero inicial 8x8 con todas las piezas                  │
│                                                                          │
│  + selectPiece(row, col): boolean                                        │
│    └─ Selecciona una pieza y calcula sus movimientos válidos            │
│                                                                          │
│  + calculateValidMoves(row, col): Array<Object>                          │
│    └─ Calcula movimientos válidos (filtra jaque)                        │
│                                                                          │
│  + movePiece(fromRow, fromCol, toRow, toCol): boolean                   │
│    └─ Mueve una pieza y actualiza el estado del juego                   │
│                                                                          │
│  + undoMove(): boolean                                                   │
│    └─ Deshace el último movimiento usando la pila                       │
│                                                                          │
│  + isKingInCheck(color): boolean                                         │
│  + isKingInCheckmate(color): boolean                                     │
│  + isStalemate(color): boolean                                           │
│  + getGameStatus(): Object                                               │
│    └─ Métodos de verificación de estado del juego                       │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ USA
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          StorageManager                                  │
│                      (Gestión de Almacenamiento)                         │
├─────────────────────────────────────────────────────────────────────────┤
│ FUNCIONES ESTÁTICAS:                                                     │
│                                                                          │
│  + serializeGameState(game): Object                                      │
│    └─ Convierte el estado del juego a formato serializable              │
│                                                                          │
│  + deserializeGameState(serializedState): Object                         │
│    └─ Convierte estado serializado de vuelta a objeto                   │
│                                                                          │
│  + saveCurrentGame(game): boolean                                        │
│  + loadCurrentGame(): Object|null                                        │
│  + clearCurrentGame(): boolean                                           │
│    └─ Gestión de partida actual                                         │
│                                                                          │
│  + saveGame(game, gameName): string|null                                 │
│  + getSavedGames(): Array<Object>                                        │
│  + loadSavedGame(gameId): Object|null                                    │
│  + deleteSavedGame(gameId): boolean                                      │
│    └─ Gestión de múltiples partidas guardadas                           │
└─────────────────────────────────────────────────────────────────────────┘
                                      ▲
                                      │ USA
                                      │
┌─────────────────────────────────────────────────────────────────────────┐
│                          GameScreen                                      │
│                     (Componente React - Vista)                           │
├─────────────────────────────────────────────────────────────────────────┤
│ ESTADO:                                                                  │
│  • game: ChessGame                                                       │
│  • board: Array<Array<Object>>                                           │
│  • gameHistory: Array<Object>                                            │
│  • currentTurn: string                                                   │
│  • selectedPiece: Object|null                                            │
│  • validMoves: Array<Object>                                             │
│  • capturedPieces: Object                                                │
│  • gameStatus: Object                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ MÉTODOS PRINCIPALES:                                                     │
│                                                                          │
│  + handleSquareClick(row, col): void                                     │
│    └─ Maneja clics en las casillas del tablero                          │
│                                                                          │
│  + handleMoveFromPanel(...): void                                        │
│    └─ Maneja movimientos desde el panel lateral                         │
│                                                                          │
│  + undoMove(): void                                                      │
│    └─ Deshace el último movimiento                                      │
│                                                                          │
│  + updateGameState(): void                                               │
│    └─ Actualiza el estado del componente                                │
│                                                                          │
│  + handleSaveGame(): void                                                │
│  + handleLoadSavedGame(savedState): void                                 │
│    └─ Gestión de partidas guardadas                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

## 2. Diagrama de Flujo de Datos

```
┌──────────────┐
│   Usuario    │
│  (Interfaz)  │
└──────┬───────┘
       │
       │ 1. Clic en casilla
       ▼
┌─────────────────────────┐
│   GameScreen Component  │
│  (Componente React)     │
└──────┬──────────────────┘
       │
       │ 2. Llama método
       ▼
┌─────────────────────────┐
│    ChessGame.movePiece  │
│  (Lógica del Juego)     │
└──────┬──────────────────┘
       │
       │ 3. Valida movimiento
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  ChessPiece     │    │  Validación     │
│  getPossible    │    │  de Jaque       │
│  Moves()        │    │                 │
└──────┬──────────┘    └──────┬──────────┘
       │                      │
       └──────────┬───────────┘
                  │
                  │ 4. Movimiento válido
                  ▼
       ┌──────────────────────┐
       │  Actualizar Tablero  │
       │  (Matriz 8x8)        │
       └──────────┬───────────┘
                  │
       ┌──────────┴───────────┐
       │                      │
       ▼                      ▼
┌──────────────┐      ┌──────────────┐
│  undoStack   │      │ gameHistory  │
│  (PILA)      │      │ (LISTA/COLA) │
│  .push()     │      │  .push()     │
└──────────────┘      └──────────────┘
       │                      │
       │                      │
       └──────────┬───────────┘
                  │
                  │ 5. Actualizar estado
                  ▼
┌─────────────────────────┐
│   GameScreen (Re-render)│
│   Actualizar UI         │
└──────┬──────────────────┘
       │
       │ 6. Guardar automáticamente
       ▼
┌─────────────────────────┐
│  StorageManager         │
│  saveCurrentGame()      │
└──────┬──────────────────┘
       │
       │ 7. Persistir
       ▼
┌─────────────────────────┐
│   LocalStorage          │
│   (Navegador)           │
└─────────────────────────┘
```

## 3. Diagrama de Estructuras de Datos

### 3.1 Matriz del Tablero (8x8)

```
Tablero (board) - Estructura: Array<Array<Object>>

Fila 0:  [Torre] [Caballo] [Alfil] [Reina] [Rey] [Alfil] [Caballo] [Torre]  ← Negras
Fila 1:  [Peón]  [Peón]    [Peón]  [Peón]  [Peón] [Peón]  [Peón]   [Peón]   ← Negras
Fila 2:  [  -  ] [  -  ]   [  -  ] [  -  ] [  - ] [  - ]  [  -  ]  [  -  ]
Fila 3:  [  -  ] [  -  ]   [  -  ] [  -  ] [  - ] [  - ]  [  -  ]  [  -  ]
Fila 4:  [  -  ] [  -  ]   [  -  ] [  -  ] [  - ] [  - ]  [  -  ]  [  -  ]
Fila 5:  [  -  ] [  -  ]   [  -  ] [  -  ] [  - ] [  - ]  [  -  ]  [  -  ]
Fila 6:  [Peón]  [Peón]    [Peón]  [Peón]  [Peón] [Peón]  [Peón]   [Peón]   ← Blancas
Fila 7:  [Torre] [Caballo] [Alfil] [Reina] [Rey] [Alfil] [Caballo] [Torre]  ← Blancas
          Col 0   Col 1     Col 2   Col 3   Col 4 Col 5   Col 6     Col 7

Cada celda: { piece: ChessPiece | null }
```

### 3.2 Pila de Deshacer (Stack)

```
Pila (undoStack) - Estructura LIFO (Last In, First Out)

        ┌─────────────────────────────┐
 TOP →  │ Movimiento 5 (Último)       │ ← Pop() retorna este
        ├─────────────────────────────┤
        │ Movimiento 4                │
        ├─────────────────────────────┤
        │ Movimiento 3                │
        ├─────────────────────────────┤
        │ Movimiento 2                │
        ├─────────────────────────────┤
 BOTTOM→│ Movimiento 1 (Primero)      │ ← Push() agrega aquí
        └─────────────────────────────┘

Operaciones:
  • Push: Agregar al final (TOP)
  • Pop:  Remover del final (TOP)

Estructura de cada elemento:
{
  from: {row, col, piece},
  to: {row, col, piece},
  turn: 'white'|'black',
  capturedPiece: ChessPiece|null,
  capturedPieces: {white: [], black: []}
}
```

### 3.3 Lista de Historial (Queue/List)

```
Historial (gameHistory) - Estructura FIFO (First In, First Out)

┌──────────┬──────────┬──────────┬──────────┐
│ Mov 1    │ Mov 2    │ Mov 3    │ Mov 4    │
│ (Primero)│          │          │ (Último) │
└──────────┴──────────┴──────────┴──────────┘
     ↑                                    ↑
  Push()                                Pop()

Estructura de cada elemento:
{
  id: timestamp,
  player: 'white'|'black',
  playerName: 'Nombre',
  move: 'Rey e1e2',
  timestamp: '12:34:56',
  moveState: { ... }
}
```

### 3.4 Mapa de Piezas Capturadas

```
Piezas Capturadas (capturedPieces) - Estructura: Object/Map

{
  white: [
    ChessPiece {type: 'pawn', color: 'black', ...},
    ChessPiece {type: 'rook', color: 'black', ...},
    ChessPiece {type: 'knight', color: 'black', ...}
    // Piezas capturadas por el jugador blanco
  ],
  
  black: [
    ChessPiece {type: 'pawn', color: 'white', ...},
    ChessPiece {type: 'bishop', color: 'white', ...}
    // Piezas capturadas por el jugador negro
  ]
}

Acceso: capturedPieces['white'] o capturedPieces['black']
```

## 4. Diagrama de Secuencia - Movimiento de Pieza

```
Usuario    GameScreen    ChessGame    ChessPiece    undoStack    gameHistory
   │            │            │            │             │              │
   │──clic─────>│            │            │             │              │
   │            │            │            │             │              │
   │            │──selectPiece()─────────>│             │              │
   │            │            │            │             │              │
   │            │            │──getPossibleMoves()─────>│             │
   │            │            │            │             │              │
   │            │            │<─Array de movimientos────│             │
   │            │            │            │             │              │
   │            │            │──calculateValidMoves()   │             │
   │            │            │   (filtra jaque)         │             │
   │            │            │            │             │              │
   │            │<─movimientos válidos───│             │              │
   │            │            │            │             │              │
   │──clic─────>│            │            │             │              │
   │ (mover)    │            │            │             │              │
   │            │──movePiece()───────────>│             │              │
   │            │            │            │             │              │
   │            │            │──validar movimiento      │             │
   │            │            │            │             │              │
   │            │            │──crear estado────────────┼─────────────>│
   │            │            │            │             │              │
   │            │            │──.push()────────────────>│              │
   │            │            │            │             │              │
   │            │            │──.push()────────────────────────────────>│
   │            │            │            │             │              │
   │            │            │──actualizar tablero      │             │
   │            │            │            │             │              │
   │            │            │──cambiar turno           │             │
   │            │            │            │             │              │
   │            │<─true (éxito)──────────│             │              │
   │            │            │            │             │              │
   │            │──updateGameState()─────>│             │              │
   │            │            │            │             │              │
   │            │──saveCurrentGame()──────┼────────────>│              │
   │            │            │            │  LocalStorage              │
   │            │            │            │             │              │
   │<──Re-render│            │            │             │              │
   │ (UI actualizada)        │            │             │              │
```

## 5. Diagrama de Estados del Juego

```
                    ┌─────────────┐
                    │   INICIO    │
                    │  (Nuevo)    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  JUGANDO    │◄────┐
                    │  (Normal)   │     │
                    └──────┬──────┘     │
                           │            │
                ┌──────────┴──────────┐ │
                │                     │ │
                ▼                     ▼ │
        ┌──────────────┐    ┌──────────────┐
        │    JAQUE     │    │  MOVIMIENTO  │
        │  (Check)     │    │   VÁLIDO     │
        └──────┬───────┘    └──────┬───────┘
               │                   │
               │                   │ Continúa
               │                   │
               ▼                   │
    ┌─────────────────────┐        │
    │  ¿Puede moverse?    │        │
    └──────┬──────────────┘        │
           │                       │
    ┌──────┴──────┐                │
    │             │                │
    ▼             ▼                │
┌─────────┐  ┌──────────────┐     │
│JAQUE    │  │  AHOGADO     │     │
│MATE     │  │(Stalemate)   │     │
│(FIN)    │  │   (FIN)      │     │
└─────────┘  └──────────────┘     │
                                  │
                                  └──────┘
```

## 6. Diagrama de Componentes React

```
                    ┌──────────────┐
                    │     App      │
                    │ (Router)     │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
┌─────────────────┐  ┌──────────────┐
│ColorSelectScreen│  │  GameScreen  │
│                 │  │              │
│ - Configuración │  │  ┌──────────────┐
│ - Nombres       │  │  │  Tablero     │
│ - Colores       │  │  │  (8x8)       │
└─────────────────┘  │  └──────────────┘
                     │              │
                     │  ┌───────────┴───────────┐
                     │  │                       │
                     │  ▼                       ▼
                     │  ┌─────────────────┐    ┌──────────────────┐
                     │  │ HistoryPanel    │    │PossibleMovesPanel│
                     │  │                 │    │                  │
                     │  │ - Historial     │    │ - Movimientos    │
                     │  │ - Cronológico   │    │   válidos        │
                     │  └─────────────────┘    └──────────────────┘
                     │              │
                     │              ▼
                     │  ┌─────────────────┐
                     │  │SavedGamesPanel  │
                     │  │                 │
                     │  │ - Cargar        │
                     │  │ - Eliminar      │
                     │  └─────────────────┘
                     │
                     └───────────┐
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │    ChessGame (lógica)  │
                    └────────────────────────┘
```

## 7. Diagrama de Almacenamiento LocalStorage

```
LocalStorage (Navegador)
│
├── chess_current_game
│   └── {
│         player1Color: 'white',
│         player1Name: 'Jugador 1',
│         player2Name: 'Jugador 2',
│         currentTurn: 'black',
│         board: [...],           // Matriz 8x8 serializada
│         gameHistory: [...],     // Lista de movimientos
│         capturedPieces: {...},  // Piezas capturadas
│         undoStack: [...],       // Pila serializada
│         timestamp: '2024-01-01T12:00:00.000Z'
│       }
│
├── chess_saved_games
│   └── [
│         {
│           id: '1234567890',
│           name: 'Partida 1',
│           state: {...},         // Mismo formato que current_game
│           createdAt: '2024-01-01T12:00:00.000Z',
│           lastPlayed: '2024-01-01T13:00:00.000Z'
│         },
│         {
│           id: '0987654321',
│           name: 'Partida 2',
│           state: {...},
│           createdAt: '2024-01-02T10:00:00.000Z',
│           lastPlayed: '2024-01-02T11:00:00.000Z'
│         }
│       ]
│
├── chess_game_settings
│   └── {
│         theme: 'default',
│         soundEnabled: true,
│         ...
│       }
│
└── chess_statistics
    └── {
          totalGames: 10,
          wins: { white: 5, black: 3 },
          draws: 2,
          averageMoves: 45
        }
```

## 8. Pseudocódigo Visual - Validación de Movimiento

```
ALGORITMO: Validar y Ejecutar Movimiento
═══════════════════════════════════════════════════════════════

INICIO
  │
  ├─► [Paso 1] Obtener pieza en posición origen
  │   └─► pieza ← tablero[filaOrigen][colOrigen].pieza
  │
  ├─► [Paso 2] Verificar que existe pieza
  │   └─► SI pieza = null ENTONCES
  │       └─► RETORNAR false
  │
  ├─► [Paso 3] Verificar que es el turno del jugador
  │   └─► SI pieza.color ≠ turnoActual ENTONCES
  │       └─► RETORNAR false
  │
  ├─► [Paso 4] Obtener movimientos posibles básicos
  │   └─► movimientos ← pieza.getPossibleMoves(tablero)
  │
  ├─► [Paso 5] Filtrar movimientos válidos (sin dejar en jaque)
  │   │
  │   └─► PARA CADA movimiento EN movimientos HACER
  │       │
  │       ├─► [5.1] Crear tablero temporal
  │       │   └─► tableroTemp ← clonarTablero(tablero)
  │       │
  │       ├─► [5.2] Simular movimiento
  │       │   └─► moverPiezaEnTableroTemp(tableroTemp, movimiento)
  │       │
  │       ├─► [5.3] Encontrar posición del rey
  │       │   └─► posRey ← encontrarRey(pieza.color, tableroTemp)
  │       │
  │       ├─► [5.4] Verificar si rey está bajo ataque
  │       │   └─► enJaque ← estaCasillaBajoAtaque(posRey, tableroTemp)
  │       │
  │       └─► SI NO enJaque ENTONCES
  │           └─► agregar a movimientosValidos
  │
  ├─► [Paso 6] Verificar que el destino está en movimientos válidos
  │   └─► SI (filaDestino, colDestino) NO está en movimientosValidos ENTONCES
  │       └─► RETORNAR false
  │
  ├─► [Paso 7] Ejecutar movimiento
  │   │
  │   ├─► [7.1] Guardar estado para deshacer
  │   │   └─► estadoMovimiento ← crearEstadoMovimiento(...)
  │   │
  │   ├─► [7.2] Mover pieza
  │   │   ├─► tablero[filaDestino][colDestino].pieza ← pieza
  │   │   ├─► tablero[filaOrigen][colOrigen].pieza ← null
  │   │   └─► pieza.moveTo(filaDestino, colDestino)
  │   │
  │   ├─► [7.3] Si hay captura, agregar a capturadas
  │   │   └─► SI piezaCapturada ≠ null ENTONCES
  │   │       └─► capturadas[colorOponente].push(piezaCapturada)
  │   │
  │   ├─► [7.4] Agregar a pila de deshacer
  │   │   └─► undoStack.push(estadoMovimiento)
  │   │
  │   ├─► [7.5] Agregar al historial
  │   │   └─► gameHistory.push(crearEntradaHistorial(...))
  │   │
  │   └─► [7.6] Cambiar turno
  │       └─► turnoActual ← oponerColor(turnoActual)
  │
  └─► [Paso 8] Retornar éxito
      └─► RETORNAR true

FIN
```

---

Estos diagramas proporcionan una representación visual completa de la arquitectura, estructuras de datos y flujos de información del proyecto de ajedrez.
