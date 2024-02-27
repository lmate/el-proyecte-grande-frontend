import MovementGeneratorFactory from "./MovementGeneratorFactory";
import MovementGenerator from "./movementGenerators/MovementGenerator";

class MovementValidator{
    private movementGeneratorFactory: MovementGeneratorFactory;

    private Y_POS_INDEX: number = 0;
    private X_POS_INDEX: number = 1;

    constructor(movementGeneratorFactory: MovementGeneratorFactory){
        this.movementGeneratorFactory = movementGeneratorFactory;
    }

    public getValidPositions(board: string[][], clickedCell: number[]): string[]{
        const piece: string = board[clickedCell[this.Y_POS_INDEX]][clickedCell[this.X_POS_INDEX]][0];
        const movementGenerator: MovementGenerator | undefined = this.movementGeneratorFactory.getMoves(piece);
        if(movementGenerator){
            const avaibleMoves: number[][] = movementGenerator.generateAvaibleMoves(clickedCell);
            const validMoves: number[][] = this.filterValidMoves(board, avaibleMoves);
            return this.concatPositionToString(validMoves);
        }
        return [];
    }

    private filterValidMoves(board: string[][], avaibleMoves: number[][]): number[][]{
        const validMoves: number[][] = [];
        for(const avaibleMove of avaibleMoves){
            if(!/w[K,Q,R,B,NP]/.test(board[avaibleMove[this.Y_POS_INDEX]][avaibleMove[this.X_POS_INDEX]])){
                validMoves.push(avaibleMove);

            }
        }

        return validMoves;
    }

    private concatPositionToString(validMoves: number[][]): string[]{
        return validMoves.map(move => move.join());
    }
}

export default MovementValidator;