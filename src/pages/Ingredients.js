import React, { useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { db } from '../store/db';
import { getIngredients as getIngredientsAction } from '../store/actions/ingredients';

export default function IngredientPage() {
  const dispatch = useDispatch();
  const ingredients = useSelector(state => state.ingredients);

  useEffect(() => {
    dispatch(getIngredientsAction());
  }, [dispatch]);

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
      <Form
        onSubmit={save}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>   
            <div>
              <label>Продукты</label>
              {ingredients.length > 0 ? (
                <Field name="ingredient_id" component="select">
                  <option />
                  {Object.keys(ingredients).map(key => {
                    const { id, name } = ingredients[key];
                    return (
                      <option key={id} value={id}>{name}</option>
                    );
                  })}
                </Field>
              ) : 'loadng...'}
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
    </>
  );
}