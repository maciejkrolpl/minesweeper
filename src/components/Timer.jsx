import { useEffect, useState } from "react";
import React from "react";

const Timer = props => {
    const { isRunTimer } = props;
    const [timerId, setTimerId] = useState(null);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (isRunTimer) {
            let secs = 0;
            setSeconds(secs);
            const tId = setInterval(() => {
                setSeconds(++secs);
            }, 1000)
            setTimerId(tId);
        } else {
            clearInterval(timerId);
        }
    }, [isRunTimer])

    return (
        <>
            <label htmlFor="timer">Timer</label>
            <input type="text" disabled id="timer" name="timer" value={seconds} />
        </>
    )
}

export default Timer;