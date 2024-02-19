import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
export const Protected = ({ children, nestedRoute }) => {
  const { currentUsr, currentUserRole } = useContext(FireBaseContext);
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);

  useEffect(() => {
    if (currentUserRole) console.log(currentUserRole, "role");
    setIsNotAuthorized(currentUserRole.toLowerCase().includes("brand Manager"));
  }, [currentUserRole]);

  // const isNotAuthorized = currentUserRole.toLowerCase().includes("franchise");
  console.log(isNotAuthorized, "isNotAuthorized protected");

  if (!currentUsr) {
    return <Navigate to="/" replace />;
  }
  if (isNotAuthorized && nestedRoute && currentUsr) {
    return <Navigate to="/app" replace />;
  }
  // } else {
  return children;
  // }
};
