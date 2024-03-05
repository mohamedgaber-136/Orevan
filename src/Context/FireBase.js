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
  const [user ,setUser]=useState({})
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
    BackGroundColor: "#00ff00",
    FontColor: "#000000",
    ButtonColor: "#ffffff",
    AccpetAllTermss: false,
    Policies:
      ' I explicitly declare that I have been informed of the obligation to disclose to the SFDA any financial support received from Novartis Saudi Ltd. I also consent the processing, saving and publication of my personal data including (Full name, National or Iqama ID, Medical License number, phone number and email address) in relation to any Transfer of Value as defined in the financial Transparency and Disclosure guideline of SFDA." I also, hereby declare that I have read and understood Novartis Privacy Notice and acknowledge my consent to the collection and processing of my data in accordance with the terms of this ',
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
  const SubscribersRef = collection(database, "Subscribers");
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
        return query(
          EventRefrence,
          where("Franchise", "==", currentUserRole.franchiseType)
        );
      }
      case currentUserRole.user: {
        return query(EventRefrence, where("CreatedByID", "==", currentUsr));
      }
      default:
        console.log("default");
      //   return query(EventRefrence);
    }
    return EventRefrence;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(false);
      if (user) {
        setCurrentUser(user.uid);
        setUser(user)
        const users = doc(UserRef, user.uid);
        const finaleUser = await getDoc(users);
        console.log(finaleUser.data().Role, "Role on state change");
        localStorage.setItem("User", JSON.stringify(finaleUser.data()));
        setCurrentUserRole(finaleUser.data().Role);
        eventsQueryAccordingToUserRole(finaleUser.data().Role, user.uid);
      } else {
        // setLoading(true);
        setCurrentUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const saveNotificationToFirebase = async ({
    notifyID,
    eventDataObject,
    message,
  }) => {
    const currentUserName = await getDoc(doc(database, "Users", currentUsr));
    const newNotificationObj = {
      EventName: eventDataObject.EventName,
      TimeStamp: new Date().getTime(),
      EventID: eventDataObject.Id,
      NewEventID: notifyID,
      CreatedAt: eventDataObject.CreatedAt,
      CreatedBy: currentUserName.data().Name,
      CreatedByID: currentUsr,
      EventFranchise: eventDataObject.Franchise,
      NotifyMessage: message,
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
        user,
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
        SubscribersRef,
      }}
    >
      {!loading && children}
    </FireBaseContext.Provider>
  );
};
export default FireBaseContextProvider;
