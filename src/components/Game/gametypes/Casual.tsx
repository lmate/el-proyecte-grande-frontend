function Casual({
  getRandomPuzzle,
  setDisableClick,
  showHint,
  onHintReset,
}: {
  showHint: () => void;
  onHintReset: () => void;
  getRandomPuzzle: () => void;
  setDisableClick: (bool: boolean) => void;
}) {
  return (
    <>
      <button
        className="next-puzzle-btn"
        onClick={() => {
          getRandomPuzzle();
          setDisableClick(true);
          setTimeout(() => {
            setDisableClick(false);
          }, 1000);
        }}
      >
        Get new puzzle
      </button>
      <button
        className="hint-button"
        onClick={() => {
          showHint();
          setTimeout(() => {
            onHintReset();
          }, 2000);
        }}
      >
        Show Hint💡
      </button>
    </>
  );
}

export default Casual;
