import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FireBaseContext } from "../../Context/FireBase";
import { useParams } from "react-router-dom";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useContext, useState } from "react";
import swal from "sweetalert";

export default function SearchEvent({ newSelected, setSelected }) {
  const { EventRefrence, SubscribersRefrence, getData } = useContext(FireBaseContext);
  const [data, setData] = useState([]);
  const [Result, setResult] = useState([]);
  const [value, setValue] = useState(null);
  const {  dbID } = useParams();

  useEffect(() => {
    getData(EventRefrence, setData);
  }, []);

  useEffect(() => {
    if (data.length !== 0) {
      const filteredData = data.filter(({ ID }) => ID !== dbID);
      setResult(filteredData);
    }
  }, [data]);

  const ChangeEvent = async () => {
    if (!newSelected || newSelected.length === 0 || !value) {
      swal({
        title: "No event or subscribers selected!",
        text: "Please select both an event and at least one subscriber.",
        icon: "warning",
      });
      return;
    }
  
    const eventRef = doc(EventRefrence, dbID);
    const collectionEvent = collection(eventRef, "Subscribers");
  
    swal({
      title: `Are you sure?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        swal({
          icon: "success",
          title:`this subscribers transferd from event ${dbID} to event ${value.ID}`
        });
        for (const item of newSelected) {
          try {
            const deletedItemRef = doc(collectionEvent, item);
            const subscriberDoc = await getDoc(deletedItemRef);
            if (!subscriberDoc.exists()) {
              console.warn(`Subscriber with ID ${item} does not exist in the old event.`);
              continue;
            }
  
            const subscriber = subscriberDoc.data();
  
            // Add subscriber to the new event
            const eventWillAddedTo = doc(EventRefrence, value.ID);
            const CollectionWillAddTo = collection(eventWillAddedTo, "Subscribers");
            await setDoc(doc(CollectionWillAddTo, item), subscriber);
  
            // Delete the subscriber from the old event
            await deleteDoc(deletedItemRef);
  
            // Update the eventID in the subscriber reference
            const subscriberRef = doc(SubscribersRefrence, item);
            await updateDoc(subscriberRef, {
              eventID: value.ID,
            });
          } catch (error) {
            console.error(`Error processing subscriber ${item}:`, error);
          }
        }
  
        setSelected([]);
      }
    });
  };
  

  return (
    <>
 <Autocomplete
  id="grouped-demo"
  value={value}
  options={Result}
  onChange={(event, newValue) => {
    setValue(newValue);
  }}
  getOptionLabel={(option) => `Event: ${option.ID}`}
  sx={{
    width: 300,
    '& .MuiAutocomplete-inputRoot': {
      padding: '0px', // Remove default padding
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none', // Remove default border
      },
      '&:hover fieldset': {
        border: 'none', // Remove default border on hover
      },
      '&.Mui-focused fieldset': {
        border: 'none', // Remove default border when focused
      },
    },
    '& .MuiInputLabel-root': {
      color: '#666', // Label color
      '&.Mui-focused': {
        color: '#0066cc', // Label color when focused
      },
    },
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Events"
      variant="outlined"
      sx={{
        '& .MuiInputBase-input': {
          padding: '10px', // Padding inside the input
        },
        '& .MuiInputLabel-root': {
          fontSize: '16px', // Font size for the label
        },
        '& .MuiOutlinedInput-root': {
          borderBottom: '2px solid #ccc', // Border bottom for the input field
          '& fieldset': {
            border: 'none', // Remove default border
          },
        },
      }}
    />
  )}
/>
      <div className="d-flex my-2 justify-content-center align-items-center">
        <div className="d-flex align-items-centerjustify-content-start  flex-column">
          <span>
           <b> from event</b> : <span className="text-dark">{dbID}</span>
          </span>
          <span>
           <b> to event</b> : <span className="text-dark">{value?value.ID:''}</span>
          </span>
          <button
          onClick={ChangeEvent}
          className={`rounded border-0 btn-DarkBlue px-2 my-2 py-1 text-white ${
            !value && "d-none"
          }`}
        >
          Save
        </button>
        </div>
        
      </div>
    </>
  );
}
