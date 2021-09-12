import React from 'react';
import { Form, Field } from 'react-final-form';

import { db } from '../../store/db';

export default function AddIngredientsForm() {
  const save = values => {
    const { name, ...nutrients } = values;
    db.transaction((tx) => {
      tx.executeSql(`
        INSERT INTO ingredients (name) values ('${name}')
        `, [], (tx, result) => {
          tx.executeSql(`
            INSERT INTO ingredients_nutrients (ingredient_id, nutrient_id, count, unit)
              values
                (${result.insertId}, 1, ${nutrients.kcal}, 'kcal'),
                (${result.insertId}, 2, ${nutrients.proteins}, 'g'),
                (${result.insertId}, 4, ${nutrients.carbohydrates}, 'g'),
                (${result.insertId}, 5, ${nutrients.fats}, 'g'),
                (${result.insertId}, 6, ${nutrients.d3}, 'g'),
                (${result.insertId}, 7, ${nutrients.b12}, 'g'),
                (${result.insertId}, 8, ${nutrients.a}, 'g'),
                (${result.insertId}, 9, ${nutrients.c}, 'g'),
                (${result.insertId}, 10, ${nutrients.dietary_fiber}, 'g'),
                (${result.insertId}, 11, ${nutrients.water}, 'g'),
                (${result.insertId}, 12, ${nutrients.glucose}, 'g'),
                (${result.insertId}, 13, ${nutrients.fructose}, 'g'),
                (${result.insertId}, 3, ${nutrients.b_car}, 'g')
            `, [], null, (qyery, error) => alert(error.message));
        }, (qyery, error) => alert(error.message));
    });
  }

  const inputsForm = [
    { label: 'Название', name: 'name', type: 'text' },
    { label: 'Ккалории', name: 'kcal' },
    { label: 'Белки (г)', name: 'proteins' },
    { label: 'carbohydrates', name: 'carbohydrates' },
    { label: 'fats (г)', name: 'fats' },
    { label: 'd3', name: 'd3' },
    { label: 'b12 (г)', name: 'b12' },
    { label: 'a', name: 'a' },
    { label: 'c (г)', name: 'c' },
    { label: 'dietary_fiber', name: 'dietary_fiber' },
    { label: 'water (г)', name: 'water' },
    { label: 'glucose (г)', name: 'glucose' },
    { label: 'fructose (г)', name: 'fructose' },
    { label: 'b_car', name: 'b_car' }
  ];

  return (
    <Form
      onSubmit={save}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form style={{ margin: 40 }} onSubmit={handleSubmit}>   
          <h2>Добавить ингредиент</h2>

          {inputsForm.map(({ label, name, type }) => (
            <div style={{ margin: '10px 0' }}>
              <label>{label}</label>
              <Field
                name={name}
                component="input"
                type={type ? type : 'number'}
                placeholder={label}
              />
            </div>
          ))}

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
  );
}