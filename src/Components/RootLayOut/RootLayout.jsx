import React, { useState } from "react";
import { Navbar } from "../navbar/Navbar";
import { Outlet } from "react-router-dom";
import arrowright from "../../assets/menu-grid-svgrepo-com.svg";
import "./RootParent.css";
import AnimatedBarsButton from "../AnimatedBtn/AnimatedBarsButton";
export const RootLayout = () => {
  const [navAppear, setNavAppear] = useState(false);

  return (
    <div className="RootParent">
      <img
        src={arrowright}
        alt="NavArrow"
        onFocus={() => setNavAppear(true)}
        onBlur={() => setNavAppear(false)}
        tabIndex={0}
      />
    
<Navbar navAppear={navAppear} />
      <Outlet />
    </div>
  );
};
