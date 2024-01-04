import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const red =  '#FF0000';
const green = '#00FF00';

function Timer(){
    return (
        <div style={{ width: 200, height: 200 }}>
            <CircularProgressbar value={60} text={'60%'} styles={buildStyles({
                textColor:'#fff',
                pathColor: red,
                tailColor: 'rgba(255,255,255,.2)',
            })}/>
            <div>
            
            </div>
        </div>
    );
}

export default Timer;