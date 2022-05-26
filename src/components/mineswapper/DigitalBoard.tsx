
export default function DigitalBoard(props: {val: number})
{

    return (
        <div className='DigitalBack'>
            <div className='DigitalInner'>{props.val.toString().padStart(3, "0")}</div>
        </div>
    );
}