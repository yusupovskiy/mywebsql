import { ingredients, ingredient } from './ingredients';
import { combineReducers } from 'redux';

const rootReducers = combineReducers({ ingredients, ingredient });

export default rootReducers;
