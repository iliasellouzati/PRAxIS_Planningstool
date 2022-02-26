/* eslint-disable eqeqeq */
import {
    CALENDAR_REQUEST,
    CALENDAR_SUCCES,
    CALENDAR_FAIL,
    ADD_SHIFT
} from '../constants/calendarConstants';

function currentCalendarReducer(state = {
    date: '',
    currentShift: '',
    calendar: []
}, action) {

    switch (action.type) {

        case CALENDAR_REQUEST:
            return {
                ...state, loading: true, datum: action.datum
            };

        case CALENDAR_SUCCES:
            return {
                ...state, loading: false,date: action.datum, calendar: action.payload
            };

        case CALENDAR_FAIL:
            return {
                loading: false, error: action.payload
            };

        case ADD_SHIFT:
            let hulpIndex1 = [...state.calendar].findIndex(o => o.employeeId == action.payload.id);
            let hulpIndex2 = [...state.calendar][hulpIndex1].calendar.findIndex(o => o.day === action.payload.day);
            let hulpCalendar = [...state.calendar];
            hulpCalendar[hulpIndex1].calendar[hulpIndex2].shift = action.payload.shift;
            return {
                ...state, calendar: hulpCalendar
            };


        default:
            return state;
    }
}

export {
    currentCalendarReducer
}