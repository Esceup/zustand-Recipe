import { useState, type FC } from 'react';
import { useRecipesStore } from '../../store/storeRecipes';
import type { IRecipe } from '../../types/types';

import { useStoreModal } from '../../store/storeModal';
import { useAuthStore } from '../../store/storeAuth';

interface ItemProps {
   recipe: IRecipe;
}

const RecipeItem: FC<ItemProps> = ({ recipe }) => {
   const [active, setActive] = useState(true);
   const removeRecipe = useRecipesStore((state) => state.removeRecipe);
   const { openEditModal } = useStoreModal();

   const userId = useAuthStore((state) => state.user?.uid);
   const loading = useAuthStore((state) => state.loading);

   const handleRemove = async () => {
      if (userId === undefined) return;
      try {
         await removeRecipe(userId, recipe.id);
      } catch (err: unknown) {
         console.error(err);
         alert(err);
      }
   };

   return (
      <>
         <li className={active ? 'recipeItem active' : 'recipeItem'} key={recipe.id}>
            <div>
               <div className="headerRecipeItem">
                  <h2 className="recipeItemTitle">{recipe.title}</h2>
                  <button className="btn-reset" onClick={() => setActive(!active)}>
                     <i className="fa-solid fa-angle-down"></i>
                  </button>
               </div>

               {recipe.desc ? (
                  <div>
                     <span className="descItem">Описание:</span>
                     <span>{recipe.desc}</span>
                  </div>
               ) : (
                  ''
               )}

               <div className="recipeItemProductsBlock">
                  <h3>Продукты</h3>
                  <ul className="ingredientsList">
                     {recipe.ingredients?.length ? (
                        recipe.ingredients.map((item) => (
                           <li key={item.id}>
                              <div className="ingredientTitle">{item.title}</div>
                              <div className="ingredientUnit">
                                 {item.value} {item.unit}
                              </div>
                           </li>
                        ))
                     ) : (
                        <div>Пока пусто</div>
                     )}
                  </ul>
               </div>
               <div>
                  <h2>Пошаговый рецепт:</h2>
               </div>
               <ul className="ingredientsList">
                  {recipe.steps?.map((item, index) => (
                     <li key={item.id}>
                        {index + 1}. <span>{item.title}</span>
                     </li>
                  ))}
               </ul>
            </div>
            <div className="btnBlockUpdateDelete">
               <button onClick={() => openEditModal(recipe)} className="btn btn-reset">
                  <i className="fa-solid fa-pencil "></i>
               </button>
               <button
                  onClick={handleRemove}
                  className="btn btn-reset"
                  disabled={!!loading || !userId}
               >
                  <i className="fa-solid fa-trash-can"></i>
               </button>
            </div>
         </li>
      </>
   );
};

export default RecipeItem;
