export const db = openDatabase("Food", "0.1", "A list of foods.", 200000);

export const initDB = () => {
  db.transaction(
    (tx) => {
      tx.executeSql(
        "SELECT COUNT(*) FROM ingredients",
        [],
        null,
        tx => {
          tx.executeSql(`
              CREATE TABLE ingredients (
                id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
                name TEXT
              )
            `,
            [],
            tx => {
              tx.executeSql(`
                INSERT INTO ingredients (name)
                  values
                    ('Огурец'),
                    ('Помидор'),
                    ('Перец'),
                    ('Маринованные огурцы Царицыно'),
                    ('Маринованные огурцы Исмаил'),
                    ('Макароны'),
                    ('Фарш'),
                    ('Макароны по флотски'),
                    ('Сахар Прессованный [Русский Сахар]')
              `);
            },
            (qyery, error) => alert(error.message)
          );
        }
      );

      tx.executeSql(
        "SELECT COUNT(*) FROM nutrients",
        [],
        null,
        (tx, error) => {
          tx.executeSql(`
            CREATE TABLE nutrients (
              id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
              slug TEXT UNIQUE
            )`,
            [],
            tx => {
              tx.executeSql(`
                INSERT INTO nutrients (slug)
                  values
                    ('kcal'),
                    ('proteins'),
                    ('b_car'),
                    ('carbohydrates'),
                    ('fats'),
                    ('d3'),
                    ('b12'),
                    ('a'),
                    ('c'),
                    ('dietary_fiber'),
                    ('water'),
                    ('glucose'),
                    ('fructose')
              `);
            },
            (qyery, error) => alert(error.message)
          );
        }
      );

      tx.executeSql(
        "SELECT COUNT(*) FROM ingredients_nutrients",
        [],
        null,
        (tx, error) => {
          tx.executeSql(`
            CREATE TABLE ingredients_nutrients (
              id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
              ingredient_id INTEGER,
              nutrient_id INTEGER,
              count INTEGER,
              unit TEXT
            )`,
            [],
            tx => {
              tx.executeSql(`
                INSERT INTO ingredients_nutrients (ingredient_id, nutrient_id, count, unit)
                  values
                    (1, 1, 18, 'kcal'),
                    (1, 2, 0.9, 'g'),
                    (1, 4, 2.7, 'g'),
                    (1, 5, 0.2, 'g'),
                    (1, 11, 95, 'g'),
                    (1, 8, 42, 'mcg'),
                    (1, 7, 0, 'mcg'),
                    (1, 6, 0, 'mcg'),
                    (1, 9, 13.7, 'mg'),
                    (1, 3, 0.449, 'mg'),
                    (1, 12, 1.25, 'g'),
                    (1, 13, 1.37, 'g'),
                    (2, 1, 222, 'kcal')
              `);
            },
            (qyery, error) => alert(error.message)
          );
        }
      );
    },
    err => console.error("База не создана", err),
    null
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
