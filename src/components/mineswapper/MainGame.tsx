import { useContext, useEffect } from "react";
import { BlockState, Game, GridState, MineGame } from "../../api/Game";




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
    {
        if(gridState[index].isMine)
            return "💣";
        return gridState[index].mineAroundCount === 0 ? "" : gridState[index].mineAroundCount;
    }

    if (gridState[index].state === GridState.HOLD)
        return "🚩";

    return "";
}




function createGameGrid(col: number, row: number, gridState: BlockState[], call: Function) {
    const list: any[] = [];
    let index: number;
    for (let i: number = 0; i < row; ++i) {
        for (let j: number = 0; j < col; ++j) {
            index = j + i * col;
            const div = <div
                className={getAppearClass(gridState[index])}
                onMouseDown={call.bind(null, index)}
                onMouseUp={call.bind(null, index)}
                key={`${i}_${j}`}>
                {getGridDisplay(gridState, index)}
            </div>;
            list.push(div);
        }
    }

    return list;
}


function createGame(col: number, row: number, gridState: BlockState[], call: Function) {
    return (
        <div className='InnerFrame'>
            <div className='Grid'>
                {createGameGrid(col, row, gridState, call)}
            </div>
        </div>
    )
}

let clickCount = 0;

export default function MainGame()
{
    const game = useContext(MineGame);

    useEffect(() => {
        document.documentElement.style.setProperty('--col', `${game.value.level.col}`);
        document.documentElement.style.setProperty('--row', `${game.value.level.row}`);
    });
    
    return (
        <MineGame.Consumer>
            {({ value, setter }) => (
                createGame(value.level.col, value.level.row, value.gridState, (i: number, ev: MouseEvent) => {

                    if (clickCount === 2) {
                        console.log("clear");
                        Game.openRange(i, value);
                    }
                    if (ev.button === 0) {
                        if (clickCount === 1) {
                            Game.mouseLeftClick(i, value);
                        }
                    }
                    else if (ev.button === 2) {
                        if (clickCount === 1) {
                            Game.mouseRightClick(i, value);
                        }

                    }

                    if (ev.type === "mousedown")
                        clickCount++;
                    else if (ev.type === "mouseup")
                        clickCount--;

                    setter({ ...value });
                    console.log("Clicked" + (i));
                    console.log("Clicked" + value.gridState[i].state);
                })
            )}
        </MineGame.Consumer>
    )
}