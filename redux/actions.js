import { UPDATE_ITEM, SET_REDUXGLOBAL } from "./constants";

export function reduxGlobal(reduxGlobal) {
  return {
    type: SET_REDUXGLOBAL,
    reduxGlobal,
  };
}

export function updateItem(itemId, newItemValue) {
  return {
    type: UPDATE_ITEM,
    payload: { itemId, newItemValue },
  };
}
