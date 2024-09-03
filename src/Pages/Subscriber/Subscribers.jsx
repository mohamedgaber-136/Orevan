import React, { useContext, useEffect } from "react";
import { ChosenCard } from "../../Components/ChosenCard/ChosenCard";
import SubScribersTable from "../../Components/SubscribersTable/SubScribersTable";
import { FireBaseContext } from "../../Context/FireBase";
import { useParams } from "react-router-dom";
import { query, where, onSnapshot } from "firebase/firestore";

export const Subscribers = () => {
  const { setSubscribers, Subscribers, SubscribersRefrence } = useContext(FireBaseContext);
  const { dbID } = useParams();
  useEffect(() => {
    if (!dbID || !SubscribersRefrence) {
      return;
    }
  
    const q = query(SubscribersRefrence, where("eventID", "==", dbID));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const subscribersData = querySnapshot.docs.map((doc) => doc.data());
        setSubscribers(subscribersData);
      },
      (error) => {
        console.error("Error fetching subscribers:", error);
      }
    );
  
    return () => unsubscribe();
  }, [dbID]);
  return (
    <div className="EventsPageParent d-flex flex-column container-fluid container-md gap-3">
      <h2>Subscribers</h2>
      <div className="d-flex justify-content-center">
        <ChosenCard />
      </div>
      <SubScribersTable row={Subscribers} refCollection={SubscribersRefrence} />
    </div>
  );
};
