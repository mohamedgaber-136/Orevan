import TextField from "@mui/material/TextField";
import { Formik, Form } from "formik";
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
  const { dbID } = useParams();
  const { EventRefrence, SubscribersRefrence } = useContext(FireBaseContext);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [updatedData, setUpdated] = useState(null);
  const [downloadURL, setDownloadUrl] = useState(null);
  const [valus, setValues] = useState(null);
  const NewSubScriberInputs = [
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
      label: "National/iqamaID",
      type: "number",
      name: "NationalID",
    },
    {
      label: "Phone Number",
      type: "text",
      name: "PhoneNumber",
    },
    {
      label: "Speciality",
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
      name: "MedicalLicense",
    },
    {
      label: "City",
      type: "text",
      name: "City",
    },
    {
      label: "Cost Per Delegate",
      type: "text",
      name: "CostPerDelegate",
    },
    // {
    //   label: "Transfer of Value",
    //   type: "text",
    //   name: "TransferOfValue",
    // },
  ];
  const ref = doc(EventRefrence, dbID);
  // const subCollection = collection(ref, "Subscribers");
  const userData = doc(SubscribersRefrence, user.ID);
  async function getdata() {
    const item = await getDoc(userData);
    setUpdated(item.data());
  }
  const ImageData = () => {
    if (!downloadURL) {
      return updatedData.image;
    } else {
      return downloadURL;
    }
  };
  const addNewSubScriber = (e) => {
    e.preventDefault();
    swal({
      title: `are you sure about this changes ?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        handleClose();

        const updateSub = {
          id: user.id,
          // FirstName: e.target["FirstName"].value,
          // LastName: e.target["LastName"].value,
          // Email: e.target["Email"].value,
          // NationalID: e.target["NationalID"].value,
          // PhoneNumber: e.target["PhoneNumber"].value,
          // Speciality: e.target["Speciality"].value,
          // Organization: e.target["Organization"].value,
          // LicenseID: e.target["LicenseID"].value,
          // City: e.target["City"].value,
          // CostPerDelegate: e.target["CostPerDelegate"].value,
        };
        NewSubScriberInputs.map(
          (input) => (updateSub[input.name] = e.target[input.name].value)
        );
        console.log(updateSub, "updateSub");

        await updateDoc(userData, updateSub);

        swal({
          icon: "success",
        });
      }
    });
  };
  const checkTxtValue = (e, item, i) => {
    selectedOptions[i].value = e.target.value;
  };
  const options = [
    { types: " Registration Fees", value: 0 },
    { types: "Meals ", value: 0 },
    { types: "Accommodation", value: 0 },
    { types: "Medical Utlitities", value: 0 },
    { types: "CME Hours", value: 0 },
    { types: "Transportation", value: 0 },
  ];
  useEffect(() => {
    getdata();
    setUpdated();
  }, []);

  if (updatedData) {
    return (
      <>
        <h2>Edit SubScriber</h2>
        <Formik>
          {() => (
            <Form
              onSubmit={addNewSubScriber}
              className="d-flex p-3 bg-white rounded  flex-column  gap-2 justify-content-between align-item-center NewSubScriberForm"
            >
              <div className="w-100   d-flex flex-wrap">
                {NewSubScriberInputs.map((input, index) => (
                  <div className="w-50 d-flex justify-content-center">
                    <TextField
                      label={input.label}
                      id={input.name}
                      sx={{ m: 1, width: "25ch" }}
                      focused
                      className="w-75 "
                      defaultValue={updatedData[input.name]}
                      type={input.type}
                    />
                  </div>
                ))}
                {/* <div className="w-50 d-flex justify-content-center">
                  <TextField
                    label={`${NewSubScriberInputs[0].label}`}
                    id={``}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    className="w-75 "
                    defaultValue={updatedData?.FirstName}
                  />
                </div>
                <div className="w-50 d-flex justify-content-center">
                  <TextField
                    label={`${NewSubScriberInputs[0].label}`}
                    id={``}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    className="w-75 "
                    defaultValue={updatedData?.LastName}
                  />
                </div>
                <div className="w-50 d-flex justify-content-center">
                  <TextField
                    label={`${NewSubScriberInputs[1].label}`}
                    id={""}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    className="w-75 "
                    defaultValue={updatedData?.Email}
                  />
                </div>
                <div className="w-50 d-flex justify-content-center">
                  <TextField
                    label={`${NewSubScriberInputs[2].label}`}
                    id={``}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    className="w-75 "
                    defaultValue={updatedData?.NationalID}
                  />
                </div>
                <div className="w-50 d-flex justify-content-center">
                  <TextField
                    label={`${NewSubScriberInputs[3].label}`}
                    id={``}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    className="w-75 "
                    defaultValue={updatedData?.PhoneNumber}
                  />
                </div>
                <div className="w-50 d-flex justify-content-center">
                  <TextField
                    label={`${NewSubScriberInputs[4].label}`}
                    id={``}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    className="w-75 "
                    defaultValue={updatedData?.Speciality}
                  />
                </div>
                <div className="w-50 d-flex justify-content-center">
                  <TextField
                    label={`${NewSubScriberInputs[5].label}`}
                    id={``}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    className="w-75 "
                    defaultValue={updatedData?.Organization}
                  />
                </div>
                <div className="w-50 d-flex justify-content-center">
                  <TextField
                    label={`${NewSubScriberInputs[6].label}`}
                    id={``}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    className="w-75 "
                    defaultValue={updatedData?.LicenseID}
                  />
                </div>
                <div className="w-50 d-flex justify-content-center">
                  <TextField
                    label={`${NewSubScriberInputs[7].label}`}
                    id={``}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    className="w-75 "
                    defaultValue={updatedData?.City}
                  />
                </div>
                <div className="w-50 d-flex justify-content-center">
                  <TextField
                    label={`${NewSubScriberInputs[8].label}`}
                    id={``}
                    sx={{ m: 1, width: "25ch" }}
                    focused
                    className="w-75 "
                    defaultValue={updatedData?.CostPerDelegate}
                  />
                </div> */}

                <div className="w-50  mt-2 d-flex justify-content-center align-items-center flex-column">
                  <div
                    style={{ borderBottom: "1px solid black" }}
                    className="mb-1 w-75"
                  >
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={options}
                      getOptionLabel={(option) => option.types}
                      filterSelectedOptions
                      onChange={(e, value) => {
                        setValues(value);
                        setUpdated({
                          ...updatedData,
                          ["TransferOfValue"]: value,
                        });
                        setSelectedOptions([
                          ...updatedData?.TransferOfValue,
                          ...value,
                        ]);
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.types === value.types
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<b>Transfer Of Values</b>}
                          className="dropDownBorder "
                        />
                      )}
                    />
                  </div>
                  <div className="w-75 d-flex justify-content-center">
                    <ul className="p-0 d-flex flex-wrap  gap-1 w-100 ">
                      {updatedData?.TransferOfValue.map(
                        (savedObject, index) => (
                          <li
                            key={index}
                            className="border d-flex flex-column p-2 rounded wrappingItems "
                            style={{ width: "40%" }}
                          >
                            <p className="m-0">Tov : {savedObject.types} </p>
                            <TextField
                              onChange={(e) =>
                                checkTxtValue(e, savedObject.option, index)
                              }
                              defaultValue={savedObject.value}
                            />
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <div className="w-50 d-flex justify-content-center align-items-center">
                  <button className="w-75 p-1 m-2 rounded rounded-2 border-0 border text-white">
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
{
  /* <Autocomplete
        multiple
        id="tags-outlined"
        const options = {[' Registration Fees', 'Meals ', 'Accommodation','Medical Utlitities','CME Hours',
        'Transportation']}
        getOptionLabel={(option) => option}
        // value={updatedData["TransferOfValue"][0]}
        filterSelectedOptions 
       onChange={(e,value)=>{
        setValues(value)
        setUpdated({
        ...updatedData,['TransferOfValue']:value
       })
      }}
       isOptionEqualToValue={(option, value) => option === value}
          renderInput={(params) => (
          <TextField
            {...params}
            label={`TransferOfValue`}
            className='dropDownBorder'
          />
        )}
         */
}
// />
