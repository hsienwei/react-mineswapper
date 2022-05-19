import { createContext } from "react";

export interface ILevel {
    col: number;
    row: number;
    mine: number
}

export const levelSetting: {[key: string]: ILevel} =
{
    "low" : { col: 9, row: 9, mine: 10 },
    "mid" : { col: 16, row: 16, mine: 40 },
    "high" :{ col: 30, row: 16, mine: 99 }
}


export class BlockState {
    public mineAroundCount: number = 0;

    constructor(
        public isMine: boolean,
        public state: number) {
    }
}

export enum GameState
{
    idle,
    running,
    dead,
    win
}


export enum GridState {
    BLOCKED,
    OPENED,
    HOLD,
    BOMB
}

export class Game {
    public openCount: number = 0;
    public gridState: BlockState[];
    public level: ILevel;
    public gameState: GameState = GameState.idle;
    public mineCount: number = 0;
    public totalMineCount: number = 0;
    public startTime: number = 0;

    public static initGame = new Game(levelSetting.low);

    constructor(level: ILevel)
    {
        this.level = level;
        this.totalMineCount = level.mine;
        this.gridState =  Game.getInitGrid(level);
        this.startTime = 0;
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
                game.gridState[i].mineAroundCount = Game.getMineCount(game.gridState, i, game.level.col)
            }
        }
    }

    public static mouseLeftClick(index: number, game: Game): void
    {
        if(game.startTime === 0)
            game.startTime = Date.now();

        if(game.gameState === GameState.win || game.gameState === GameState.dead)
            return;

        if (game.gridState[index].state !== GridState.HOLD) {
            if (game.openCount === 0)
                Game.avoidFirstClickDead(index, game);
            Game.openSingle(index, game);
        }
    }

    public static mouseRightClick(index: number, game: Game): void
    {
        if(game.startTime === 0)
            game.startTime = Date.now();

        if (game.gameState === GameState.win || game.gameState === GameState.dead)
            return;

        if (game.gridState[index].state === GridState.HOLD) {
            game.gridState[index].state = GridState.BLOCKED;
            game.mineCount--;
        }
        else if (game.gridState[index].state === GridState.BLOCKED) {
            game.gridState[index].state = GridState.HOLD;
            game.mineCount++;
        }
    }

    public static openRange(index: number, game: Game) {

        if(game.startTime === 0)
            game.startTime = Date.now();

        if( game.gridState[index].state !== GridState.OPENED) 
            return;

        const targetCol: number = index % game.level.col;
        const targetRow: number = Math.floor(index / game.level.col);
        let flagCount: number = 0;

        const mineCount: number = game.gridState[index].mineAroundCount;

        const openIndexList: number[] = [];

        for (let i = targetRow - 1; i <= targetRow + 1; ++i) {
            if (i < 0) continue;
            if (i >= Math.floor(game.gridState.length / game.level.col)) continue;
            for (let j: number = targetCol - 1; j <= targetCol + 1; ++j) {
                if (j < 0) continue;
                if (j >= game.level.col) continue;
                if(game.gridState[j + i * game.level.col].state === GridState.BLOCKED)
                {
                    if (!openIndexList.includes(j + i * game.level.col))
                        openIndexList.push(j + i * game.level.col);
                }
                if(game.gridState[j + i * game.level.col].state === GridState.HOLD)
                {
                    flagCount++;
                }
            }
        }

        if(mineCount === flagCount)
        {
            console.log(openIndexList);
            Game.open(openIndexList, game);
        }
    }

    public static openSingle(index: number, game: Game) {

        if (game.gridState[index].isMine)
        {
            game.gridState[index].state = GridState.BOMB;
            game.gameState = GameState.dead;
            return;
        }

        if( game.gridState[index].state === GridState.BLOCKED)
            Game.open([index], game);
    }
                            
    public static open(indexList: number[], game: Game) {

        if(game.gameState === GameState.win)
            return;

        let checkIndex: number = 0;
    
        while (checkIndex < indexList.length) {
            const currentIndex = indexList[checkIndex];
            if (game.gridState[currentIndex].isMine )
            {
                game.gridState[currentIndex].state = GridState.BOMB;
                game.gameState = GameState.dead;
            }

            else if (game.gridState[currentIndex].mineAroundCount !== 0)
                game.gridState[currentIndex].state = GridState.OPENED;
            else {
                game.gridState[currentIndex].state = GridState.OPENED;
                const targetCol: number = currentIndex % game.level.col;
                const targetRow: number = Math.floor(currentIndex / game.level.col);
    
                for (let i = targetRow - 1; i <= targetRow + 1; ++i) {
                    if (i < 0) continue;
                    if (i >= Math.floor(game.gridState.length / game.level.col)) continue;
                    for (let j: number = targetCol - 1; j <= targetCol + 1; ++j) {
                        if (j < 0) continue;
                        if (j >= game.level.col) continue;
                        if (game.gridState[j + i * game.level.col].state === GridState.BLOCKED) {
                            if (!indexList.includes(j + i * game.level.col))
                                indexList.push(j + i * game.level.col);
                        }
                    }
                }
            }
            checkIndex++;
            game.openCount++;
        }

        if(game.openCount === (game.level.col * game.level.row - game.level.mine))
        {
            game.gameState = GameState.win;
        }
    }

}

export const MineGame = createContext( {value: Game.initGame, setter: (game: Game) => {}} );

