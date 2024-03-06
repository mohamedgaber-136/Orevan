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
    // e.preventDefault();

    // const newData = { id: randomXToY(1, 100000000) };

    // NewSubScriberInputs.map(({ name }) => {
    //   if (name == "PhoneNumber") {
    //     newData[name] = `${countryCode}${e.target[name].value}`;
    //   } else {
    //     newData[name] = e.target[name].value;
    //   }
    // });

    // console.log(newData, "newData");

    // const data = {
    //   id: randomXToY(1, 100000000),
    //   FirstName: e.target[2].value,
    //   LastName: e.target[4].value,
    //   Email: e.target[6].value,
    //   NationalID: e.target[0].value,
    //   PhoneNumber: e.target[8].value,
    //   Speciality: e.target[10].value,
    //   Organization: e.target[12].value,
    //   LicenseID: e.target[14].value,
    //   MedicalID: e.target[16].value,
    //   City: e.target[18].value,
    // };

    const data = { ...values };
    data.PhoneNumber = `${countryCode}${data.PhoneNumber}`;

    console.log(data, "data");
    const checkUser = checkSubScriber.find(({ Email }) => Email === data.Email);
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
        await addDoc(SubCollection, data);
        setShowAddNeWSub(false);
        handleClose();
      });
    }
  };

  const handleInputChange = (name, value, formValues, setFormValues) => {
    let isAutoCompleted = false;
    // is the national id primary one
    if (name == "NationalID" && value.length >= 7) {
      const matchingItem = user.find(
        (item) => String(item.NationalID).toLowerCase() == value.toLowerCase()
      );

      if (matchingItem) {
        isAutoCompleted = true;
        // setAutoFilledUser({ ...matchingItem });

        setFormValues({
          ...matchingItem,
          PhoneNumber:matchingItem.PhoneNumber.substring(
            4
          ),
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
            // onSubmit={onsubmit}
            className="d-flex p-3 bg-white rounded  flex-column  gap-2 justify-content-between align-item-center NewSubScriberForm"
          >
            <h3>
              <BreadCrumbs id={id} sub={"Subscriber"} />
            </h3>
            <div className="w-100  d-flex flex-wrap ">
              {/* <div className="w-50  flex-column align-items-center    d-flex justify-content-center">
                <div className="text-danger ps-5 align-self-start">
                  <ErrorMessage name={"NationalID"} />
                </div>

                <Field
                  as={TextField}
                  label={"National/iqamaID"}
                  id={"NationalID"}
                  sx={{ m: 1, width: "25ch" }}
                  focused
                  type={"number"}
                  className="w-75 "
                  name={"NationalID"}
                  // onChange={checkNationalId}
                  // onChange={handleChange}
                  // value={change}
                  onChange={(e) =>
                    customHandleChange("NationalID", e, handleChange)
                  }
                  value={values.NationalID}
                />
              </div> */}
              {/* <div className="w-50  flex-column align-items-center    d-flex justify-content-center">
                <div className="text-danger ps-5 align-self-start">
                  <ErrorMessage name={"NationalID"} />
                </div>

                <Field
                  as={TextField}
                  label={"National/iqamaID"}
                  id={"NationalID"}
                  sx={{ m: 1, width: "25ch" }}
                  focused
                  type={"number"}
                  className="w-75 "
                  name={"NationalID"}
                  // onChange={checkNationalId}
                  // onChange={handleChange}
                  // value={change}
                  value={autoFilledUser["NationalID"]}
                  onChange={(e) => {
                    handleInputChange(e, "NationalID");
                    handleChange(e);
                  }}
                />
              </div> */}

              {NewSubScriberInputs.map((item, index) => (
                <div
                  className="w-50  flex-column align-items-center   d-flex justify-content-center"
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
                    }}
                    focused
                    type={item.type}
                    className={`w-75  ${
                      item.name == "PhoneNumber" &&
                      "border border-secondary form-control p-2"
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
                      startAdornment: item.name == "PhoneNumber" && (
                        <InputAdornment position="start">
                          {countryCode}
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              ))}

              {/* {NewSubScriberInputs.map((item, index) =>
                item.name === "PhoneNumber" ? (
                  <div
                    className="w-50  flex-column align-items-center   d-flex justify-content-center"
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
                      // onChange={handleChange}
                      value={values[item.name]}
                      onChange={(e) =>
                        customHandleChange(item.name, e, handleChange)
                      }
                      // onChange={(e) => handleInputChange(e, item.name)}
                      // onChange={(e) =>
                      //   setAutoFilledUser({
                      //     ...autoFilledUser,
                      //     [item.name]: e.target.value,
                      //   })
                      // }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            {countryCode}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                ) : (
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
                      // value={autoFilledUser[item.name]}
                      value={values[item.name]}
                      onChange={(e) =>
                        customHandleChange(item.name, e, handleChange)
                      }
                      // onChange={(e) => handleInputChange(e, item.name)}

                      // onChange={handleChange}

                      // onChange={(e) =>
                      //   setAutoFilledUser({
                      //     ...autoFilledUser,
                      //     [item.name]: e.target.value,
                      //   })
                      // }
                    />
                  </div>
                )
              )} */}
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
