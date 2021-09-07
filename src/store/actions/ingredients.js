import { db, leftJoinForGetNutrients } from '../db';

// Список ингридиентов
export const getIngredients = () => dispatch => {
  db.transaction((tx) => {
    tx.executeSql(`
      SELECT
        DISTINCT ingredients.id,
        ingredients.name,
        
        kcal.count as kcal,
        proteins.count as proteins,
        carbohydrates.count as carbohydrates,
        fats.count as fats
  
      FROM ingredients
        ${leftJoinForGetNutrients('kcal')}
        ${leftJoinForGetNutrients('proteins')}
        ${leftJoinForGetNutrients('carbohydrates')}
        ${leftJoinForGetNutrients('fats')}
          
    `, [], (tx, { rows }) => {
      dispatch({ type: 'FETCH_INGREDIENTS_SUCCESS', payload: rows });
    }, (qyery, error) => dispatch({ type: 'FETCH_INGREDIENTS_FAILED', error }));
  });
}

export const getIngredientAction = (id) => dispatch => {
  db.transaction((tx) => {
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

    `, [], (tx, { rows }) => {
      dispatch({ type: 'FETCH_INGREDIENT_SUCCESS', payload: rows[0] });
    }, (qyery, error) => dispatch({ type: 'FETCH_INGREDIENT_FAILED', error }));
  });
}
