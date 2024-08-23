import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./NewSubScriberStyle.css";
import { BreadCrumbs } from "../BreadCrum/BreadCrumbs";
import { SearchContext } from "../../Context/SearchContext";
import { FireBaseContext } from "../../Context/FireBase";
import InputAdornment from "@mui/material/InputAdornment";
import { doc, collection, getDoc, setDoc } from "firebase/firestore";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

export const NewSubScriber = ({ id, handleClose }) => {
  const { setShowAddNeWSub } = useContext(SearchContext);
  const { EventRefrence, SubscribersRefrence, getData } =
    useContext(FireBaseContext);
  const { dbID } = useParams();
  const countryCode = "+966";
  const [errorMsg, setErrorMsg] = useState(false);
  const [checkSubScriber, SetSubScriber] = useState([]);
  const [user, SetUsers] = useState([]);
  const [cities, setCity] = useState([]);
  const [initialValues, setInitialValues] = useState({
    nationalId: "",
    name: "",
    LastName: "",
    email: "",
    tel: "",
    specialty: "",
    organization: "",
    licenceId: "",
    city: "",
    CostPerDelegate: 0,
    TransferOfValue: [],
  });

  const NewSubScriberInputs = [
    { label: "National/iqamaID", type: "text", name: "nationalId" },
    { label: "First Name", type: "text", name: "name" },
    { label: "Last Name", type: "text", name: "LastName" },
    { label: "email", type: "text", name: "email" },
    { label: "Phone Number", type: "text", name: "tel" },
    { label: "specialty", type: "text", name: "specialty" },
    { label: "Organization", type: "text", name: "organization" },
    { label: "Medical License", type: "text", name: "licenceId" },
    { label: "City", type: "select", name: "city" },
  ];

  const validationSchema = Yup.object().shape({
    nationalId: Yup.string()
      .matches(/^\d{10}$/, "National ID must be 10 digits")
      .required("Required"),
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "First Name must contain only letters")
      .min(3, "Too short")
      .required("Required"),
    LastName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Last Name must contain only letters")
      .min(3, "Too short")
      .required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
    tel: Yup.string()
      .matches(/^\d{9}$/, "Phone number must be 9 digits")
      .required("Required"),
    specialty: Yup.string().required("Required"),
    organization: Yup.string().required("Required"),
    licenceId: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
  });

  const ref = doc(EventRefrence, dbID);
  const subscriberCollection = collection(ref, "Subscribers");

  useEffect(() => {
    getData(subscriberCollection, SetSubScriber);
    getData(SubscribersRefrence, SetUsers);
  
    (async () => {
      const datas = await getDoc(ref);
      const Result = datas.data();
      setCity(Result.city);
  
      if (Result.city.length === 1) {
        console.log(Result.city[0],'result')
        setInitialValues((prevValues) => ({
          ...prevValues,
          city: Result.city[0], // Set the only city as the default value
        }));
      }
    })();
  }, [dbID]);

  function randomXToY(minVal, maxVal) {
    let randVal = minVal + Math.random() * (maxVal - minVal);
    return Math.round(randVal);
  }

  const handleFormSubmit = async (values) => {
    const data = { ...values };
    data.tel = `${countryCode}${data.tel}`;

    const existingSubscriber = checkSubScriber.find(
      (subscriber) =>
        subscriber.email === data.email ||
        subscriber.nationalId === data.nationalId ||
        subscriber.tel === data.tel
    );

    if (existingSubscriber) {
      let errorMessages = {};
      if (existingSubscriber.email === data.email) {
        errorMessages.email = "This email is already registered.";
      }
      if (existingSubscriber.nationalId === data.nationalId) {
        errorMessages.nationalId = "This National/iqama ID is already registered.";
      }
      if (existingSubscriber.tel === data.tel) {
        errorMessages.tel = "This phone number is already registered.";
      }

      setErrorMsg(errorMessages);
    } else {
      swal({
        text: `Subscriber ${data.email} added successfully`,
        icon: "success",
      }).then(async () => {
        const eventRef = await getDoc(ref);
        const eventData = eventRef.data();
        data["CostPerDelegate"] = eventData.CostperDelegate;
        data["TransferOfValue"] = eventData.TransferOfValue;
        data["sign64data"] = "";
        data["eventID"] = dbID;
        const generatedId = randomXToY(1, 1000).toString();
        data["id"] = generatedId;
        setErrorMsg(false);

        await setDoc(doc(subscriberCollection, generatedId), data);
        await setDoc(doc(SubscribersRefrence, generatedId), data);

        setShowAddNeWSub(false);
        handleClose();
      });
    }
  };

  const handleInputChange = (name, value, formValues, setFormValues) => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    if (arabicRegex.test(value)) {
      value = value.replace(arabicRegex, "");
    }

    if (name === "nationalId" && value.length > 10) {
      value = value.slice(0, 10);
    }

    if (["name", "LastName"].includes(name)) {
      const letterOnlyRegex = /^[A-Za-z\s]*$/;
      if (!letterOnlyRegex.test(value)) {
        return;
      }
    }

    setFormValues({ ...formValues, [name]: value });

    let isAutoCompleted = false;
    if (name === "nationalId" && value.length >= 7) {
      const matchingItem = user.find(
        (item) => String(item.nationalId).toLowerCase() === value.toLowerCase()
      );
      if (matchingItem) {
        isAutoCompleted = true;
        setFormValues({
          ...matchingItem,
          tel: matchingItem.tel.substring(4),
        });
      }
    }
    if (!isAutoCompleted) {
      setFormValues({ ...formValues, [name]: value });
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize={true}  // Add this prop

    >
      {({ values, setValues }) => (
        <Form className="bg-white rounded NewSubScriberForm">
          <h3 className="px-lg-3 px-1">
            <BreadCrumbs id={id} sub={"Subscriber"} />
          </h3>
          <div className="w-100 gap-2 d-flex flex-wrap justify-content-evenly mt-3 pt-2">
            {NewSubScriberInputs.map((item, index) => (
              <div
                className="col-12 col-md-5 p-1"
                key={`${item.label}-${index}`}
              >
                {item.type === "select" ? (
                  <FormControl fullWidth>
                    <InputLabel>{item.label}</InputLabel>
                    <Field
                      as={Select}
                      label={item.label}
                      id={index}
                      name={item.name}
                      className='border-2 border  rounded-3 w-100'

                      value={values[item.name]}
                      onChange={(e) =>
                        handleInputChange(
                          item.name,
                          e.target.value,
                          values,
                          setValues
                        )
                      }
                    >
                      {cities.map((city, cityIndex) => (
                        <MenuItem key={cityIndex} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                ) : (
                  <Field
                    as={TextField}
                    label={item.label}
                    id={index}
                    focused
                    type={item.type}
                   
                    className='border-2 border  rounded-3 w-100'

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
                      startAdornment: item.name === "tel" && (
                        <InputAdornment position="start">
                          {countryCode}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                <ErrorMessage
                  name={item.name}
                  component="div"
                  className="text-danger"
                />
                {errorMsg && errorMsg[item.name] && (
                  <div className="text-danger">{errorMsg[item.name]}</div>
                )}
              </div>
            ))}
          </div>
          <div className="d-flex flex-wrap gap-2 justify-content-end p-3">
            <button
              className="btn btn-danger px-5"
              onClick={() => {
                setShowAddNeWSub(false);
                handleClose();
              }}
              type="button"
            >
              Cancel
            </button>
            <button className="btn btn-primary px-5" type="submit">
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
