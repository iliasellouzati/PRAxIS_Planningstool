import axios from "axios";

import { 
    CALENDARS_OVERVIEW_LIST_FAIL, CALENDARS_OVERVIEW_LIST_REQUEST, CALENDARS_OVERVIEW_LIST_SUCCES, 
    CALENDAR_SHIFTS_REQUEST, CALENDAR_SHIFTS_SUCCES, CALENDAR_SHIFTS_FAIL,
    CHANGE_CALENDARSHIFT_TYPE,
    ADD_SHIFT,
    SAVE_CALENDAR_SHIFTS_FAIL,SAVE_CALENDAR_SHIFTS_REQUEST,SAVE_CALENDAR_SHIFTS_SUCCES
} from "../constants/shiftConstants";


const getCalendarShifts= (datum) => async (dispatch) => {
    try {
        dispatch({type: CALENDAR_SHIFTS_REQUEST, datum: datum});
        const {data} = await axios.get("/api/planning/"+datum);
        dispatch({type:CALENDAR_SHIFTS_SUCCES, datum: datum, payload: data })
        
    } catch (error) {
        dispatch({type:CALENDAR_SHIFTS_FAIL, payload:error.message})
    }


}

const getCalendarOverview=(year) => async (dispatch) => {
    try{
        dispatch({type:CALENDARS_OVERVIEW_LIST_REQUEST});
        const {data}=await axios.get("/api/overzicht/"+year);
        dispatch({type:CALENDARS_OVERVIEW_LIST_SUCCES, payload:data})

    }catch(error){
        dispatch({type: CALENDARS_OVERVIEW_LIST_FAIL, payload: error.message})
    }
}

const changeCalenderShiftType= shiftNaam => async (dispatch) => {
    dispatch({type: CHANGE_CALENDARSHIFT_TYPE, payload: shiftNaam});
}

const addShift =(object) => async (dispatch)=>{

    dispatch({type: ADD_SHIFT, payload:object})

}

const saveCalenderShifts = (idPlanning,calendar) => async (dispatch)=> {
    try {
        dispatch({type: SAVE_CALENDAR_SHIFTS_REQUEST});
        const {data} = await axios.post("/api/planning/"+ idPlanning, calendar);
        dispatch({type:SAVE_CALENDAR_SHIFTS_SUCCES , payload: data})
         
    } catch (error) {
        dispatch({type:SAVE_CALENDAR_SHIFTS_FAIL, payload:error.message})
    }



}


export {getCalendarOverview,getCalendarShifts,changeCalenderShiftType,addShift,saveCalenderShifts};