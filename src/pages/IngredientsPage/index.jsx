import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getIngredients as getIngredientsAction } from '../../store/actions/ingredients';
import AddIngredientsForm from './AddIngredientsForm';

export default function IngredientPage() {
  const dispatch = useDispatch();
  const ingredients = useSelector(state => state.ingredients);

  useEffect(() => {
    dispatch(getIngredientsAction());
  }, [dispatch]);
  
  return (
    <>
      <ul>
        {ingredients.length > 0 ? Object.keys(ingredients).map(key => {
          const { id, name, kcal, proteins, carbohydrates, fats } = ingredients[key];
          return (
            <li key={id}>
              <Link to={`/ingredients/${id}`}>
                <div>{name}</div>
                <div>
                  {kcal ? `Ккалории: ${kcal}` : ''}
                  {proteins ? `Белки: ${proteins}` : ''}
                  {carbohydrates ? `Углеводы: ${carbohydrates}` : ''}
                  {fats ? `Жиры: ${fats}` : ''}
                </div>
              </Link>
            </li>
          );
        }) : 'loading'}
      </ul>
      <AddIngredientsForm />
    </>
  );
}