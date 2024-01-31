import MovementGenerator from "./MovementGenerator";

class KingMovement extends MovementGenerator{
    constructor(){
        super('king');
    }

    generateAvaibleMoves(currentPos : number[]) : number[][]{
        return this.getAllMoves(currentPos);
    }

    private getAllMoves(currentPos: number[]) : number[][]{
        const xPos: number = currentPos[0];
        const yPos: number = currentPos[0];

        const forward: number[] = [xPos, yPos + 1];
        const forwardRight: number[] = [xPos + 1, yPos + 1];
        const right: number[] = [xPos + 1, yPos];
        const backwardRight: number[] = [xPos + 1, yPos - 1];
        const backward: number[] = [xPos, yPos - 1];
        const backwardLeft: number[] = [xPos - 1, yPos - 1];
        const left: number[] = [xPos - 1, yPos];
        const forwardLeft: number[] = [xPos - 1, yPos + 1];

        const allMoves: number[][] = [
            backward,
            backwardLeft,
            left,
            forwardLeft,
            forward,
            forwardRight,
            right,
            backwardRight
        ];

        return allMoves;
    }
}

export default KingMovement;