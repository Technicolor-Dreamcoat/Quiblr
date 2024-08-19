import { UPDATE_ITEM, SET_REDUXGLOBAL } from "./constants";
import { combineReducers } from "redux";

// Define the initial state for reduxGlobal

const INITIAL_STATE = {
  reduxGlobal: {
    instance: "https://lemmy.world",
    listing: "All",
    community: "",
    sort: "Active",
    sortComments: "Hot",
    sortSearch: "TopWeek",
    blurNSFWSettings: true,
    showNSFWSettings: false,
    darkModeSettings: false,
    showScrollToTopSettings: true,
    dyslexiaFont: false,
    jwtRedux: "",
    personDetailsRedux: "",
    fontSize: 0,
    openInSeparateTab: false,
    removeDuplicatePosts: false,
    dynamicImageSize: false,
    soundOnVideos: false,
    showScrollBars: false,
    flipVotingArrows: false,
  },
};

// Define the reducer for reduxGlobal

const reducer_reduxGlobal = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_REDUXGLOBAL:
      return {
        reduxGlobal: action.reduxGlobal,
      };
    default:
      return state;
  }
};

const reducer_update = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_ITEM:
      const { itemId, newItemValue } = action.payload;
      return {
        ...state,
        reduxGlobal: {
          ...state.reduxGlobal,
          [itemId]: newItemValue,
        },
      };
    default:
      return state;
  }
};

// Combine the reducers

const reducer = combineReducers({
  updateItem: reducer_update,
  reduxGlobal: reducer_reduxGlobal,
});

export default reducer;
