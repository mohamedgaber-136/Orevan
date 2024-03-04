import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
export const PrivateRoute = ({ children }) => {
  const { currentUserRole } = useContext(FireBaseContext);
  // const [isNotAuthorized, setIsNotAuthorized] = useState(false);

  // useEffect(() => {
  //   if (currentUserRole) {
  //     setIsNotAuthorized(!currentUserRole.admin);
  //     // setIsNotAuthorized(currentUserRole.toLowerCase().includes("brand manager"));
  //   }
  // }, [currentUserRole]);

  // useEffect(() => {
  //   if (currentUsr && currentUserRole) {
  //     setIsReady(true);
  //   }
  // }, [currentUsr, currentUserRole]);

  console.log(currentUserRole, "currentUserRole protected");

  // const check = () => {
  //   if (!currentUsr) {
  //     return <Navigate to="/" replace />;
  //   }
  //   return children;
  // };

  // useEffect(() => {
  //   check();
  // }, [currentUsr]);

  if (currentUserRole.admin) {
    return children;
  }
  if (currentUserRole.manager || currentUserRole.user) {
    return <Navigate to="/app" replace />;
  }
  // if (currentUsr) {
  // }

  // const isNotAuthorized = currentUserRole.toLowerCase().includes("franchise");

  // if (isReady) {
  // if (!currentUsr) {
  //   return <Navigate to="/" replace />;
  // }
  // return children;
  // }

  // {
  //   currentUsr ? <Redirect to="/" /> : <Redirect to="/" />;
  // }

  // if (isReady) {
  //   if (!currentUsr) {
  //     return <Navigate to="/" replace />;
  //   }
  //   if (isNotAuthorized && nestedRoute && currentUsr) {
  //     return <Navigate to="/app" replace />;
  //   }
  //   // else {
  //   return children;
  // }
  // }
  // // } else {
  // return children;
  // }
};
