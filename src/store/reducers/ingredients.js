const initialState = [];

export function ingredients(state = initialState, action) {
  if (action.type === 'ADD_INGREDIENT') {
    return [
      ...state,
      action.payload
    ];
  } else if (action.type === 'FETCH_INGREDIENTS_SUCCESS') {
    return action.payload;
  }
  return state;
}

export function ingredient(state = initialState, action) {
  if (action.type === 'FETCH_INGREDIENT_SUCCESS') {
    return action.payload;
  }
  return state;
}