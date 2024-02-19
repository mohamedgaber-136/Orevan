import React, { useContext, useEffect, useState } from 'react'
import TeamsTable from '../../Components/TeamsTable/TeamsTable'
import { FireBaseContext } from '../../Context/FireBase'
import { collection, getDocs,query,onSnapshot,doc,getDoc ,where } from 'firebase/firestore'
import { Navigate } from "react-router-dom";
export const Teams = () => {
const {setTeams,TeamsRefrence,currentUserRole,EventRefrence} = useContext(FireBaseContext)
const [collectionKeys, setCollectionKeys] = useState([]);
const getValue = async ()=>{
    const retinaRef = onSnapshot(TeamsRefrence,async (snapshot )=>setCollectionKeys(await Promise.all( snapshot.docs.map( async (item)=> {
      const ref = await getDocs(query(EventRefrence,where('Franchise',"==",item.id)))
      const RefData = ref.docs.map((info)=>({...info.data(),ID:info.id}))
       const data =  {name:item.id.replace('Franchise',' Franchise'),data:RefData}
       console.log(data)
       return data;
    }))))
      
  } 
useEffect(()=>{
  getValue()
},[])
console.log(collectionKeys)

    return (
      <div className='d-flex flex-column container gap-3 EventsPageParent '>
      <h2>Teams</h2>
   <TeamsTable  row={collectionKeys}  /> 
      </div>
  )
}

