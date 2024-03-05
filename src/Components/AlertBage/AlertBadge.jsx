import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { FireBaseContext } from "../../Context/FireBase";
import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import SnackBarItem from "../SnackBarItem/SnackBarItem";

export default function AlertBadge() {
  const navigation = useNavigate();
  const {
    triggerNum,
    setTriggerNum,
    database,
    currentUsr,
    currentUserRole,
  } = useContext(FireBaseContext);
  const [snackBarConfig, setSanckBarConfig] = useState({
    open: false,
    message: "",
  });

  function notificationsLabel(count) {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  }

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Set up real-time listener for changes in the 'notifications' collection
    const notificationsQuery = query(
      collection(database, "notifications"),
      where("CreatedByID", "!=", currentUsr)
    );
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const newNotifications = [];

      if (currentUserRole.admin) {
        snapshot.docs.map((docItem) =>
          newNotifications.push({
            id: docItem.id,
            ...docItem.data(),
          })
        );
      } else if (currentUserRole.manager) {
        snapshot.docs.map(
          (docItem) =>
            docItem.data().EventFranchise == currentUserRole.franchiseType &&
            newNotifications.push({
              id: docItem.id,
              ...docItem.data(),
            })
        );
      }
      console.log(newNotifications, "filtered notifications");

      const editedNotifications = newNotifications
        .sort((x, y) =>
          new Date(x.CreatedAt).getTime() < new Date(y.CreatedAt).getTime()
            ? 1
            : -1
        )
        .map((notify, index) => {
          if (index === 0) {
            const currentDate = new Date().getTime();
            // check if the notification created during 1000 milliseconds
            if (
              notify.TimeStamp <= currentDate &&
              notify.TimeStamp >= currentDate - 10000 &&
              !notify.isReadUsersID.find((item) => item === currentUsr)
            ) {
              console.log("New Notification");
              setSanckBarConfig({
                open: true,
                message: "You have new notification",
              });
            }
            // console.log(new Date("Mon Feb 19 2024 15:41:00").getTime(), "test");
            // console.log(new Date("Mon Feb 19 2024 15:42:00").getTime(), "test");
            // one minute == 60000 miliseconds
          }
          const found = notify.isReadUsersID.find((item) => item == currentUsr);
          if (found) {
            return { ...notify, isRead: true };
          }
          return { ...notify, isRead: false };
        });
      // sort notify
      setTriggerNum(
        editedNotifications.slice(0, 5).filter(({ isRead }) => isRead == false)
          .length
      );

      setNotifications([...editedNotifications]);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [currentUserRole]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (EventID, NewEventID, notifyID) => {
    setAnchorEl(null);
    navigation(`/app/subscribers/${EventID}/${NewEventID}`);
    const currentNotification = notifications.find(({ id }) => id == notifyID);
    await updateDoc(doc(database, "notifications", notifyID), {
      isReadUsersID: [...currentNotification?.isReadUsersID, currentUsr],
    });
    currentNotification.isRead = true;
  };
  return (
    <>
      <IconButton
        onClick={(e) => {
          handleClick(e);
        }}
        aria-label={notificationsLabel(triggerNum)}
      >
        <Badge
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          badgeContent={triggerNum}
          color="warning"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <SnackBarItem
        snackBarConfig={snackBarConfig}
        setSnackBarConfig={setSanckBarConfig}
      />

      {notifications.length !== 0 && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {notifications.slice(0, 5).map((notify, notifyIndex) => (
            <>
              <MenuItem
                onClick={() =>
                  handleClose(notify.EventID, notify.NewEventID, notify.id)
                }
                key={notify.id}
                className={`mx-2 rounded text-dark ${
                  !notify.isRead && "bg-light"
                }`}
              >
                <div className="text-wrap w-100">
                  <div className="fs-6">
                    <span className="fw-semibold">{notify.CreatedBy}</span>
                    {/* <span className="px-1">{`added a new event:`}</span> */}
                    <span className="px-1">{notify.NotifyMessage}:</span>
                    <span className="d-block fst-italic">{`"${notify.EventName}"`}</span>
                  </div>
                  <span
                    className="px-2 text-dark-emphasis"
                    style={{ fontSize: "13px" }}
                  >
                    {new Date(notify.CreatedAt).toDateString()}
                  </span>
                </div>
              </MenuItem>
              {notifyIndex !== notifications.length - 1 && (
                <Divider variant="middle" component="li" />
              )}
            </>
          ))}
        </Menu>
      )}
    </>
  );
}
