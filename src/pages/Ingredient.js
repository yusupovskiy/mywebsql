import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

import { db, leftJoinForGetNutrients } from '../store/db';

export default function IngredientPage (router) {
  const list2 = useSelector(state => state);
  const id = router.match.params.ingredientId;
  
  console.log(12323, list2);

  const [list, setList] = useState({});

  useEffect(() => {
    db.transaction((tx) => {
      // Список ингридиентов
      tx.executeSql(`
        SELECT
          DISTINCT ingredients.id,
          ingredients.name,
          
          kcal.count as kcal,
          proteins.count as proteins,
          carbohydrates.count as carbohydrates,
          fats.count as fats,
          d3.count as d3,
          b12.count as b12,
          a.count as a,
          c.count as c,
          dietary_fiber.count as dietary_fiber,
          water.count as water,
          glucose.count as glucose,
          fructose.count as fructose

        FROM ingredients
          ${leftJoinForGetNutrients('kcal')}
          ${leftJoinForGetNutrients('proteins')}
          ${leftJoinForGetNutrients('carbohydrates')}
          ${leftJoinForGetNutrients('fats')}

          ${leftJoinForGetNutrients('d3')}
          ${leftJoinForGetNutrients('b12')}
          ${leftJoinForGetNutrients('a')}
          ${leftJoinForGetNutrients('c')}
          ${leftJoinForGetNutrients('dietary_fiber')}
          ${leftJoinForGetNutrients('water')}
          ${leftJoinForGetNutrients('glucose')}
          ${leftJoinForGetNutrients('fructose')}

        WHERE ingredients.id=${id}  

      `, [], (tx, result) => {
        setList(result.rows);
      }, null)
    });
  }, [id]);

  const {
    name, kcal, proteins, carbohydrates, fats, water,
    glucose, fructose, dietary_fiber, a, c, b12, d3
  } = list[0] || {};
  
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