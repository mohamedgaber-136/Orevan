import "./Navbar.css";
import LogoImg from "../../assets/logo.png";
import LogoTwo from "../../assets/Logo2.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
export const Navbar = ({ navAppear }) => {
  const navigate = useNavigate();
  // const{userId} = useContext(FireBaseContext)
  const { currentUserRole } = useContext(FireBaseContext);
  const { pathname } = useLocation();
  const [focusedButton, setFocusedButton] = useState(null);
  const [isAllowedUser, setIsAllowedUser] = useState(null);
  console.log(isAllowedUser)
  const handleFocus = (id) => {
    setFocusedButton(id);
  };
  useEffect(() => {
    switch (pathname) {
      case "/app":
        setFocusedButton(0);
        break;
      case "/app/events":
        setFocusedButton(1);
        break;
      case "/app/profile":
        setFocusedButton(3);
        break;
      case "/app/teams":
        setFocusedButton(2);
        break;
        default:
    }
  }, [pathname]);

  useEffect(() => {
    if (currentUserRole)
      setIsAllowedUser(currentUserRole.toLowerCase().includes("brand manager"));
  }, [currentUserRole]);

  const MenuData = [
    {
      icon: "fa-solid fa-house",
      data: "Dashboard",
      nav: "/app",
    },
    {
      icon: "fa-regular fa-calendar",
      data: "Events",
      nav: "events",
    },
    isAllowedUser && {
      icon: "fa-solid fa-users",
      data: "Teams",
      nav: "teams",
    },
    // {
    //   icon: "fa-solid fa-file-lines",
    //   data: "Profile",
    //   nav: "Profile",
    // },
    isAllowedUser && {
      icon: "fa-solid fa-people-group",
      data: "Users",
      nav: "Users",
    },
  ];
  return (
    <nav className={`MainNav ${navAppear && "appearNav"}`}>
      <div className="container  d-flex flex-column  py-5   justify-content-between align-items-center h-100">
        <div>
          <img src={LogoImg} alt="Logo" />
          <ul className="d-flex align-items-center  flex-column p-0 gap-3 MainNavList">
            {MenuData.map(
              (item, indx) =>
                item && (
                  <li
                    className={` ${
                      indx == focusedButton && "selectedBtn"
                    } gap-2 d-flex align-items-center justify-content-center rounded-3 rounded px-5 py-2 `}
                    key={`${item?.icon}-${indx}`}
                    onClick={() => {
                      navigate(item?.nav);
                    }}
                    onFocus={() => handleFocus(indx)}
                    tabIndex={indx}
                  >
                    <i className={item?.icon}></i>
                    <div className="  d-flex justify-content-start">
                      {item?.data}
                    </div>
                  </li>
                )
            )}
          </ul>
        </div>
        <div className="SecondMenuLogo">
          <img src={LogoTwo} alt="SecondLogo" />
        </div>
      </div>
    </nav>
  );
};
