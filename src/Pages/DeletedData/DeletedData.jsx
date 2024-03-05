import React from "react";
import { Outlet } from "react-router-dom";
import AppBar from "./AppBar/AppBar";

export const DeletedData = () => {
  return (
    <div>
      <AppBar />
      <Outlet />
    </div>
  );
};
