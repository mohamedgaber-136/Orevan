import TextField from "@mui/material/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./NewSubScriberStyle.css";
import { BreadCrumbs } from "../BreadCrum/BreadCrumbs";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../Context/SearchContext";
import { FireBaseContext } from "../../Context/FireBase";
import InputAdornment from "@mui/material/InputAdornment";
import {
  addDoc,
  doc,
  collection,
  getDoc,
  
} from "firebase/firestore";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
export const NewSubScriber = ({ id, handleClose }) => {
  const { setShowAddNeWSub } = useContext(SearchContext);
  const { dbID } = useParams();
  const [errorMsg, setErrorMsg] = useState(false);
  const [change, setChange] = useState("");
  const [checkSubScriber, SetSubScriber] = useState([]);
  const [autoFilledUser, setAutoFilledUser] = useState({
    id: randomXToY(1, 1000),
    FirstName: "",
    LastName: "",
    Email: "",
    NationalID: "",
    PhoneNumber: "",
    Speciality: "",
    Organization: "",
    LicenseID: "",
    City: "",
    CostPerDelegate: 0,
    TransferOfValue: [],
  });
  const [NewSubScriberInputs, SetNewSubScriberInputs] = useState([
    {
      label: "First Name",
      type: "text",
      name: "FirstName",
    },
    {
      label: "Last Name",
      type: "text",
      name: "LastName",
    },
    {
      label: "Email",
      type: "text",
      name: "Email",
    },
    // {
    //   label: "National/iqamaID",
    //   type: "number",
    //   name: "NationalID",
    // },
    {
      label: "Phone Number",
      type: "text",
      name: "PhoneNumber",
    },
    {
      label: "specialty",
      type: "text",
      name: "Speciality",
    },
    {
      label: "Organization",
      type: "text",
      name: "Organization",
    },
    {
      label: "License ID",
      type: "number",
      name: "LicenseID",
    },
    {
      label: "City",
      type: "text",
      name: "City",
    },
  ]);
  const [user, SetUsers] = useState([]);

  const { EventRefrence, getData, database } = useContext(FireBaseContext);
  function randomXToY(minVal, maxVal) {
    let randVal = minVal + Math.random() * (maxVal - minVal);
    return Math.round(randVal);
  }
  const initialvalues = {
    id: randomXToY(1, 1000),
    FirstName: "",
    LastName: "",
    Email: "",
    NationalID: "",
    PhoneNumber: "",
    Speciality: "",
    Organization: "",
    LicenseID: "",
    City: "",
    CostPerDelegate: 0,
    TransferOfValue: [],
  };
  const validation = Yup.object().shape({
    FirstName: Yup.string().min(3, "too short").required("Required"),
    LastName: Yup.string().min(3, "too short").required("Required"),
    Email: Yup.string().email("Enter Valid Email").required("Required"),
    NationalID: Yup.string().required("Required"),
    PhoneNumber: Yup.string()
      .min(7, "too short")
      .typeError("enter Valid phone Number")
      .required("Required"),
    Speciality: Yup.string().required("Required"),
    Organization: Yup.string().required("Required"),
    LicenseID: Yup.string().required("Required"),
    City: Yup.string().required("Required"),
  });
  const ref = doc(EventRefrence, dbID);
  const subscriberCollection = collection(ref, "Subscribers");
  const SubCollection = collection(database, "Subscribers");
  useEffect(() => {
    getData(subscriberCollection, SetSubScriber);
    getData(SubCollection, SetUsers);
  }, [dbID]);
  const countryCode = "+966";
  const onsubmit = (e) => {
    e.preventDefault();

    const data = {
      id: randomXToY(1, 100000000),
      FirstName: e.target[2].value,
      LastName: e.target[4].value,
      Email: e.target[6].value,
      NationalID: e.target[0].value,
      PhoneNumber: e.target[8].value,
      Speciality: e.target[10].value,
      Organization: e.target[12].value,
      LicenseID: e.target[14].value,
      City: e.target[16].value,
    };
    data.PhoneNumber=`${countryCode}${data.PhoneNumber}`
    console.log(data)
    // console.log(values)
    const checkUser = checkSubScriber.find(
         ({ Email }) => Email === data.Email
       );
       if (checkUser) {
       setErrorMsg(true);
     } else {
         swal({
          text:`Subscriber ${data.Email} added successfully `,
                 icon: "success",
           }).then(async () => {
       const eventRef = await getDoc(ref);
       const eventData = eventRef.data();
       data["CostPerDelegate"] = eventData.CostperDelegate;
       data["TransferOfValue"] = eventData.TransferOfValue;
       setErrorMsg(false);
       await addDoc(subscriberCollection, data);
       await addDoc(SubCollection, data);
       setShowAddNeWSub(false);
       handleClose();
     });
     }
    // console.log(autoFilledUser,'autoFilledUser')
  };
  const checkNationalId = async (e) => {
    setChange(e.target.value);
    const data = e.target.value;
    setAutoFilledUser({ ...autoFilledUser, NationalID: data });
    if (data.length > 7) {
      const matchingItem = user.find((item) =>
        String(item.NationalID).toLowerCase().includes(data.toLowerCase())
      );
      if (matchingItem) {
        setAutoFilledUser(matchingItem);
      }
    }
  };
  return (
    <Formik initialValues={initialvalues} 
    // validationSchema={validation}
    >
      {(values, handleChange) => (
        <>
          <Form
            onSubmit={onsubmit}
            className="d-flex p-3 bg-white rounded  flex-column  gap-2 justify-content-between align-item-center NewSubScriberForm"
          >
            <h3>
              <BreadCrumbs id={id} sub={"Subscriber"} />
            </h3>
            <div className="w-100  d-flex flex-wrap ">
                <div
                className="w-50  flex-column align-items-center    d-flex justify-content-center"
              >
                <div className="text-danger ps-5 align-self-start">
                  <ErrorMessage name={'NationalID'} />
                </div>

                <Field
                  as={TextField}
                  label={'National/iqamaID'}
                  id={"NationalID"}
                  sx={{ m: 1, width: "25ch" }}
                  focused
                  type={'number'}
                  className="w-75 "
                  name={'NationalID'}
                  onChange={checkNationalId}
                  value={change}
                />
              </div>
              
              {NewSubScriberInputs.map((item, index) =>
                item.name === "PhoneNumber" ? (
                  <div
                    className="w-50  flex-column align-items-center    d-flex justify-content-center"
                    key={`${item.label}-${index}`}
                  >
                    <div className="text-danger ps-5 align-self-start">
                      <ErrorMessage name={item.name} />
                    </div>
                    <Field
                      as={TextField}
                      label={item.label}
                      id={index}
                      sx={{
                        m: 1,
                        width: "25ch",
                        border: "1px solid grey",
                        borderRadius: 1,
                      }}
                      focused
                      type={item.type}
                      className="w-75  "
                      name={item.name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" >
                            {countryCode}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                ) : 
              <div
                className="w-50  flex-column align-items-center    d-flex justify-content-center"
                key={`${item.label}-${index}`}
              >
                <div className="text-danger ps-5 align-self-start">
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
                  value={autoFilledUser[item.name]|| ''}
                  onChange={(e) => setAutoFilledUser({ ...autoFilledUser, [item.name]: e.target.value })}
                  // onChange={handleChange}
                />
              </div>
              )}
              <div className="w-50 d-flex justify-content-center">
                <button
                  type="submit"
                  className="w-75 p-1 m-2 rounded rounded-2 border-0 border text-white"
                >
                  Save
                </button>
              </div>
              {errorMsg && (
                <div className="w-50 text-danger d-flex justify-content-center align-items-center">
                  <small>This Email already Registerd</small>
                </div>
              )}
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};
