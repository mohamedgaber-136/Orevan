import {useNavigate} from 'react-router-dom'
import AlertBadge from '../AlertBage/AlertBadge'

import { BinBadge } from '../binBadge/BinBadge'
import  ProfileMenu  from '../ProfileMenu/ProfileMenu'
import ModalProfileData from '../ModalProfileData/ModalProfileData'
export const ProfileNav = () => {
  const navigate = useNavigate()
  
  return (
<div className=' d-flex justify-content-between flex-column container align-items-end gap-2'>
    <div className='d-flex ProfileNavParen justify-content-end  container align-items-center  gap-3'>
    <AlertBadge/>
    <BinBadge/>
    <ProfileMenu/>
    </div>
    <button onClick={()=>navigate('AddEvents')}  className='rounded-pill btn-DarkBlue btn px-3 py-2 d-flex align-items-center gap-2 AddEventBtn'>
        <span className="text-white">Add Event</span><i className="fa-light fa-plus text-white"></i>
        </button>
</div>  )
}
