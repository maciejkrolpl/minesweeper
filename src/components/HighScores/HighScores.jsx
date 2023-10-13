import React, { useState, useEffect, useRef } from 'react';
import useLocalStorage from '../../utils/useLocalStorage';
import Button from '../../layout-components/Button/Button';
import './HighScores.css';

function HighScores(props) {
    const { score, level, display } = props;
    const inputRef = useRef(null);
    
    useEffect(()=> {
       inputRef?.current?.focus();
    },[])

    const [highScores, setHighScores] = useLocalStorage('highscores', {});
    const [userName, setUserName] = useState('');
    const saveHighScore = level !== 'custom';
    const miliSecsToSecs = (ms) => (Math.round(ms / 10) / 100).toFixed(2);

    const levelsHighScore = (thisLevel) => highScores[thisLevel] || [];

    const changeUserName = (e) => {
        setUserName(e.target.value);
    };

    const hideForm = () => {
        const elem = document.getElementById('form');
        elem.style.display = 'none';
    };

    const saveScore = (e) => {
        e.preventDefault();
        const timeStamp = Date.now();
        const scoresList = [
            ...levelsHighScore(level),
            { score, userName, timeStamp },
        ].sort((a, b) => a.score - b.score);
        const scoreToSave = {
            ...highScores,
            [level]: scoresList,
        };
        setHighScores(scoreToSave);
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
                <div key={thisScore.timeStamp}>
                    <b title={thisScore.timeStamp}>{thisScore.userName}</b> -{' '}
                    {miliSecsToSecs(thisScore.score)}s -{' '}
                    {new Date(thisScore.timeStamp).toLocaleString()}
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
