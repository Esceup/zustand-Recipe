import { memo, useEffect, useMemo, useRef, type FC } from 'react';
import type { IMenuWeek, IRecipe } from '../../types/types';
import { useMenuWeekStore } from '../../store/storeMenuWeek';
import { getShoppingList } from '../../function/getShoppingList';

interface Props {
   item: IMenuWeek;
   recipesList: IRecipe[];
   userId: string;
   onOpenModal: (menuId: string) => void;
}

export const MenuInWeekItem: FC<Props> = memo(({ item, recipesList, userId, onOpenModal }) => {
   const editingMenuId = useMenuWeekStore((s) => s.editingMenuId);
   const setEditingMenuId = useMenuWeekStore((s) => s.setEditingMenuId);
   const isEditing = editingMenuId === item.id;
   const editTitleMenu = useMenuWeekStore((s) => s.editTitleMenu);
   const deleteMenu = useMenuWeekStore((s) => s.deleteMenu);
   const inputRef = useRef<HTMLInputElement>(null);
   const editingTitleStore = useMenuWeekStore((s) => s.editingTitle);
   const currentTitle = isEditing ? editingTitleStore : item.title;

   const ingredientsList = useMemo(() => {
      return getShoppingList(item.recipesForWeek, recipesList);
   }, [item.recipesForWeek, recipesList]);

   useEffect(() => {
      if (isEditing && inputRef.current) {
         inputRef.current?.focus();
      }
   }, [isEditing]);

   const handleEditToggle = () => {
      if (isEditing) {
         if (currentTitle === item.title) {
            setEditingMenuId(null, '');
            return;
         }
         if (currentTitle.trim().length < 1 || currentTitle.length > 25) {
            alert('Введите от 1 до 25 символов');
            return;
         }
         editTitleMenu(userId, item.id, currentTitle);
         setEditingMenuId(null, '');
      } else {
         setEditingMenuId(item.id, item.title);
      }
   };

   return (
      <li key={item.id} className="recipeItem">
         <h3 className="menuWeekItemTitle">
            <span className={`${!isEditing ? 'spanTitleItem active' : 'spanTitleItem'}`}>
               {item.title || 'Меню без названия'}
            </span>

            <input
               className={`input-reset titleItemEdit ${isEditing ? 'editing' : ''}`}
               type="text"
               value={currentTitle}
               ref={inputRef}
               onChange={(e) => setEditingMenuId(item.id, e.target.value)}
            />
            <button className="btn-reset" onClick={handleEditToggle}>
               <i className={`fa-solid ${isEditing ? 'fa-check' : 'fa-pencil'}`}></i>
            </button>
         </h3>

         <div className="mb-10px">
            <button
               className="btn-reset btn-delete"
               onClick={() => {
                  if (confirm('Точно удалить?')) deleteMenu(userId, item.id);
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
            <button onClick={() => onOpenModal(item.id)} className="btn-reset btnAddRecipeForWeek">
               <i className="fa-solid fa-plus"></i>
            </button>
         </ul>
         <h3>Продукты для рецептов</h3>
         <ul className="list-reset listIncludeProducts">
            {ingredientsList.map((ing, index) => (
               <li key={ing.id}>
                  {index + 1}. {ing.title[0].toUpperCase()}
                  {ing.title.slice(1)} - {ing.value}
               </li>
            ))}
         </ul>
      </li>
   );
});
