import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getIngredientAction } from '../store/actions/ingredients';

export default function IngredientPage(router) {
  const dispatch = useDispatch();
  const id = router.match.params.ingredientId;
  const ingredient = useSelector(state => state.ingredient);

  useEffect(() => {
    dispatch(getIngredientAction(id));
  }, [id, dispatch]);

  const {
    name, kcal, proteins, carbohydrates, fats, water,
    glucose, fructose, dietary_fiber, a, c, b12, d3
  } = ingredient || {};
  
  return (
    <div>
      <div>{name}</div>
      <div>Ккалории: {kcal || '-'}</div>
      <div>Белки: {proteins || '-'}</div>
      <div>Углеводы: {carbohydrates || '-'}</div>
      <div>Жиры: {fats || '-'}</div>
      <div>Вода: {water || '-'}</div>

      <div>Глюкоза: {glucose || '-'}</div>
      <div>Фруктоза: {fructose || '-'}</div>
      <div>Пищевые волокна: {dietary_fiber || '-'}</div>
      <div>Витамин А: {a || '-'}</div>
      <div>Витамин B12: {b12 || '-'}</div>
      <div>Витамин С: {c || '-'}</div>
      <div>Витамин D3: {d3 || '-'}</div>
    </div>
  );
}