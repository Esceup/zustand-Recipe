import { useMemo, useState, type FC } from 'react';

import { generatedId } from '../../function/generatedId';
import { useIngredientsStore } from '../../store/storeIngredients';
import type { IIngredient } from '../../types/types';

const units = ['кг', 'гр', 'мл', 'шт', 'ст.л', 'ч.л'] as const;
type Unit = (typeof units)[number];
interface InputIngredients {
   ingredients: IIngredient[];
   setIngredients: (ingredients: IIngredient[]) => void;
}

export const InputIngredients: FC<InputIngredients> = ({ ingredients, setIngredients }) => {
   const [show, setShow] = useState(false);
   const [title, setTitle] = useState('');
   const [valueUnit, setValueUnit] = useState('');
   const [selectedUnit, setSelectedUnit] = useState<Unit>('кг');

   const { Ingredients } = useIngredientsStore();

   const sortedIngredients = useMemo(() => {
      if (!Ingredients) return [];
      return [...Ingredients]?.sort((a, b) => a.title.localeCompare(b.title));
   }, [Ingredients]);

   const updateValue = (id: string, field: keyof IIngredient, value: string) => {
      setIngredients(
         ingredients.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
   };

   const handleChangeUnit = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedUnit(event.target.value as Unit);
   };

   const deleteIngredient = (id: string) => {
      setIngredients(ingredients.filter((item) => item.id !== id));
   };

   const addIngredient = () => {
      const trimmedTitle = title?.trim();
      if (!trimmedTitle) return;

      const newIngredients: IIngredient = {
         id: generatedId(),
         title: trimmedTitle,
         value: valueUnit.trim(),
         unit: selectedUnit,
      };

      setIngredients([...ingredients, newIngredients]);
      setTitle('');
      setValueUnit('');
   };

   return (
      <>
         <ul className="listReset ingredientsList">
            {ingredients?.map((item) => (
               <li key={item.id} className="ingredientsItem">
                  <input
                     name="title"
                     className="inputModal first "
                     type="text"
                     placeholder="Наименование"
                     value={item.title}
                     onChange={(event) => updateValue(item.id, 'title', event.target.value)}
                  />

                  <input
                     name="value"
                     className="inputModal"
                     type="text"
                     placeholder="Кол-во"
                     value={item.value}
                     onChange={(event) => updateValue(item.id, 'value', event.target.value)}
                  />

                  <select
                     value={item.unit}
                     onChange={(event) => updateValue(item.id, 'unit', event.target.value)}
                  >
                     {units.map((unit) => (
                        <option key={unit} value={unit}>
                           {unit}
                        </option>
                     ))}
                  </select>

                  <button className="btndelete" onClick={() => deleteIngredient(item.id)}>
                     <i className="fa-solid fa-trash-can"></i>
                  </button>
               </li>
            ))}
         </ul>

         <div className="ingredientsItem">
            <input
               type="text"
               className="inputModal first"
               placeholder="Наименование"
               value={title}
               onChange={(event) => setTitle(event.target.value)}
            />
            <ul
               id="popularIngredientsList"
               className={`popularIngredientsList ${show ? 'active' : ''}`}
            >
               {sortedIngredients.map((item) => (
                  <li
                     key={item.id}
                     onClick={() => {
                        setTitle(item.title);
                        setValueUnit(item.value);
                        setSelectedUnit(item.unit as Unit);
                        setShow(false);
                     }}
                  >
                     {item.title}
                  </li>
               ))}
            </ul>

            <span className="btnPopularIngredients" onClick={() => setShow(show ? false : true)}>
               <i className="fa-solid fa-carrot "></i>
            </span>
            <input
               type="text"
               className="inputModal"
               placeholder="Кол-во"
               value={valueUnit}
               onChange={(event) => setValueUnit(event.target.value)}
            />
            <select value={selectedUnit} onChange={handleChangeUnit}>
               {units.map((unit) => (
                  <option key={unit} value={unit}>
                     {unit}
                  </option>
               ))}
            </select>
            <button type="button" className="btn btnadd" onClick={addIngredient}>
               <i className="fa-solid fa-plus"></i>
            </button>
         </div>
      </>
   );
};
