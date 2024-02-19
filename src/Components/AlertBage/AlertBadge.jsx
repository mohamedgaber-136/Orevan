import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { FireBaseContext } from "../../Context/FireBase";
// import UseMenu from '../testing-zolfa'
// import Notification from '../Notification/Notification'
import React, { useState, useEffect, useContext } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import SnackBarItem from "../SnackBarItem/SnackBarItem";

export default function AlertBadge() {
  const navigation = useNavigate();
  const { triggerNum, setTriggerNum, database, currentUsr } = useContext(
    FireBaseContext
  );
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
      console.log(triggerNum, "triggerNum");

      // setSanckBarConfig({ open: true, message: 'New Notification'});

      const newNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const editedNotifications = newNotifications
        .sort((x, y) =>
          new Date(x.CreatedAt).getTime() < new Date(y.CreatedAt).getTime()
            ? 1
            : -1
        )
        .map((notify, index) => {
          if (index == 0) {
            console.log(new Date(notify.TimeStamp));
            console.log(new Date(notify.TimeStamp).getTime());
            const currentDate = new Date().getTime();
            console.log(new Date());
            console.log(currentDate, "current");
            // check if the notification created during 1000 milliseconds
            if (
              notify.TimeStamp <= currentDate &&
              notify.TimeStamp >= currentDate - 10000 &&
              !notify.isReadUsersID.find((item) => item == currentUsr)
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
      console.log(triggerNum, "triggerNum");
      setTriggerNum(
        editedNotifications.slice(0, 5).filter(({ isRead }) => isRead == false)
          .length
      );

      setNotifications([...editedNotifications]);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // if (currentUserRole.toLowerCase().includes("manager")) {
  //   const notificationsQuery = query(
  //     collection(database, "notifications"),
  //     where("CreatedByID", "!=", currentUsr)
  //   );
  //   const unsubscribe = onSnapshot(notificationsQuery, async (snapshot) => {
  //     console.log(triggerNum, "triggerNum");

  //     let newNotifications = [];

  //     if (currentUserRole.toLowerCase().includes("franchise")) {
  //       const holder = [];
  //       snapshot.docs.map(async (docItem) => {
  //         const franchiseType = currentUserRole.split("-")[1];
  //         const event = await getDoc(
  //           doc(EventRefrence, docItem.data().NewEventID)
  //         );
  //         console.log(event.data(), "EventRefrence");

  //         if (event.Franchise == franchiseType) {
  //           holder.push({
  //             id: docItem.id,
  //             ...docItem.data(),
  //           });
  //           // return {
  //           //   id: docItem.id,
  //           //   ...docItem.data(),
  //           // };
  //         }
  //       });

  //       newNotifications = [...holder];
  //     } else {
  //       newNotifications = snapshot.docs.map(async (docItem) => ({
  //         id: docItem.id,
  //         ...docItem.data(),
  //       }));
  //     }

  //     // const newNotifications = await Promise.all(
  //     //   snapshot.docs.map(async (docItem) => {
  //     //     if (currentUserRole.toLowerCase().includes("franchise")) {
  //     //       const franchiseType = currentUserRole.split("-")[1];
  //     //       console.log(franchiseType, "franchiseType notify");
  //     //       const event = await getDoc(
  //     //         doc(EventRefrence, docItem.data().NewEventID)
  //     //       );
  //     //       console.log(event.data(), "EventRefrence");

  //     //       if (event.Franchise == franchiseType) {
  //     //         return {
  //     //           id: docItem.id,
  //     //           ...docItem.data(),
  //     //         };
  //     //       }
  //     //     } else {
  //     //       return {
  //     //         id: docItem.id,
  //     //         ...docItem.data(),
  //     //       };
  //     //     }
  //     //     return null;
  //     //   })
  //     // );
  //     console.log(newNotifications, "newNotifications");

  //     const editedNotifications = newNotifications
  //       .sort((x, y) =>
  //         new Date(x.CreatedAt).getTime() < new Date(y.CreatedAt).getTime()
  //           ? 1
  //           : -1
  //       )
  //       .map((notify, index) => {
  //         if (index == 0) {
  //           console.log(new Date(notify.TimeStamp));
  //           console.log(new Date(notify.TimeStamp).getTime());
  //           const currentDate = new Date().getTime();
  //           console.log(new Date());
  //           console.log(currentDate, "current");
  //           // check if the notification created during 1000 milliseconds
  //           if (
  //             notify.TimeStamp <= currentDate &&
  //             notify.TimeStamp >= currentDate - 10000 &&
  //             !notify.isReadUsersID.find((item) => item == currentUsr)
  //           ) {
  //             console.log("New Notification");
  //             setSanckBarConfig({
  //               open: true,
  //               message: "You have new notification",
  //             });
  //           }
  //           // console.log(new Date("Mon Feb 19 2024 15:41:00").getTime(), "test");
  //           // console.log(new Date("Mon Feb 19 2024 15:42:00").getTime(), "test");
  //           // one minute == 60000 miliseconds
  //         }
  //         const found = notify.isReadUsersID.find(
  //           (item) => item == currentUsr
  //         );
  //         if (found) {
  //           return { ...notify, isRead: true };
  //         }
  //         return { ...notify, isRead: false };
  //       });
  //     // sort notify
  //     console.log(triggerNum, "triggerNum");
  //     setTriggerNum(
  //       editedNotifications
  //         .slice(0, 5)
  //         .filter(({ isRead }) => isRead == false).length
  //     );

  //     setNotifications([
  //       ...editedNotifications,
  //       // .filter((item) => item.isRead == false)
  //       // .sort((x, y) => {
  //       //   if (
  //       //     new Date(x.CreatedAt).getTime() <
  //       //     new Date(y.CreatedAt).getTime()
  //       //   ) {
  //       //     return 1;
  //       //   }
  //       //   if (
  //       //     new Date(x.CreatedAt).getTime() >
  //       //     new Date(y.CreatedAt).getTime()
  //       //   ) {
  //       //     return -1;
  //       //   }
  //       //   return 0;
  //       // }),
  //     ]);
  //   });

  //   // Clean up the listener when the component unmounts
  //   return () => unsubscribe();
  // }

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (EventID, NewEventID, notifyID) => {
    setAnchorEl(null);

    const currentNotification = notifications.find(({ id }) => id == notifyID);
    await updateDoc(doc(database, "notifications", notifyID), {
      isReadUsersID: [...currentNotification?.isReadUsersID, currentUsr],
    });
    // const evenDoc = doc(,NewEventID)
    currentNotification.isRead = true;
    navigation(`/app/subscribers/${EventID}/${NewEventID}`);
  };
  return (
    <>
      <IconButton
        onClick={(e) => {
          // setTriggerNum(0);
          // update to firebase
          // setNotifications([
          //   ...notifications.map((item) => ({ ...item, isRead: true })),
          // ]);
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
                {/* <h5
                  className="py-2 fw-bolder text-wrap"
                  style={{ width: "200px" }}
                >{`New Event Created '${notify.EventName}'`}</h5> */}

                <div className="text-wrap w-100">
                  <div className="fs-6">
                    <span className="fw-semibold">{notify.CreatedBy}</span>
                    <span className="px-1">{`added a new event:`}</span>
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
