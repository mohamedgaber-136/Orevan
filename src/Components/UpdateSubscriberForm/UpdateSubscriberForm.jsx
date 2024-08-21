import TextField from "@mui/material/TextField";
import { Formik, Form, Field } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
import {
  updateDoc,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import swal from "sweetalert";

export const UpdateSubscriberForm = ({ user, handleClose }) => {
  const tovOptions = [
    { types: "Registration Fees", value: 0 },
    { types: "Meals", value: 0 },
    { types: "Accommodation", value: 0 },
    { types: "Medical Utilities", value: 0 },
    { types: "CME Hours", value: 0 },
    { types: "Transportation", value: 0 },
  ];

  const NewSubScriberInputs = [
    { label: "First Name", type: "text", name: "name" },
    { label: "Last Name", type: "text", name: "LastName" },
    { label: "Email", type: "text", name: "email" },
    { label: "National/iqamaID", type: "number", name: "nationalId" },
    { label: "Phone Number", type: "text", name: "tel" },
    { label: "Speciality", type: "text", name: "specialty" },
    { label: "Organization", type: "text", name: "organization" },
    { label: "License ID", type: "number", name: "licenceId" },
    { label: "City", type: "text", name: "city" },
    { label: "Cost Per Delegate", type: "text", name: "CostPerDelegate" },
  ];

  const { dbID } = useParams();
  const { SubscribersRefrence } = useContext(FireBaseContext);
  const [selectedTovOptions, setSelectedTovOptions] = useState([]);
  const [updatedData, setUpdatedData] = useState(null);
  const [downloadURL, setDownloadUrl] = useState(null);

  const changeedUser = doc(SubscribersRefrence, user.id);

  const setInitialData = async () => {
    try {
      const userDoc = await getDoc(changeedUser);
      if (userDoc.exists()) {
        const data = { ...userDoc.data() };
        delete data.ID;
        setUpdatedData({ ...data });
        setSelectedTovOptions([...data.TransferOfValue]);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  useEffect(() => {
    setInitialData();
  }, [user]);

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

  if (updatedData) {
    return (
      <>
        <h2>Edit Subscriber</h2>
        <Formik
          initialValues={updatedData}
          onSubmit={addNewSubScriber}
        >
          {({ setFieldValue }) => (
            <Form className="d-flex p-3 bg-white rounded flex-column gap-2 justify-content-between align-item-center NewSubScriberForm">
              <div className="w-100 d-flex flex-wrap">
                {NewSubScriberInputs.map((input, index) => (
                  <div key={index} className="w-50 d-flex justify-content-center">
                    <Field
                      as={TextField}
                      label={input.label}
                      name={input.name}
                      type={input.type}
                      sx={{ m: 1, width: "25ch" }}
                      focused
                      className="w-75"
                    />
                  </div>
                ))}

                <div className="w-50 mt-2 d-flex justify-content-center align-items-center flex-column">
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
                  <div className="w-75 d-flex justify-content-center">
                    <ul className="p-0 d-flex flex-wrap gap-1 w-100">
                      {selectedTovOptions.map((savedObject, index) => (
                        <li
                          key={index}
                          className="border d-flex flex-column p-2 rounded wrappingItems"
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
                <div className="w-50 d-flex justify-content-center align-items-center">
                  <button type="submit" className="w-75 p-1 m-2 rounded rounded-2 border-0 border text-white">
                    Save
                  </button>
                </div>
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
