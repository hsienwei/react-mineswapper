import { useEffect, useState } from "react";


let clickTimer: any;

export default function Countdown(props: {startTime: number})
{
    const [passTime, setPassTime] = useState(0);
    useEffect(() => {
        if(props.startTime !== 0)
        {
            setPassTime(0);
            clickTimer = setInterval( () => {
                setPassTime( Math.floor(( Date.now() - props.startTime) / 1000));
            }, 1000);
        }
        else
        {
            clearInterval(clickTimer);
            setPassTime(0);
        }
    }, [props.startTime]);

    return (
        <div className='Time' >{Math.min(999, passTime).toString().padStart(3, "0")}</div>
        )
}