

import { useState } from 'react';

import { Game,  levelSetting, MineGame} from '../../api/Game'

import Countdown from "./Countdown"
import ResetButton from "./ResetButton"
import MainGame from "./MainGame"
import MenuButton from '../menu/MenuButton';
import DigitalBoard from './DigitalBoard';



function MineSwapper() {

    const [game, setGame] = useState(Game.initGame);

    return (
        
        <MineGame.Provider value={{ value: game, setter: (game: Game) => {setGame(game)}}}>
            <div className='MinesSwapper OuterFrame'>
                <div className='InnerFrame InfoFrame'>
                    <DigitalBoard val={(game.level.mine - game.mineCount)}/>
                    <ResetButton 
                        onClick={() => {
                            setGame(new Game(game.level));
                        }}
                        gameState={game.gameState}></ResetButton>
                    <Countdown startTime={game.startTime} gameState={game.gameState}></Countdown>
                </div >
                <MainGame />
            </div>
            
            <MenuButton level={levelSetting.low}></MenuButton>
            <MenuButton level={levelSetting.mid}></MenuButton>
            <MenuButton level={levelSetting.high}></MenuButton>
            <MenuButton label="Customize" level={{ col: 20, row: 20, mine: 60 }}></MenuButton>
        </MineGame.Provider>
    );

        
}

export default MineSwapper;