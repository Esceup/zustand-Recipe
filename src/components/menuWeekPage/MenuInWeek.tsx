import { useState, useRef } from "react"

import { useRecipesStore } from "../../store/storeRecipes"
import { useMenuWeek } from "../../store/storeMenuWeek"
import { ModalMenuWeek } from './ModalMenuWeek';
import type { IMenuWeek } from "../../types/types";
import { useAuthStore } from "../../store/storeAuth";


export const MenuInWeek = () => {
    const refInput = useRef<HTMLInputElement>(null)
    const [show, setShow] = useState(false)
    const [menuItemProp, menuItemPropSet] = useState<IMenuWeek>({ 
        id: '', 
        title: '', 
        includesRecipe: [],
        editMode: false
    })  
    const [titleItemEdit, setTitleItemEdit] = useState('')
    const [title, setTitle] = useState('')
    const [titleSearch, setTitleSearch] = useState('')
    const { menuWeek, addNewMenu, deleteMenu, editTitleMenu, toggleEditMenu, loading } = useMenuWeek()
    const { recipesList } = useRecipesStore()
    const userId = useAuthStore(state => state.user?.uid)

    if(userId === undefined) return

    const handleAddNewMenu = () => {
        if(title === '' || title.length <= 3) return
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
                <button onClick={handleAddNewMenu} className="btn btnAdd btn-gradient">Добавить</button>
                
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
           
           
     
            <ul className="recipeList">
                {menuWeek?.filter(filterItem => 
                    filterItem.title.toLowerCase().includes(titleSearch.toLowerCase())).map((item) => 
                    
                        <li key={item.id} className="recipeItem">
                            <h3 className="menuWeekItemTitle">
                                <span className={`${!item.editMode ? 'spanTitleItem active' : 'spanTitleItem'}`} >
                                    {item.title ? item.title : 'Меню без названия'}
                                </span>

                            <input 
                                className={`input-reset ${!item.editMode ? 'titleItemEdit' : 'titleItemEdit active'}`}
                                type="text" 
                                value={titleItemEdit}     
                                ref={refInput}                           
                                onChange={(e) => {                                    
                                    setTitleItemEdit(e.target.value)          
                                }}/> 
                            
                            
                            </h3>

                            <div className="mb-10px">
                                <button className="btn-reset" onClick={() => {
                                    toggleEditMenu(userId, item.id, true) 

                                    setTimeout(() => {
                                        refInput.current?.focus()
                                    }, 0)
                                    if(item.editMode === true) {
                                        toggleEditMenu(userId, item.id, false)
                                        editTitleMenu(userId, item.id, titleItemEdit)   
                                    }                         
                                        
                                        setTitleItemEdit(item.title)                                       
                                    }
                                    }><i className={`fa-solid ${item.editMode ? "fa-check" : "fa-pencil"} `}></i>
                                </button> 
                                <button 
                                    className="btn-reset" 
                                    onClick={() => {
                                        const isDelete = confirm('Точно удалить?')
                                        if(!isDelete) return
                                        deleteMenu(userId, item.id)
                                    }}>
                                        <i className="fa-solid fa-trash-can"></i>
                                </button> 
                            </div>  

                            <ul className="recipeList mb-15px">
                               
                                 {item.includesRecipe?.map(includeItem => 
                                    recipesList?.map((recipeItem) => 
                                        recipeItem.title === includeItem.title ? 
                                        <li key={recipeItem.id}><i className="fa-solid fa-circle"></i>{recipeItem.title}</li> : '')
                                    )
                             }
                            <button onClick={() => {
                                setShow(true)
                                menuItemPropSet(item)
                                }} 
                                className="btn-reset">
                                    <i className="fa-solid fa-plus"></i>
                            </button>
                          
                            </ul> 
                                                
                        </li>
   
            )}

            <ModalMenuWeek show={show} setShow={setShow} menuItemProp={menuItemProp}/>
             
            </ul>
            
        </div>
    </>
    )
}