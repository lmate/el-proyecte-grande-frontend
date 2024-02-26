import MovementGenerator from "./MovementGenerator";

class BishopMovement extends MovementGenerator{
    constructor(){
        super('bishop');
    }

    getType() : string{
        return this.MOVEMENT_TYPE;
    }

    public generateAvaibleMoves(currentPos : number[]) : number[][]{
        return this.collectAllMovements(currentPos);
    }

    private collectAllMovements(currentPos : number[]) : number[][]{
        const allAvaibleMoves: Set<number[]> = new Set();

        this.forwardLeftMovements(currentPos).forEach(position => allAvaibleMoves.add(position));
        this.forwardRightMovements(currentPos).forEach(position => allAvaibleMoves.add(position));
        this.backwardLeftMovements(currentPos).forEach(position => allAvaibleMoves.add(position));
        this.backwardRightMovements(currentPos).forEach(position => allAvaibleMoves.add(position));

        const avaibleMoves : number[][] = [];

        for(const move of allAvaibleMoves){
            avaibleMoves.push(move);
        }

        return avaibleMoves;
    }

    private forwardLeftMovements(currentPos: number[]) : number[][]{
        let xPos: number = currentPos[0];
        let yPos: number = currentPos[1];
        const avaibleMoves = [];
        while(xPos > this.MIN_BOARD_SIZE && yPos > this.MIN_BOARD_SIZE){
            xPos--;
            yPos--;
            const newPositions: number[] = [xPos, yPos];
            avaibleMoves.push(newPositions);
        }

        return avaibleMoves;
    }

    private forwardRightMovements(currentPos: number[]) : number[][]{
        let xPos: number = currentPos[0];
        let yPos: number = currentPos[1];
        const avaibleMoves: number[][] = [];
        while(xPos < this.MAX_BOARD_SIZE && yPos > this.MIN_BOARD_SIZE){
            xPos++;
            yPos--;
            const newPositions: number[] = [xPos, yPos];
            avaibleMoves.push(newPositions);
        }

        return avaibleMoves;
    }


    private backwardLeftMovements(currentPos: number[]) : number[][]{
        let xPos: number = currentPos[0];
        let yPos: number = currentPos[1];
        const avaibleMoves = [];
        while(xPos > this.MIN_BOARD_SIZE && yPos < this.MAX_BOARD_SIZE){
            xPos--;
            yPos++;
            const newPositions: number[] = [xPos, yPos];
            avaibleMoves.push(newPositions);
        }

        return avaibleMoves;
    }


    private backwardRightMovements(currentPos: number[]) : number[][]{
        let xPos: number = currentPos[0];
        let yPos: number = currentPos[1];
        const avaibleMoves = [];
        while(xPos < this.MAX_BOARD_SIZE - 1 && yPos < this.MAX_BOARD_SIZE - 1){
            xPos++;
            yPos++;
            const newPositions: number[] = [xPos, yPos];
            avaibleMoves.push(newPositions);
        }

        return avaibleMoves;
    }

    
}

export default BishopMovement;