import React, { useContext } from "react";
import { FireBaseContext } from "../../Context/FireBase";

const PrivateRoute = ({ children }) => {
  const { currentUserRole } = useContext(FireBaseContext);

  if (!currentUserRole.admin == null) {
    // return <Navigate to="/" replace />;
    return <></>;
  }

  return children;
};

export default PrivateRoute;
