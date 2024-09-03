import React, { useContext, useEffect, useState, useRef } from "react";
import DataTable from "../../Components/DataTable/DataTable";
import { FireBaseContext } from "../../Context/FireBase";
import SearchFormik from "../../Components/SearchFormik/SearchFormik";
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
  const [rows, setRows] = useState([]);

  const prevEventsRef = useRef(events);

  // Fetching event information based on user role
  useEffect(() => {
    if (currentUserRole) {
      getData(eventsQueryAccordingToUserRole(), setInformations);
    }
  }, [currentUserRole, getData, eventsQueryAccordingToUserRole]);

  // Process fetched event information
  useEffect(() => {
    const fetchDataForItems = async () => {
      const date = new Date().getTime();
      const promises = informations.map(async (item) => {
        const data = doc(EventRefrence, item.Id.toString());
        const eventSubscribersCollec = collection(data, "Subscribers");
        const subNm = await getDocs(eventSubscribersCollec);
        const NumberOfSubScribers = subNm.docs.length;
        const EndTime = new Date(item.EndDate).getTime();
        const StartTime = new Date(item.StartDate).getTime();
        let status = item.Status;
        if (StartTime > date) {
          status = "Pending";
        } else if (date > StartTime && EndTime > date) {
          status = "Started";
        } else if (date > EndTime) {
          status = "Completed";
        }
        item.Status = status;
        item.EventCost = NumberOfSubScribers * item.CostperDelegate;
        const userSnapshot = await getDoc(doc(UserRef, item.CreatedByID));
        item.CreatedByName = userSnapshot.data()?.Name;
        return item;
      });

      const results = await Promise.all(promises);

      // Only update context if the new data is different
      if (prevEventsRef.current.length !== results.length || 
          !prevEventsRef.current.every((event, idx) => event.Id === results[idx].Id && event.Status === results[idx].Status)) {
        setEvents(results.reverse());
        prevEventsRef.current = results.reverse();
      }
    };

    if (informations.length > 0) {
      fetchDataForItems();
    }
  }, [informations, EventRefrence, UserRef, setEvents]);
  return (
    <div className="d-flex flex-column container-fluid container-md gap-3 EventsPageParent">
      <h2>Events</h2>
      {!informations.length ? (
        <div
          className="w-100 d-flex justify-content-center align-items-center"
          style={{ height: "calc(100vh - 150px)" }}
        >
          <p>Create Your First Event</p>
        </div>
      ) : (
        <>
          <SearchFormik rows={events} setRows={setRows} />
          <DataTable row={rows} />
        </>
      )}
    </div>
  );
};
