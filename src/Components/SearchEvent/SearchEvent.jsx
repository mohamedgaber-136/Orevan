import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FireBaseContext } from "../../Context/FireBase";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {useEffect, useContext,useState} from 'react';
import swal from "sweetalert";
export default function SearchEvent({newSelected,setSelected}) {
    const { EventRefrence, getData } = useContext(FireBaseContext);
    const [data, setData] = useState([]);
    const [Result, setResult] = useState([]);
    const [value, setValue] = useState(null);
    const { id,dbID } = useParams();
    useEffect(() => {
        getData(EventRefrence, setData);
      }, []);
      useEffect(() => {
        let cartona ;
        if (data.lenght != 0) {
          const x = data.filter(({ Id }) => Id != id);
          setResult(x)
        }
      }, [data]);
      console.log(value)
      console.log(newSelected[0],'newSelected')
      console.log(dbID)
      const ChangeEvent =  () => {
        const eventRef = doc(EventRefrence, dbID);
        const collectionEvent = collection(eventRef, "Subscribers");     
         swal({
           title: `are you sure  ?`,
           icon: "warning",
           buttons: true,
           dangerMode: true,
         }).then(async (willDelete) => {
                  if (willDelete) {
             swal({
               icon: "success",
             });
             newSelected.map( async (item)=>{
              const deletedItemRef = doc(collectionEvent, item);
              const data = await getDoc(deletedItemRef);
              const subscriber = data.data();
              const eventWillAddedTo = doc(EventRefrence, value.ID);
              const newEvent = await getDoc(eventWillAddedTo);
              const CollectionWillAddTo = collection(eventWillAddedTo, "Subscribers");
              await setDoc(doc(CollectionWillAddTo, item), subscriber);
              await deleteDoc(deletedItemRef); 
              setSelected([])
             })
                
            }
         })        
      }    
  return (<>
    <Autocomplete
      id="grouped-demo"
      value={value}
      options={Result}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      getOptionLabel={(option) => `Event: ${option.Id}`}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Events" style={{borderBottom:'1px solid black'}}/>}
    />
    <div className='d-flex my-2 justify-content-center align-items-center'>
    <button
        onClick={ChangeEvent}
        className={`rounded  border-0 btn-DarkBlue px-2 py-1 text-white ${
          !value && "d-none"
        }`}
      >
        Save
      </button>
    </div>
   
      </>
  );
}
