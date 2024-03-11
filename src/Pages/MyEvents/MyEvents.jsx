import { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import { collection, getDocs, doc } from "firebase/firestore";
import FranchiseTable from "../../Components/FranchiseTable/FranchiseTable";
import { useLocation } from "react-router-dom";
export const MyEvents = () => {
  const { state } = useLocation();
  const [sub, setSub] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [data, setdata] = useState(state.data);
  const { EventRefrence } = useContext(FireBaseContext);
  useEffect(() => {
    // query to filter evemts according to role
    const fetchData = async () => {
      const EventDetails = await Promise.all(
        state.data.map(async (maidDoc) => {
          const ref = doc(EventRefrence, maidDoc.ID);
          const infoCollection = collection(ref, "Subscribers");
          const subObj = await getDocs(infoCollection);
          const subData = subObj.docs.map((subDoc) => ({
            id: subDoc.id,
            ...subDoc.data(),
          }));
          maidDoc["Team"] = subData;
          return maidDoc;
        })
      );
      setCombinedData(EventDetails);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length) {
      // هنا عملنا تغيير من غير ReRender
      const date = new Date().getTime();
      const fetchDataForItems = async () => {
        const promises = data.map(async (item) => {
          const data = doc(EventRefrence, item.ID);
          const eventSubscribersCollec = collection(data, "Subscribers");
          const subNm = await getDocs(eventSubscribersCollec);
          const NumberOfSubScribers = subNm.docs.length;
          const cost = item.CostperDelegate;
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
        setdata(results);
      };
      fetchDataForItems();
    }
  }, []);

  useEffect(() => {
    let x = combinedData.map((item) => ({
      CurrentEventID: item.ID,
      ...item,
    }));
    setSub(x);
  }, [combinedData]);

  return (
    <div className="d-flex flex-column container gap-3 EventsPageParent ">
      <h2>{state.name}</h2>
      {!combinedData.length ? (
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
        <FranchiseTable row={data} sub={sub} />
      )}
    </div>
  );
};
