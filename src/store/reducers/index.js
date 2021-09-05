import ingredientsReducer from './ingredients';
import { combineReducers } from 'redux';

const rootReducers = combineReducers({ ingredients: ingredientsReducer });

export default rootReducers;
