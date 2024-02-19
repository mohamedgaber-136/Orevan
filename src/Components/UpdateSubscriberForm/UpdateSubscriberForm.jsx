import TextField from "@mui/material/TextField";
import { Formik, Form } from "formik";
import { BreadCrumbs } from "../BreadCrum/BreadCrumbs";
import Autocomplete from '@mui/material/Autocomplete';
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
import { updateDoc, doc, getDoc, collection } from "firebase/firestore";
import UploadBtnSub from "./UploadBtnSub";
import swal from "sweetalert";
import { writeFileAsync } from "xlsx";
export const UpdateSubscriberForm = ({ user ,handleClose}) => {
  const { dbID } = useParams();
  const { EventRefrence, triggerNum, setTriggerNum, updateUser } = useContext(
    FireBaseContext
  );
  const [updatedData, setUpdated] = useState(null);
  const [downloadURL, setDownloadUrl] = useState(null);
  const [valus,setValues]=useState(null)
  const [NewSubScriberInputs, setNewSubScriberInputs] = useState([
    {
      label: "Name",
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
  console.log(userData);
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
  const addNewSubScriber = (e)=>{
    e.preventDefault();
    swal({
      title: `are you sure about this changes ?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async  (willDelete) => {
      if (willDelete) { 
                 handleClose()
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
                    // image: ImageData(),
                    CostPerDelegate:e.target[16].value,
                    // TransferOfValue:valus
                  };
                  await updateDoc(userData, updateSub);
                  console.log(valus)
                  // console.log(valus)
              
        swal({
          icon: "success",
        });
       }
    }) 
  }
  
  useEffect(() => {
    getdata();
    setUpdated();
  }, []);
  if (updatedData) {
    return (
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
                  defaultValue={updatedData?.Name}
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
              {/* <div className="w-50 d-flex justify-content-center">
<Autocomplete
        multiple
        id="tags-outlined"
        options={  [
          { types: "Pharma" },
          { types: "chem" },
          { types: "phys" },
        ]}
        getOptionLabel={(option) => option.types}
        // value={updatedData["TransferOfValue"][0]}
        filterSelectedOptions 
       onChange={(e,value)=>{
        setValues(value)
        setUpdated({
        ...updatedData,['TransferOfValue']:value
       })
      }}
       isOptionEqualToValue={(option, value) => option.types === value.types}
          renderInput={(params) => (
          <TextField
            {...params}
            label={`TransferOfValue`}
            className='dropDownBorder'
          />
        )}
        
      />
              </div> */}
              <div className="w-50 d-flex justify-content-center">
                <button className="w-75 p-1 m-2 rounded rounded-2 border-0 border text-white">
                  Save
                </button>
              </div>
              <div className="w-50 d-flex justify-content-center">
                <UploadBtnSub id={user.ID} setImg={setDownloadUrl} />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }else{
      return(<div className="w-100 d-flex justify-content-center" >
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
</div>)
}
};
