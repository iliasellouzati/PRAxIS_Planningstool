import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {employeesListReducer} from './reducers/employeesReducers';
import {shifttypesReducer} from './reducers/shifttypesReducer';
import { calendarOvervieuwReducer ,currentCalendarReducer} from './reducers/shiftReducers';
import {contracttypesListReducer} from './reducers/contracttypesReducer';
import {betaReducer} from './reducers/betaReducer';
 


const initialState = {
  
};
const reducer = combineReducers({
  employeesList: employeesListReducer,
  shifttypeList: shifttypesReducer,
  contracttypeList: contracttypesListReducer,
  yearlyCalendarList: calendarOvervieuwReducer,
  currentCalendar: currentCalendarReducer ,
  beta: betaReducer

});
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);
export default store;
