import React, { useContext, useEffect } from "react";
import { ChosenCard } from "../../Components/ChosenCard/ChosenCard";
import SubScribersTable from "../../Components/SubscribersTable/SubScribersTable";
import { FireBaseContext } from "../../Context/FireBase";
import { useParams } from "react-router-dom";
import { collection, doc } from "firebase/firestore";
export const Subscribers = () => {
  const { setSubscribers, getData, Subscribers, EventRefrence } = useContext(
    FireBaseContext
  );
  const { dbID } = useParams();
  const ref = doc(EventRefrence, dbID);
  const infoCollection = collection(ref, "Subscribers");
  useEffect(() => {
    getData(infoCollection, setSubscribers);
    }, [dbID]);
    console.log(Subscribers)
    return (
    <div className="EventsPageParent d-flex flex-column container-fluid container-md gap-3  ">
      <h2>Subscribers</h2>
      <div className="d-flex justify-content-center">
        <ChosenCard />
      </div>
      <SubScribersTable row={Subscribers} refCollection={infoCollection} />
    </div>
  );
};
