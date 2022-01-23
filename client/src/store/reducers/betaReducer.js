import {
    ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_NON_OPERATOR_FOR_NEXT_MONTH,
    ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_OPERATOR_FOR_NEXT_MONTH,
    STEP_3_BETA_INITIAL,
    ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_OPERATOR,
    ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_NON_OPERATOR,
    STEP_5_BETA_INITIAL,
    WEEK_STRUCTURES_LIST_FAIL, WEEK_STRUCTURES_LIST_REQUEST, WEEK_STRUCTURES_LIST_SUCCES,
    ADD_WEEK_STRUCTURE_FAIL, ADD_WEEK_STRUCTURE_REQUEST, ADD_WEEK_STRUCTURE_SUCCES,
    REMOVE_WEEK_STRUCTURE_FAIL, REMOVE_WEEK_STRUCTURE_REQUEST, REMOVE_WEEK_STRUCTURE_SUCCES,
    CHANGE_WEEK_STRUCTURE_FAIL, CHANGE_WEEK_STRUCTURE_REQUEST, CHANGE_WEEK_STRUCTURE_SUCCES,
    UPDATE_OPERATOR_NIGHT, UPDATE_OPERATOR_WEEKEND, RESET_OPERATORS_NIGHT_AND_WEEKEND

} from "../constants/betaConstants";


function betaReducer(state = { nonOperatorConfig: [], OperatorConfig: [], weekStructuren: [] }, action) {

    switch (action.type) {
        case STEP_3_BETA_INITIAL:
            return { ...state, nonOperatorConfig: action.payload };

        case STEP_5_BETA_INITIAL:
            return { ...state, OperatorConfig: action.payload };

        case ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_OPERATOR: {
            let hulpvalue11 = [...state.OperatorConfig].find(x => x.id === action.employeeId);
            hulpvalue11.extra_operatorshiften = action.amount;
            let hulpvalue22 = [...state.OperatorConfig];
            let hulpindexx = hulpvalue22.indexOf(x => x.id === action.employeeId);
            hulpvalue22[hulpindexx] = hulpvalue11;
            return { ...state, OperatorConfig: hulpvalue22 }
        }

        case ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_NON_OPERATOR: {
            let hulpvalue1 = [...state.nonOperatorConfig].find(x => x.id === action.employeeId);
            hulpvalue1.extra_operatorshiften = action.amount;
            let hulpvalue2 = [...state.nonOperatorConfig];
            let hulpindex = hulpvalue2.indexOf(x => x.id === action.employeeId);
            hulpvalue2[hulpindex] = hulpvalue1;
            return { ...state, nonOperatorConfig: hulpvalue2 }
        }

        case ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_OPERATOR_FOR_NEXT_MONTH: {
            let hulpvalue11 = [...state.OperatorConfig].find(x => x.id === action.employeeId);
            hulpvalue11.extra_operatorshiften_volgende_maand = action.amount;
            let hulpvalue22 = [...state.OperatorConfig];
            let hulpindexx = hulpvalue22.indexOf(x => x.id === action.employeeId);
            hulpvalue22[hulpindexx] = hulpvalue11;
            return { ...state, OperatorConfig: hulpvalue22 }
        }

        case ADD_AMOUNT_OF_OPERATOR_SHIFTS_FOR_NON_OPERATOR_FOR_NEXT_MONTH: {
            let hulpvalue1 = [...state.nonOperatorConfig].find(x => x.id === action.employeeId);
            hulpvalue1.extra_operatorshiften_volgende_maand = action.amount;
            let hulpvalue2 = [...state.nonOperatorConfig];
            let hulpindex = hulpvalue2.indexOf(x => x.id === action.employeeId);
            hulpvalue2[hulpindex] = hulpvalue1;
            return { ...state, nonOperatorConfig: hulpvalue2 }
        }

        case UPDATE_OPERATOR_NIGHT: {
            let currentNightBool = [...state.OperatorConfig].find(x => x.id === action.employeeId).nacht;
            let currentState = [...state.OperatorConfig];
            let hulpindexx = currentState.findIndex(x => x.id === action.employeeId);
            currentState[hulpindexx].nacht = !currentNightBool;
            return { ...state, OperatorConfig: currentState }
        }



        case UPDATE_OPERATOR_WEEKEND: {
            let currentWeekendBool = [...state.OperatorConfig].find(x => x.id === action.employeeId).weekend;
            let currentState = [...state.OperatorConfig];
            let hulpindexx = currentState.findIndex(x => x.id === action.employeeId);
            currentState[hulpindexx].weekend = !currentWeekendBool;
            return { ...state, OperatorConfig: currentState }
        }



        case RESET_OPERATORS_NIGHT_AND_WEEKEND: {
            let currentSetup = [...state.OperatorConfig];
            for (let index = 0; index < currentSetup.length; index++) {
                    currentSetup[index].nacht= false;
                    currentSetup[index].weekend = false;                
            }
    
            return { ...state, OperatorConfig: currentSetup }
        }

        case WEEK_STRUCTURES_LIST_REQUEST:
        case ADD_WEEK_STRUCTURE_REQUEST:
        case CHANGE_WEEK_STRUCTURE_REQUEST:
        case REMOVE_WEEK_STRUCTURE_REQUEST:
            return { ...state, weekStructuren: [] };
        case WEEK_STRUCTURES_LIST_SUCCES:
        case ADD_WEEK_STRUCTURE_SUCCES:
        case REMOVE_WEEK_STRUCTURE_SUCCES:
        case CHANGE_WEEK_STRUCTURE_SUCCES:
            return { ...state, weekStructuren: action.payload };
        case WEEK_STRUCTURES_LIST_FAIL:
        case REMOVE_WEEK_STRUCTURE_FAIL:
        case ADD_WEEK_STRUCTURE_FAIL:
        case CHANGE_WEEK_STRUCTURE_FAIL:
            return { ...state, error: action.payload }


        default:
            return state;
    }


}

export { betaReducer }