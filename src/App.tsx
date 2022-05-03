import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

interface ILevel {
    col: number;
    row: number;
    mine: number
}

const levelSetting: ILevel[] =
    [
        { col: 9, row: 9, mine: 10 },
        { col: 16, row: 16, mine: 40 },
        { col: 30, row: 16, mine: 99 },
    ]


class BlockState {
    public mineAroundCount: number = 0;

    constructor(
        public isMine: boolean,
        public state: number) {
    }
}

enum GameState
{
    idle,
    runnging,
    dead,
    win
}

class Game {
    public openCount: number = 0;
    public gridState: BlockState[];
    public col: number;
    public gameState: GameState = GameState.idle;

    public static initGame = new Game(levelSetting[0]);

    constructor(level: ILevel)
    {
        this.col = level.col;
        this.gridState =  Game.getInitGrid(level);
    }

    private static getMineCount(gridState: BlockState[], index: number, col: number) {
        const targetCol: number = index % col;
        const targetRow: number = Math.floor(index / col);
    
        let totalCount: number = 0;
    
        for (let i = targetRow - 1; i <= targetRow + 1; ++i) {
            if (i < 0) continue;
            if (i >= Math.floor(gridState.length / col)) continue;
            for (let j: number = targetCol - 1; j <= targetCol + 1; ++j) {
                if (j < 0) continue;
                if (j >= col) continue;
                totalCount += gridState[j + i * col].isMine ? 1 : 0;
            }
        }
    
        return totalCount;
    }

    private static getInitGrid(level: ILevel): BlockState[] {
        // Check the count of mines is legal.
        const totalGridCount: number = level.col * level.row;
        if (level.mine >= totalGridCount) {
            level.mine = totalGridCount - 1;
        }
    
        // Generation mines random index.
        const mineIndex: number[] = [];
        for (let i = 0; i < level.mine; ++i) {
            let randomIdx: number = Math.floor(Math.random() * totalGridCount);
            while (mineIndex.includes(randomIdx)) {
                randomIdx = (randomIdx + 1) % totalGridCount;
            }
            mineIndex.push(randomIdx);
        }
    
        // Create block state.
        const initGridState: BlockState[] = [];
        for (let i = 0; i < totalGridCount; ++i) {
            initGridState.push(new BlockState(mineIndex.includes(i), 0));
        }
    
        // Calculate around mine count.
        for (let i = 0; i < totalGridCount; ++i) {
            initGridState[i].mineAroundCount = Game.getMineCount(initGridState, i, level.col)
        }
        return initGridState;
    }

    public static avoidFirstClickDead(index: number, game: Game)
    {
        if(game.gridState[index].isMine)
        {
            game.gridState[index].isMine = false;
            
            let targetIndex: number = index;
            while(true) {
                targetIndex = (targetIndex + 1) % game.gridState.length;
                if(!game.gridState[targetIndex].isMine)
                {
                    game.gridState[targetIndex].isMine = true;
                    break;
                }
            }

            for (let i = 0; i < game.gridState.length; ++i) {
                game.gridState[i].mineAroundCount = Game.getMineCount(game.gridState, i, game.col)
            }
        }
    }

    public static openRange(index: number, game: Game, col: number) {

        const targetCol: number = index % col;
        const targetRow: number = Math.floor(index / col);

        const openIndexList: number[] = [];

        for (let i = targetRow - 1; i <= targetRow + 1; ++i) {
            if (i < 0) continue;
            if (i >= Math.floor(game.gridState.length / col)) continue;
            for (let j: number = targetCol - 1; j <= targetCol + 1; ++j) {
                if (j < 0) continue;
                if (j >= col) continue;
                if(game.gridState[j + i * col].state === GridState.BLOCKED)
                {
                    if (!openIndexList.includes(j + i * col))
                        openIndexList.push(j + i * col);
                }
            }
        }
        console.log(openIndexList);
        Game.open(openIndexList, game, col);
    }

    public static openSingle(index: number, game: Game, col: number) {

        if (game.gridState[index].isMine)
        {
            game.gridState[index].state = GridState.BOMB;
            return;
        }

        if( game.gridState[index].state === GridState.BLOCKED)
            Game.open([index], game, col);
    }
                            
    public static open(indexList: number[], game: Game, col: number) {
        let checkIndex: number = 0;
    
        while (checkIndex < indexList.length) {
            const currentIndex = indexList[checkIndex];
            if (game.gridState[currentIndex].isMine )
            {
                game.gridState[currentIndex].state = GridState.BOMB;
            }

            else if (game.gridState[currentIndex].mineAroundCount !== 0)
                game.gridState[currentIndex].state = GridState.OPENED;
            else {
                game.gridState[currentIndex].state = GridState.OPENED;
                const targetCol: number = currentIndex % col;
                const targetRow: number = Math.floor(currentIndex / col);
    
                for (let i = targetRow - 1; i <= targetRow + 1; ++i) {
                    if (i < 0) continue;
                    if (i >= Math.floor(game.gridState.length / col)) continue;
                    for (let j: number = targetCol - 1; j <= targetCol + 1; ++j) {
                        if (j < 0) continue;
                        if (j >= col) continue;
                        if (game.gridState[j + i * col].state === GridState.BLOCKED) {
                            if (!indexList.includes(j + i * col))
                                indexList.push(j + i * col);
                        }
                    }
                }
            }
            checkIndex++;
            game.openCount++;
        }
    }

}

