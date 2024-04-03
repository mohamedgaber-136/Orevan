
import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FireBaseContext } from "../../Context/FireBase";
import swal from 'sweetalert'
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius:5,
  p: 4,
};

export default function AddCityModal() {
  const {Cities} = useContext(FireBaseContext)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [cityName, setCityName] = useState("");
  const handleAddCity = async () => {
    const docRef = doc(Cities,'City'); 
          const docSnap = await getDoc(docRef);
           const info = {
      types:cityName
    }
if (docSnap.exists()) {
        const newData = docSnap.data().data || []; // Get existing array or initialize empty array
        newData.push(info); // Push new item into the array

        await updateDoc(docRef, { data: newData });
        swal({
          icon: "success",
          title: `${cityName} Added`
        }) // Update document with the new array
        handleClose()
        console.log('Document successfully updated!');
      } else {
        console.log('No such document!');
      }
    } 
   

  return (
    <div className="BtnOthers">
      
      <Button onClick={handleOpen}><small>Others</small> </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className=''>
          <Typography id="modal-modal-description" >
            <div className=" ">
              <h5>City Name:</h5>
              <div className="d-flex w-100 justify-content-between">
              <input
                type="text"
                onChange={(e) => setCityName(e.target.value)}
              />
              <button className="border-0 px-2 rounded btn-DarkBlue  text-white" onClick={handleAddCity}>+</button>

              </div>
            </div>{" "}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
