import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
export const Protected = ({ children }) => {
  const { currentUsr } = useContext(FireBaseContext);

  if (currentUsr == null) {
    return <Navigate to="/" replace />;
  }

  return children;
};
