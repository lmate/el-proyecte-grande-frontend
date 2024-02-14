function SingleGame({getRandomPuzzle, setDisableClick, showHint, setHint}){
    return(
        <>

            <button className="next-puzzle-btn"onClick={() => {getRandomPuzzle(); setDisableClick(true); setTimeout(() => {setDisableClick(false)}, 1000)}}>Get new puzzle</button>
            <button className="hint-button" onClick={() => {showHint(); setTimeout(() => {setHint()}, 2000)}}>Show Hint💡</button>
        {
            /*
            <button className="next-puzzle-btn"onClick={() => {getRandomPuzzle(), setDisableClick(true), setTimeout(() => {setDisableClick(false)}, 1000)}}>Get new puzzle</button>
            <button className="hint-button" onClick={() => {showHint(moveCount),console.log(hint + "hint");setTimeout(() => {setHint(null)}, 2000)}}>Show Hint💡</button>
            */
        }
            
        </>
    )
}

export default SingleGame;