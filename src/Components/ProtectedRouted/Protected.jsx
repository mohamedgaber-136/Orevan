import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
export const Protected = ({ children, nestedRoute }) => {
  const { currentUsr, currentUserRole } = useContext(FireBaseContext);
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (currentUserRole) {
      setIsNotAuthorized(!currentUserRole.admin);
      // setIsNotAuthorized(currentUserRole.toLowerCase().includes("brand manager"));
    }
  }, [currentUserRole]);

  useEffect(() => {
    if (currentUsr && currentUserRole) {
      setIsReady(true);
    }
  }, [currentUsr, currentUserRole]);

  // const isNotAuthorized = currentUserRole.toLowerCase().includes("franchise");

  if (isReady) {
    if (!currentUsr) {
      return <Navigate to="/" replace />;
    }
    if (isNotAuthorized && nestedRoute && currentUsr) {
      return <Navigate to="/app" replace />;
    }
    // else {
    return children;
  }
  // }
  // // } else {
  // return children;
  // }
};
