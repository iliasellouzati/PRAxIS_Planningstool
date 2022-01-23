import {
    CALENDAR_SHIFTS_SUCCES, CALENDAR_SHIFTS_FAIL, CALENDAR_SHIFTS_REQUEST,
    CALENDARS_OVERVIEW_LIST_FAIL, CALENDARS_OVERVIEW_LIST_REQUEST, CALENDARS_OVERVIEW_LIST_SUCCES,
    CHANGE_CALENDARSHIFT_TYPE,
    ADD_SHIFT,
    SAVE_CALENDAR_SHIFTS_FAIL, SAVE_CALENDAR_SHIFTS_REQUEST, SAVE_CALENDAR_SHIFTS_SUCCES
} from "../constants/shiftConstants";


function currentCalendarReducer(state = { datum: '', difference: { new: '', updated: '', same: '', deleted: '' }, currentShift: '', calendar: [] }, action) {

    switch (action.type) {
        case CALENDAR_SHIFTS_REQUEST:
            return { ...state, loading: true, datum: action.datum };
        case SAVE_CALENDAR_SHIFTS_REQUEST:
            return { ...state, loading: true , difference:{ new: '', updated: '', same: '', deleted: '' }}
        case CALENDAR_SHIFTS_SUCCES:
            return { ...state, loading: false, calendar: action.payload };
        case SAVE_CALENDAR_SHIFTS_SUCCES:
            return {...state, loading:false, difference:{ new: action.payload.new, updated: action.payload.updated, same: action.payload.same, deleted: action.payload.deleted }}
        case CALENDAR_SHIFTS_FAIL:
        case SAVE_CALENDAR_SHIFTS_FAIL:
            return { loading: false, error: action.payload };
        case CHANGE_CALENDARSHIFT_TYPE:
            return { ...state, currentShift: action.payload };

        case ADD_SHIFT:
            let hulpIndex1 = [...state.calendar].findIndex(o => o.employeeId == action.payload.id);
            let hulpIndex2 = [...state.calendar][hulpIndex1].employeeCalendar.findIndex(o => o.day === action.payload.day);
            let hulpCalendar = [...state.calendar];
            hulpCalendar[hulpIndex1].employeeCalendar[hulpIndex2].shift = action.payload.shift;
            return { ...state, calendar: hulpCalendar };

        default:
            return state;
    }
}

function calendarOvervieuwReducer(state = { calendarsOvervieuw: [] }, action) {
    switch (action.type) {
        case CALENDARS_OVERVIEW_LIST_REQUEST:
            return { loading: true, calendarsOvervieuw: [] };
        case CALENDARS_OVERVIEW_LIST_SUCCES:
            return { loading: false, calendarsOvervieuw: action.payload };
        case CALENDARS_OVERVIEW_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }

}


export { calendarOvervieuwReducer, currentCalendarReducer };