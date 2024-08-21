import { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SearchEvent from "../SearchEvent/SearchEvent";
export default function ChangeEventModal({ newSelected, setSelected,numSelected }) {
  const [open, setOpen] = useState(false);
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
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
      <Button
        onClick={handleClickOpen}
        className={` text-white d-flex justify-content-center align-items-center ${numSelected?'btn-grey':'btn-DarkBlue'} `}
        disabled={numSelected}
      >
        Change Event
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
       
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className="p-5">
          <SearchEvent
            handleClose={handleClose}
            newSelected={newSelected}
            setSelected={setSelected}
          />
        </DialogContent>
      </BootstrapDialog>
    </>
  );
}
