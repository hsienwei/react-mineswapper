import { useEffect, useState } from "react";
import { GameState } from "../../api/Game";
import DigitalBoard from "./DigitalBoard";


let clickTimer: any;

export default function Countdown(props: {startTime: number, gameState: GameState})
{
    const [passTime, setPassTime] = useState(0);
    useEffect(() => {
        if (props.gameState === GameState.win || props.gameState === GameState.dead) {
            console.log("Countdown is win");
            clearInterval(clickTimer);
        }
        else {
            console.log("Countdown not win");
            if (props.startTime !== 0) {
                console.log("Countdown setInterval");
                setPassTime(0);
                clickTimer = setInterval(() => {
                    setPassTime(Math.floor((Date.now() - props.startTime) / 1000));
                    console.log("update");
                }, 1000);
            }
            else {
                console.log("clearInterval");
                clearInterval(clickTimer);
                setPassTime(0);
            }
        }
    }, [props.startTime, props.gameState]);

    return (
        <DigitalBoard val={Math.min(999, passTime)} />
    )
}