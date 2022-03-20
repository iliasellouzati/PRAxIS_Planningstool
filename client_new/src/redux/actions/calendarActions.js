import axios from "axios";
import moment from 'moment';
import {CALENDAR_REQUEST,CALENDAR_SUCCES,CALENDAR_FAIL,ADD_SHIFT} from '../constants/calendarConstants';
import { mapShiftsFromDbToCalendar } from "../../mappers/calendar/DatabaseToReduxMapper"; 

const getCalendarShifts = (month,year) => async (dispatch) => {

    try {
        dispatch({ type: CALENDAR_REQUEST, datum: `${month}-${year}` });

        const DBshifts= await axios.get( `http://localhost:3001/api/calendar/global/year/${year}/calendarmonth/${month}`);
        const employees = await  axios.get('http://127.0.0.1:3001/api/employee');
        const calendar = mapShiftsFromDbToCalendar(`${month}-${year}`,DBshifts.data,employees.data);

        dispatch({ type: CALENDAR_SUCCES, datum: `${month}-${year}`, payload: calendar })

    } catch (error) {
        dispatch({ type: CALENDAR_FAIL, payload: error.message })
    }
}

const getStoredCalender = (year, month, version) => async (dispatch)=>{


}


const addShift =(object) => async (dispatch)=>{

    dispatch({type: ADD_SHIFT, payload:object})

}
export {
    getCalendarShifts,
    getStoredCalender,
    addShift
}