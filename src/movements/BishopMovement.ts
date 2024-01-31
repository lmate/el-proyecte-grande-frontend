class BishpoMovement implements MovementGenerator{
    private MAX_BOARD_SIZE : number = 8;
    private MIN_BOARD_SIZE : number = 0;
    private MOVEMENT_TYPE : string = 'bishop';

    getType() : string{
        return this.MOVEMENT_TYPE;
    }

    generateAvaibleMoves(currentPos : number[]) : number[][]{
        return this.forwardLeftMovements(currentPos);
    }

    forwardLeftMovements(currentPos: number[]) : number[][]{
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

    
}

export default BishpoMovement;