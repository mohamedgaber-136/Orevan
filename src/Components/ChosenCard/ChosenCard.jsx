import { useContext, useEffect, useState } from "react";
import "./ChosenCardStyle.css";
import { getDoc, doc } from "firebase/firestore";
import { FireBaseContext } from "../../Context/FireBase";
import { useParams } from "react-router-dom";
export const ChosenCard = () => {
  const { dbID } = useParams();
  const { EventRefrence } = useContext(FireBaseContext);
  const [ResultData, setResultData] = useState(null);
  useEffect(() => {
    const itemRef = doc(EventRefrence, dbID);
    (async () => {
      const datas = await getDoc(itemRef);
      const Result = await datas.data();
      setResultData(Result);
    })();
  }, [dbID]);

  return (
    // Dashboard Events Counts Card ----------------------------------
    <div className="w-100">
      {ResultData ? (
        <div className=" choosenCard bg-white px-3 py-2 rounded-2 rounded w-100 shadow">
          <h2 className="EventDetailTitle">Event Details</h2>
          <div className="  my-3 gap-2  d-flex flex-md-wrap flex-column flex-md-row ">
            <div className="d-flex flex-column gap-2 justify-content-between ">
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>ID:</b>
                </p>
                <p className="m-0 px-2 ">{ResultData.Id}</p>
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>Event Name:</b>
                </p>
                <p className="m-0 px-2 ">{ResultData.eventName}</p>
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>Franchise:</b>
                </p>
                <p className="m-0 px-2 ">{ResultData.Franchise}</p>
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>BeSure:</b>
                </p>
                <p className="m-0 px-2 ">{ResultData.BeSure}</p>
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>PO:</b>
                </p>
                <p className="m-0 px-2 ">{ResultData.PO}</p>
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>Cost per Delegate:</b>
                </p>
                <p className="m-0 px-2 ">{ResultData.CostperDelegate}</p>
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>Created At:</b>
                </p>
                <p className="m-0 px-2 ">{ResultData.CreatedAt}</p>
              </div>
            </div>
            <div className="d-flex flex-column gap-2 justify-content-between ">
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>Start Date:</b>
                </p>
                <p className="m-0 px-2 ">{ResultData.eventDate}</p>
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>End Date:</b>
                </p>
                <p className="m-0 px-2 ">{ResultData.endDate}</p>
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>City:</b>
                </p>
                {ResultData.city.map((item,ind) => (
                  <div key={ind} className="wrappingItems p-1 ">{item}</div>
                ))}
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>Transfer of Value:</b>
                </p>
                {ResultData.TransferOfValue.map((item,ind) => (
                  <div key={ind} className="wrappingItems p-1 ">
                    <p className="m-0">
                      <span className="text-white">{item.types} :</span>
                      <span className="text-white"> {item.value}</span>
                    </p>
                  </div>
                ))}
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>Background Color:</b>
                </p>
                <div
                  className="showColor border border-2"
                  style={{ backgroundColor: ResultData.bgColor }}
                ></div>
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>Button Color:</b>
                </p>
                <div
                  className="showColor border border-2"
                  style={{ backgroundColor: ResultData.btnColor }}
                ></div>
              </div>
              <div className={`d-flex align-items-center gap-2 `}>
                <p className="m-0">
                  <b>Font Color:</b>
                </p>
                <div
                  className="showColor border border-2"
                  style={{ backgroundColor: ResultData.fontColor }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-100 d-flex justify-content-center">
          <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
          </div>
        </div>
      )}
    </div>
  );
};
