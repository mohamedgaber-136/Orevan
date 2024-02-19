import { useState, useContext, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FireBaseContext } from "../../Context/FireBase";
import { useParams, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import swal from "sweetalert";

export default function DropDownEvents() {
  const [age, setAge] = useState("");
  const [data, setData] = useState([]);
  const [Result, setResult] = useState([]);
  const [showBtn, setShowBTN] = useState(true);
  const { EventRefrence, getData } = useContext(FireBaseContext);
  const { id, UserDbID, dbID } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getData(EventRefrence, setData);
  }, []);
  useEffect(() => {
    if (data.lenght != 0) {
      const x = data.filter(({ Id }) => Id != id);
      setResult(x);
    }
  }, [data]);
  const handleChange = (event) => {
    setAge(event.target.value);
    if (event.target.value) {
      setShowBTN(false);
    } else {
      setShowBTN(true);
    }
  };
  const ChangeEvent = async () => {
    const eventRef = doc(EventRefrence, dbID);
    const collectionEvent = collection(eventRef, "Subscribers");
    const deletedItemRef = doc(collectionEvent, UserDbID);
    const data = await getDoc(deletedItemRef);
    const subscriber = data.data();
    const eventWillAddedTo = doc(EventRefrence, age);
    const newEvent = await getDoc(eventWillAddedTo);
    const CollectionWillAddTo = collection(eventWillAddedTo, "Subscribers");
    swal({
      title: ` You sure change from Event ${id} to Event ${
        newEvent.data().Id
      } ?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        swal({
          icon: "success",
        });
        await setDoc(doc(CollectionWillAddTo, UserDbID), subscriber);
        await deleteDoc(deletedItemRef);
        // navigate(
        //   `/app/subscribers/${newEvent.data().Id}/${age}/UpdateSubscriber/${
        //     subscriber.id
        //   }/${UserDbID}`
        // );
        // navigate(
        //   `/app/subscribers/${newEvent.data().Id}/${age}/UpdateSubscriber/${
        //     subscriber.id
        //   }/${UserDbID}`
        // );
        // navigate('/app/events')
      }
    });
  };
  return (
    <>
      <FormControl
        sx={{ m: 1, minWidth: 120 }}
        className="border rounded bg-white shadow"
      >
        <Select
          value={age}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Result.map((item) => (
            <MenuItem key={item.Id} value={item.ID}>
              Event {item.Id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button
        onClick={ChangeEvent}
        className={`rounded border-0 bg-primary px-2 py-1 text-white ${
          showBtn && "d-none"
        }`}
      >
        Save
      </button>
    </>
  );
}
