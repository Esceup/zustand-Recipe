import { useState, useRef, useMemo } from 'react';

import { useRecipesStore } from '../../store/storeRecipes';
import { useMenuWeekStore } from '../../store/storeMenuWeek';
import { ModalMenuWeek } from './ModalMenuWeek';
import type { IMenuWeek } from '../../types/types';
import { useAuthStore } from '../../store/storeAuth';

export const MenuInWeek = () => {
   const refInput = useRef<HTMLInputElement>(null);
   const [show, setShow] = useState(false);
   const [menuItemId, setMenuItemId] = useState<string>('');
   const [title, setTitle] = useState('');
   const [titleSearch, setTitleSearch] = useState('');
   const menuWeek = useMenuWeekStore((s) => s.menuWeek);
   const addNewMenu = useMenuWeekStore((s) => s.addNewMenu);
   const deleteMenu = useMenuWeekStore((s) => s.deleteMenu);
   const editTitleMenu = useMenuWeekStore((s) => s.editTitleMenu);
   const loading = useMenuWeekStore((s) => s.loading);
   const editingTitle = useMenuWeekStore((s) => s.editingTitle);
   const editingMenuId = useMenuWeekStore((s) => s.editingMenuId);
   const setEditingMenuId = useMenuWeekStore((s) => s.setEditingMenuId);
   const { recipesList } = useRecipesStore();
   const userId = useAuthStore((state) => state.user?.uid);

   const filteredMenuWeek = useMemo(() => {
      if (!menuWeek.length) return [];
      const search = titleSearch.trim().toLowerCase();
      if (!search) return menuWeek;
      return menuWeek?.filter((filterItem) => filterItem.title.toLowerCase().includes(search));
   }, [menuWeek, titleSearch]);

   const handleAddNewMenu = () => {
      if (title.length <= 3) {
         alert('Длина заголовка меню должна быть не менее 4 символов');
         return;
      }
      if (menuWeek.some((item) => item.title.toLowerCase() === title.toLowerCase())) return;
      addNewMenu(userId!, title);
      setTitle('');
   };

   return (
      <>
         <div className={`loaderFullBack ${loading ? 'loading' : ''}`}>
            <div className="loader"></div>
         </div>
         <div className="menuWeek">
            <h1>Меню на неделю</h1>

            <div className="flexBlockInputAdd">
               <input
                  type="text"
                  value={title}
                  className="inputMenuWeekAdd"
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder=""
               />
               <button onClick={handleAddNewMenu} className="btn btnAdd btn-gradient">
                  Создать
               </button>
            </div>
            <div>
               <h3 className="searchLabel">Поиск</h3>
               <div className="flexBlockInputAdd">
                  <input
                     type="text"
                     value={titleSearch}
                     className="searchInput"
                     onChange={(event) => setTitleSearch(event.target.value)}
                     placeholder=""
                  />
                  <i className="searchInputAbsolute fa-solid fa-magnifying-glass"></i>
               </div>
            </div>

            {menuWeek?.length !== 0 ? (
               <ul className="recipeList">
                  {filteredMenuWeek.map((item) => {
                     const editMode = editingMenuId === item.id;

                     const getAllIngredients = (item: IMenuWeek) => {
                        const allIngredients = new Map<
                           string,
                           { title: string; valueAndUnit: string[] }
                        >();

                        item.recipesForWeek
                           ?.sort((a, b) => a.title.localeCompare(b.title))
                           .forEach((includeItem) => {
                              const recipe = recipesList?.find((r) => r.id === includeItem.id);
                              if (recipe?.ingredients) {
                                 recipe.ingredients.forEach((ing) => {
                                    const key = ing.title.trim().toLowerCase();
                                    const value = `${ing.value} ${ing.unit}`;

                                    if (allIngredients.has(key)) {
                                       allIngredients.get(key)?.valueAndUnit.push(value);
                                    } else {
                                       allIngredients.set(key, {
                                          title: ing.title,
                                          valueAndUnit: [value],
                                       });
                                    }
                                 });
                              }
                           });

                        const result = Array.from(allIngredients.entries()).map(([id, data]) => ({
                           id,
                           title: data.title,
                           finalValue: data.valueAndUnit.join(', '),
                        }));
                        return result.sort((a, b) => a.title.localeCompare(b.title));
                     };

                     return (
                        <li key={item.id} className="recipeItem">
                           <h3 className="menuWeekItemTitle">
                              <span
                                 className={`${!editMode ? 'spanTitleItem active' : 'spanTitleItem'}`}
                              >
                                 {item.title ? item.title : 'Меню без названия'}
                              </span>

                              <input
                                 className={`input-reset titleItemEdit ${editMode ? 'editing' : ''}`}
                                 type="text"
                                 value={editMode ? editingTitle : item.title}
                                 ref={refInput}
                                 onChange={(e) => {
                                    setEditingMenuId(item.id, e.target.value);
                                 }}
                              />
                              <button
                                 className="btn-reset "
                                 onClick={() => {
                                    if (editingMenuId === item.id) {
                                       if (editingTitle === item.title) {
                                          setEditingMenuId(null);
                                          return;
                                       }
                                       if (editingTitle.length < 1 || editingTitle.length > 25) {
                                          alert('Введите хоть один символ и не более 25');
                                          return;
                                       }

                                       editTitleMenu(userId!, item.id, editingTitle);
                                       setEditingMenuId(null);
                                    } else {
                                       setEditingMenuId(item.id, item.title);

                                       setTimeout(() => {
                                          refInput.current?.focus();
                                       }, 0);
                                    }
                                 }}
                              >
                                 <i
                                    className={`fa-solid ${editMode ? 'fa-check' : 'fa-pencil'} `}
                                 ></i>
                              </button>
                           </h3>

                           <div className="mb-10px">
                              <button
                                 className="btn-reset btn-delete"
                                 onClick={() => {
                                    const isDelete = confirm('Точно удалить?');
                                    if (!isDelete) return;
                                    deleteMenu(userId!, item.id);
                                 }}
                              >
                                 <i className="fa-solid fa-trash-can"></i>
                              </button>
                           </div>

                           <ul className="recipeList mb-15px">
                              {item.recipesForWeek?.map((includeItem) => {
                                 const recipe = recipesList?.find((r) => r.id === includeItem.id);

                                 return recipe ? <li key={recipe.id}>{recipe.title}</li> : null;
                              })}
                              <button
                                 onClick={() => {
                                    setMenuItemId(item.id);
                                    setShow(true);
                                 }}
                                 className="btn-reset btnAddRecipeForWeek"
                              >
                                 <i className="fa-solid fa-plus"></i>
                              </button>
                           </ul>
                           <h3>Продукты для рецептов</h3>
                           <ul className="list-reset listIncludeProducts">
                              {getAllIngredients(item).map((ing, index) => (
                                 <li key={ing.id}>
                                    {index + 1}. {ing.title} - {ing.finalValue}
                                 </li>
                              ))}
                           </ul>
                        </li>
                     );
                  })}

                  <ModalMenuWeek show={show} setShow={setShow} menuItemId={menuItemId} />
               </ul>
            ) : (
               <div className="notMenuWeekItem">Создайте меню на неделю</div>
            )}
         </div>
      </>
   );
};
