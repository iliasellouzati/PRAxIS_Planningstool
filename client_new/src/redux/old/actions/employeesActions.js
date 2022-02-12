import {
    EMPLOYEES_LIST_FAIL,EMPLOYEES_LIST_SUCCES,EMPLOYEES_LIST_REQUEST,
    ADD_EMPLOYEE_FAIL,ADD_EMPLOYEE_REQUEST,ADD_EMPLOYEE_SUCCES,
    CHANGE_EMPLOYEE_FAIL,CHANGE_EMPLOYEE_REQUEST,CHANGE_EMPLOYEE_SUCCES,
    REMOVE_EMPLOYEE_FAIL,REMOVE_EMPLOYEE_REQUEST,REMOVE_EMPLOYEE_SUCCES
} from '../constants/employeesconstants';
import axios from 'axios';

const listEmployees = () => async (dispatch) => {
    try {

        dispatch({type: EMPLOYEES_LIST_REQUEST});
        const {data} = await axios.get('/api/werknemers' );

        dispatch({type: EMPLOYEES_LIST_SUCCES, payload: data});
    } catch (error){
        dispatch({type: EMPLOYEES_LIST_FAIL, payload: error.message})
    }
};

const addEmployee = (employee) => async (dispatch) => {
    try {
        dispatch({ type: ADD_EMPLOYEE_REQUEST });
        const { data } = await axios.post('/api/werknemers', employee);

        dispatch({ type: ADD_EMPLOYEE_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: ADD_EMPLOYEE_FAIL, payload: error.message })
    }
}

const deleteEmployee = (id) => async (dispatch) => {
    try {
        dispatch({ type: REMOVE_EMPLOYEE_REQUEST });
        const { data } = await axios.delete('/api/werknemers/' + id);

        dispatch({ type: REMOVE_EMPLOYEE_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: REMOVE_EMPLOYEE_FAIL, payload: error.message })
    }
}

const updateEmployee = (employee) => async (dispatch) => {

    try {
        dispatch({ type: CHANGE_EMPLOYEE_REQUEST });
        const { data } = await axios.put('/api/werknemers/'+employee.id, employee);

        dispatch({ type: CHANGE_EMPLOYEE_SUCCES, payload: data });
    } catch (error) {
        dispatch({ type: CHANGE_EMPLOYEE_FAIL, payload: error.message })
    }

}



export {listEmployees,updateEmployee,deleteEmployee,addEmployee};