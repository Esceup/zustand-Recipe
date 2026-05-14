import { useCallback, useMemo, useState } from 'react';
import { useIngredientsStore } from '../../store/storeIngredients';
import { useAuthStore } from '../../store/storeAuth';

const units = ['кг', 'гр', 'мл', 'шт', 'ст.л', 'ч.л'] as const;
type Unit = (typeof units)[number];

export const Ingredients = () => {
   const { Ingredients, addNewIngredient, deleteIngredient, loading } = useIngredientsStore();
   const [show, setShow] = useState(false);
   const [title, setTitle] = useState('');
   const [valueUnit, setValueUnit] = useState('');
   const [searchTitle, setSearchTitle] = useState('');
   const [selectedUnit, setSelectedUnit] = useState<Unit>('кг');
   const [error, setError] = useState(false);

   const filteredIngredients = useMemo(() => {
      if (!Ingredients) return [];
      return Ingredients?.filter((filterItem) =>
         filterItem.title.toLowerCase().includes(searchTitle.toLowerCase())
      ).sort((a, b) => a.title.localeCompare(b.title));
   }, [searchTitle, Ingredients]);

   const userId = useAuthStore((state) => state.user!.uid);
   const handleNewIngredient = useCallback(() => {
      if (title === '' || valueUnit === '') {
         setError(true);
         return false;
      }

      addNewIngredient(userId, title, valueUnit, selectedUnit);
      setTitle('');
      setValueUnit('');
   }, [title, valueUnit, selectedUnit, userId, addNewIngredient]);
   const handleChangeUnit = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedUnit(event.target.value as Unit);
   };

   return (
      <div className="ingredientsPage">
         <div className={`loaderFullBack ${loading ? 'loading' : ''}`}>
            <div className="loader"></div>
         </div>
         <h2>Ингредиенты</h2>
         <div className={`popularIngredientsListBlock ${show ? 'active' : ''}`}>
            <div className="flexBlock mt-15px">
               <input
                  type="text"
                  className={`inputModal first  mb-15px input-reset ${error ? 'error' : ''} `}
                  value={title}
                  placeholder="Наименование ингредиента"
                  onChange={(event) => setTitle(event.target.value)}
               />
               <input
                  type="text"
                  className={`inputModal mb-5px mr-15px mb-15px input-reset ${error ? 'error' : ''}`}
                  value={valueUnit}
                  placeholder="Значение"
                  onChange={(event) => setValueUnit(event.target.value)}
               />
               <div className="blockForSelect">
                  <select value={selectedUnit} onChange={handleChangeUnit}>
                     {units.map((unit) => (
                        <option key={unit} value={unit}>
                           {unit}
                        </option>
                     ))}
                  </select>
               </div>
               <button
                  className="btn btnAddNewIngredient btn-gradient"
                  onClick={handleNewIngredient}
               >
                  Добавить
               </button>
            </div>

            <input
               type="text"
               className={`inputModal first mb-15px input-reset `}
               value={searchTitle}
               placeholder="Поиск"
               onChange={(event) => setSearchTitle(event.target.value)}
            />
            <ul className={`listReset popularIngredientsListMain`}>
               {filteredIngredients.length ? (
                  filteredIngredients.map((item) => (
                     <li className="popularIngredientItem" key={item.id}>
                        {item.title} - {item.value} {item.unit}
                        <span
                           onClick={() => deleteIngredient(userId, item.id)}
                           className="deleteIngredient"
                        >
                           <i className="fa-solid fa-trash-can"></i>
                        </span>
                     </li>
                  ))
               ) : (
                  <li>Ничего не найдено</li>
               )}
            </ul>
         </div>
         <div onClick={() => setShow(false)} className={`backModal ${show ? 'active' : ''}`}></div>
      </div>
   );
};
