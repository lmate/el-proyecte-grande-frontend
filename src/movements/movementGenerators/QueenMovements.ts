import BishopMovement from "./BishopMovement";
import MovementGenerator from "./MovementGenerator";
import RookMovement from "./RookMovement";

class QueenMovements extends MovementGenerator{
    rookMovement: RookMovement;
    bishopMovements: BishopMovement;

    constructor(){
        super("queen");
        this.rookMovement = new RookMovement();
        this.bishopMovements = new BishopMovement();
    }

    generateAvaibleMoves(currentPos : number[]) : number[][]{
        const avaibleMoves: number[][] = [];
        this.bishopMovements.generateAvaibleMoves(currentPos).forEach(pos => avaibleMoves.push(pos));
        this.rookMovement.generateAvaibleMoves(currentPos).forEach(pos => avaibleMoves.push(pos));

        return avaibleMoves;
    }
}

export default QueenMovements;