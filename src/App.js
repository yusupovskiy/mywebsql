import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { Route, Link } from "react-router-dom";

import IngredientPage from './pages/Ingredient';
import { db, leftJoinForGetNutrients, getIngredientsDB, sqlResults } from './store/db';
import './App.css';

function App() {
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
          tx.executeSql("CREATE TABLE nutrients (id REAL UNIQUE, slug TEXT UNIQUE)", [], null, null);
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
      db.transaction((tx) => {
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

  const save = values => {
    const { ingredient_id, ...nutrients } = values;
    console.log('Saving', values);
    db.transaction((tx) => {
      tx.executeSql(`
        INSERT INTO ingredients_nutrients (id, ingredient_id, nutrient_id, count, unit)
          values
            (25, ${ingredient_id}, 1, ${nutrients.kcal}, 'kcal'),
            (26, ${ingredient_id}, 2, ${nutrients.proteins}, 'g')
        `, [], null, (qyery, error) => alert(error.message));
    });
  }
  
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
          fats.count as fats

        FROM ingredients
          ${leftJoinForGetNutrients('kcal')}
          ${leftJoinForGetNutrients('proteins')}
          ${leftJoinForGetNutrients('carbohydrates')}
          ${leftJoinForGetNutrients('fats')}
            
      `, [], (tx, result) => {
        setList(result.rows);
      }, null);
    });
  }, []);

  let test;
  getIngredientsDB(async (result) => {
    const res = result;
    test = await res;
    return res;
  });
  sqlResults.then(async (res) => test = await res)
  console.log(5553333, test);

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div style={{ minWidth: '50%' }}>
        <ul>
          {Object.keys(list).map(key => {
            const { id, name, kcal, proteins, carbohydrates, fats } = list[key];
            return (
              <li key={id}>
                <Link to={`/${id}`}>
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
          })}
        </ul>
        <Form
          onSubmit={save}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>   
              <div>
                <label>Продукты</label>
                <Field name="ingredient_id" component="select">
                  <option />
                  {Object.keys(list).map(key => {
                    const { id, name } = list[key];
                    return (
                      <option key={id} value={id}>{name}</option>
                    );
                  })}
                </Field>
              </div>

              <div>
                <label>Ккалории</label>
                <Field
                  name="kcal"
                  component="input"
                  type="number"
                  placeholder="Ккалории"
                />
              </div>

              <div>
                <label>Белки</label>
                <Field
                  name="proteins"
                  component="input"
                  type="number"
                  placeholder="proteins"
                />
              </div>

              <div>
                <button type="submit" disabled={submitting || pristine}>
                  Submit
                </button>
                <button
                  type="button"
                  onClick={form.reset}
                  disabled={submitting || pristine}
                >
                  Reset
                </button>
              </div>
              <pre>{JSON.stringify(values, 0, 2)}</pre>
            </form>
          )}
        />
      </div>
      <div style={{ minWidth: '50%' }}>
        <Route path="/:ingredientId" component={IngredientPage} />
      </div>
    </div>
  );
}

export default App;
