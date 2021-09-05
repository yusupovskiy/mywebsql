
export const db = openDatabase("Food", "0.1", "A list of foods.", 200000);

export const leftJoinForGetNutrients = (name) => `
  LEFT JOIN (
    SELECT *
    FROM (SELECT * FROM ingredients_nutrients ORDER BY id DESC) as ingr_nut
      LEFT JOIN nutrients
        ON (ingr_nut.nutrient_id = nutrients.id)
    WHERE nutrients.slug = '${name}'
    GROUP BY nutrients.slug, ingr_nut.ingredient_id
  ) AS ${name}
    ON ingredients.id = ${name}.ingredient_id
`;

let sql = `
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
`;

function executeSQL(sql) {
  return new Promise((resolve) => {
      db.transaction((tx) => {
          tx.executeSql(sql, [], (tx, results) => {
                  resolve({
                      results
                  })
              },
              (error) => {
                  resolve({
                      error
                  })
              });
      });
  });
}

export const sqlResults = executeSQL(sql);

export const getIngredientsDB = (fun) => {
  return db.transaction((tx) => {
    // Список ингридиентов
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
          
    `, [], (tx, result) => {
      console.log(666, result)
      return fun(result.rows);
    }, null);
  });
}
