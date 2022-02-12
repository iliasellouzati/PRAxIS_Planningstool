import {
    CONTRACT_LIST_FAIL,CONTRACT_LIST_REQUEST,CONTRACT_LIST_SUCCES,
    CHANGE_CONTRACT_FAIL,CHANGE_CONTRACT_REQUEST,CHANGE_CONTRACT_SUCCES,
    ADD_CONTRACT_FAIL,ADD_CONTRACT_REQUEST,ADD_CONTRACT_SUCCES,
    REMOVE_CONTRACT_FAIL,REMOVE_CONTRACT_REQUEST,REMOVE_CONTRACT_SUCCES
} from '../constants/contracttypeConstants';
import axios from 'axios';


const listContractTypes = () => async (dispatch) => {
    try {
        dispatch({ type: CONTRACT_LIST_REQUEST });
        const { data } = await axios.get('/api/contract');

        dispatch({ type: CONTRACT_LIST_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: CONTRACT_LIST_FAIL, payload: error.message })
    }
};

const addContracttype = (contract) => async (dispatch) => {
    try {
        dispatch({ type: ADD_CONTRACT_REQUEST });
        const { data } = await axios.post('/api/contract', contract);

        dispatch({ type: ADD_CONTRACT_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: ADD_CONTRACT_FAIL, payload: error.message })
    }
}

const deleteContracttype = (naam) => async (dispatch) => {
    try {
        dispatch({ type: REMOVE_CONTRACT_REQUEST });
        const { data } = await axios.delete('/api/contract/' + naam);

        dispatch({ type: REMOVE_CONTRACT_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: REMOVE_CONTRACT_FAIL, payload: error.message })
    }
}

const updateContracttype = (oudeShiftNaam,shift) => async (dispatch) => {

    try {
        dispatch({ type: CHANGE_CONTRACT_REQUEST });
        const { data } = await axios.put('/api/contract/'+oudeShiftNaam, shift);

        dispatch({ type: CHANGE_CONTRACT_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: CHANGE_CONTRACT_FAIL, payload: error.message })
    }

}

export {listContractTypes, addContracttype, deleteContracttype, updateContracttype}