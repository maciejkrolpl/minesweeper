import useLocalStorage from './../utils/useLocalStorage';
import { useState } from 'react';
import Button from './Button';

const HighScores = props => {
    const {
        score,
        level
    } = props;

    const MAX_SCORE_SIZE = 10;
    const saveHighScore = level !== 'custom';
    const miliSecsToSecs = ms => ms / 100;

    const levelsHighScore = () => {
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
        const scoresList = [...levelsHighScore(), { score, userName, timeStamp }].sort((a, b) => a.score - b.score);
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

    const displayHighScores = () => (levelsHighScore() || [])
        .sort((a, b) => a.score - b.score)
        .map((score) =>
            <div key={score.timeStamp}>
                <b title={score.timeStamp}>{score.userName}</b> - {miliSecsToSecs(score.score)}s - {new Date(score.timeStamp).toLocaleString()}
            </div>
        )

    const scoreInRange = () => {
        const onlyTimes = (levelsHighScore() || []).map(score => score.score);
        const maxTime = Math.max(...onlyTimes);
        return onlyTimes.length < MAX_SCORE_SIZE || score < maxTime;
    }


    return (
        <div>
            <p>Your score is {miliSecsToSecs(score)} seconds.</p>
            {saveHighScore &&
                <>
                    {scoreInRange() &&
                        <div id="form">Enter your name:<br />
                            <input type="text" name="userName" id="userName" value={userName} onChange={changeUserName} />
                            <Button onclick={saveScore}>Save</Button>
                        </div>}
                    <div>
                        {displayHighScores()}
                    </div>
                </>}
        </div>
    )

}

export default HighScores;