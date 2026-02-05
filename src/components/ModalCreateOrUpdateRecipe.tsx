import { useEffect, useState, type FormEvent } from "react"
import { useRecipesStore } from "../store/store";
import type { IIngredient, IStep } from "../types/types";
import  { storeModal } from "../store/storeModal";
import { InputIngredients } from "./InputIngredients";
import { TextAreaSteps } from "./TextAreaSteps";



export const ModalCreateOrUpdateRecipe = () => {

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
            createRecipe({title, desc, ingredients, steps})
        }

        resetForm()
        closeModal()
    }



if(!isModalOpen) return null

    return (
        <div>
            <div onClick={closeModal} className={`backModal ${isModalOpen ? 'active' : ''}`}></div>
            <div className="modalRecipe">
            <button className="btn btnClose" onClick={closeModal}>х</button>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="flexBlock">
                        <h3 className="labelModal">Название рецепта:</h3>
                        <input 
                            className="inputModal"
                            name="title" 
                            type="text"
                            value={title}
                            placeholder="Наименование рецепта"
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </div>
                    <div className="flexBlock">
                        <h3 className="labelModal mr-5px">Описание:</h3>
                        <textarea 
                            rows="5"
                            className="inputModal"
                            name="desc" 
                            value={desc}
                            placeholder="Описание рецепта"
                            onChange={(event) => setDesc(event.target.value)}
                        />
                    </div>
                    <div className="flexBlock">
                        <h3 className="labelModal">Продукты:</h3>                     
                    </div>
                    
                    
                    

                    <button type="submit" className="btn btnUpdate">{modalMode === 'edit' ? 'Сохранить' : 'Добавить'}</button>
                </form>
                <InputIngredients ingredients={ingredients} setIngredients={setIngredients}/>
                <TextAreaSteps  modalMode={modalMode} />
            </div>
        </div>
        </div>
        
    )
}