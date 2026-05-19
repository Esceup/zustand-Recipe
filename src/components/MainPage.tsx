import { useState } from 'react';
import { MenuInWeek } from './menuWeekPage/MenuInWeek';
import { Ingredients } from './ingredientsPage/Ingredients';
import { RecipesList } from './recipeListPage/RecipesList';
import { ModalUserProfile } from './modal/ModalUserProfile';

export function MainPage() {
   const [tabs, setTabs] = useState<'MenuInWeek' | 'RecipesList' | 'Ingredients'>('MenuInWeek');
   const [showModal, setShowModal] = useState(false);

   return (
      <>
         <button className="btn btnLogout" onClick={() => setShowModal(!showModal)}>
            <i className="fa-solid fa-gear"></i>
         </button>
         {tabs === 'RecipesList' ? (
            <RecipesList />
         ) : tabs === 'MenuInWeek' ? (
            <MenuInWeek />
         ) : tabs === 'Ingredients' ? (
            <Ingredients />
         ) : (
            ''
         )}

         <div className="tabsBlock">
            <button
               onClick={() => setTabs('MenuInWeek')}
               className={`btn btnAllMenu ${tabs === 'MenuInWeek' ? 'active' : ''}`}
            >
               <div>
                  <i className="fa-solid fa-utensils"></i>
                  <div className="underTitleTabs">Меню на неделю</div>
               </div>
            </button>
            <button
               onClick={() => setTabs('RecipesList')}
               className={`btn btnAllMenu ${tabs === 'RecipesList' ? 'active' : ''}`}
            >
               <i className="fa-solid fa-list"></i>
               <div className="underTitleTabs">Список рецептов</div>
            </button>
            <button
               onClick={() => setTabs('Ingredients')}
               className={`btn btnAllMenu ${tabs === 'Ingredients' ? 'active' : ''}`}
            >
               <i className="fa-solid fa-carrot "></i>
               <div className="underTitleTabs">Ингредиенты</div>
            </button>
         </div>
         <ModalUserProfile showModal={showModal} setShowModal={setShowModal} />
      </>
   );
}
