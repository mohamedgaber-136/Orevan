import TextField from "@mui/material/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./NewSubScriberStyle.css";
import { BreadCrumbs } from "../BreadCrum/BreadCrumbs";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../Context/SearchContext";
import { FireBaseContext } from "../../Context/FireBase";
import InputAdornment from "@mui/material/InputAdornment";
import { addDoc, doc, collection, getDoc } from "firebase/firestore";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import "./NewSubScriberStyle.css";
export const NewSubScriber = ({ id, handleClose }) => {
  const { setShowAddNeWSub } = useContext(SearchContext);
  const { EventRefrence, getData, database } = useContext(FireBaseContext);
  const { dbID } = useParams();
  const countryCode = "+966";
  const [errorMsg, setErrorMsg] = useState(false);
  const [checkSubScriber, SetSubScriber] = useState([]);
  const [user, SetUsers] = useState([]);

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
    MedicalID: "",
    City: "",
    CostPerDelegate: 0,
    TransferOfValue: [],
  };

  const NewSubScriberInputs = [
    {
      label: "National/iqamaID",
      type: "number",
      name: "NationalID",
    },
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
      label: "Medical ID",
      type: "number",
      name: "MedicalID",
    },
    {
      label: "City",
      type: "text",
      name: "City",
    },
  ];

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
    MedicalID: Yup.string().required("Required"),
    City: Yup.string().required("Required"),
  });

  function randomXToY(minVal, maxVal) {
    let randVal = minVal + Math.random() * (maxVal - minVal);
    return Math.round(randVal);
  }

  const ref = doc(EventRefrence, dbID);
  const subscriberCollection = collection(ref, "Subscribers");
  const SubCollection = collection(database, "Subscribers");
  useEffect(() => {
    getData(subscriberCollection, SetSubScriber);
    getData(SubCollection, SetUsers);
  }, [dbID]);

  const handleFormSubmit = async (values) => {
    const data = { ...values };
    data.PhoneNumber = `${countryCode}${data.PhoneNumber}`;
    const checkUser = checkSubScriber.find(({ Email }) => Email === data.Email);
    console.log(data)
    // if (checkUser) {
    //   setErrorMsg(true);
    // } else {
    //   swal({
    //     text: `Subscriber ${data.Email} added successfully `,
    //     icon: "success",
    //   }).then(async () => {
    //     const eventRef = await getDoc(ref);
    //     const eventData = eventRef.data();
    //     data["CostPerDelegate"] = eventData.CostperDelegate;
    //     data["TransferOfValue"] = eventData.TransferOfValue;
    //     setErrorMsg(false);
    //     await addDoc(subscriberCollection, data);
    //     await addDoc(SubCollection, data);
    //     setShowAddNeWSub(false);
    //     handleClose();
    //   });
    // }
  };

  const handleInputChange = (name, value, formValues, setFormValues) => {
    let isAutoCompleted = false;
    // is the national id primary one
    if (name === "NationalID" && value.length >= 7) {
      const matchingItem = user.find(
        (item) => String(item.NationalID).toLowerCase() === value.toLowerCase()
      );
      if (matchingItem) {
        isAutoCompleted = true;
        // setAutoFilledUser({ ...matchingItem });

        setFormValues({
          ...matchingItem,
          PhoneNumber: matchingItem.PhoneNumber.substring(4),
        });
      }
      // else {
      //   // setAutoFilledUser({ ...autoFilledUser, NationalID: nationalValue });
      //   setValues({ ...autoFilledUser, NationalID: nationalValue });
      // }
      console.log(matchingItem, "matchingItem");
      // }
    }
    if (!isAutoCompleted) {
      // setAutoFilledUser({
      //   ...autoFilledUser,
      //   [name]: value,
      // });
      setFormValues({ ...formValues, [name]: value });
    }
  };

  return (
    <Formik
      initialValues={{ ...initialvalues }}
      validationSchema={validation}
      onSubmit={handleFormSubmit}
    >
      {({ values, setValues }) => (
        <>
          <Form
            className="bg-white rounded  NewSubScriberForm "
          >
            <h3 className="px-lg-3 px-1">
              <BreadCrumbs id={id} sub={"Subscriber"} />
            </h3>
            <div
              className="w-100 gap-2 d-flex flex-wrap justify-content-evenly mt-3 pt-2"
            >
              {NewSubScriberInputs.map((item, index) => (
                <div
                  className="col-12 col-md-5 p-1"
                  key={`${item.label}-${index}`}
                >
                
                  <Field
                    as={TextField}
                    label={item.label}
                    id={index}
                    focused
                    type={item.type}
                    className={`w-100  ${
                      item.name === "PhoneNumber" &&
                      "border border-secondary form-control "
                    }`}
                    name={item.name}
                    value={values[item.name]}
                    onChange={(e) =>
                      handleInputChange(
                        item.name,
                        e.target.value,
                        values,
                        setValues
                      )
                    }
                    InputProps={{
                      startAdornment: item.name === "PhoneNumber" && (
                        <InputAdornment position="start">
                          {countryCode}
                        </InputAdornment>
                      ),
                    }}
                  />
                    <div className="text-danger  align-self-start  mb-3">
                    <ErrorMessage name={item.name} />
                  </div>
                </div>
              ))}

              <div className="w-50 d-flex flex-column align-items-center justify-content-center gap-2 p-2">
               
                <button
                  type="submit"
                  className="w-75 p-2 rounded rounded-2 border-0 border text-white"
                >
                  Save
                </button>
                {errorMsg && (
                  <div className="w-50 text-danger d-flex justify-content-center align-items-center">
                    <small>This Email already Registerd</small>
                  </div>
                )}
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};
