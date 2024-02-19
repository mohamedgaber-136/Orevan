import TextField from "@mui/material/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./NewSubScriberStyle.css";
import { BreadCrumbs } from "../BreadCrum/BreadCrumbs";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../Context/SearchContext";
import { FireBaseContext } from "../../Context/FireBase";
import { addDoc ,doc,collection, getDocs, getDoc} from "firebase/firestore";
import * as Yup from 'yup'
import {useParams} from 'react-router-dom'
import swal from "sweetalert";
export const NewSubScriber = ({ id ,handleClose}) => {
  const { setShowAddNeWSub } = useContext(SearchContext);
  const {dbID} = useParams()
  const [errorMsg,setErrorMsg]=useState(false)
  const [checkSubScriber,SetSubScriber] = useState([])
  const {  triggerNum, setTriggerNum,EventRefrence ,getData } = useContext(
    FireBaseContext
  );
  const NewSubScriberInputs = [
    {
      label: "Name",
      type: "text",
      name:"Name"
    },
    {
      label: "Email",
      type: "text",
      name:'Email'
    },
    {
      label: "National/iqamaID",
      type: "number",
      name:'NationalID'
    },
    {
      label: "Phone Number",
      type: "number",
      name:'PhoneNumber'
    },
    {
      label: "specialty",
      type: "text",
      name:'Speciality'
    },
    {
      label: "Organization",
      type: "text",
      name:'Organization'
    },
    {
      label: "License ID",
      type: "number",
      name:'LicenseID'
    },
    {
      label: "City",
      type: "text",
      name:'City'
    },
  ];
  function randomXToY(minVal, maxVal) {
    let randVal = minVal + Math.random() * (maxVal - minVal);
    return Math.round(randVal);
  }
  const initialvalues={
    id: randomXToY(1,1000),
          Name: "",
          Email:"" ,
          NationalID:"" ,
          PhoneNumber: "",
          Speciality:"" ,
          Organization: "",
          LicenseID:"" ,
          City: "",
          CostPerDelegate:0,
          TransferOfValue:[]
  }
 const validation = Yup.object().shape({
    Name: Yup.string().min(3,'too short').required("Required"),
    Email: Yup.string().email('Enter Valid Email').required("Required") ,
    NationalID: Yup.string().required("Required") ,
    PhoneNumber:  Yup.number().typeError("enter Valid phone Number").required("Required"),
    Speciality: Yup.string().required("Required") ,
    Organization:  Yup.string().required("Required"),
    LicenseID: Yup.string().required("Required") ,
    City:  Yup.string().required("Required"),
  })
  const ref = doc(EventRefrence,dbID)
  const subscriberCollection = collection(ref,'Subscribers')
  useEffect(()=>{getData(subscriberCollection,SetSubScriber)},[dbID])
const onsubmit =  (values)=>{
  const checkUser = checkSubScriber.find(({Email})=>Email===values.Email)
  if(checkUser){
    setErrorMsg(true)
  }else{    
    swal({
      icon: "success",
    }).then( async ()=>{
      const eventRef = await getDoc(ref)
      const eventData =eventRef.data()
      values['CostPerDelegate']=eventData.CostperDelegate
      values['TransferOfValue']=eventData.TransferOfValue
      setErrorMsg(false)
      await addDoc(subscriberCollection, values);
      setShowAddNeWSub(false);
      handleClose()
    })
  }

}
  return (
    <Formik initialValues={initialvalues} validationSchema={validation}  onSubmit={onsubmit}>
      {() => (
        <>
          <Form       
            className="d-flex p-3 bg-white rounded  flex-column  gap-2 justify-content-between align-item-center NewSubScriberForm"
          >
            <h3>
              <BreadCrumbs id={id} sub={"SubScriber"} />
            </h3>
            <div className="w-100  d-flex flex-wrap ">
              {NewSubScriberInputs.map((item, index) => (
                <div
                  className="w-50  flex-column align-items-center    d-flex justify-content-center"
                  key={`${item.label}-${index}`}
                ><div className="text-danger ps-5 align-self-start">
                    <ErrorMessage name={item.name} />

                </div>
                  <Field 
                  as={TextField}
                    label={item.label}
                    id={index}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    type={item.type}
                    className="w-75 "
                    name={item.name}
                  />
                </div>
              ))}
              <div className="w-50 d-flex justify-content-center">
                <button type="submit" className="w-75 p-1 m-2 rounded rounded-2 border-0 border text-white">
                  Save
                </button>
              </div>
           {
            errorMsg&&<div className="w-50 text-danger d-flex justify-content-center align-items-center">
            <small>This Email already Registerd</small>
            </div>
           }
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};
