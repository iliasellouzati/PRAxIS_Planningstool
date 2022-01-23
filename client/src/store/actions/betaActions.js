import {
    ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_NON_OPERATOR_FOR_NEXT_MONTH,
    ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_OPERATOR_FOR_NEXT_MONTH,
    ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_NON_OPERATOR,
    STEP_3_BETA_INITIAL,
    STEP_5_BETA_INITIAL,
    ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_OPERATOR,
    WEEK_STRUCTURES_LIST_FAIL, WEEK_STRUCTURES_LIST_REQUEST, WEEK_STRUCTURES_LIST_SUCCES,
    ADD_WEEK_STRUCTURE_FAIL, ADD_WEEK_STRUCTURE_REQUEST, ADD_WEEK_STRUCTURE_SUCCES,
    REMOVE_WEEK_STRUCTURE_FAIL, REMOVE_WEEK_STRUCTURE_REQUEST, REMOVE_WEEK_STRUCTURE_SUCCES,
    CHANGE_WEEK_STRUCTURE_FAIL, CHANGE_WEEK_STRUCTURE_REQUEST, CHANGE_WEEK_STRUCTURE_SUCCES,
    UPDATE_OPERATOR_NIGHT, UPDATE_OPERATOR_WEEKEND, RESET_OPERATORS_NIGHT_AND_WEEKEND
}
    from "../constants/betaConstants";
import axios from 'axios';

const listWeekStructuren = () => async (dispatch) => {
    try {

        dispatch({ type: WEEK_STRUCTURES_LIST_REQUEST });
        const { data } = await axios.get('/api/weekstructuur');

        dispatch({ type: WEEK_STRUCTURES_LIST_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: WEEK_STRUCTURES_LIST_FAIL, payload: error.message })
    }
};

const addWeekStructuur = (weekstructuur) => async (dispatch) => {
    try {
        dispatch({ type: ADD_WEEK_STRUCTURE_REQUEST });
        const { data } = await axios.post('/api/weekstructuur', weekstructuur);

        dispatch({ type: ADD_WEEK_STRUCTURE_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: ADD_WEEK_STRUCTURE_FAIL, payload: error.message })
    }
}

const deleteWeekStructuur = (id) => async (dispatch) => {
    try {
        dispatch({ type: REMOVE_WEEK_STRUCTURE_REQUEST });
        const { data } = await axios.delete('/api/weekstructuur/' + id);

        dispatch({ type: REMOVE_WEEK_STRUCTURE_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: REMOVE_WEEK_STRUCTURE_FAIL, payload: error.message })
    }
}

const updateWeekStructuur = (weekstructuur) => async (dispatch) => {

    try {
        dispatch({ type: CHANGE_WEEK_STRUCTURE_REQUEST });
        const { data } = await axios.put('/api/weekstructuur/' + weekstructuur.id, weekstructuur);

        dispatch({ type: CHANGE_WEEK_STRUCTURE_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: CHANGE_WEEK_STRUCTURE_FAIL, payload: error.message })
    }

}


const step3BetaInitial = (employeesList) => async (dispatch) => {

    let NonOperatorConfig = [];

    employeesList.forEach(employee => {
        NonOperatorConfig.push({
            "id": employee.id,
            "extra_operatorshiften": 0,
            "extra_operatorshiften_volgende_maand": 0,
            "stap6": []
        })
    });

    dispatch({ type: STEP_3_BETA_INITIAL, payload: NonOperatorConfig })

}

const step5BetaInitial = (employeesList) => async (dispatch) => {

    let OperatorConfig = [];

    employeesList.forEach(employee => {
        OperatorConfig.push({
            "id": employee.id,
            "extra_operatorshiften": 0,
            "extra_operatorshiften_volgende_maand": 0,
            "weekend": false,
            "nacht": false

        })
    });

    dispatch({ type: STEP_5_BETA_INITIAL, payload: OperatorConfig })

}

const addAmountOfNONOperatorShifts = (employeeId, amount) => async (dispatch) => {

    dispatch({ type: ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_NON_OPERATOR, employeeId: employeeId, amount: amount })

}

const addAmountOfOperatorShifts = (employeeId, amount) => async (dispatch) => {

    dispatch({ type: ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_OPERATOR, employeeId: employeeId, amount: amount })

}

const addAmountOfNONOperatorShiftsForNextMonth = (employeeId, amount) => async (dispatch) => {

    dispatch({ type: ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_NON_OPERATOR_FOR_NEXT_MONTH, employeeId: employeeId, amount: amount })

}

const addAmountOfOperatorShiftsForNextMonth = (employeeId, amount) => async (dispatch) => {

    dispatch({ type: ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_OPERATOR_FOR_NEXT_MONTH, employeeId: employeeId, amount: amount })

}

const step6BetaInitial = (emplId, year) => async (dispatch) => {

}

const updateOperatorNight = (employeeId) => async(dispatch) => {
    dispatch({ type: UPDATE_OPERATOR_NIGHT, employeeId: employeeId })

}

const updateOperatorWeekend = (employeeId) => async(dispatch) => {
    dispatch({ type: UPDATE_OPERATOR_WEEKEND, employeeId: employeeId })

}

const resetOperatorNightAndWeekend = () => async(dispatch) => {
    dispatch({ type: RESET_OPERATORS_NIGHT_AND_WEEKEND})

}



export {
    step3BetaInitial, addAmountOfNONOperatorShifts, step5BetaInitial,
     addAmountOfOperatorShifts, 
     addAmountOfNONOperatorShiftsForNextMonth, 
     addAmountOfOperatorShiftsForNextMonth,
    listWeekStructuren, addWeekStructuur, 
    deleteWeekStructuur, updateWeekStructuur, step6BetaInitial,
    updateOperatorNight, updateOperatorWeekend,resetOperatorNightAndWeekend

}