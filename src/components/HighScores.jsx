import useLocalStorage from './../utils/useLocalStorage';
import { useState } from 'react';
import Button from './Button';

const HighScores = props => {
    const {
        score
    } = props;

    const [highScores, setHighScores] = useLocalStorage('highscores', [])
    const [userName, setUserName] = useState('');

    const changeUserName = e => {
        setUserName(e.target.value)
    }

    const hideForm = () => {
        const elem = document.getElementById('form');
        elem.style.display='none';
    }

    const saveScore = () => {
        const scores = [...highScores, { score, userName }];
        setHighScores(scores);
        hideForm();
    }

    const displayHighScores = highScores.map((score, index) =>
        <div key={index}>
            <b>{score.userName}</b> - {score.score}
        </div>
    )


    return (
        <div>
            <p>Your score is {score} seconds.</p>
            <div id="form">Enter your name:<br />
                <input type="text" name="userName" id="userName" value={userName} onChange={changeUserName} />
                <Button onclick={saveScore}>Save</Button>
            </div>
            <div>
                {displayHighScores}
            </div>
        </div>
    )

}

export default HighScores;