import {EMPLOYEES_LIST_FAIL,EMPLOYEES_LIST_SUCCES,EMPLOYEES_LIST_REQUEST} from '../constants/employeesconstants';


function employeesListReducer(state = { employees: [] }, action) {
    switch (action.type) {
      case EMPLOYEES_LIST_REQUEST:
        return { loading: true, employees: [] };
      case EMPLOYEES_LIST_SUCCES:
        return { loading: false, employees: action.payload };
      case EMPLOYEES_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  }

  export {employeesListReducer};