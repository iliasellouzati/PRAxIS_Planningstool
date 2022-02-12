import {
    CONTRACT_LIST_FAIL, CONTRACT_LIST_REQUEST, CONTRACT_LIST_SUCCES,
    CHANGE_CONTRACT_FAIL, CHANGE_CONTRACT_REQUEST, CHANGE_CONTRACT_SUCCES,
    ADD_CONTRACT_FAIL, ADD_CONTRACT_REQUEST, ADD_CONTRACT_SUCCES,
    REMOVE_CONTRACT_FAIL, REMOVE_CONTRACT_REQUEST, REMOVE_CONTRACT_SUCCES
} from "../constants/contracttypeConstants";


function contracttypesListReducer(state = { contracttypes: [] }, action) {

    switch (action.type) {
        case CONTRACT_LIST_REQUEST:
        case ADD_CONTRACT_REQUEST:
        case CHANGE_CONTRACT_REQUEST:
        case REMOVE_CONTRACT_REQUEST:
            return { loading: true, contracttypes: [] }
        case CONTRACT_LIST_SUCCES:
        case ADD_CONTRACT_SUCCES:
        case CHANGE_CONTRACT_SUCCES:
        case REMOVE_CONTRACT_SUCCES:
            return { loading: false, contracttypes: action.payload };
        case CONTRACT_LIST_FAIL:
        case ADD_CONTRACT_FAIL:
        case CHANGE_CONTRACT_FAIL:
        case REMOVE_CONTRACT_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}

export { contracttypesListReducer };