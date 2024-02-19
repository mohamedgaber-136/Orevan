// import React, { useState, useEffect, useContext } from 'react';
// import { FireBaseContext } from '../../Context/FireBase';
// import { collection, getFirestore, onSnapshot, doc,getDoc } from "firebase/firestore";
// import Button from '@mui/material/Button';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';

// const Notification = () => {
//     const {database} = useContext(FireBaseContext)
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     // Set up real-time listener for changes in the 'notifications' collection
//     const unsubscribe = onSnapshot(collection(database,'notifications'),(snapshot) => {
//       const newNotifications = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setNotifications(newNotifications);
//     });

//     // Clean up the listener when the component unmounts
//     return () => unsubscribe();
//   }, []); // Empty dependency array means this effect runs once when the component mounts


//     const [anchorEl, setAnchorEl] = useState(null);
  
//     const handleClick = (event) => {
//       setAnchorEl(event.currentTarget);
//     };
  
//     const handleClose = () => {
//       setAnchorEl(null);
//     };

//   return (
//     <div>
//     <Button onClick={handleClick} variant="contained">
//       Open Menu
//     </Button>
//     <Menu
//       anchorEl={anchorEl}
//       open={Boolean(anchorEl)}
//       onClose={handleClose}
//     >
//       <MenuItem onClick={handleClose}>Option 1</MenuItem>
//       <MenuItem onClick={handleClose}>Option 2</MenuItem>
//       <MenuItem onClick={handleClose}>Option 3</MenuItem>
//     </Menu>
//   </div>
//     // <UseMenu notifyList ={notifications} />
//     // <div>
//     //   <h2>Notifications</h2>
//     //   <ul>
//     //     {notifications.map((notification) => (
//     //       <li key={notification.id}>{notification.EventName}</li>
//     //     ))}
//     //   </ul>
//     // </div>
//   );
// };

// export default Notification;