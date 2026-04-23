import { useState } from 'react';
import { useIngredientsStore } from '../../store/storeIngredients';
import { useAuthStore } from '../../store/storeAuth';

export const Ingredients = () => {
  const { Ingredients, addNewIngredient, deleteIngredient, loading } = useIngredientsStore();
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [valueUnit, setValueUnit] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('кг');
  const [error, setError] = useState(false);

  const userId = useAuthStore((state) => state.user?.uid);
  if (userId === undefined) return;

  const handleNewIngredient = () => {
    if (title === '' || valueUnit === '') {
      setError(true);
      return false;
    }

    setError(title ? false : true);
    addNewIngredient(userId, title, valueUnit, selectedUnit);
    setTitle('');
    setValueUnit('');
  };

  const handleChangeUnit = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUnit(event.target.value);
  };

  return (
    <div className="ingredientsPage">
      <div className={`loaderFullBack ${loading ? 'loading' : ''}`}>
        <div className="loader"></div>
      </div>
      <h2>Ингредиенты</h2>
      {/* <img src="src\assets\11.jpg" alt="" />   */}
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
              <option value="кг">кг</option>
              <option value="гр">гр</option>
              <option value="мл">мл</option>
              <option value="шт">шт</option>
              <option value="ст.л">ст.л</option>
              <option value="ч.л">ч.л</option>
            </select>
          </div>
          <button className="btn btnAddNewIngredient btn-gradient" onClick={handleNewIngredient}>
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
          {Ingredients?.filter((filterItem) =>
            filterItem.title.toLowerCase().includes(searchTitle.toLowerCase())
          )
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((item) => (
              <li className="popularIngredientItem" key={item.id}>
                {item.title} - {item.value}
                {item.unit}
                <span
                  onClick={() => deleteIngredient(userId, item.id)}
                  className="deleteIngredient"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </span>
              </li>
            ))}
        </ul>
      </div>
      <div onClick={() => setShow(false)} className={`backModal ${show ? 'active' : ''}`}></div>
    </div>
  );
};
