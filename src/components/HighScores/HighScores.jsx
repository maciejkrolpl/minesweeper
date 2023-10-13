import { useState, useEffect, useRef } from 'react';
import Button from '../../layout-components/Button/Button';
import './HighScores.css';
import Firebase from '../../firebase/firebase';
const db = new Firebase('hiscores');

function HighScores(props) {
  const { score, level, display } = props;
  const inputRef = useRef(null);
  const [hiscores, setHiscores] = useState(null);

  useEffect(() => {
    inputRef?.current?.focus();
    retrieveHiscores();
  }, []);

  const retrieveHiscores = async () => {
    const hiscores = await db.retrieveAll();
    setHiscores(hiscores);
  };

  const [userName, setUserName] = useState('');
  const saveHighScore = level !== 'custom';
  const miliSecsToSecs = (ms) => (Math.round(ms / 10) / 100).toFixed(2);

  const levelsHighScore = (thisLevel) =>
    (hiscores || []).filter((score) => score.level === thisLevel);

  const changeUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleOnKeyDown = e => {
    if (e.key === 'Enter'){
      e.preventDefault();
      saveScore(e);
    }
  }

  const hideForm = () => {
    const elem = document.getElementById('form');
    elem.style.display = 'none';
  };

  const saveScore = (e) => {
    e.preventDefault();
    const timestamp = Date.now();
    const newScore = { score, userName, timestamp, level };
    setHiscores([...hiscores, newScore])
    db.add(newScore);
    hideForm();
    const event = new CustomEvent('setFocus', {
      detail: { button: 'close' },
    });
    document.dispatchEvent(event);
  };

  const displayHighScores = (thisLevel) =>
    levelsHighScore(thisLevel)
      .sort((a, b) => a.score - b.score)
      .map((thisScore) => (
        <div key={thisScore.id || ''}>
          <b title={thisScore.timestamp}>{thisScore.userName}</b> -{' '}
          {miliSecsToSecs(thisScore.score)}s -{' '}
          {new Date(thisScore.timestamp).toLocaleString()}
        </div>
      ));

  if (display) {
    return (
      <div className="display-container">
        {['beginner', 'intermediate', 'expert'].map((lvl) => (
          <div key={lvl}>
            <h3>{lvl}</h3>
            {displayHighScores(lvl)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <p>Your score is {miliSecsToSecs(score)} seconds.</p>
      {saveHighScore && (
        <>
          <div id="form">
            Enter your name:
            <br />
            <form>
              <input
                type="text"
                name="userName"
                id="userName"
                value={userName}
                onChange={changeUserName}
                ref={inputRef}
                onKeyDown={handleOnKeyDown}
              />
              <Button type="button" onclick={saveScore}>
                Save
              </Button>
            </form>
          </div>
          <div>{displayHighScores(level)}</div>
        </>
      )}
    </div>
  );
}

export default HighScores;
