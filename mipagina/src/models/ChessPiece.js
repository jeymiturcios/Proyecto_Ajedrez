export class ChessPiece {
    constructor(type, color, position){
        this.type=type; // 'pawn', 'rook', 'knight', 'bishop', 'queen', 'king'
        this.color=color; // 'white' or 'black'
        this.position=position;// {row, col}
        this.hasMoved=false; //Para el primer movimiento (importante para peones y enroque)
    }
    //Obtener el simbolo Unicode del pieza
    getSymbol(){
        const symbols={
            white:{
                king: '♔',
                queen: '♕',
                rook: '♖',
                bishop: '♗',
                knight: '♘',
                pawn: '♙'
            },
            black:{
                king: '♚',
                queen: '♛',
                rook: '♜',
                bishop: '♝',
                knight: '♞',
                pawn: '♟︎'
            }
        };
        return symbols[this.color][this.type];
        }
        //Nombre de la pieza en español
        getName(){
            const names={
                king: 'Rey',
                queen: 'Reina',
                rook: 'Torre',  
                bishop: 'Alfil',
                knight: 'Caballo',
                pawn: 'Peón'
            };
            return names[this.type];
            }

            //Clonar la pieza
    clone(){
        const cloned = new ChessPiece(this.type, this.color, {...this.position});
        cloned.hasMoved = this.hasMoved;
        return cloned;
    }
    moveTo(row, col){
        this.position={row, col};
        this.hasMoved=true;
    }

}