import { useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FireBaseContext } from "../../Context/FireBase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
export default function SettingsDeleted({  rowId }) {
    const {
        EventsDeletedRef,
        EventRefrence,
        saveNotificationToFirebase,
      } = useContext(FireBaseContext);
  const ITEM_HEIGHT = 38;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const returnData = async (id) => {
    const ref = doc(EventsDeletedRef, id);
    const item = await getDoc(ref);
    const keyToDelete = "timing";
    const keyToDeleteTwo = "ID";
    const data = item.data();
    if (data && data.hasOwnProperty(keyToDelete)) {
      // Remove the key from the copy
      delete data[keyToDelete];
      delete data[keyToDeleteTwo];
      await setDoc(doc(EventRefrence, id), data);

      saveNotificationToFirebase({
        notifyID: id,
        message: "restored an old event",
        eventDataObject: { ...data },
      });
      await deleteDoc(ref);
    } else {
    }
  };

  const DeleteForever = async (id) => {
    const ref = doc(EventsDeletedRef, id);
    await deleteDoc(ref);
  };
  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "15ch",
          },
        }}
      >
        <MenuItem onClick={()=>returnData(rowId)}>
          <div className="d-flex   justify-content-start align-items-center w-75  gap-2 ">
            <span className="   w-75 text-primary"> Restore</span>
          </div>
        </MenuItem>
        <MenuItem onClick={()=>DeleteForever(rowId)}>
          <div className="d-flex   justify-content-start align-items-center w-75  gap-2 ">
            <span className="   w-75 text-danger">Delete</span>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
