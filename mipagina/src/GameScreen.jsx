export default function GamesScreen({ route }) {
    const { player1Color } = route.params;

   const player2Color = player1Color === "white" ? "black" : "white";

   const [turn, setTurn] = useState("white");

   return (
       <View style={styles.container}>
           <Text style={styles.title}>Juego de Ajedrez</Text>
           <Text style={styles.info}>Jugador 1: {player1Color === "white" ? "Blancas" : "Negras"}</Text>
           <Text style={styles.info}>Jugador 2: {player2Color === "white" ? "Blancas" : "Negras"}</Text>
           <Text style={styles.info}>Turno actual: {turn === "white" ? "Blancas" : "Negras"}</Text>
           {/* Aquí iría el componente del tablero de ajedrez */}
       </View>
   );
}