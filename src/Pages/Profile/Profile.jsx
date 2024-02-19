import { Form, Formik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import ProfileReport from "../../Components/ProfileReport/ProfileReport";
import {  useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { FireBaseContext } from "../../Context/FireBase";
import { doc, getDoc } from "firebase/firestore";
export const Profile = () => {
  const [disabledValue,setDisabled]=useState(true)
  const {currentUsr,UserRef} = useContext(FireBaseContext)
  const [Current,setCurrent] = useState(null) 
  const InputsDataColOne = [
    {
      label: "Name",
      defaultValue: Current?.Name,
      type: "text",
    },
    {
      label: "Telephone",
      defaultValue: Current?.PhoneNumber,
      type: "text",
    },
  ];
  const InputsDataColTwo = [
    {
      label: "Email",
      defaultValue:Current?.Email,
      type: "text",
    },
  ];
  console.log(currentUsr)
const handleSubmit = (e)=>{
  e.preventDefault()
}
useEffect(()=>{
const fetchUser = async () =>{
  const docRef = doc(UserRef,currentUsr)
  const user = await getDoc(docRef)
  setCurrent(user.data())
}

fetchUser()
},[currentUsr])
if(Current){
  return (
    <div className="  d-flex flex-column container gap-3 EventsPageParent ">
      <div className="">
        <h5 className="mb-3">Personal Data</h5>
        <Formik>
          {() => (
            
            <Form
              onSubmit={handleSubmit}
              className="FormDataParent  bg-white container   rounded rounded-2  "
            >
            <div className="d-flex w-100 gap-2">

              <div className="d-flex gap-4 flex-column w-50  ">
                {InputsDataColOne.map((item, indx) => (
                  <TextField
                    key={indx}
                    name={item.label}
                    label={item.label}
                    focused
                    defaultValue={item.defaultValue}
                    disabled={disabledValue}
                  />
                ))}
              </div>
              <div className="d-flex gap-4 flex-column w-50 ">
                {InputsDataColTwo.map((item, indx) => (
                  <TextField
                    key={indx}
                    name={item.label}
                    label={item.label}
                    focused
                    defaultValue={item.defaultValue}
                    disabled={disabledValue}
                  />
                ))}
              </div>
              </div>


              <EditIcon
                title="edit"
                onClick={() => setDisabled(!disabledValue)}
                className="text-primary  EditPen"
              />
            <button
                className={`SaveBtn ${disabledValue && "d-none"} m-2 `}
                onClick={() => setDisabled(true)}
              >
                Save
           </button>
  
              {/* <ProfileReport />  */}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}else{
 return( <div className="w-100 d-flex justify-content-center">
  <div className="dot-spinner">
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
  </div>
</div>)
}
}
