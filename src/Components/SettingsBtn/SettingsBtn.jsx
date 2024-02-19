import { useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FireBaseContext } from "../../Context/FireBase";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import {
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import UpdateSubModel from "../UpdateSubModel/UpdateSubModel";
export default function SettingsBtn({ refCollection, rowId, row }) {
  const { dbID } = useParams();
  const ITEM_HEIGHT = 38;
  const [anchorEl, setAnchorEl] = useState(null);
  const { SubscribersDeletedRef } = useContext(FireBaseContext);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const removeSubscriber = async (id) => {
    const ref = doc(refCollection, id);
    const item = await getDoc(ref);
    swal({
      title: "Are you sure You want Delete this subscriber?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        swal({
          icon: "success",
        });
        await deleteDoc(ref);
        await setDoc(doc(SubscribersDeletedRef, id), {
          event: dbID,
          ID: id,
          timing: serverTimestamp(),
          ...item.data(),
        });
        handleClose();
      }
    });
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
        <MenuItem >
          <div className="d-flex   justify-content-between align-items-center w-100  gap-2 ">
            <UpdateSubModel user={row} />
       
          </div>
        </MenuItem>
        <MenuItem onClick={() => removeSubscriber(rowId)}>
          <div className="d-flex   justify-content-center align-items-center w-75  gap-2 ">
            {" "}
            <span className="   w-75 darkBlue">delete</span>
            <i className={`fa-solid fa-trash darkBlue w-25`}></i>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
