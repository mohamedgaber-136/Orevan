import { useContext } from "react";
import { FireBaseContext } from "../../Context/FireBase";
export const PreviewCard = () => {
  const { newEvent } = useContext(FireBaseContext);
  return (
    <div className="w-100  d-flex justify-content-center align-items-center">
      <div className=" previewCardParent p-2  rounded-2 ">
        <h3 className="py-1">Preview Event Data</h3>
        <div className="d-flex gap-2 flex-column">
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>ID:</b>
            </p>
            <p className="m-0">{newEvent.Id}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>Event Name:</b>
            </p>
            <p className="m-0">{newEvent.EventName}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>Franchise:</b>
            </p>
            <p className="m-0">{newEvent.Franchise}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>P3:</b>
            </p>
            <p className="m-0">{newEvent.P3}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>Cost per Delegate::</b>
            </p>
            <p className="m-0">{newEvent.CostperDelegate}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>Created At:</b>
            </p>
            <p className="m-0">{newEvent.CreatedAt}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>Start Date:</b>
            </p>
            <p className="m-0"> {newEvent.StartDate}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>Font Color:</b>
            </p>
            <div className='border' style={{backgroundColor:`${newEvent.FontColor}`,width:'50px',height:'5px',borderRadius:'5px'}}> </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>Background Color:</b>
            </p>
            <div className='border' style={{backgroundColor:`${newEvent.BackGroundColor}`,width:'50px',height:'5px',borderRadius:'5px'}}> </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>Button Color:</b>
            </p>
            <div className='border' style={{backgroundColor:`${newEvent.ButtonColor}`,width:'50px',height:'5px',borderRadius:'5px'}}> </div>
          </div>
      
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>End Date:</b>
            </p>
            <p className="m-0"> {newEvent.EndDate}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>City:</b>
            </p>
            {newEvent.City.map((item,index) => (
              <div className="wrappingItems p-1 " key={index}>{item.types}</div>
            ))}
          </div>
          <div className="d-flex align-items-center gap-2">
            <p className="m-0">
              <b>Transfer of value:</b>
            </p>
            {newEvent.TransferOfValue.map((item ,index) => (
              <div className="wrappingItems p-1 " key={index}>{item.types}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
