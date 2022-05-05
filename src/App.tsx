
import logo from './logo.svg';
import './App.css';

import MineSwapper from "./components/mineswapper/index"








document.documentElement.addEventListener('contextmenu', function (ev) {
    ev.preventDefault();
    return false;
}, false);



function App() {


    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </header>
            <MineSwapper/>

            
        </div>

    );
}

export default App;
