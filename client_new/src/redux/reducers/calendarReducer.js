/* eslint-disable eqeqeq */
import {
    CALENDAR_REQUEST,
    CALENDAR_SUCCES,
    CALENDAR_FAIL,
    ADD_SHIFT,
    CHANGE_CALENDARSHIFT_TYPE,
    SET_SAVED_CALENDAR
} from '../constants/calendarConstants';

function currentCalendarReducer(state = {
    date: '',
    currentShift: '',
    calendar: []
}, action) {

    switch (action.type) {

        case CALENDAR_REQUEST:
            return {
                ...state, loading: true, date: action.datum
            };

        case CALENDAR_SUCCES:
            return {
                ...state, loading: false, date: action.datum, calendar: action.payload
            };

        case CALENDAR_FAIL:
            return {
                loading: false, error: action.payload
            };
        case SET_SAVED_CALENDAR:
            return{
                ...state, date: action.datum, calendar: action.payload
            };

        case ADD_SHIFT:
            let hulpIndex1 = [...state.calendar].findIndex(o => o.employeeId == action.payload.id);
            let hulpIndex2 = [...state.calendar][hulpIndex1].calendar.findIndex(o => o.day === action.payload.day);
            let hulpCalendar = [...state.calendar];
            hulpCalendar[hulpIndex1].calendar[hulpIndex2].shift = action.payload.shift;
            hulpCalendar[hulpIndex1].calendar[hulpIndex2].startmoment = action.payload.startmoment;
            hulpCalendar[hulpIndex1].calendar[hulpIndex2].endmoment = action.payload.endmoment;
            return {
                ...state, calendar: hulpCalendar
            };
        case CHANGE_CALENDARSHIFT_TYPE:
            return {
                ...state, currentShift: action.payload
            };

        default:
            return state;
    }
}

export {
    currentCalendarReducer
}