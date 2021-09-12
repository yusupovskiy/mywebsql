import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import './App.css';
import IngredientPage from './pages/IngredientPage';
import IngredientsPage from './pages/IngredientsPage';
import { initDB } from './store/db';

initDB();

function App() {
  return (
    <div className="App" style={{ display: 'flex' }}>
      <Redirect from="/" to="/ingredients" exact />
      <div style={{ minWidth: '50%' }}>
        <Route path="/ingredients" component={IngredientsPage} />
      </div>
      <div style={{ minWidth: '50%' }}>
        <Route path="/ingredients/:ingredientId" component={IngredientPage} />
      </div>
    </div>
  );
}

export default App;
