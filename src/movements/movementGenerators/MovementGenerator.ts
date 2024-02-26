abstract class MovementGenerator{
    protected MAX_BOARD_SIZE : number = 8;
    protected MIN_BOARD_SIZE : number = 0;
    protected MOVEMENT_TYPE : string;

    constructor(movementType : string){
        this.MOVEMENT_TYPE = movementType; 
    }

    getType(): string {
        return this.MOVEMENT_TYPE;
    }

    abstract generateAvaibleMoves(currentPos : number[]) : number[][];
}

export default MovementGenerator;