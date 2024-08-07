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
        item.CreatedByName = userSnapshot.data()?.Name;
        return item;
      });
      const results = await Promise.all(promises);
      setEvents(results.reverse());
    };
    fetchDataForItems();
  }, [informations]);
  return (
    <div className="d-flex flex-column container-fluid container-md gap-3 EventsPageParent ">
      <h2>Events</h2>
      {!informations.length ? (
        <div
          className="w-100 d-flex justify-content-center align-items-center   "
          style={{ height: "calc(100vh - 150px) " }}
        >
       
          <p>Create Your First Event </p>
        </div>
      ) : (
        <DataTable row={events} />
      )}
    </div>
  );
};
