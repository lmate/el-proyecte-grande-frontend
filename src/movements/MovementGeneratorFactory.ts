import MovementGenerator from "./MovementGenerator";

interface MovementGeneratorFactory{

    getMoves(piece: string): MovementGenerator;
}

export default MovementGeneratorFactory;