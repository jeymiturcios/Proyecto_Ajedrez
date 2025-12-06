# Proyecto de Ajedrez

Una aplicación web completa de ajedrez desarrollada en React, que implementa todas las reglas oficiales del juego de ajedrez.

## 📋 Descripción

El Proyecto de Ajedrez es una aplicación web interactiva que permite a dos jugadores jugar partidas de ajedrez completas. La aplicación incluye validación de movimientos, detección de jaque y jaque mate, sistema de deshacer movimientos, historial de partidas, y capacidad de guardar y cargar partidas.

## ✨ Características

- **Tablero Interactivo 8x8**: Interfaz visual completa del tablero de ajedrez
- **Todas las Piezas**: Implementación de las 6 piezas del ajedrez (Peón, Torre, Caballo, Alfil, Reina, Rey)
- **Validación Completa**: Movimientos validados según las reglas oficiales del ajedrez
- **Detección de Estados**: Jaque, jaque mate y empate por ahogado
- **Sistema de Deshacer**: Permite deshacer movimientos usando una pila (Stack)
- **Historial de Movimientos**: Registro cronológico de todos los movimientos
- **Guardado de Partidas**: Persistencia de partidas usando LocalStorage
- **Interfaz Moderna**: Diseño responsivo y atractivo

## 🚀 Tecnologías Utilizadas

- **React 19.2.0** - Biblioteca de JavaScript para interfaces de usuario
- **React Router DOM 6.28.0** - Navegación y enrutamiento
- **JavaScript ES6+** - Lenguaje de programación
- **LocalStorage API** - Almacenamiento local persistente
- **CSS3** - Estilos y diseño

## 📁 Estructura del Proyecto

```
Proyecto_Ajedrez/
├── mipagina/                    # Aplicación React principal
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   │   ├── ColorSelectScreen.jsx
│   │   │   └── game/
│   │   │       ├── GameScreen.jsx
│   │   │       ├── HistoryPanel.js
│   │   │       ├── PossibleMovesPanel.jsx
│   │   │       └── SavedGamesPanel.jsx
│   │   ├── models/              # Modelos de datos
│   │   │   └── ChessPiece.js
│   │   ├── utils/               # Utilidades
│   │   │   ├── Gamelogic.js    # Lógica principal del juego
│   │   │   └── StorageManager.js
│   │   ├── styles/              # Estilos CSS
│   │   └── App.js
│   └── package.json
├── assets/                      # Recursos (imágenes, etc.)
├── INFORME_TECNICO.md          # Informe técnico completo
├── DIAGRAMAS.md                # Diagramas del proyecto
└── README.md                   # Este archivo
```

## 📚 Documentación

El proyecto incluye documentación técnica completa:

- **[INFORME_TECNICO.md](INFORME_TECNICO.md)**: Informe técnico detallado con:
  - Descripción completa del proyecto
  - Estructuras de datos empleadas
  - Diagrama de clases
  - Diagramas de pseudocódigo
  - Análisis de complejidad

- **[DIAGRAMAS.md](DIAGRAMAS.md)**: Diagramas visuales incluyendo:
  - Diagrama de clases detallado
  - Diagrama de flujo de datos
  - Estructuras de datos visuales
  - Diagramas de secuencia
  - Diagramas de estados

## 🎮 Cómo Usar

### Instalación

1. Clonar el repositorio o navegar al directorio del proyecto
2. Instalar dependencias:

```bash
cd mipagina
npm install
```

### Ejecución

Para ejecutar la aplicación en modo desarrollo:

```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

### Construcción para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

## 📊 Estructuras de Datos Utilizadas

El proyecto implementa varias estructuras de datos fundamentales:

1. **Matriz Bidimensional (8x8)**: Representa el tablero de ajedrez
2. **Pila (Stack)**: Sistema de deshacer movimientos (LIFO)
3. **Lista/Cola**: Historial de movimientos (FIFO)
4. **Objeto/Mapa**: Organización de piezas capturadas por color
5. **Árbol/Grafo**: Análisis de movimientos válidos (implícito)
6. **LocalStorage**: Persistencia de datos del navegador

Para más detalles, consulta la sección "Estructuras de Datos Empleadas" en el [INFORME_TECNICO.md](INFORME_TECNICO.md).

## 🎯 Funcionalidades Principales

### Configuración de Jugadores
- Ingreso de nombres de jugadores
- Selección de color de piezas
- Configuración inicial del juego

### Juego
- Selección de piezas con clic
- Visualización de movimientos válidos
- Movimiento de piezas arrastrando o haciendo clic
- Validación automática de movimientos
- Detección de jaque y jaque mate
- Sistema de deshacer movimientos

### Gestión de Partidas
- Guardado automático de partida en progreso
- Guardado de partidas con nombre personalizado
- Carga de partidas guardadas
- Eliminación de partidas guardadas
- Historial de movimientos en tiempo real

## 👥 Autores

Proyecto desarrollado como parte de un trabajo académico sobre estructuras de datos.

## 📝 Licencia

Este proyecto es de carácter educativo.

## 🔗 Referencias

- [React Documentation](https://reactjs.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Reglas del Ajedrez](https://es.wikipedia.org/wiki/Ajedrez)

---

Para información técnica detallada, consulta el [INFORME_TECNICO.md](INFORME_TECNICO.md) y [DIAGRAMAS.md](DIAGRAMAS.md).
