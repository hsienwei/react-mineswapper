

import { useEffect, useState } from 'react';

import { Game,  levelSetting, GridState} from '../../api/Game'

import Countdown from "./Countdown"
import ResetButton from "./ResetButton"
import MainGame from "./MainGame"

let clickCount = 0;

function MineSwapper() {

    const [level, setLevel] = useState(levelSetting.low);
    const [startTime, setStartTime] = useState(0);
   // 
    const [game, setGame] = useState(Game.initGame);

    useEffect(() => {
        document.documentElement.style.setProperty('--col', `${level.col}`);
        document.documentElement.style.setProperty('--row', `${level.row}`);
    }, [level]);

    

    return (
        <>
            <div className='OuterFrame'>
                <div className='InnerFrame InfoFrame'>
                    <div className='Mine'>{(game.totalMineCount - game.mineCount).toString().padStart(3, "0")}</div>
                    <ResetButton 
                        onClick={() => {
                            setGame(new Game(level));
                            setStartTime(0);
                        }}
                        gameState={game.gameState}></ResetButton>
                    <Countdown startTime={startTime}></Countdown>
                </div >
                <MainGame 
                    game={game}
                    level={level}
                    onMouseEvent={(i: number, ev: MouseEvent) => {
                        console.log(ev)
                        if (startTime === 0) {
                            setStartTime(Date.now());
                        }
                        if (clickCount === 2) {
                            console.log("clear");
                            if (game.gridState[i].state === GridState.OPENED) {
                                Game.openRange(i, game, level.col);
                            }
                        }
                        if (ev.button === 0) {
                            if (clickCount === 1) {
                                if (game.gridState[i].state !== GridState.HOLD) {
                                    if (game.openCount === 0)
                                        Game.avoidFirstClickDead(i, game);
                                    Game.openSingle(i, game, level.col);
                                }
                            }
                        }
                        else if (ev.button === 2) {
                            if (clickCount === 1) {
                                if (game.gridState[i].state === GridState.HOLD) {
                                    game.gridState[i].state = GridState.BLOCKED;
                                    game.mineCount--;
                                }
                                else if (game.gridState[i].state === GridState.BLOCKED) {
                                    game.gridState[i].state = GridState.HOLD;
                                    game.mineCount++;
                                }
                            }

                        }

                        if (ev.type === "mousedown")
                            clickCount++;
                        else if (ev.type === "mouseup")
                            clickCount--;

                        setGame({ ...game });
                        console.log("Clicked" + (i));
                        console.log("Clicked" + game.gridState[i].state);
                    }} />
                


            </div>
            <div onClick={
                () => {
                    setLevel(levelSetting.low);
                    setGame(new Game(levelSetting.low));
                    setStartTime(0);
                }}>{`${levelSetting.low.col} * ${levelSetting.low.row}  mine: ${levelSetting.low.mine}`}</div>
            <div onClick={
                () => {
                    setLevel(levelSetting.mid);
                    setGame(new Game(levelSetting.mid));
                    setStartTime(0);
                }}>{`${levelSetting.mid.col} * ${levelSetting.mid.row}  mine: ${levelSetting.mid.mine}`}</div>

            <div onClick={
                () => {
                    setLevel(levelSetting.high);
                    setGame(new Game(levelSetting.high));
                    setStartTime(0);
                }}>{`${levelSetting.high.col} * ${levelSetting.high.row}  mine: ${levelSetting.high.mine}`}</div>

            <div onClick={
                () => {
                    const level = { col: 20, row: 20, mine: 60 };
                    setLevel(level);
                    setGame(new Game(level));
                    setStartTime(0);
                }}>Customize  </div>

            <div onClick={
                () => {
                    setGame(new Game(level));
                    setStartTime(0);
                }}>Reset</div>
        </>
    );

        
}

export default MineSwapper;