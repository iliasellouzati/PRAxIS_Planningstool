import ShiftType from '../../models/shiftType.js';
import moment from 'moment';

const SHIFTTYPESDUMMY= [

     ShiftType.StandaardShift('0618',"06:00","18:00","#3399ff"),
    ShiftType.StandaardShift('0719',"07:00","19:00","#ffcc66"),
    ShiftType.StandaardShift('1806',"18:00","06:00","#66ff33"),
     ShiftType.StandaardShift('1907',"19:00","07:00","#ffff00")
]

export default SHIFTTYPESDUMMY;