import { BlockState, Game, GridState, ILevel } from "../../api/Game";




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
        <div className='InnerFrame'>
            <div className='Grid'>
                {createGameGrid(col, row, gridState, call)}
            </div>
        </div>
    )
}



export default function MainGame(props: { game: Game; onMouseEvent: Function})
{
    return (
        createGame(props.game.level.col, props.game.level.row, props.game.gridState, props.onMouseEvent)
    )
}