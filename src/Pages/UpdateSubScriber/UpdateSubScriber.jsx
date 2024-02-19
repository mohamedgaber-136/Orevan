import React from 'react'
import {useParams } from 'react-router-dom'
import { UpdateSubscriberForm } from '../../Components/UpdateSubscriberForm/UpdateSubscriberForm'
import DropDownEvents  from '../../Components/DropDownEvents/DropDownEvents'
 const UpdateSubScriber = () => {
    const {UserDbID,id,userId} = useParams()
  return (
    <div className='d-flex flex-column container gap-3 EventsPageParent '>
  <h2>Update Subscriber</h2>
  <h4 >user: <span>{userId}</span></h4>
  <div className="d-flex align-items-center gap-2 ">
    <div >

  <h3 className='m-0'>event: <span>{id}</span></h3>
    </div>
  <DropDownEvents/>
  </div>
    <UpdateSubscriberForm/>
    </div>
    )
}
export default UpdateSubScriber;