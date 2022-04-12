import React from 'react';
import logo from './logo.svg';
import './App.css';

const testState: number[][] = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
];

function onClick(i: number)
{
  console.log("Clicked" + i);
}

function createRow(col: number)
{
  const list: any[] = [];
  for (let i: number = 0; i < 10; ++i)
  {
    const block: any = <div className="Block" onClick={onClick.bind(null, i)}>{testState[col][i]}</div>;
    list.push(block);
  }
  return list;
}

function createColumn()
{
  const list: any[] = [];
  for (let i = 0; i < 10; ++i)
  {
    const div = <div className="Row"> {createRow(i)}</div>;
    list.push(div);
  }

  return list;
}

function createGame()
{
  return (
    <div className='Column'>
      {createColumn()}
    </div>
  )
}

function App()
{


  const list: any[] = [];

  for (let i = 0; i < 10; ++i)
  {
    const div = <div className="Row"></div>;
    for (let j = 0; j < 10; ++j)
    {
      const block: any = <div className="Block"></div>;
      React.createElement(block, div);
    }
    list.push(div);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      {createGame()}
    </div>
  );
}

export default App;
