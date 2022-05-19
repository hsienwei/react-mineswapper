import { Game, ILevel, MineGame } from "../../api/Game";

export default function MenuButton(props: {  label?: string; level: ILevel  })
{
    return (
        <MineGame.Consumer>
            {({ value, setter }) => (
                <div onClick={() => {
                    setter(new Game(props.level));
                }
                }>{props.label ?? `${props.level.col} * ${props.level.row}  mine: ${props.level.mine}`}</div>
            )}
        </MineGame.Consumer>
    )
}