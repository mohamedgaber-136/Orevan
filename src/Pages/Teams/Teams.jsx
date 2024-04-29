import React, { useContext, useEffect, useState } from "react";
import TeamsTable from "../../Components/TeamsTable/TeamsTable";
import { FireBaseContext } from "../../Context/FireBase";
import { getDocs, query, onSnapshot, where } from "firebase/firestore";
export const Teams = () => {
  const { TeamsRefrence, EventRefrence } = useContext(FireBaseContext);
  const [collectionKeys, setCollectionKeys] = useState([]);

  const getValue = async () => {
    const retinaRef = onSnapshot(TeamsRefrence, async (snapshot) =>
      setCollectionKeys(
        await Promise.all(
          snapshot.docs.map(async (item) => {
            const ref = await getDocs(
              query(EventRefrence, where("Franchise", "==", item.id))
            );
            const RefData = ref.docs.map((info) => ({
              ...info.data(),
              ID: info.id,
            }));
            const data = {
              name: item.id.replace("Franchise", " Franchise"),
              data: RefData,
            };
            
            return data;
          })
        )
      )
    );
  };
  useEffect(() => {
    getValue();
  }, []);


  console.log(collectionKeys,'collectionKeyss')

  if (collectionKeys.length) {
    return (
      <div className="d-flex flex-column container-fluid container-md gap-3 EventsPageParent ">
        <h2>Teams</h2>
        <TeamsTable row={collectionKeys} />
      </div>
    );
  } else {
    return (
      <div className="w-100 d-flex justify-content-center align-items-center   " style={{height:'calc(100vh - 150px) '}}> 
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
    );
  }
};
