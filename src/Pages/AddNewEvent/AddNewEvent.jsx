import React from 'react'
import NewEvent from '../../Components/NewEvent/NewEvent'
export const AddNewEvent = () => {
  return (<div className="container EventsPageParent my-3">
      <h2 className='mb-3'>Add Event</h2>
    <div className=' container bg-white py-2 rounded rounded-2 px-2 px-md-3 pt-5 h-100  EventShadow'>
    <div>
    <NewEvent/>
    </div>
    </div>
  </div>
  )
}
