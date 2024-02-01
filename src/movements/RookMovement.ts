import MovementGenerator from "./MovementGenerator";

class RookMovement extends MovementGenerator{
    constructor(){
        super('rook');
    }

    getType(): string {
        return this.MOVEMENT_TYPE;
    }

    generateAvaibleMoves(currentPos : number[]) : number[][]{
        const validMoves: number[][] = [];
        this.generateForwardMovement(currentPos).forEach(position => validMoves.push(position));
        this.generateRightMovement(currentPos).forEach(position => validMoves.push(position));
        this.generateBackwardMovement(currentPos).forEach(position => validMoves.push(position));
        this.generateLeftMovement(currentPos).forEach(position => validMoves.push(position));

        return validMoves;
    }

    private generateForwardMovement(currentPos: number[]): number[][]{
        const xPos: number = currentPos[1];
        let yPos: number = currentPos[0];
        const avaibleMoves: number[][] = [];

        while(yPos > this.MIN_BOARD_SIZE){
            yPos--;
            const avaiblePosition: number[] = [xPos, yPos];
            avaibleMoves.push(avaiblePosition);
        }

        return avaibleMoves;
    }

    private generateRightMovement(currentPos: number[]): number[][]{
        let xPos: number = currentPos[1];
        const yPos: number = currentPos[0];
        const avaibleMoves: number[][] = [];

        while(xPos < this.MAX_BOARD_SIZE - 1){
            xPos++;
            const avaiblePosition: number[] = [xPos, yPos];
            avaibleMoves.push(avaiblePosition);
        }
        return avaibleMoves;
    }

    private generateBackwardMovement(currentPos: number[]): number[][]{
        const xPos: number = currentPos[1];
        let yPos: number = currentPos[0];
        const avaibleMoves: number[][] = [];

        while(yPos < this.MAX_BOARD_SIZE - 1){
            yPos++;
            const avaiblePosition: number[] = [xPos, yPos];
            avaibleMoves.push(avaiblePosition);
        }

        return avaibleMoves;
    }

    private generateLeftMovement(currentPos: number[]): number[][]{
        let xPos: number = currentPos[1];
        const yPos: number = currentPos[0];
        const avaibleMoves: number[][] = [];

        while(xPos > this.MIN_BOARD_SIZE){
            xPos--;
            const avaiblePosition: number[] = [xPos, yPos];
            avaibleMoves.push(avaiblePosition);
        }
        return avaibleMoves;
    }

}

export default RookMovement;