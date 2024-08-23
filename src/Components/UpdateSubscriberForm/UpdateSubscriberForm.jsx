import TextField from "@mui/material/TextField";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import swal from "sweetalert";
import * as Yup from "yup";
import { MenuItem, Select, FormControl, InputLabel, InputAdornment } from "@mui/material";

export const UpdateSubscriberForm = ({ user, handleClose }) => {
  const tovOptions = [
    { types: "Registration Fees", value: 0 },
    { types: "Meals", value: 0 },
    { types: "Accommodation", value: 0 },
    { types: "Medical Utilities", value: 0 },
    { types: "CME Hours", value: 0 },
    { types: "Transportation", value: 0 },
  ];
  const countryCode = "+966";

  const NewSubScriberInputs = [
    { label: "First Name", type: "text", name: "name" },
    { label: "Last Name", type: "text", name: "LastName" },
    { label: "Email", type: "text", name: "email" },
    { label: "National/iqamaID", type: "text", name: "nationalId" },
    { label: "Phone Number", type: "text", name: "tel" },
    { label: "Speciality", type: "text", name: "specialty" },
    { label: "Organization", type: "text", name: "organization" },
    { label: "License ID", type: "text", name: "licenceId" },
    { label: "Cost Per Delegate", type: "text", name: "CostPerDelegate" },
  ];
  const compareData = (originalData, updatedData) => {
    const changes = [];
    Object.keys(updatedData).forEach(key => {
      if (originalData[key] !== updatedData[key]) {
        changes.push({
          field: key,
          from: originalData[key],
          to: updatedData[key]
        });
      }
    });
    return changes;
  };
  
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "First Name must contain only letters")
      .min(3, "Too short")
      .required("Required"),
    LastName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Last Name must contain only letters")
      .min(3, "Too short")
      .required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
    nationalId: Yup.string()
      .matches(/^\d{10}$/, "National ID must be 10 digits")
      .required("Required"),
    tel: Yup.string()
      .matches(/^\d{9}$/, "Phone number must be 9 digits")
      .required("Required"),
    specialty: Yup.string().required("Required"),
    organization: Yup.string().required("Required"),
    licenceId: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    CostPerDelegate: Yup.number().required("Required"),
  });
  const { dbID } = useParams();

  const { SubscribersRefrence,EventRefrence } = useContext(FireBaseContext);
  const [selectedTovOptions, setSelectedTovOptions] = useState([]);
  const [updatedData, setUpdatedData] = useState(null);
  const [downloadURL, setDownloadUrl] = useState(null);
  const [cities, setCity] = useState([]);

  const changeedUser = doc(SubscribersRefrence, user.id);

  const setInitialData = async () => {
    try {
      const userDoc = await getDoc(changeedUser);
      if (userDoc.exists()) {
        const data = { ...userDoc.data() };
        delete data.ID;
        setUpdatedData({ ...data ,tel: extractPhoneNumber(data.tel)// Set the only city as the default value
        });
        setSelectedTovOptions([...data.TransferOfValue]);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };
  const ref = doc(EventRefrence, dbID);
  function extractPhoneNumber(number) {
    const countryCode = '+966';
    if (number.startsWith(countryCode)) {
      return number.slice(countryCode.length);
    }
    return number; // or return null or an empty string if the number doesn't start with +966
  }
  useEffect(() => {
    setInitialData();
  }, [user]);
  useEffect(() => {
    (async () => {
      const datas = await getDoc(ref);
      const Result = datas.data();
      setCity(Result.city);
  
      if (Result.city.length === 1) {
        setInitialData((prevValues) => ({
          ...prevValues,
          city: Result.city[0],
        }));
      }
    })();
  }, [dbID]);

  const ImageData = () => {
    return downloadURL || updatedData?.image;
  };

  const addNewSubScriber = async (values) => {
    try {
      swal({
        title: "Are you sure about these changes?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          handleClose();
          values.TransferOfValue = selectedTovOptions;
          await updateDoc(changeedUser, values);
          swal({ icon: "success" });
        }
      });
    } catch (error) {
      console.error("Error updating document:", error);
      swal({
        title: "Error",
        text: "There was an issue updating the subscriber.",
        icon: "error",
      });
    }
  };

  const checkTxtValue = (value, item) => {
    const found = selectedTovOptions.find(({ types }) => types === item);
    if (found) {
      found.value = value;
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
  if (updatedData) {
    return (
      <>
        <h2>Edit Subscriber</h2>
        <Formik
          initialValues={updatedData}
          validationSchema={validationSchema}
          onSubmit={addNewSubScriber}
        >
          {({ setFieldValue , values, setValues }) => (
            <Form className="d-flex p-3 bg-white rounded flex-column gap-2 justify-content-between align-items-center NewSubScriberForm">
              <div className="w-100  gap-2 row justify-content-center flex-wrap">
                {NewSubScriberInputs.map((input, index) => (
                  <div key={index} className=" d-flex col-12 col-md-4 flex-column justify-content-center">
                    <Field
                      as={TextField}
                      label={input.label}
                      name={input.name}
                      type={input.type}
                      sx={{ m: 1, width: "25ch" }}
                      className='border-2 border rounded-3 w-100'
                      InputProps={{
                        startAdornment: input.name === "tel" && (
                          <InputAdornment position="start">
                            {countryCode}
                          </InputAdornment>
                        ),
                      }}
                    />
                    <ErrorMessage
                      name={input.name}
                      component="div"
                      className="text-danger"
                    />
                  </div>
                ))}
                <div className="col-12 col-md-4">
                   <FormControl fullWidth>
                    <InputLabel>City</InputLabel>
                    <Field
                      as={Select}
                      label={'City'}
                      id={'City'}
                      name={'city'}
                      className='border-2 border  rounded-3 w-100'

                      value={values.city}
                      onChange={(e) =>
                        handleInputChange(
                          'city',
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
                  </div>
                <div className="w-100 mt-2 d-flex justify-content-center align-items-center flex-column">
                  <div style={{ borderBottom: "1px solid black" }} className="mb-1 w-75">
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={tovOptions}
                      getOptionLabel={(option) => option.types}
                      filterSelectedOptions
                      value={selectedTovOptions}
                      onChange={(e, value) => {
                        setSelectedTovOptions(value);
                      }}
                      isOptionEqualToValue={(option, value) => option.types === value.types}
                      renderInput={(params) => (
                        <TextField {...params} label={<b>Transfer Of Values</b>} className="dropDownBorder" />
                      )}
                    />
                  </div>
                  <div className="w-50 d-flex justify-content-center">
                    <ul className="p-0 d-flex flex-wrap gap-1 w-100">
                      {selectedTovOptions.map((savedObject, index) => (
                        <li
                          key={index}
                          className="border d-flex flex-column p-2 justify-content-between rounded wrappingItems"
                          style={{ width: "40%" }}
                        >
                          <p className="m-0">Tov: {savedObject.types}</p>
                          <TextField
                            onChange={(e) =>
                              checkTxtValue(e.target.value, savedObject.types)
                            }
                            defaultValue={savedObject.value}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <button type="submit" className="px-4 text-center m-2 rounded rounded-2 border-0 border text-white">
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </>
    );
  } else {
    return (
      <div className="w-100 d-flex justify-content-center">
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
      </div>
    );
  }
};
