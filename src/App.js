import React from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import IngredientPage from './pages/Ingredient';
import IngredientsPage from './pages/Ingredients';
import { initDB } from './store/db';

initDB();

function App() {
  return (
    <div className="App" style={{ display: 'flex' }}>
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
