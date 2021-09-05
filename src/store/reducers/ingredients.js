const listReducer = (state = {}, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case "LISTITEM_ADD":
      newState[
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
      ] = {
        complete: false,
        label: action.payload
      };
      break;
    case "LISTITEM_EDIT":
      newState[action.payload.key] = {
        complete:
          action.payload.complete ?? newState[action.payload.key].complete,
        label: action.payload.label ?? newState[action.payload.key].label
      };
      break;
    case "LISTITEM_DELETE":
      delete newState[action.payload];
      break;
    default:
      break;
  }

  return newState;
};

export default listReducer;
