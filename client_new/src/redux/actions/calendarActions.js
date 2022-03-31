import axios from "axios";
import moment from 'moment';
import {CALENDAR_REQUEST,CALENDAR_SUCCES,CALENDAR_FAIL,ADD_SHIFT,CHANGE_CALENDARSHIFT_TYPE, SET_SAVED_CALENDAR} from '../constants/calendarConstants';
import { mapShiftsFromDbToCalendar } from "../../mappers/calendar/DatabaseToReduxMapper"; 

const getCalendarShifts = (datum) => async (dispatch) => {

    try {
        dispatch({ type: CALENDAR_REQUEST, datum: datum });

        const DBshifts= await axios.get( `http://localhost:3001/api/calendar/global/year/${moment(datum,"MM-YYYY").format("YYYY")}/calendarmonth/${moment(datum,"MM-YYYY").format("MM")}`);
        const employees = await  axios.get(`http://127.0.0.1:3001/api/employee/calendaremployees/${moment(datum,"MM-YYYY").format("YYYY")}/${moment(datum,"MM-YYYY").format("MM")}`);
        const calendar = mapShiftsFromDbToCalendar(datum,DBshifts.data,employees.data);

        dispatch({ type: CALENDAR_SUCCES, datum: datum, payload: calendar })

    } catch (error) {
        dispatch({ type: CALENDAR_FAIL, payload: error.message })
    }
}

const setSavedCalendar =(calendar,date)=>async (dispatch)=>{

        dispatch({type:SET_SAVED_CALENDAR, datum:date , payload:calendar});
}




const addShift =(object) => async (dispatch)=>{

    dispatch({type: ADD_SHIFT, payload:object})

}

const changeCalenderShiftType= shiftName => async (dispatch) => {
    dispatch({type: CHANGE_CALENDARSHIFT_TYPE, payload: shiftName});
}
export {
    getCalendarShifts,
    addShift,
    changeCalenderShiftType,
    setSavedCalendar
}