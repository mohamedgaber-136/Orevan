import { useContext,useEffect } from 'react'
import { CreateUser } from '../../Components/CreatUser/CreateUser'
import { FireBaseContext } from '../../Context/FireBase'
import { Navigate } from "react-router-dom";

export const Users = () => {
  const {currentUserRole} = useContext(FireBaseContext)
  console.log(currentUserRole,'currentUserRole')
    return (
      <div className='d-flex flex-column container gap-3 EventsPageParent '>
  <h2>Create New User</h2>
  <CreateUser/>
  </div>  )

}
