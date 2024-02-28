import React, { useContext, useEffect, useState } from 'react'
import { FireBaseContext } from '../../Context/FireBase'
import AllUsersTable from '../../Components/AllUsersTable/AllUsersTable'

export const AllUsers = () => {
    const {getData,SubscribersRef} =useContext(FireBaseContext)
    const [informations,setInformations]=useState([])
    useEffect(()=>{
        getData(SubscribersRef, setInformations);
    },[])
    console.log(informations)
  return (
    <div className="d-flex flex-column container gap-3 EventsPageParent ">
    <h2>All Users</h2>        <AllUsersTable rows={informations}   />
    </div>
  )
}
