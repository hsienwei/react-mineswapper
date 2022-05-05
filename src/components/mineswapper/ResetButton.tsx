
import { GameState} from '../../api/Game'

function getResetIcon(state: GameState)
{
    switch(state) {
        case GameState.dead:
            return "😫";
        case GameState.win:
            return "😎";
        default:
            return "🙂";
    }
}

export default function ResetButton(props: { onClick: ()=>void;  gameState: GameState  })
{

    return (
        <div className='Face' onClick={props.onClick}>{getResetIcon(props.gameState)}</div>
    )
}