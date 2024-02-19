import { createContext, useState } from "react";

export const SearchContext = createContext()

 const SearchContextProvider = ({children}) =>{
    const [filterType,setFilterType]=useState('Id')
    const [ChosenItem ,setChosenItem] = useState(false)
    const [ShowAddNeWSub,setShowAddNeWSub] = useState(false)
    const [AccpetAllTermss,setAccpetAll] = useState(false)
    const [ShowUpdateSub,setShowUpdate] = useState(false)
   return <SearchContext.Provider value={{ShowUpdateSub,setShowUpdate,setAccpetAll,AccpetAllTermss,setShowAddNeWSub,ShowAddNeWSub,filterType,setFilterType,ChosenItem,setChosenItem}}>
        {children}
    </SearchContext.Provider>
}
export default SearchContextProvider ;