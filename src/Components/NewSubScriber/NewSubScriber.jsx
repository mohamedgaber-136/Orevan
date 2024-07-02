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
  onSnapshot,
} from "firebase/firestore";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import "./NewSubScriberStyle.css";
import { MenuItem } from "@mui/material";
export const NewSubScriber = ({ id, handleClose }) => {
  const { setShowAddNeWSub } = useContext(SearchContext);
  const { EventRefrence, SubscribersRefrence, getData, database, Cities } =
    useContext(FireBaseContext);
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
    MedicalLicense: "",
    City: "",
    CostPerDelegate: 0,
    TransferOfValue: [],
  };
  const getDatas = (CollectionType, SetItem) => {
    const returnedValue = onSnapshot(CollectionType, (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      SetItem(newData[0].data);
    });
  };

  // useEffect(()=>{
  //   getDatas(Cities,setItem)
  // },[])
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
      label: "Medical License",
      type: "text",
      name: "MedicalLicense",
    },
    {
      label: "City",
      type: "text",
      name: "City",
    },
  ];
  const validationSchema = Yup.object().shape({
    FirstName: Yup.string().min(3, "Too short").required("Required"),
    LastName: Yup.string().min(3, "Too short").required("Required"),
    Email: Yup.string().email("Enter valid email").required("Required"),
    NationalID: Yup.string()
      .matches(/^\d{10}$/, "National ID must be 10 digits")
      .required("Required"),
    PhoneNumber: Yup.string()
      .matches(/^\d{9}$/, "Phone number must be 9 digits")
      .required("Required"),
    Speciality: Yup.string().required("Required"),
    Organization: Yup.string().required("Required"),
    MedicalLicense: Yup.string().required("Required"),
    City: Yup.string().required("Required"),
  });

  function randomXToY(minVal, maxVal) {
    let randVal = minVal + Math.random() * (maxVal - minVal);
    return Math.round(randVal);
  }

  const ref = doc(EventRefrence, dbID);
  const subscriberCollection = collection(ref, "Subscribers");
  // const SubCollection = collection(database, "Subscribers");
  useEffect(() => {
    getData(subscriberCollection, SetSubScriber);
    getData(SubscribersRefrence, SetUsers);

    (async () => {
      const datas = await getDoc(ref);
      const Result = await datas.data();
      console.log(Result, "result event");
      // setEventData(Result);
    })();
  }, [dbID]);

  const handleFormSubmit = (values) => {
    const data = { ...values };
    console.log("hi");
    console.log(data, "values");
    data.PhoneNumber = `${countryCode}${data.PhoneNumber}`;
    const checkUser = checkSubScriber.find(({ Email }) => Email === data.Email);
    console.log(data);
    if (checkUser) {
      setErrorMsg(true);
    } else {
      swal({
        text: `Subscriber ${data.Email} added successfully `,
        icon: "success",
      }).then(async () => {
        const eventRef = await getDoc(ref);
        const eventData = eventRef.data();
        data["CostPerDelegate"] = eventData.CostperDelegate;
        data["TransferOfValue"] = eventData.TransferOfValue;
        setErrorMsg(false);
        await addDoc(subscriberCollection, data);
        await addDoc(SubscribersRefrence, data);

        setShowAddNeWSub(false);
        handleClose();
      });
    }
  };

  const handleInputChange = (name, value, formValues, setFormValues) => {
    // Regular expression to match Arabic characters
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;

    // Check if the input value contains Arabic characters
    if (arabicRegex.test(value)) {
      // If Arabic characters are detected, remove them
      value = value.replace(arabicRegex, "");
    }
    setFormValues({ ...formValues, [name]: value });

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

      // }
    }
    if (!isAutoCompleted) {
      setFormValues({ ...formValues, [name]: value });
    }
    // Update the form values with the sanitized input
  };

  return (
    <Formik
      initialValues={initialvalues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({ values, setValues }) => (
        <>
          <Form className="bg-white rounded  NewSubScriberForm ">
            <h3 className="px-lg-3 px-1">
              <BreadCrumbs id={id} sub={"Subscriber"} />
            </h3>
            <div className="w-100 gap-2 d-flex flex-wrap justify-content-evenly mt-3 pt-2">
              {NewSubScriberInputs.map((item, index) => (
                <div
                  className="col-12 col-md-5 p-1"
                  key={`${item.label}-${index}`}
                >
                  {item.name == "Email" ? (
                    <>
                      <Field
                        select={item.type == "select"}
                        as={TextField}
                        label={item.label}
                        id={index}
                        focused
                        type={item.type}
                        className={`w-100  ${
                          (item.name === "PhoneNumber" ||
                            item.name === "City") &&
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
                      >
                        {/* {item.type == "select" &&
                      eventData?.city?.map((option) => (
                        <MenuItem key={option.types} value={option.types}>
                          {option.types}
                        </MenuItem>
                      ))} */}
                      </Field>
                      <div className="text-danger  align-self-start  mb-3">
                        <ErrorMessage name={item.name} />
                      </div>
                      {errorMsg && (
                        <div className="w-50 text-danger d-flex justify-content-center align-items-center">
                          <small>This Email already Registerd</small>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <Field
                        select={item.type == "select"}
                        as={TextField}
                        label={item.label}
                        id={index}
                        focused
                        type={item.type}
                        className={`w-100  ${
                          (item.name === "PhoneNumber" ||
                            item.name === "City") &&
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
                      >
                        {/* {item.type == "select" &&
                      eventData?.city?.map((option) => (
                        <MenuItem key={option.types} value={option.types}>
                          {option.types}
                        </MenuItem>
                      ))} */}
                      </Field>
                      <div className="text-danger  align-self-start  mb-3">
                        <ErrorMessage name={item.name} />
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div className="col-12 col-md-5 p-1">
                {/* 
<MultipleSelection
                type="city"
                label="City"
                list={items}
                
                /> */}
              </div>
              <div className="col-12 col-md-5 p-1 d-flex flex-column align-items-center justify-content-center gap-2 p-2">
                <button
                  type="submit"
                  className="w-75 p-2 rounded rounded-2 border-0 border text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </Form>
          {errorMsg && (
            <div className="w-50 text-danger d-flex justify-content-center align-items-center">
              <small>This Email already Registerd</small>
            </div>
          )}
        </>
      )}
    </Formik>
  );
};
