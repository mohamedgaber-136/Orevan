import { useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FireBaseContext } from "../../Context/FireBase";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import {
  doc,

  updateDoc,
} from "firebase/firestore";
export default function UsersSettings({  rowId, row }) {
  const { dbID } = useParams();
  const ITEM_HEIGHT = 38;
  const [anchorEl, setAnchorEl] = useState(null);
  const { UserRef } = useContext(FireBaseContext);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const removeSubscriber = async (id) => {
    const ref = doc(UserRef, row.ID);
   
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        swal({
          
          title: `${row.Email} ${row.Condition.Blocked?'Unblocked':'Blocked'}   `,
          icon: "success",
        });
       await updateDoc(ref,{...row,Condition:{
        Blocked
        : 
        !row.Condition.Blocked}})
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
      
        <MenuItem 
        
        onClick={() =>{
          removeSubscriber(rowId)        }
        }
        
        
        >
            {row.Condition.Blocked?
             <div className="d-flex   justify-content-center align-items-center w-75  gap-2 ">
             <i className="fa-solid fa-lock-open text-success w-25"></i>
             <span className="   w-75 darkBlue">Unblock</span>
      </div>
            :
          <div className="d-flex   justify-content-center align-items-center w-75  gap-2 ">
                 <i className="fa-solid fa-user-slash text-danger w-25"></i>
                 <span className="   w-75 darkBlue">Block</span>
          </div>
            }
       
        </MenuItem>
      </Menu>
    </div>
  );
}
