import BishopMovement from './movementGenerators/BishopMovement';
import KingMovement from './movementGenerators/KingMovement';
import MovementGeneratorFactory from './MovementGeneratorFactory';
import MovementGenerator from './movementGenerators/MovementGenerator';
import QueenMovements from './movementGenerators/QueenMovements';
import RookMovement from './movementGenerators/RookMovement';

class MovementGeneratorFactoryImpl implements MovementGeneratorFactory{
    getMoves(piece: string): MovementGenerator | undefined{
        if(piece.includes('wB')){
            return new BishopMovement();
        } else if(piece.includes('wK')){
            return new KingMovement();
        } else if(piece.includes('wQ')){
            return new QueenMovements();
        } else if(piece.includes('wR')){
            return new RookMovement();
        }
    }
}

export default MovementGeneratorFactoryImpl;