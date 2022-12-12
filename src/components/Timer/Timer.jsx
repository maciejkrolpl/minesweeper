import React, { useEffect, useState } from 'react';
import './Timer.css';

function Timer(props) {
    const { isRunTimer } = props;
    const [seconds, setSeconds] = useState(0);
    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        if (isRunTimer) {
            let secs = 0;
            setSeconds(secs);
            const tId = setInterval(() => {
                secs += 1;
                setSeconds(secs);
            }, 1000);
            setTimerId(tId);
        } else {
            clearInterval(timerId);
        }
    }, [isRunTimer]);

    return <input type="text" disabled id="timer" name="timer" value={seconds} />;
}

export default Timer;
