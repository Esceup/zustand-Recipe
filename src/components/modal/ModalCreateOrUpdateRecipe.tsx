import { useState, type FormEvent } from 'react';
import { useRecipesStore } from '../../store/storeRecipes';
import type { IIngredient, IStep } from '../../types/types';
import { useStoreModal } from '../../store/storeModal';
import { TextAreaSteps } from '../recipeListPage/RecipeTextAreaSteps';
import { InputIngredients } from '../ingredientsPage/InputsIngredients';
import { useAuthStore } from '../../store/storeAuth';

export const ModalCreateOrUpdateRecipe = () => {
   const { createRecipe, updateRecipe } = useRecipesStore();
   const { isModalOpen, editingRecipe, modalMode, closeModal } = useStoreModal();

   const [title, setTitle] = useState(editingRecipe?.title ?? '');
   const [desc, setDesc] = useState(editingRecipe?.desc ?? '');
   const [ingredients, setIngredients] = useState<IIngredient[]>(editingRecipe?.ingredients ?? []);
   const [steps, setSteps] = useState<IStep[]>(editingRecipe?.steps ?? []);

   const userId = useAuthStore((state) => state.user?.uid);

   const resetForm = () => {
      setTitle('');
      setDesc('');
      setIngredients([]);
      setSteps([]);
   };

   const handleSubmit = async (event: FormEvent) => {
      if (userId === undefined) return;
      event.preventDefault();

      if (!title.trim()) {
         alert('Введите больше одного символа');
         return;
      }

      if (modalMode === 'edit' && editingRecipe) {
         try {
            await updateRecipe(userId, editingRecipe.id, { title, desc, ingredients, steps });
            closeModal();
         } catch (err: unknown) {
            console.error(err);
            alert(err);
         }
      } else {
         try {
            await createRecipe(userId, { title, desc, ingredients, steps });
            resetForm();
            closeModal();
         } catch (err: unknown) {
            console.error(err);
            alert(err);
         }
      }
   };

   if (!isModalOpen) return null;

   return (
      <div>
         <div onClick={closeModal} className={`backModal ${isModalOpen ? 'active' : ''}`}></div>
         <div className="modalRecipe">
            <button className="btn btnClose" onClick={closeModal}>
               <i className="fa-solid fa-xmark"></i>
            </button>
            <div>
               <form onSubmit={handleSubmit}>
                  <div className="flexBlock mt-40px">
                     <input
                        className="inputModal input-reset"
                        name="title"
                        type="text"
                        value={title}
                        placeholder="Название рецепта"
                        onChange={(event) => setTitle(event.target.value)}
                     />
                  </div>
                  <div className="flexBlock">
                     <textarea
                        className="inputModal input-reset"
                        name="desc"
                        value={desc}
                        placeholder="Описание"
                        onChange={(event) => setDesc(event.target.value)}
                     />
                  </div>

                  <h3 className="labelModal">Добавление продукта</h3>

                  <InputIngredients ingredients={ingredients} setIngredients={setIngredients} />
                  <TextAreaSteps steps={steps} setSteps={setSteps} />
                  <button
                     onClick={handleSubmit}
                     type="submit"
                     className="btn btnUpdate btn-gradient"
                  >
                     {modalMode === 'edit' ? 'Сохранить' : 'Добавить'}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
};
