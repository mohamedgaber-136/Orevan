import React, { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import AllUsersTable from "../../Components/AllUsersTable/AllUsersTable";

export const AllUsers = () => {
  const { getData ,UserRef } = useContext(FireBaseContext);
  const [informations, setInformations] = useState([]);


  useEffect(() => {
    getData(UserRef, setInformations);
  }, []);
  console.log(informations,'info')
  return (
    <div className="d-flex flex-column container gap-3 EventsPageParent ">
      <h2>All Users</h2> <AllUsersTable row={informations} />
    </div>
  );
};
