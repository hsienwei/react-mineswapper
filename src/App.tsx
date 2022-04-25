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
  constructor(
    public isMine: boolean,
    public state: number) {
  }
}

function getAppearClass(state: number)
{
  switch (state)
  {
    case 0:
      return "Block";
    default:
      return "Open";
  }
}

function createGameGrid(col: number, row: number, gridState: IBlockState[], call: Function)
{
  const list: any[] = [];
  for (let i = 0; i < row; ++i)
  {
    for (let j: number = 0; j < col; ++j)
    {
      const div = <div 
        className={getAppearClass(gridState[j + i * col].state)}
        onClick={call.bind(null, j + i * col)}
        key={`${i}_${j}`}>
        { gridState[j + i * col].state === 0 ? "" : gridState[j + i * col].isMine.toString()}
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

  const initGridState: IBlockState[] = [];
  for (let i = 0; i < totalGridCount; ++i)
  {
    initGridState.push(new IBlockState(mineIndex.includes(i), 0));
  }
  return initGridState;
}

const initGrid = getInitGrid(levelSetting[0])

function App()
{
  const [level, setLevel] = useState(levelSetting[0]);
  const [gridState, setGridState] = useState(initGrid);

  useEffect( () => {
    document.documentElement.style.setProperty('--col',`${level.col}`);
    document.documentElement.style.setProperty('--row',`${level.row}`);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      {createGame(level.col, level.row, gridState, 
        (i: number) => {
          gridState[i].state = 1;
          setGridState([...gridState]);
          console.log("Clicked" +(i) );
          console.log("Clicked" +gridState[i].state );
        })}

      <div onClick={ 
        () => {
          setLevel(levelSetting[0]);
          setGridState(getInitGrid(levelSetting[0]));
        }}>5*5</div>
      <div onClick={ 
        () => {
          setLevel(levelSetting[1]);
          setGridState(getInitGrid(levelSetting[1]));
        }}>10*10</div>

      <div onClick={ 
        () => {
          setLevel(levelSetting[2]);
          setGridState(getInitGrid(levelSetting[2]));
        }}>10*10</div>

      <div onClick={ 
        () => {
          setGridState(getInitGrid(level));
        }}>Reset</div>
    </div>

  );
}

export default App;
