import {
    CALENDAR_REQUEST,
    CALENDAR_SUCCES,
    CALENDAR_FAIL,
    ADD_SHIFT
} from '../constants/calendarConstants';

function currentCalendarReducer(state = { date: '', currentShift: '', calendar: [] }, action) {

    switch (action.type) {

        case CALENDAR_REQUEST:
            return { ...state, loading: true, datum: action.datum };

        case CALENDAR_SUCCES:
            return { ...state, loading: false, calendar: action.payload };

        case CALENDAR_FAIL:
            return { loading: false, error: action.payload };



        default:
            return state;
    }
}

export {currentCalendarReducer}