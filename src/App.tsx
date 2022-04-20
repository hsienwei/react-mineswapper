import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

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


function getInitState(col: number, row:number)
{
  const initGridState: IBlockState[] = [];
  for(let i=0; i< col * row; ++i)
  {
    initGridState.push(new IBlockState(Math.round(Math.random()) === 1, 0));
  }
  return initGridState;
}

function App()
{
  const [col, setCol] = useState(5);
  const [row, setRow] = useState(5);
  const [gridState, setGridState] = useState(getInitState(5, 5));

  useEffect( () => {
    document.documentElement.style.setProperty('--col',`${col}`);
    document.documentElement.style.setProperty('--row',`${row}`);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      {createGame(col, row, gridState, 
        (i: number) => {
          gridState[i].state = 1;
          setGridState([...gridState]);
          console.log("Clicked" +(i) );
          console.log("Clicked" +gridState[i].state );
        })}

      <div onClick={ 
        () => {
          setRow(5)
          setCol(5)
          setGridState(getInitState(5, 5))
        }}>5*5</div>
      <div onClick={ 
        () => {
          setRow(10)
          setCol(10)
          setGridState(getInitState(10, 10))
        }}>10*10</div>

      <div onClick={ 
        () => {
          setGridState(getInitState(col, row))
        }}>Reset</div>
    </div>

  );
}

export default App;
