import useLocalStorage from './../utils/useLocalStorage';
import { useState } from 'react';
import Button from './Button';
import './HighScores.css';

const HighScores = props => {
    const {
        score,
        level,
        display
    } = props;

    const MAX_SCORE_SIZE = 10;
    const saveHighScore = level !== 'custom';
    const miliSecsToSecs = ms => ms / 100;

    const levelsHighScore = (level) => {
        console.log({ level }, (highScores[level] || []))
        return (highScores[level] || []);
    }


    const [highScores, setHighScores] = useLocalStorage('highscores', {})
    const [userName, setUserName] = useState('');

    const changeUserName = e => {
        setUserName(e.target.value)
    }

    const hideForm = () => {
        const elem = document.getElementById('form');
        elem.style.display = 'none';
    }

    const saveScore = () => {
        const timeStamp = Date.now();
        const scoresList = [...levelsHighScore(level), { score, userName, timeStamp }].sort((a, b) => a.score - b.score);
        if (scoresList.length > MAX_SCORE_SIZE) {
            scoresList.length = MAX_SCORE_SIZE;
        }
        const scoreToSave = {
            ...highScores,
            [level]: scoresList
        }
        console.log('scoretosave', scoreToSave)
        setHighScores(scoreToSave);
        hideForm();
    }

    const displayHighScores = (level) => (levelsHighScore(level) || [])
        .sort((a, b) => a.score - b.score)
        .map((score) =>
            <div key={score.timeStamp}>
                <b title={score.timeStamp}>{score.userName}</b> - {miliSecsToSecs(score.score)}s - {new Date(score.timeStamp).toLocaleString()}
            </div>
        )

    const isScoreInRange = (level) => {
        const onlyTimes = (levelsHighScore(level) || []).map(score => score.score);
        const maxTime = Math.max(...onlyTimes);
        return onlyTimes.length < MAX_SCORE_SIZE || score < maxTime;
    }


    if (display) {
        return (
            <div className="display-container">
                {
                    ['beginner', 'intermediate', 'expert'].map(lvl =>
                        <div key={lvl}>
                            <h3>{lvl}</h3>
                            {displayHighScores(lvl)}
                        </div>
                    )
                }
            </div>
        )
    }

    return (
        <div>
            <p>Your score is {miliSecsToSecs(score)} seconds.</p>
            {saveHighScore &&
                <>
                    {isScoreInRange(level) &&
                        <div id="form">Enter your name:<br />
                            <input type="text" name="userName" id="userName" value={userName} onChange={changeUserName} />
                            <Button onclick={saveScore}>Save</Button>
                        </div>}
                    <div>
                        {displayHighScores(level)}
                    </div>
                </>}
        </div>
    )

}

export default HighScores;