import React, { useContext, useEffect, useState } from "react";
import DataTable from "../../Components/DataTable/DataTable";
import "./Event.css";
import { FireBaseContext } from "../../Context/FireBase";
import { collection, getDocs, doc } from "firebase/firestore";
export const Events = () => {
  const {
    events,
    getData,
    setEvents,
    EventRefrence,
    currentUserRole,
    eventsQueryAccordingToUserRole,
  } = useContext(FireBaseContext);
  const [informations, setInformations] = useState([]);
  useEffect(() => {
    if (currentUserRole) {
      getData(eventsQueryAccordingToUserRole(), setInformations);
    }
  }, [currentUserRole]);

  useEffect(() => {
    if (informations.length) {
      // هنا عملنا تغيير من غير ReRender
      const date = new Date().getTime();
      const fetchDataForItems = async () => {
        const promises = informations.map(async (item) => {
          const data = doc(EventRefrence, item.ID);
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
          return item;
        });
        const results = await Promise.all(promises);
        setEvents(results);
      };
      fetchDataForItems();
    } else {
      // this line is important to reset the data when delete all but it is the reason of the rerendering of events
      setEvents([]);
    }
  }, [informations]);

  return (
    <div className="d-flex flex-column container gap-3 EventsPageParent ">
      <h2>Events</h2>
      <DataTable row={events} />
    </div>
  );
};
