import { useEffect, useState, type FC, type FormEvent } from "react"
import { useRecipesStore } from "../store/store";
import type { IIngredient, IStep } from "../types/types";
import  { storeModal } from "../store/storeModal";



export const ModalCreateRecipe: FC = () => {



const [title, setTitle] = useState('')
const [desc, setDesc] = useState('')
const [ingredients, setIngredients] = useState<IIngredient[]>([])
const [steps, setSteps] = useState<IStep[]>([])

const createRecipe = useRecipesStore(state => state.createRecipe)
const updateRecipe = useRecipesStore(state => state.updateRecipe)
const { isModalOpen, editingRecipe, modalMode, closeModal } = storeModal()

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

}, [isModalOpen, modalMode, editingRecipe])



const handleSubmit = (event: FormEvent) => {

    event.preventDefault()

    if(!title.trim()) {
        alert('Введите больше одного символа')
        return
    }

    if(modalMode === 'edit' && editingRecipe) {
        updateRecipe(
            editingRecipe.id, 
            {title, desc, ingredients, steps}
        )
    } else {
        createRecipe({
            title, desc, ingredients, steps
        })
    }

    resetForm()
}



if(!isModalOpen) return null

    return (
        <div className={`backModal ${isModalOpen ? 'active' : ''}`}>
            <div className="modalRecipe">
            <button className="position: absolute; right" onClick={closeModal}>x</button>
            <div>
                <form onSubmit={handleSubmit}>
                    <label className="labelModal">Название рецепта:</label>
                    <input 
                        className="inputModal"
                        name="title" 
                        type="text"
                        value={title}
                        placeholder="Наименование рецепта"
                        onChange={(event) => setTitle(event.target.value)}
                    />
                    <label className="labelModal">Описание:</label>
                    <textarea 
                        className="inputModal"
                        name="desc" 
                        value={desc}
                        placeholder="Описание рецепта"
                        onChange={(event) => setDesc(event.target.value)}
                    />

                    <button type="submit">{modalMode === 'edit' ? 'Сохранить изменения' : 'Добавить рецепт'}</button>
                </form>
            </div>
        </div>
        </div>
    )
}