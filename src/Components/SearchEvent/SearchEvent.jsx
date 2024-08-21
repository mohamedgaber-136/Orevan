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
  const { id, dbID } = useParams();

  useEffect(() => {
    getData(EventRefrence, setData);
  }, []);

  useEffect(() => {
    if (data.length !== 0) {
      const filteredData = data.filter(({ ID }) => ID !== dbID);
      setResult(filteredData);
    }
  }, [data]);

  const ChangeEvent = () => {
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
        });

        for (const item of newSelected) {
          const deletedItemRef = doc(collectionEvent, item);
          const subscriberDoc = await getDoc(deletedItemRef);
          const subscriber = subscriberDoc.data();

          if (subscriber) {
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
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Events"
            style={{ borderBottom: "1px solid black" }}
          />
        )}
      />
      <div className="d-flex my-2 justify-content-center align-items-center">
        <button
          onClick={ChangeEvent}
          className={`rounded border-0 btn-DarkBlue px-2 py-1 text-white ${
            !value && "d-none"
          }`}
        >
          Save
        </button>
      </div>
    </>
  );
}
