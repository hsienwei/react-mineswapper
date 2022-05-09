import { ILevel } from "../../api/Game";

export default function MenuButton(props: { onClick: ()=>void;  label?: string; level: ILevel  })
{

    return (
        <div onClick={props.onClick
            }>{props.label ?? `${props.level.col} * ${props.level.row}  mine: ${props.level.mine}` }</div>
    )
}