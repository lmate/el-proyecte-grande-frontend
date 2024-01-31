interface MovementGenerator{
    getType() : string;
    generateAvaibleMoves(currentPos : number[]) : number[][];
}