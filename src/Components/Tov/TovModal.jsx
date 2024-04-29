// TovModal.jsx
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import { useState } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TovModal({ checkTxtValue, selectedOption }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSaveValue = () => {
    checkTxtValue(inputValue, selectedOption);
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <span className="btn btn-outline-primary">add value</span>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add value
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
              focused
              className="w-100"
              value={inputValue}
              onChange={handleInputChange}
            />
          </Typography>
          <Button onClick={handleSaveValue}>Save</Button>
        </Box>
      </Modal>
    </div>
  );
}