enum GridState {
    BLOCKED,
    OPENED,
    HOLD,
    BOMB
}

function getAppearClass(state: BlockState) {
    switch (state.state) {
        case GridState.BLOCKED:
            return "Block";
        case GridState.OPENED:
            return `Open Count${state.mineAroundCount}`;
        case GridState.HOLD:
            return "Hold";
        case GridState.BOMB:
            return "Dead";
        default:
            return "Open";
    }
}

function getGridDisplay(gridState: BlockState[], index: number) {

    if (gridState[index].state === GridState.BOMB)
        return "💣";

    if (gridState[index].state === GridState.OPENED)
        return gridState[index].mineAroundCount === 0 ? "" : gridState[index].mineAroundCount;

    if (gridState[index].state === GridState.HOLD)
        return "🚩";

    return "";
}

function createGameGrid(col: number, row: number, gridState: BlockState[], call: Function) {
    const list: any[] = [];
    for (let i: number = 0; i < row; ++i) {
        for (let j: number = 0; j < col; ++j) {
            const div = <div
                className={getAppearClass(gridState[j + i * col])}
                onMouseDown={call.bind(null, j + i * col)}
                onMouseUp={call.bind(null, j + i * col)}
                key={`${i}_${j}`}>
                {getGridDisplay(gridState, j + i * col)}
            </div>;
            list.push(div);
        }
    }

    return list;
}

function createGame(col: number, row: number, gridState: BlockState[], call: Function) {
    return (
        <div className='Grid'>
            {createGameGrid(col, row, gridState, call)}
        </div>
    )
}







document.documentElement.addEventListener('contextmenu', function (ev) {
    ev.preventDefault();
    return false;
}, false);

let clickCount = 0;
let clickTimer: any;

function App() {
    const [level, setLevel] = useState(levelSetting[0]);
    const [startTime, setStartTime] = useState(0);
    const [passTime, setPassTime] = useState(0);
    const [game, setGame] = useState(Game.initGame);

    useEffect(() => {
        document.documentElement.style.setProperty('--col', `${level.col}`);
        document.documentElement.style.setProperty('--row', `${level.row}`);
    }, [level]);

    useEffect(() => {
        if(startTime !== 0)
        {
            setPassTime(0);
            clickTimer = setInterval( () => {
                setPassTime( Math.floor(( Date.now() - startTime) / 1000));
            }, 1000);
        }
        else
        {
            clearInterval(clickTimer);
            setPassTime(0);
        }
    }, [startTime]);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </header>
            <div className='OuterFrame'>
            <div className='InnerFrame InfoFrame'>
                <div className='Mine'>000</div> 
                <div className='Face' onClick={ () => {
                    setGame(new Game(level));
                    setStartTime(0);
                }}>🙂</div> 
                <div className='Time'>{passTime.toString().padStart(3, "0") }</div> 
            </div >
            <div className='InnerFrame'>
            {createGame(level.col, level.row, game.gridState,
                (i: number, ev: MouseEvent) => {
                    console.log(ev)
                    if(startTime === 0)
                    {
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
                            if (game.gridState[i].state === GridState.HOLD)
                                game.gridState[i].state = GridState.BLOCKED;
                            else if (game.gridState[i].state === GridState.BLOCKED)
                                game.gridState[i].state = GridState.HOLD;
                        }

                    }

                    if(ev.type === "mousedown")
                        clickCount++;
                    else if(ev.type === "mouseup")
                        clickCount--;

                    setGame({...game});
                    console.log("Clicked" + (i));
                    console.log("Clicked" + game.gridState[i].state);
                })}

            </div></div>

            <div onClick={
                () => {
                    setLevel(levelSetting[0]);
                    setGame(new Game(levelSetting[0]));
                    setStartTime(0);
                }}>{`${levelSetting[0].col} * ${levelSetting[0].row}  mine: ${levelSetting[0].mine}`}</div>
            <div onClick={
                () => {
                    setLevel(levelSetting[1]);
                    setGame(new Game(levelSetting[1]));
                    setStartTime(0);
                }}>{`${levelSetting[1].col} * ${levelSetting[1].row}  mine: ${levelSetting[1].mine}`}</div>

            <div onClick={
                () => {
                    setLevel(levelSetting[2]);
                    setGame(new Game(levelSetting[2]));
                    setStartTime(0);
                }}>{`${levelSetting[2].col} * ${levelSetting[2].row}  mine: ${levelSetting[2].mine}`}</div>

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
        </div>

    );
}

export default App;
