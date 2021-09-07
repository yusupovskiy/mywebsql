
export const db = openDatabase("Food", "0.1", "A list of foods.", 200000);

export const initDB = () => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        "SELECT COUNT(*) FROM ingredients",
        [],
        null,
        (tx, error) => {
          tx.executeSql(`
            CREATE TABLE ingredients (
              id REAL UNIQUE,
              name TEXT
            )
          `);
        }
      );

      tx.executeSql(
        "SELECT COUNT(*) FROM nutrients",
        [],
        null,
        (tx, error) => {
          tx.executeSql(`
            CREATE TABLE nutrients (
              id REAL UNIQUE,
              slug TEXT UNIQUE
            )
          `, [], null, null);
        }
      );

      tx.executeSql(
        "SELECT COUNT(*) FROM ingredients_nutrients",
        [],
        null,
        (tx, error) => {
          tx.executeSql(`
            CREATE TABLE ingredients_nutrients (
              id REAL UNIQUE,
              ingredient_id INTEGER,
              nutrient_id INTEGER,
              count INTEGER,
              unit TEXT
            )
          `, [], null, null);
        }
      );
    },
    err => console.error("База не создана", err),
    () => {
      db.transaction(tx => {
        tx.executeSql(`
          INSERT INTO ingredients (id, name)
            values
              (1, 'Огурец'),
              (2, 'Помидор'),
              (4, 'Перец'),
              (5, 'Маринованные огурцы Царицыно'),
              (6, 'Маринованные огурцы Исмаил'),
              (7, 'Макароны'),
              (8, 'Фарш'),
              (9, 'Макароны по флотски'),
              (10, 'Сахар Прессованный [Русский Сахар]')
        `);
        tx.executeSql(`
          INSERT INTO nutrients (id, slug)
            values
              (1, 'kcal'),
              (2, 'proteins'),
              (3, 'b_car'),
              (4, 'carbohydrates'),
              (5, 'fats'),
              (6, 'd3'),
              (7, 'b12'),
              (8, 'a'),
              (9, 'c'),
              (10, 'dietary_fiber'),
              (11, 'water'),
              (12, 'glucose'),
              (13, 'fructose')
        `, [], null, (qyery, error) => alert(error.message));
        tx.executeSql(`
          INSERT INTO ingredients_nutrients (id, ingredient_id, nutrient_id, count, unit)
            values
              (1, 1, 1, 18, 'kcal'),
              (2, 1, 2, 0.9, 'g'),
              (3, 1, 4, 2.7, 'g'),
              (4, 1, 5, 0.2, 'g'),
              (5, 1, 11, 95, 'g'),
              (6, 1, 8, 42, 'mcg'),
              (7, 1, 7, 0, 'mcg'),
              (8, 1, 6, 0, 'mcg'),
              (9, 1, 9, 13.7, 'mg'),
              (10, 1, 3, 0.449, 'mg'),
              (11, 1, 12, 1.25, 'g'),
              (12, 1, 13, 1.37, 'g'),
              (13, 2, 1, 222, 'kcal')
        `);
      });
    }
  );
}

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
