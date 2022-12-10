/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import useLocalStorage from '../utils/useLocalStorage';
import Button from './Button';
import './HighScores.css';

function HighScores(props) {
    const { score, level, display } = props;

    const [highScores, setHighScores] = useLocalStorage('highscores', {});
    const [userName, setUserName] = useState('');
    const MAX_SCORE_SIZE = 10;
    const saveHighScore = level !== 'custom';
    const miliSecsToSecs = (ms) => ms / 100;

    const levelsHighScore = (thisLevel) => highScores[thisLevel] || [];

    const changeUserName = (e) => {
        setUserName(e.target.value);
    };

    const hideForm = () => {
        const elem = document.getElementById('form');
        elem.style.display = 'none';
    };

    const saveScore = () => {
        const timeStamp = Date.now();
        const scoresList = [
            ...levelsHighScore(level),
            { score, userName, timeStamp },
        ].sort((a, b) => a.score - b.score);
        if (scoresList.length > MAX_SCORE_SIZE) {
            scoresList.length = MAX_SCORE_SIZE;
        }
        const scoreToSave = {
            ...highScores,
            [level]: scoresList,
        };
        setHighScores(scoreToSave);
        hideForm();
    };

    const displayHighScores = (thisLevel) =>
        (levelsHighScore(thisLevel) || [])
            .sort((a, b) => a.score - b.score)
            .map((thisScore) => (
                <div key={thisScore.timeStamp}>
                    <b title={thisScore.timeStamp}>{thisScore.userName}</b> -{' '}
                    {miliSecsToSecs(thisScore.score)}s -{' '}
                    {new Date(thisScore.timeStamp).toLocaleString()}
                </div>
            ));

    const isScoreInRange = (thisLevel) => {
        const onlyTimes = (levelsHighScore(thisLevel) || []).map(
            (thisScore) => thisScore.score
        );
        const maxTime = Math.max(...onlyTimes);
        return onlyTimes.length < MAX_SCORE_SIZE || score < maxTime;
    };

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
                    {isScoreInRange(level) && (
                        <div id="form">
                            Enter your name:
                            <br />
                            <input
                                type="text"
                                name="userName"
                                id="userName"
                                value={userName}
                                onChange={changeUserName}
                            />
                            <Button onclick={saveScore}>Save</Button>
                        </div>
                    )}
                    <div>{displayHighScores(level)}</div>
                </>
            )}
        </div>
    );
}

export default HighScores;
