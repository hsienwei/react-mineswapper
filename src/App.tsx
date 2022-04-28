import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

interface ILevel{
  col: number;
  row: number;
  mine: number
}

const levelSetting: ILevel[] =
[
  {col: 9, row: 9, mine: 10},
  {col: 16, row: 16, mine: 40},
  {col: 30, row: 16, mine: 99},
]


class IBlockState {
  public mineAroundCount: number = 0;

  constructor(
    public isMine: boolean,
    public state: number) {
  }
}

enum GridState{
  BLOCKED,
  OPENED,
  HOLD,
  BOMB
}

function getAppearClass(state: IBlockState)
{
  switch (state.state)
  {
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

function getMineCount(gridState: IBlockState[], index: number, col: number)
{
  const targetCol: number = index % col;
  const targetRow: number = Math.floor(index / col);

  let totalCount: number = 0;

  for (let i = targetRow - 1; i <= targetRow + 1; ++i)
  {
    if(i < 0)  continue;
    if(i >= Math.floor(gridState.length / col))  continue;
    for (let j: number = targetCol - 1; j <= targetCol + 1; ++j)
    {
      if(j < 0)  continue;
      if(j >= col)  continue;
      totalCount += gridState[j + i * col].isMine ? 1 : 0;
    }
  }

  return totalCount;
}

function getGridDisplay(gridState: IBlockState[], index: number)
{

  if (gridState[index].state === GridState.BOMB)
    return "💣";

  if (gridState[index].state === GridState.OPENED)
    return gridState[index].mineAroundCount === 0 ? "" : gridState[index].mineAroundCount;

  if (gridState[index].state === GridState.HOLD)
    return "🚩";

  return "";
}

function createGameGrid(col: number, row: number, gridState: IBlockState[], call: Function)
{
  const list: any[] = [];
  for (let i: number = 0; i < row; ++i)
  {
    for (let j: number = 0; j < col; ++j)
    {
      const div = <div
        className={getAppearClass(gridState[j + i * col])}
        onMouseUp={call.bind(null, j + i * col)}
        key={`${i}_${j}`}>
        {getGridDisplay(gridState, j + i * col)}
      </div>;
      list.push(div);
    }
  }

  return list;
}

function createGame(col: number, row: number, gridState: IBlockState[], call: Function)
{
  return (
    <div className='Grid'>
      {createGameGrid(col, row, gridState, call)}
    </div>
  )
}


function getInitGrid(level: ILevel)
{
  console.log("getInitGrid");
  // Check the count of mines is legal.
  const totalGridCount: number = level.col * level.row;
  if(level.mine >= totalGridCount)
  {
    level.mine = totalGridCount - 1;
  }

  // Generation mines random index.
  const mineIndex: number[] = [];
  for (let i = 0; i < level.mine; ++i)
  {
    let randomIdx: number = Math.floor( Math.random() * totalGridCount );
    while(mineIndex.includes(randomIdx))
    {
      randomIdx = (randomIdx + 1) % totalGridCount;
    }
    mineIndex.push(randomIdx);
  }

  // Create block state.
  const initGridState: IBlockState[] = [];
  for (let i = 0; i < totalGridCount; ++i)
  {
    initGridState.push(new IBlockState(mineIndex.includes(i), 0));
  }

  // Calculate around mine count.
  for (let i = 0; i < totalGridCount; ++i)
  {
    initGridState[i].mineAroundCount = getMineCount(initGridState, i, level.col)
  }
  return initGridState;
}

function open(index:number, gridState: IBlockState[], col: number)
{
  const indexList: number[] = [index];
  let checkIndex: number = 0;

  while (checkIndex < indexList.length)
  {
    const currentIndex = indexList[checkIndex];
    if (gridState[currentIndex].mineAroundCount !== 0)
      gridState[currentIndex].state = GridState.OPENED;
    else
    {
      gridState[currentIndex].state = GridState.OPENED;
      const targetCol: number = currentIndex % col;
      const targetRow: number = Math.floor(currentIndex / col);

      for (let i = targetRow - 1; i <= targetRow + 1; ++i)
      {
        if (i < 0) continue;
        if (i >= Math.floor(gridState.length / col)) continue;
        for (let j: number = targetCol - 1; j <= targetCol + 1; ++j)
        {
          if (j < 0) continue;
          if (j >= col) continue;
          if(!indexList.includes(j + i * col))
            indexList.push(j + i * col);
        }
      }
    }
    checkIndex++;
  }
}

const initGrid = getInitGrid(levelSetting[0])

document.documentElement.addEventListener('contextmenu', function (ev)
{
  ev.preventDefault();
  return false;
}, false);

function App()
{
  const [level, setLevel] = useState(levelSetting[0]);
  const [gridState, setGridState] = useState(initGrid);

  useEffect( () => {
    document.documentElement.style.setProperty('--col',`${level.col}`);
    document.documentElement.style.setProperty('--row',`${level.row}`);
  }, [level]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      {createGame(level.col, level.row, gridState, 
        (i: number, ev: MouseEvent) =>
        {
          if (ev.button === 0)
          {
            if (gridState[i].state !== GridState.HOLD)
            {
              if (gridState[i].isMine) 
                gridState[i].state = GridState.BOMB;
              else
                open(i, gridState, level.col);
            }
          }
          else if (ev.button === 2)
          {
            if (gridState[i].state === GridState.HOLD)
              gridState[i].state = GridState.BLOCKED;
            else if (gridState[i].state === GridState.BLOCKED)
              gridState[i].state = GridState.HOLD;
          }
          setGridState([...gridState]);
          console.log("Clicked" + (i));
          console.log("Clicked" + gridState[i].state);
        })}

      <div onClick={ 
        () => {
          setLevel(levelSetting[0]);
          setGridState(getInitGrid(levelSetting[0]));
        }}>{`${levelSetting[0].col} * ${levelSetting[0].row}  mine: ${levelSetting[0].mine}` }</div>
      <div onClick={ 
        () => {
          setLevel(levelSetting[1]);
          setGridState(getInitGrid(levelSetting[1]));
        }}>{`${levelSetting[1].col} * ${levelSetting[1].row}  mine: ${levelSetting[1].mine}` }</div>

      <div onClick={ 
        () => {
          setLevel(levelSetting[2]);
          setGridState(getInitGrid(levelSetting[2]));
        }}>{`${levelSetting[2].col} * ${levelSetting[2].row}  mine: ${levelSetting[2].mine}` }</div>

      <div onClick={ 
        () => {
          setGridState(getInitGrid(level));
        }}>Reset</div>
    </div>

  );
}

export default App;
