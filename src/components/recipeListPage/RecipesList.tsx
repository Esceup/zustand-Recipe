import { useMemo, useState } from 'react';
import { useRecipesStore } from '../../store/storeRecipes';
import RecipeItem from './RecipeItem';
import { useStoreModal } from '../../store/storeModal';
import { ModalCreateOrUpdateRecipe } from '../modal/ModalCreateOrUpdateRecipe';

export const RecipesList = () => {
   const [title, setTitle] = useState('');
   const { recipesList, loading } = useRecipesStore();
   const { openCreateModal, modalMode, editingRecipe } = useStoreModal();

   const recipesFiltered = useMemo(() => {
      if (!recipesList.length) return [];
      const search = title.trim().toLowerCase();
      if (!search) return recipesList;
      return recipesList?.filter((item) => item.title.toLowerCase().includes(search));
   }, [recipesList, title]);
   return (
      <>
         <div className={`loaderFullBack ${loading ? 'loading' : '1'}`}>
            <div className="loader"></div>
         </div>

         <h1>Список рецептов</h1>

         <div className="flexBlock j-center ">
            <button className="btn btnAddRecipeMain btn-gradient" onClick={openCreateModal}>
               Добавить рецепт
            </button>
         </div>
         <div>
            <div className="flexBlockInputAdd">
               <input
                  type="text"
                  className="searchInput"
                  value={title}
                  onChange={(event) => setTitle(event?.target.value)}
               />
               <i className="searchInputAbsolute fa-solid fa-magnifying-glass"></i>
            </div>
         </div>

         <ul className="recipeList">
            {recipesFiltered.map((recipe) => (
               <RecipeItem key={recipe.id} recipe={recipe} />
            ))}
         </ul>
         <ModalCreateOrUpdateRecipe key={modalMode === 'edit' ? editingRecipe?.id : 'create'} />
      </>
   );
};
