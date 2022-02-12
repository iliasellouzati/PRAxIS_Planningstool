import {
    SHIFTTYPE_LIST_FAIL, SHIFTTYPE_LIST_REQUEST, SHIFTTYPE_LIST_SUCCES,
    CHANGE_SHIFTTYPE_FAIL, CHANGE_SHIFTTYPE_REQUEST, CHANGE_SHIFTTYPE_SUCCES,
    ADD_SHIFTTYPE_REQUEST, ADD_SHIFTTYPE_SUCCES, ADD_SHIFTTYPE_FAIL,
    REMOVE_SHIFTTYPE_REQUEST, REMOVE_SHIFTTYPE_SUCCES, REMOVE_SHIFTTYPE_FAIL
} from '../constants/shifttypeConstants';
import axios from 'axios';

const listShiftTypes = () => async (dispatch) => {
    try {
        dispatch({ type: SHIFTTYPE_LIST_REQUEST });
        const { data } = await axios.get('/api/shifttypes');

        dispatch({ type: SHIFTTYPE_LIST_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: SHIFTTYPE_LIST_FAIL, payload: error.message })
    }
};

const addShifttype = (shift) => async (dispatch) => {
    try {
        dispatch({ type: ADD_SHIFTTYPE_REQUEST });
        const { data } = await axios.post('/api/shifttypes', shift);

        dispatch({ type: ADD_SHIFTTYPE_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: ADD_SHIFTTYPE_FAIL, payload: error.message })
    }
}

const deleteShifttype = (naam) => async (dispatch) => {
    try {
        dispatch({ type: REMOVE_SHIFTTYPE_REQUEST });
        const { data } = await axios.delete('/api/shifttypes/' + naam);

        dispatch({ type: REMOVE_SHIFTTYPE_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: REMOVE_SHIFTTYPE_FAIL, payload: error.message })
    }
}

const updateShifttype = (oudeShiftNaam,shift) => async (dispatch) => {

    try {
        dispatch({ type: CHANGE_SHIFTTYPE_REQUEST });
        const { data } = await axios.put('/api/shifttypes/'+oudeShiftNaam, shift);

        dispatch({ type: CHANGE_SHIFTTYPE_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: CHANGE_SHIFTTYPE_FAIL, payload: error.message })
    }

}


export { listShiftTypes, addShifttype, deleteShifttype, updateShifttype };