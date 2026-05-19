import { type FC } from 'react';
import { useMenuWeekStore } from '../../store/storeMenuWeek';
import { useRecipesStore } from '../../store/storeRecipes';

import { useAuthStore } from '../../store/storeAuth';
interface ModalMenuWeekProps {
   show: boolean;
   setShow: (id: boolean) => void;
   menuItemId: string;
}

export const ModalMenuWeek: FC<ModalMenuWeekProps> = ({ show, setShow, menuItemId }) => {
   const { recipesList } = useRecipesStore();
   const { addExistedRecipe, deleteExistedMenuItem } = useMenuWeekStore();
   const menuWeek = useMenuWeekStore((state) => state.menuWeek);
   const userId = useAuthStore((state) => state.user?.uid);
   if (!userId) return null;

   const currentMenu = menuWeek.find((item) => item.id === menuItemId);
   if (!currentMenu) return null;

   const recipesForWeek = currentMenu.recipesForWeek || [];
   const includesRecipes = recipesForWeek.filter((recipe) =>
      recipesList?.some((r) => r.id === recipe.id)
   );

   return (
      <>
         <div className={`modalMenuWeek ${show ? 'active' : ''}`}>
            <button
               className="btn btnClose"
               onClick={() => {
                  setShow(false);
               }}
            >
               <i className="fa-solid fa-xmark"></i>
            </button>

            {includesRecipes?.length ? (
               <>
                  <h3>Уже в этом меню</h3>
                  <ul className="popularIngredientsListMain">
                     {[...includesRecipes]
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((recipe) => (
                           <li className="popularIngredientItem menuIncludeItem" key={recipe.id}>
                              {recipe.title}
                              <button
                                 className="deleteIngredient"
                                 aria-label={`Удалить ${recipe.title} из этого меню`}
                                 onClick={() =>
                                    deleteExistedMenuItem(userId, currentMenu.id, recipe.id)
                                 }
                              >
                                 <i className="fa-solid fa-trash-can" aria-hidden="true"></i>
                              </button>
                           </li>
                        ))}
                  </ul>
               </>
            ) : (
               <h3>В меню ничего нет</h3>
            )}

            <h3>Меню на выбор</h3>
            <ul className="listReset popularIngredientsListMain">
               {recipesList
                  ?.sort((a, b) => a.title.localeCompare(b.title))
                  .map((item) => (
                     <li className="popularIngredientItem" key={item.id}>
                        <button
                           className="resetBtn"
                           onClick={() =>
                              addExistedRecipe(userId, currentMenu.id, item.id, item.title)
                           }
                           aria-label={`Добавить рецепт ${item.title} в это меню`}
                        >
                           {item.title}
                        </button>
                     </li>
                  ))}
            </ul>
         </div>
         <div
            onClick={() => {
               setShow(false);
            }}
            className={`modalMenuWeekBack ${show ? 'active' : ''}`}
         ></div>
      </>
   );
};
