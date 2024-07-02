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
  const tovOptions = [
    { types: " Registration Fees", value: 0 },
    { types: "Meals ", value: 0 },
    { types: "Accommodation", value: 0 },
    { types: "Medical Utlitities", value: 0 },
    { types: "CME Hours", value: 0 },
    { types: "Transportation", value: 0 },
  ];

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

  const { dbID } = useParams();
  const { EventRefrence } = useContext(FireBaseContext);
  const [selectedTovOptions, setSelectedTovOptions] = useState([]);
  const [updatedData, setUpdatedData] = useState(null);
  const [downloadURL, setDownloadUrl] = useState(null);

  const EventRef = doc(EventRefrence, dbID);
  const SubscribersCollection = collection(EventRef, "Subscribers");
  const userData = doc(SubscribersCollection, user.ID);
  // async function getdata() {
  //   const item = await getDoc(userData);
  //   console.log(user, "user");
  //   console.log(item.data(), "data");
  //   setUpdatedData(item.data());
  // }

  const setInitialData = () => {
    const data = { ...user };
    delete data.ID;
    setUpdatedData({ ...data });
    setSelectedTovOptions([...data.TransferOfValue]);
  };

  useEffect(() => {
    setInitialData();
  }, []);

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

        updatedData.TransferOfValue = selectedTovOptions;
        console.log(updatedData, "updatedData");

        await updateDoc(userData, updatedData);

        // const updateSub = {
        //   id: user.id,
        //   TransferOfValue: selectedTovOptions.length
        //     ? selectedTovOptions
        //     : updatedData.TransferOfValue,
        //   // FirstName: e.target["FirstName"].value,
        //   // LastName: e.target["LastName"].value,
        //   // Email: e.target["Email"].value,
        //   // NationalID: e.target["NationalID"].value,
        //   // PhoneNumber: e.target["PhoneNumber"].value,
        //   // Speciality: e.target["Speciality"].value,
        //   // Organization: e.target["Organization"].value,
        //   // LicenseID: e.target["LicenseID"].value,
        //   // City: e.target["City"].value,
        //   // CostPerDelegate: e.target["CostPerDelegate"].value,
        // };
        // NewSubScriberInputs.map(
        //   (input) => (updateSub[input.name] = e.target[input.name]?.value)
        // );
        // console.log(updateSub, "updateSub");

        swal({
          icon: "success",
        });
      }
    });
  };
  const checkTxtValue = (value, item) => {
    // selectedOptions[i].value = e.target.value;
    const found = selectedTovOptions.find(({ types }) => types == item);
    found.value = value;
  };

  // useEffect(() => {
  //   getdata();
  //   setUpdated();
  // }, []);

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

                <div className="w-50 mt-2 d-flex justify-content-center align-items-center flex-column">
                  <div
                    style={{ borderBottom: "1px solid black" }}
                    className="mb-1 w-75"
                  >
                    <Autocomplete
                      name={"TransferOfValue"}
                      multiple
                      id="tags-outlined"
                      options={tovOptions}
                      getOptionLabel={(option) => option.types}
                      filterSelectedOptions
                      defaultValue={updatedData.TransferOfValue}
                      onChange={(e, value) => {
                        console.log("changing..");
                        // setUpdatedData({
                        //   ...updatedData,
                        //   ["TransferOfValue"]: value,
                        // });
                        setSelectedTovOptions([
                          // ...updatedData?.TransferOfValue,
                          ...value,
                        ]);
                        console.log(value, "value");
                        console.log(updatedData, "updatedData");
                        console.log(selectedTovOptions, "selectedTovOptions");
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.types === value.types
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<b>Transfer Of Values</b>}
                          className="dropDownBorder "
                          name={"TransferOfValue"}
                        />
                      )}
                    />
                  </div>
                  <div className="w-75 d-flex justify-content-center">
                    <ul className="p-0 d-flex flex-wrap  gap-1 w-100 ">
                      {selectedTovOptions?.map((savedObject, index) => (
                        <li
                          key={index}
                          className="border d-flex flex-column p-2 rounded wrappingItems"
                          style={{ width: "40%" }}
                        >
                          <p className="m-0">Tov : {savedObject.types} </p>
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
