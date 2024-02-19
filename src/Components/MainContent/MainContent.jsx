import { ProfileNav } from '../ProfileNav/ProfileNav'
import './MainContent.css'
import { Outlet} from 'react-router-dom'
export const MainContent = () => {
   
  return (
    <div className='MainContent py-3'>
              <ProfileNav/>
       <Outlet/>
    </div>
  )
}
