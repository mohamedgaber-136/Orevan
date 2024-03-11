import React, { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import AllUsersTable from "../../Components/AllUsersTable/AllUsersTable";

export const AllUsers = () => {
  const { getData ,UserRef } = useContext(FireBaseContext);
  const [informations, setInformations] = useState([]);


  useEffect(() => {
    getData(UserRef, setInformations);
  }, []);
  if(!informations.length){
    return <div className="w-100 d-flex justify-content-center align-items-center   " style={{height:'calc(100vh - 150px) '}}> 
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
  }
  return (
    <div className="d-flex flex-column container-fluid container-md gap-3 EventsPageParent ">
      <h2>All Users</h2> <AllUsersTable row={informations} />
    </div>
  );
};
