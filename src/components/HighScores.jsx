import useLocalStorage from './../utils/useLocalStorage';
import { useState } from 'react';
import Button from './Button';

const HighScores = props => {
    const {
        score,
        saveHighScore
    } = props;

    const MAX_SCORE_SIZE = 10;

    const miliSecsToSecs = ms => ms / 100;


    const [highScores, setHighScores] = useLocalStorage('highscores', [])
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
        const scores = [...highScores, { score, userName, timeStamp }].sort((a, b) => a.score - b.score);
        if (scores.length > MAX_SCORE_SIZE) {
            scores.length = MAX_SCORE_SIZE;
        }
        setHighScores(scores);
        hideForm();
    }

    const displayHighScores = highScores
        .sort((a, b) => a.score - b.score)
        .map((score) =>
            <div key={score.timeStamp}>
                <b title={score.timeStamp}>{score.userName}</b> - {miliSecsToSecs(score.score)}s - {new Date(score.timeStamp).toLocaleString()}
            </div>
        )

    const scoreInRange = () => {
        const onlyTimes = highScores.map(score => score.score);
        const maxTime = Math.max(...onlyTimes);
        return score < maxTime;
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
                        {displayHighScores}
                    </div>
                </>}
        </div>
    )

}

export default HighScores;