import {
  SHIFTTYPE_LIST_FAIL, SHIFTTYPE_LIST_REQUEST, SHIFTTYPE_LIST_SUCCES,
  REMOVE_SHIFTTYPE_FAIL, REMOVE_SHIFTTYPE_REQUEST, REMOVE_SHIFTTYPE_SUCCES,
  ADD_SHIFTTYPE_FAIL, ADD_SHIFTTYPE_REQUEST, ADD_SHIFTTYPE_SUCCES,
  CHANGE_SHIFTTYPE_FAIL, CHANGE_SHIFTTYPE_REQUEST, CHANGE_SHIFTTYPE_SUCCES
} from '../constants/shifttypeConstants';

function shifttypesReducer(state = { shifttypes: [] }, action) {
  switch (action.type) {
    case SHIFTTYPE_LIST_REQUEST:
    case ADD_SHIFTTYPE_REQUEST:
    case CHANGE_SHIFTTYPE_REQUEST:
    case REMOVE_SHIFTTYPE_REQUEST:
      return { loading: true, shifttypes: [] };
    case SHIFTTYPE_LIST_SUCCES:
    case ADD_SHIFTTYPE_SUCCES:
    case CHANGE_SHIFTTYPE_SUCCES:
    case REMOVE_SHIFTTYPE_SUCCES:
      return { loading: false, shifttypes: action.payload };
    case SHIFTTYPE_LIST_FAIL:
    case ADD_SHIFTTYPE_FAIL:
    case CHANGE_SHIFTTYPE_FAIL:
    case REMOVE_SHIFTTYPE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
}

export { shifttypesReducer };