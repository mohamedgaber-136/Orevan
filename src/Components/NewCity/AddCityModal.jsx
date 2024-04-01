// import React, { useState } from "react";

// const AddCityModal = ({ open, onClose, onAdd }) => {
//   const [cityName, setCityName] = useState("");

//   const handleAddCity = () => {
//     if (cityName.trim() !== "") {
//       onAdd(cityName);
//       setCityName("");
//       onClose();
//     }
//   };

//   return (
//     <div style={{ display: open ? "block" : "none" }}>
//       <div>City Name:</div>
//       <input
//         type="text"
//         value={cityName}
//         onChange={(e) => setCityName(e.target.value)}
//       />
//       <button onClick={handleAddCity}>Add</button>
//       <button onClick={onClose}>Cancel</button>
//     </div>
//   );
// };

// export default AddCityModal;
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { borderRadius } from "@mui/system";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius:5,
  p: 4,
};

export default function AddCityModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [cityName, setCityName] = useState("");
  const handleAddCity = () => {
    if (cityName.trim() !== "") {
      setCityName("");
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>Add City </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div className=" ">
              <h5>City Name:</h5>
              <div className="d-flex w-100 justify-content-between">
              <input
                type="text"
                onChange={(e) => setCityName(e.target.value)}
              />
              <button className="border-0 rounded bg-primary text-white" onClick={handleAddCity}>Add</button>

              </div>
            </div>{" "}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
