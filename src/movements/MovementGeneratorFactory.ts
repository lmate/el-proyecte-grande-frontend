import MovementGenerator from "./MovementGenerator";

interface MovementGeneratorFactory{

    getMoves(piece: string): MovementGenerator | undefined;
}

export default MovementGeneratorFactory;