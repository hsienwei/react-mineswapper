

import { useEffect, useState } from 'react';

import { Game,  levelSetting, GridState} from '../../api/Game'

import Countdown from "./Countdown"
import ResetButton from "./ResetButton"
import MainGame from "./MainGame"
import MenuButton from '../menu/MenuButton';

let clickCount = 0;

function MineSwapper() {

    //const [startTime, setStartTime] = useState(0);
    const [game, setGame] = useState(Game.initGame);

    useEffect(() => {
        document.documentElement.style.setProperty('--col', `${game.level.col}`);
        document.documentElement.style.setProperty('--row', `${game.level.row}`);
    }, [game.level]);

    

    return (
        <>
            <div className='OuterFrame'>
                <div className='InnerFrame InfoFrame'>
                    <div className='Mine'>{(game.totalMineCount - game.mineCount).toString().padStart(3, "0")}</div>
                    <ResetButton 
                        onClick={() => {
                            setGame(new Game(game.level));
                        }}
                        gameState={game.gameState}></ResetButton>
                    <Countdown startTime={game.startTime} gameState={game.gameState}></Countdown>
                </div >
                <MainGame 
                    game={game}
                    onMouseEvent={(i: number, ev: MouseEvent) => {

                        if (clickCount === 2) {
                            console.log("clear");
                            Game.openRange(i, game);
                        }
                        if (ev.button === 0) {
                            if (clickCount === 1) {
                                Game.mouseLeftClick(i, game);
                            }
                        }
                        else if (ev.button === 2) {
                            if (clickCount === 1) {
                                Game.mouseRightClick(i, game);
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
            
            <MenuButton
                level={levelSetting.low}
                onClick={
                    () => {
                        setGame(new Game(levelSetting.low));
                    }}></MenuButton>
            <MenuButton
                level={levelSetting.mid}
                onClick={
                    () => {
                        setGame(new Game(levelSetting.mid));
                    }}></MenuButton>

            <MenuButton
                level={levelSetting.high}
                onClick={
                    () => {
                        setGame(new Game(levelSetting.high));
                    }}></MenuButton>

            <MenuButton
                label="Customize"
                level={{ col: 20, row: 20, mine: 60 }}
                onClick={
                    () => {
                        const level = { col: 20, row: 20, mine: 60 };
                        setGame(new Game(level));
                    }}></MenuButton>

            <MenuButton
                label="Reset"
                level={game.level}
                onClick={
                    () => {
                        setGame(new Game(game.level));
                    }}></MenuButton>
        </>
    );

        
}

export default MineSwapper;