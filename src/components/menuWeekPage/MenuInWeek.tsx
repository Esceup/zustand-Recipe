import { useState, useMemo, useCallback } from 'react';

import { useRecipesStore } from '../../store/storeRecipes';
import { useMenuWeekStore } from '../../store/storeMenuWeek';
import { ModalMenuWeek } from './ModalMenuWeek';
import { useAuthStore } from '../../store/storeAuth';
import { MenuInWeekItem } from './MenuInWeekItem';

export const MenuInWeek = () => {
   const [show, setShow] = useState(false);
   const [menuItemId, setMenuItemId] = useState<string>('');
   const [title, setTitle] = useState('');
   const [titleSearch, setTitleSearch] = useState('');
   const menuWeek = useMenuWeekStore((s) => s.menuWeek);
   const addNewMenu = useMenuWeekStore((s) => s.addNewMenu);
   const loading = useMenuWeekStore((s) => s.loading);
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

   const handleOpenModal = useCallback((id: string) => {
      setMenuItemId(id);
      setShow(true);
   }, []);

   if (userId === undefined) return null;

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
                  {filteredMenuWeek.map((item) => (
                     <MenuInWeekItem
                        key={item.id}
                        item={item}
                        recipesList={recipesList}
                        userId={userId}
                        onOpenModal={handleOpenModal}
                     />
                  ))}
                  <ModalMenuWeek show={show} setShow={setShow} menuItemId={menuItemId} />
               </ul>
            ) : (
               <div className="notMenuWeekItem">Создайте меню на неделю</div>
            )}
         </div>
      </>
   );
};
