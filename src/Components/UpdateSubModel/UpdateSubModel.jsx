import {useState} from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { UpdateSubscriberForm } from '../UpdateSubscriberForm/UpdateSubscriberForm';
import AddIcon from '@mui/icons-material/Add';
export default function UpdateSubModel({user}) {
  const [open, setOpen] = useState(false);
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button  onClick={handleClickOpen} className=' darkBlue w-100  d-flex justify-content-start  p-0'>
<div className="w-75 d-flex justify-content-between align-items-center">
<span>edit</span> <i className={`fa-solid fa-pen w-25`}></i> 
</div>
         
     </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{minWidth:'300'}} >
        <UpdateSubscriberForm handleClose={handleClose} user={user}/>
        </DialogContent>

      </BootstrapDialog>
    </>
  );
}