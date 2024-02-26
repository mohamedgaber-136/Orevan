import { initializeApp } from "@firebase/app";
import { createContext, useEffect, useState } from "react";

import {
  collection,
  getFirestore,
  onSnapshot,
  doc,
  getDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export const FireBaseContext = createContext();
const FireBaseContextProvider = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const [IdIncluded, setId] = useState(false);
  const [rows, setRows] = useState([]);
  const [triggerNum, setTriggerNum] = useState(0);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filterdData, setFilterd] = useState([]);
  const [updateUser, setUpdateUser] = useState(null);
  const [Subscribers, setSubscribers] = useState([]);
  const [roleCondition, setRole] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [newEvent, setNewEvent] = useState({
    EventName: "",
    CostperDelegate: "",
    PO: "",
    Franchise: "",
    Id: "",
    City: [],
    P3: "",
    TransferOfValue: [],
    CreatedAt: new Date().toLocaleString(),
    StartDate: "",
    EndDate: "",
    DateFromHours: "",
    DateEndHours: "",
    BackGroundColor: "#FFF",
    FontColor: "#000",
    ButtonColor: "#00F",
    AccpetAllTermss: false,
  });
  const firebaseConfig = {
    apiKey: "AIzaSyBckxAp9_24tLxViaY6yX5BUln07nUk2sM",
    authDomain: "novartis-f3745.firebaseapp.com",
    projectId: "novartis-f3745",
    storageBucket: "novartis-f3745.appspot.com",
    messagingSenderId: "904353795718",
    appId: "1:904353795718:web:25f35b4c6c5f25688f8b07",
    measurementId: "G-2LMZXPR3L4",
  };
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);
  const EventRefrence = collection(database, "Event");
  const TeamsRefrence = collection(database, "Teams");
  const SubscribersRefrence = collection(database, "Subscribers");
  const UserRef = collection(database, "Users");
  const EventsDeletedRef = collection(database, "EventsDeleted");
  const SubscribersDeletedRef = collection(database, "SubscribersDeleted");
  //  Authentication
  const auth = getAuth(app);
  // GetData from FireBase
  const getData = (CollectionType, SetItem) => {
    const returnedValue = onSnapshot(CollectionType, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ID: doc.id,
        ...doc.data(),
      }));
      SetItem(newData);
    });
  };
  const [currentUsr, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const eventsQueryAccordingToUserRole = () => {
    switch (true) {
      case currentUserRole.admin: {
        return query(EventRefrence);
      }
      case currentUserRole.manager: {
        console.log("currentUserRole franchise manager case");
        console.log(currentUserRole.franchiseType, "type");
        // const franchiseType = currentUserRole.split("-")[1];
        return query(
          EventRefrence,
          where("Franchise", "==", currentUserRole.franchiseType)
        );
      }
      case currentUserRole.user: {
        console.log("currentUserRole user case");
        return query(EventRefrence, where("CreatedByID", "==", currentUsr));
      }
      default:
        console.log("default");
      //   return query(EventRefrence);
    }
    // return EventRefrence;
  };
  useEffect(() => {
    setLoading(false);
    console.log(currentUsr, "currentUsr");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(user, "firebaseUser");
      if (user) {
        console.log("loggedin");
        console.log(user, "userauth");
        /* `setCurrentUser` is a function that is used to set the current user's ID in the component's
        state. It is typically called when a user logs in or logs out to update the current user's
        information in the application. */
        setCurrentUser(user.uid);
        const users = doc(UserRef, user.uid);
        const finaleUser = await getDoc(users);
        console.log(finaleUser.data().Role, "Role on state change");
        setCurrentUserRole(finaleUser.data().Role);
        eventsQueryAccordingToUserRole(finaleUser.data().Role, user.uid);
        // localStorage.setItem("REF", JSON.stringify(finaleUser.data().Role));
        localStorage.setItem("User", JSON.stringify(finaleUser.data()));
      } else {
        setCurrentUser(null);
        console.log(currentUsr, "loggedOut");
      }
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const saveNotificationToFirebase = async (notifyID) => {
    const currentUserName = await getDoc(doc(database, "Users", currentUsr));
    const newNotificationObj = {
      EventName: newEvent.EventName,
      TimeStamp: new Date().getTime(),
      EventID: newEvent.Id,
      NewEventID: notifyID,
      CreatedAt: newEvent.CreatedAt,
      CreatedBy: currentUserName.data().Name,
      CreatedByID: currentUsr,
      isReadUsersID: [],
    };
    await addDoc(collection(database, "notifications"), newNotificationObj);
  };
  return (
    <FireBaseContext.Provider
      value={{
        roleCondition,
        setRole,
        setCurrentUser,
        IdIncluded,
        setId,
        SubscribersDeletedRef,
        EventsDeletedRef,
        currentUsr,
        auth,
        app,
        updateUser,
        setUpdateUser,
        filterdData,
        setFilterd,
        rows,
        setRows,
        triggerNum,
        setTriggerNum,
        getData,
        Subscribers,
        SubscribersRefrence,
        database,
        setAuthorized,
        authorized,
        events,
        teams,
        newEvent,
        setNewEvent,
        EventRefrence,
        setEvents,
        setSubscribers,
        setTeams,
        TeamsRefrence,
        currentUserRole,
        setCurrentUserRole,
        saveNotificationToFirebase,
        UserRef,
        eventsQueryAccordingToUserRole,
      }}
    >
      {!loading && children}
    </FireBaseContext.Provider>
  );
};
export default FireBaseContextProvider;
