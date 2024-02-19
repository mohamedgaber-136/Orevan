
import EventsDeletedTable from './EventsDeletedTable/EventsDeletedTable';
import SubscriberDeletedTable from './SubScriberDeletedTable/SubscriberDeletedTable';
export default function DeletedTable() {
  
return (
    <div className='d-flex flex-column gap-5 justify-content-center align-items-center container' >
      <div className=" w-100">
      <h3 className=''>
        EVENTS
      </h3>
    <EventsDeletedTable/>
      </div>
      <div className='w-100'>

      <h3>
        Subscribers
      </h3>
    <SubscriberDeletedTable/>
      </div>
    </div>
)
}