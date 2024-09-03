// Import necessary Firebase modules and React hooks
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

// Create a context to provide Firebase-related data to the entire application
export const FireBaseContext = createContext();

const FireBaseContextProvider = ({ children }) => {
  // Define state variables for managing various aspects of the application
  const [authorized, setAuthorized] = useState(false);
  const [IdIncluded, setId] = useState(false);
  const [rows, setRows] = useState([]);
  const [triggerNum, setTriggerNum] = useState(0);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filterdData, setFilterd] = useState([]);
  const [UsersData, setUsersData] = useState([]);
  const [updateUser, setUpdateUser] = useState(null);
  const [Subscribers, setSubscribers] = useState([]);
  const [user, setUser] = useState({});
  const [FinaleUser, setFinaleUser] = useState({});
  const [roleCondition, setRole] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [dateError, setdateError] = useState(false);

  // Initialize the new event state with default values
  const [newEvent, setNewEvent] = useState({
    eventName: "",
    CostperDelegate: "",
    PO: "",
    Franchise: "",
    EventCurrency: "",
    Id: "",
    city: [],
    BeSure: "",
    TransferOfValue: [],
    CreatedAt: new Date().toLocaleString(),
    eventDate: "",
    endDate: "",
    DateFromHours: "",
    DateEndHours: "",
    bgColor: "#ffffff",
    fontColor: "#000000",
    btnColor: "#0000ff",
    AccpetAllTermss: false,
    eventLogo: "https://events.orevan.net/img/1615264982.png",
    eventTerms:
      'I explicitly declare that I have been informed of the obligation to disclose to the SFDA any financial support received from Novartis Saudi Ltd. I also consent to the processing, saving, and publication of my personal data including (Full name, National or Iqama ID, Medical License number, phone number, and email address) in relation to any Transfer of Value as defined in the financial Transparency and Disclosure guideline of SFDA. I also, hereby declare that I have read and understood Novartis Privacy Notice and acknowledge my consent to the collection and processing of my data in accordance with the terms of this ',
  });

  // Firebase configuration object with API keys and other credentials
  const firebaseConfig = {
    apiKey: "AIzaSyCVvf3gBWoTTvErXwWNbeWWW8aLfx9S5Ag",
    authDomain: "orevanreg.firebaseapp.com",
    databaseURL: "https://orevanreg.firebaseio.com",
    projectId: "orevanreg",
    storageBucket: "orevanreg.appspot.com",
    messagingSenderId: "882583903364",
    appId: "1:882583903364:web:1d5c38ff461bb5f4e0f6d1",
    measurementId: "G-FRHV1QQFS9",
  };

  // Initialize Firebase app with the provided configuration
  const app = initializeApp(firebaseConfig);
  const database = getFirestore(app);

  // References to various collections in Firestore
  // this for events 
  const EventRefrence = collection(database, "eventsTemp");
  // this for Subscribers
  const SubscribersRefrence = collection(database, "registeredUsersTemp");
  // this for Franchices
  const TeamsRefrence = collection(database, "Teams");
  // this for registerd users in system
  const UserRef = collection(database, "Users");
  // this for  eventsDeleted
  const EventsDeletedRef = collection(database, "EventsDeleted");
  // this for  subscriberDeleted
  const SubscribersDeletedRef = collection(database, "SubscribersDeleted");
  // this for Cities for events
  const Cities = collection(database, "Cities");
  // this for Tov values for reports
  const TransferOfValuesRef = collection(database, "TransferOfValues");
  // Initialize Firebase Authentication
  const auth = getAuth(app);
  // Function to retrieve data from a Firestore collection and update the corresponding state
  const getData = (CollectionType, SetItem) => {
    const returnedValue = onSnapshot(CollectionType, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ID: doc.id,
        ...doc.data(),
      }));
      SetItem(newData);
    });
  };

  // State to store the current user and loading status
  const [currentUsr, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  // Function to query events based on the current user's role
  const eventsQueryAccordingToUserRole = () => {
    switch (true) {
      case currentUserRole.admin:
        return query(EventRefrence);
      case currentUserRole.manager:
        return query(
          EventRefrence,
          where("Franchise", "==", currentUserRole.franchiseType)
        );
      case currentUserRole.user:
        return query(EventRefrence, where("CreatedByID", "==", currentUsr));
      default:
        return query(EventRefrence);
    }
  };

  // useEffect hook to listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(false);
      if (user) {
        setCurrentUser(user.uid);
        setUser(user);

        // Retrieve user data from Firestore and set it in state
        const users = doc(UserRef, user.uid);
        const finaleUser = await getDoc(users);
        setFinaleUser(finaleUser.data());
        setCurrentUserRole(finaleUser.data().Role);
        localStorage.setItem("User", JSON.stringify(finaleUser.data()));
        eventsQueryAccordingToUserRole(finaleUser.data().Role, user.uid);
      } else {
        setCurrentUser(null);
      }
    });

    // Cleanup function to unsubscribe from the authentication listener
    return () => {
      unsubscribe();
    };
  }, []);

  // Function to save notifications to Firestore
  const saveNotificationToFirebase = async ({
    notifyID,
    eventDataObject,
    message,
  }) => {
    const currentUserName = await getDoc(doc(database, "Users", currentUsr));
    const newNotificationObj = {
      EventName: eventDataObject.eventName,
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

    // Add the new notification object to the "notifications" collection in Firestore
    await addDoc(collection(database, "notifications"), newNotificationObj);
  };

  // Provide Firebase-related data and functions to the entire application via context
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
        Cities,
        FinaleUser,
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
        setdateError,
        dateError,
        setUsersData,
        UsersData,
        TeamsRefrence,
        currentUserRole,
        setCurrentUserRole,
        saveNotificationToFirebase,
        UserRef,
        eventsQueryAccordingToUserRole,
        TransferOfValuesRef,
      }}
    >
      {!loading && children} {/* Render children components when loading is complete */}
    </FireBaseContext.Provider>
  );
};

// Export the Firebase context provider for use in the application
export default FireBaseContextProvider;
