import TextField from "@mui/material/TextField";
import { Formik, Form } from "formik";
import Autocomplete from "@mui/material/Autocomplete";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
import { updateDoc, doc, getDoc, collection } from "firebase/firestore";
import swal from "sweetalert";
export const UpdateSubscriberForm = ({ user, handleClose }) => {
  const { dbID } = useParams();
  const { EventRefrence } = useContext(FireBaseContext);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [updatedData, setUpdated] = useState(null);
  const [downloadURL, setDownloadUrl] = useState(null);
  const [valus, setValues] = useState(null);
  const [NewSubScriberInputs, setNewSubScriberInputs] = useState([
    {
      label: "First Name",
      type: "text",
      default: "",
    },
    {
      label: "Last Name",
      type: "text",
      default: "",
    },
    {
      label: "Email",
      type: "text",
      default: "",
    },
    {
      label: "National/iqamaID",
      type: "number",
      default: "",
    },
    {
      label: "Phone Number",
      type: "number",
      default: "",
    },
    {
      label: "specialty",
      type: "text",
      default: "",
    },
    {
      label: "Organization",
      type: "text",
      default: "",
    },
    {
      label: "License ID",
      type: "number",
      default: "",
    },
    {
      label: "City",
      type: "text",
      default: "",
    },
    {
      label: "Cost Per Delegate",
      type: "text",
      default: "",
    },
    {
      label: "Transfer of Value",
      type: "text",
      default: "",
    },
  ]);
  const ref = doc(EventRefrence, dbID);
  const subCollection = collection(ref, "Subscribers");
  const userData = doc(subCollection, user.ID);
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
          Name: e.target[0].value,
          Email: e.target[2].value,
          NationalID: e.target[4].value,
          PhoneNumber: e.target[6].value,
          Speciality: e.target[8].value,
          Organization: e.target[10].value,
          LicenseID: e.target[12].value,
          City: e.target[14].value,
          CostPerDelegate: e.target[16].value,
        };
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
              <div className="w-100   d-flex flex-wrap ">
                <div className="w-50 d-flex justify-content-center">
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
                </div>
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
