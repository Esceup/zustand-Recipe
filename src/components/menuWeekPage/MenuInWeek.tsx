import { useState, useRef } from "react"

import { useRecipesStore } from "../../store/storeRecipes"
import { useMenuWeekStore } from "../../store/storeMenuWeek"
import { ModalMenuWeek } from './ModalMenuWeek';
import type { IMenuWeek } from "../../types/types";
import { useAuthStore } from "../../store/storeAuth";


export const MenuInWeek = () => {


    const refInput = useRef<HTMLInputElement>(null)
    const [show, setShow] = useState(false)
    const [menuItemProp, menuItemPropSet] = useState<IMenuWeek>({ 
        id: '', 
        title: '', 
        recipesForWeek: [],
    })  
    const [titleItemEdit, setTitleItemEdit] = useState('')
    const [title, setTitle] = useState('')
    const [titleSearch, setTitleSearch] = useState('')
    const { menuWeek, addNewMenu, deleteMenu, editTitleMenu, loading, editingMenuId, setEditingMenuId } = useMenuWeekStore()
    const { recipesList } = useRecipesStore()
    const userId = useAuthStore(state => state.user?.uid)

    if(!userId) return null

    const handleAddNewMenu = () => {
        if(title.length <= 3) {
            alert('Длина заголовка меню должна быть не менее 4 символов')
            return
        }
        if(menuWeek.some(item => item.title.toLowerCase() === title.toLowerCase())) return
        addNewMenu(userId, title)
        setTitle('')
    }

    

    return (
        <>
        <div className={`loaderFullBack ${loading ? 'loading' : ''}`}>
                <div className='loader'></div>
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
                <button onClick={handleAddNewMenu} className="btn btnAdd btn-gradient">Создать</button>
                
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
                {menuWeek?.filter(filterItem => 
                    filterItem.title.toLowerCase().includes(titleSearch.toLowerCase())).map((item) => {

                        const editMode = editingMenuId === item.id
                        
                        const getAllIngredients = () => {
                            const allIngredients: {title: string, value: string, unit: string}[] = []

                        }

                        return (
                            <li key={item.id} className="recipeItem">
                            <h3 className="menuWeekItemTitle">
                                <span className={`${!editMode ? 'spanTitleItem active' : 'spanTitleItem'}`} >
                                    {item.title ? item.title : 'Меню без названия'}
                                </span>                              

                            <input 
                                className={`input-reset ${!editMode ? 'titleItemEdit' : 'titleItemEdit active'}`}
                                type="text" 
                                value={titleItemEdit}     
                                ref={refInput}                           
                                onChange={(e) => {                                    
                                    setTitleItemEdit(e.target.value)          
                                }}/> 
                            
                            
                            </h3>
                               
                            <div className="mb-10px">
                                <button className="btn-reset" onClick={() => {                             
                                    if(editMode) {
                                        if(titleItemEdit === item.title) {
                                            setEditingMenuId(null)
                                            return
                                        }
                                        if(titleItemEdit.length < 1 || titleItemEdit.length > 25) {
                                            alert('Введите хоть один символ и не больше 25')
                                            return
                                        }
                                        
                                        editTitleMenu(userId, item.id, titleItemEdit) 
                                        setEditingMenuId(null)                                         
                                    } else {
                                        setTitleItemEdit(item.title)     
                                        setEditingMenuId(item.id) 

                                        setTimeout(() => {
                                            refInput.current?.focus()
                                        }, 0)
                                    }                                                                                                      
                                }}>
                                    <i className={`fa-solid ${editMode ? "fa-check" : "fa-pencil"} `}></i>
                                </button> 
                                <button 
                                    className="btn-reset btn-delete" 
                                    onClick={() => {
                                        const isDelete = confirm('Точно удалить?')
                                        if(!isDelete) return
                                        deleteMenu(userId, item.id)
                                    }}>
                                        <i className="fa-solid fa-trash-can"></i>
                                </button> 
                            </div>  

                            <ul className="recipeList mb-15px">
                               
                                {item.recipesForWeek?.map(includeItem => 
                                    recipesList?.map((recipeItem) => 
                                        recipeItem.title === includeItem.title ? 
                                            <li key={recipeItem.id}>{recipeItem.title}</li> : ''
                                            
                                        )
                                    )
                                }
                            <button onClick={() => {
                                    setShow(true)
                                    menuItemPropSet(item)
                                }} 
                                className="btn-reset btnAddRecipeForWeek">
                                    <i className="fa-solid fa-plus"></i>
                            </button>
                          
                            </ul> 
                            <h3>Продукты для рецептов</h3>
                            <ul className="list-reset listIncludeProducts">
                                 {item.recipesForWeek?.map(includeItem => 
                                    recipesList?.map((recipeItem) => 
                                        recipeItem.title === includeItem.title ? 
                                            recipeItem.ingredients.map((ing) => 
                                               <li key={recipeItem.id}>{ing.title} - {ing.value} {ing.unit}</li>
                                             ) : ''                          
                                        )
                                )}
                            </ul>
                           
                                   
                        </li>
                        )
                    }
            )}

            <ModalMenuWeek show={show} setShow={setShow} menuItemProp={menuItemProp}/>
             
            </ul>          
            ) : (<div className="notMenuWeekItem">Создайте меню на неделю</div>)}
        </div>
    </>
    )
}