import axios from "axios";
import moment from 'moment';
import {CALENDAR_REQUEST,CALENDAR_SUCCES,CALENDAR_FAIL,ADD_SHIFT} from '../constants/calendarConstants';
import { mapShiftsFromDbToCalendar } from "../../mappers/calendar/DatabaseToReduxMapper"; 

const getCalendarShifts = (datum) => async (dispatch) => {

    try {
        dispatch({ type: CALENDAR_REQUEST, datum: datum });

        const DBshifts= await axios.get( `http://localhost:3001/api/calendar/global/year/${moment(datum,"MM-YYYY").format("YYYY")}/calendarmonth/${moment(datum,"MM-YYYY").format("MM")}`);
        const employees = await  axios.get('http://127.0.0.1:3001/api/employee');
        const calendar = mapShiftsFromDbToCalendar(datum,DBshifts.data,employees.data);

        dispatch({ type: CALENDAR_SUCCES, datum: datum, payload: calendar })

    } catch (error) {
        dispatch({ type: CALENDAR_FAIL, payload: error.message })
    }
}


const addShift =(object) => async (dispatch)=>{

    dispatch({type: ADD_SHIFT, payload:object})

}
export {
    getCalendarShifts,
    addShift
}