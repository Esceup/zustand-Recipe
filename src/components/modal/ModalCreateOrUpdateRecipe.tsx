import { useEffect, useState, type FormEvent } from "react"
import { useRecipesStore } from "../../store/storeRecipes";
import type { IIngredient, IStep } from "../../types/types";
import  { useStoreModal } from "../../store/storeModal";
import { TextAreaSteps } from "../recipeListPage/RecipeTextAreaSteps";
import { InputIngredients } from "../ingredientsPage/InputsIngredients";
import { useAuthStore } from "../../store/storeAuth";



export const ModalCreateOrUpdateRecipe = () => {

    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [ingredients, setIngredients] = useState<IIngredient[]>([])
    const [steps, setSteps] = useState<IStep[]>([])

    const { createRecipe, updateRecipe } = useRecipesStore()
    const { isModalOpen, editingRecipe, modalMode, closeModal } = useStoreModal()

    const userId = useAuthStore(state => state.user?.uid)

    const resetForm = () => {
        setTitle('')
        setDesc('')
        setIngredients([])
        setSteps([])
    }

    useEffect(() => {
        if(editingRecipe && modalMode === 'edit') {
            setTitle(editingRecipe.title)
            setDesc(editingRecipe.desc)
            setIngredients(editingRecipe.ingredients)
            setSteps(editingRecipe.steps)
        } else {
            resetForm()
        }

        if (isModalOpen) {
            document.body.classList.add('modalOpen');
        } else {
            document.body.classList.remove('modalOpen');
        }
    
        return () => document.body.classList.remove('modal-open');

    }, [isModalOpen, modalMode, editingRecipe])

    const handleSubmit = async (event: FormEvent) => {
        if(userId === undefined) return
        event.preventDefault()

        if(!title.trim()) {
            alert('Введите больше одного символа')
            return
        }

        if(modalMode === 'edit' && editingRecipe) {
            try {
                await updateRecipe(
                    userId,
                    editingRecipe.id, 
                    {title, desc, ingredients, steps}
                )
                closeModal()
            } catch(err: unknown) {
                console.error(err)
                alert(err)
            }
        } else {
            try {
                await createRecipe(userId, {title, desc, ingredients, steps})
                resetForm()
                closeModal()
            } catch(err: unknown) {
                console.error(err)
                alert(err)
            }
        } 
    }

if(!isModalOpen) return null

    return (
        <div>
            <div onClick={closeModal} className={`backModal ${isModalOpen ? 'active' : ''}`}></div>
            <div className="modalRecipe">
                <button className="btn btnClose" onClick={closeModal}><i className="fa-solid fa-xmark"></i></button>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="flexBlock mt-40px">
                        {/* <h3 className="labelModal">Название рецепта:</h3> */}
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
                        {/* <h3 className="labelModal mr-5px">Описание:</h3> */}
                        <textarea 
                           
                            className="inputModal input-reset"
                            name="desc" 
                            value={desc}
                            placeholder="Описание"
                            onChange={(event) => setDesc(event.target.value)}
                        />
                    </div>
                    
                    <h3 className="labelModal">Добавление продукта</h3>                     
                    

                    <InputIngredients ingredients={ingredients} setIngredients={setIngredients}/>
                    <TextAreaSteps  modalMode={modalMode} steps={steps} setSteps={setSteps} />
                    <button onClick={handleSubmit} type="submit" className="btn btnUpdate btn-gradient">{modalMode === 'edit' ? 'Сохранить' : 'Добавить'}</button>
                </form>
            </div>
            </div>
        </div>
    )
}