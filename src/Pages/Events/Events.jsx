import React, { useContext, useEffect, useState } from "react";
import DataTable from "../../Components/DataTable/DataTable";
import "./Event.css";
import { FireBaseContext } from "../../Context/FireBase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
export const Events = () => {
  const {
    events,
    getData,
    setEvents,
    EventRefrence,
    currentUserRole,
    eventsQueryAccordingToUserRole,
    UserRef,
  } = useContext(FireBaseContext);
  const [informations, setInformations] = useState([]);
  useEffect(() => {
    // if (currentUserRole) {
    //   getData(eventsQueryAccordingToUserRole(), setInformations);
    // }
    getData(eventsQueryAccordingToUserRole(), setInformations);
  }, []);

  useEffect(() => {
    // هنا عملنا تغيير من غير ReRender
    const date = new Date().getTime();
    const fetchDataForItems = async () => {
      const promises = informations.map(async (item) => {
        const data = doc(EventRefrence, item.Id.toString());
        const eventSubscribersCollec = collection(data, "Subscribers");
        const subNm = await getDocs(eventSubscribersCollec);
        const NumberOfSubScribers = subNm.docs.length;
        const EndTime = new Date(item.EndDate).getTime();
        const StartTime = new Date(item.StartDate).getTime();
        if (StartTime > date) {
          item.Status = "Pending";
        } else if (date > StartTime && EndTime > date) {
          item.Status = "Started";
        } else if (date > EndTime) {
          item.Status = "Completed";
        }
        item.EventCost = NumberOfSubScribers * item.CostperDelegate;
        const userSnapshot = await getDoc(doc(UserRef, item.CreatedByID))
        item.CreatedByName = userSnapshot.data().Name;
        return item;
      });
      const results = await Promise.all(promises);
      // const compareDate = new Date("2024-04-29")
      // const finaleResult = results.filter((item)=>compareDate<= new Date(item.CreatedAt))
      // console.log(finaleResult)
      setEvents(results.reverse());
      // setEvents(finaleResult);
    };
    fetchDataForItems();
  }, [informations]);
  console.log(events, "events");
  return (
    <div className="d-flex flex-column container-fluid container-md gap-3 EventsPageParent ">
      <h2>Events</h2>
      {!informations.length ? (
        <div
          className="w-100 d-flex justify-content-center align-items-center   "
          style={{ height: "calc(100vh - 150px) " }}
        >
          <div className="dot-spinner ">
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
      ) : (
        <DataTable row={events} />
      )}
    </div>
  );
};
