import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
export const Protected = ({ children, nestedRoute }) => {
  const { currentUsr, currentUserRole } = useContext(FireBaseContext);
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);

  useEffect(() => {
    if (currentUserRole){
      setIsNotAuthorized(currentUserRole.toLowerCase().includes("brand manager"));
    }
    
  }, [currentUserRole]);

  // const isNotAuthorized = currentUserRole.toLowerCase().includes("franchise");
  console.log(isNotAuthorized, "isNotAuthorized protected");

  // if (!currentUsr) {
  //   return <Navigate to="/" replace />;
  // }else{
     return children;
  // }
  // if (isNotAuthorized && nestedRoute && currentUsr) {
  //   return <Navigate to="/app" replace />;
  // }
  // // } else {
  // return children;
  // }
};
