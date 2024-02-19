import React, { useState,useContext, useEffect } from 'react'
import { Navbar } from '../navbar/Navbar'
import { FireBaseContext } from '../../Context/FireBase'
import { Outlet} from 'react-router-dom'
import arrowright from '../../assets/fast-forward.gif'
import './RootParent.css'
import { Navigate } from 'react-router-dom'
export const RootLayout = () => {
  const [navAppear,setNavAppear]=useState(false)
  const {auth}=useContext(FireBaseContext)

  
    return (
      <div className='RootParent'>
        <img src={arrowright} alt="NavArrow" onFocus={()=>setNavAppear(true)} onBlur={()=>setNavAppear(false)
        }  tabIndex={0}/>
          <Navbar navAppear={navAppear}/>
          <Outlet/>
      </div>
  )
 
 
}
