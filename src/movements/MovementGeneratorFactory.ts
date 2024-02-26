import MovementGenerator from "./movementGenerators/MovementGenerator";

interface MovementGeneratorFactory{

    getMoves(piece: string): MovementGenerator | undefined;
}

export default MovementGeneratorFactory;