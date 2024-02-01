import MovementGenerator from "./MovementGenerator";

class KingMovement extends MovementGenerator{
    constructor(){
        super('king');
    }

    generateAvaibleMoves(currentPos : number[]) : number[][]{
        const avaibleMoves: number[][] = this.getAllMoves(currentPos);
        const validMoves: number[][] = this.filterValidMovements(avaibleMoves);
        return validMoves;
    }

    private getAllMoves(currentPos: number[]) : number[][]{
        const xPos: number = currentPos[0];
        const yPos: number = currentPos[1];

        const forward: number[] = [xPos, yPos - 1];
        const forwardRight: number[] = [xPos + 1, yPos - 1];
        const right: number[] = [xPos + 1, yPos];
        const backwardRight: number[] = [xPos + 1, yPos + 1];
        const backward: number[] = [xPos, yPos + 1];
        const backwardLeft: number[] = [xPos - 1, yPos + 1];
        const left: number[] = [xPos - 1, yPos];
        const forwardLeft: number[] = [xPos - 1, yPos - 1];

        const allMoves: number[][] = [
            forward,
            forwardRight,
            right,
            backwardRight,
            backward,
            backwardLeft,
            left,
            forwardLeft
        ];

        return allMoves;
    }

    private filterValidMovements(avaibleMoves: number[][]){
        const filteredMoves: number[][] = [];

        for(const move of avaibleMoves){
            if(!(move.includes(-1) || move.includes(8))){
                filteredMoves.push(move);
            }
        }
    

        return filteredMoves;
    }
}

export default KingMovement;