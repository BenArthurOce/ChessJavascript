// Strategy interface for move validation
class MoveValidationStrategy {
    isValidMove(piece, destination, moveInfo) {
        throw new Error('This method must be implemented by concrete strategies');
    }
}

// Concrete strategy for validating pawn moves
class PawnMoveStrategy extends MoveValidationStrategy {
    isValidMove(piece, destination, moveInfo) {
        const [rankRefDiff, fileRefDiff] = piece.getfileRefrankRefDifference(destination);

        if (moveInfo.locationPosX) {
            return piece.positionArr[0] === moveInfo.locationRow && Math.abs(rankRefDiff) === 1;
        }
        if (moveInfo.locationPosY) {
            return piece.positionArr[1] === moveInfo.locationCol && Math.abs(rankRefDiff) === 1;
        }
        if (moveInfo.isCapture) {
            return piece.fileRef === moveInfo.locationPosY && Math.abs(rankRefDiff) === 1;
        }

        if (piece.team === 0) {
            if (fileRefDiff === 0 && rankRefDiff === 1) {
                return true;
            }
            if (piece.row === 6 && fileRefDiff === 0 && rankRefDiff === 2) {
                return true;
            }
        } else {
            if (fileRefDiff === 0 && rankRefDiff === -1) {
                return true;
            }
            if (piece.row === 1 && fileRefDiff === 0 && rankRefDiff === -2) {
                return true;
            }
        }
        
        return false;
    }
}

// Concrete strategy for validating rook moves
class RookMoveStrategy extends MoveValidationStrategy {
    isValidMove(piece, destination, moveInfo) {
        const [rankRefDiff, fileRefDiff] = piece.getfileRefrankRefDifference(destination);
        return fileRefDiff === 0 || rankRefDiff === 0;
    }
}

// Concrete strategy for validating knight moves
class KnightMoveStrategy extends MoveValidationStrategy {
    isValidMove(piece, destination, moveInfo) {
        const [rankRefDiff, fileRefDiff] = piece.getfileRefrankRefDifference(destination);
        return (Math.abs(fileRefDiff) === 1 && Math.abs(rankRefDiff) === 2) || (Math.abs(fileRefDiff) === 2 && Math.abs(rankRefDiff) === 1);
    }
}

// Concrete strategy for validating bishop moves
class BishopMoveStrategy extends MoveValidationStrategy {
    isValidMove(piece, destination, moveInfo) {
        const [rankRefDiff, fileRefDiff] = piece.getfileRefrankRefDifference(destination);
        return Math.abs(fileRefDiff) === Math.abs(rankRefDiff);
    }
}

// Concrete strategy for validating queen moves
class QueenMoveStrategy extends MoveValidationStrategy {
    isValidMove(piece, destination, moveInfo) {
        const [rankRefDiff, fileRefDiff] = piece.getfileRefrankRefDifference(destination);
        const diagonalMoves = Math.abs(fileRefDiff) === Math.abs(rankRefDiff);
        const straightMoves = fileRefDiff === 0 || rankRefDiff === 0;
        return diagonalMoves || straightMoves;
    }
}

// Concrete strategy for validating king moves
class KingMoveStrategy extends MoveValidationStrategy {
    isValidMove(piece, destination, moveInfo) {
        const [rankRefDiff, fileRefDiff] = piece.getfileRefrankRefDifference(destination);
        return Math.abs(fileRefDiff) <= 1 && Math.abs(rankRefDiff) <= 1;
    }
}






export {MoveValidationStrategy, PawnMoveStrategy, RookMoveStrategy, KnightMoveStrategy, BishopMoveStrategy, QueenMoveStrategy, KingMoveStrategy}


// PawnMoveStrategy, RookMoveStrategy