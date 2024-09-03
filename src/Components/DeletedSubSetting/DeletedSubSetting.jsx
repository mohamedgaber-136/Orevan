import { useContext, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FireBaseContext } from "../../Context/FireBase";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
export default function DeletedSubSetting({  rowId }) {
    const {SubscribersDeletedRef,EventRefrence,SubscribersRefrence} = useContext(FireBaseContext)

  const ITEM_HEIGHT = 38;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const returnData = async (id, event) => {
    try {
      const ref = doc(SubscribersDeletedRef, id);
      const item = await getDoc(ref);
  
      if (item.exists()) {
        const itemData = item.data();
        const docId = itemData.id; // Use the id from item.data() as the document ID
        
        // Add the item to the SubscribersRefrence collection using the id from item.data()
        const subscribersRef = doc(SubscribersRefrence, docId);
        await setDoc(subscribersRef, { ...itemData });
  
        // Delete the original document from SubscribersDeletedRef
        await deleteDoc(ref);
  
        console.log(`Document with ID ${docId} added to SubscribersRefrence and deleted from SubscribersDeletedRef.`);
      } else {
        console.log(`Document with ID ${id} does not exist in SubscribersDeletedRef.`);
      }
    } catch (error) {
      console.error("Error adding document to SubscribersRefrence:", error);
    }
  };
  const DeleteForever = async (id)=>{
    const ref = doc(SubscribersDeletedRef,id)
    await deleteDoc(ref)
  }
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
