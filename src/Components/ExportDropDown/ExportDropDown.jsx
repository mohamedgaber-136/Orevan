import * as React from "react";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import ExportEventsExcel from '../ExportEventsExcel/ExportEventsExcel'
import ExportSfda from "../ExportSfda/ExportSfda";
export default function ExportDropDown({rows,sub}) {
  console.log(sub, 'combined export dropdown')

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        className="d-flex flex-column "
      >
        <i className="fa-solid fa-file-arrow-down fs-4 darkBlue"></i>
        <span>export</span>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}> 
         <ExportEventsExcel
         filename="exported_data"
         sheetname="Sheet 1"
         data={rows}
       /> 
     </MenuItem>
        <MenuItem onClick={handleClose}> 
        <ExportSfda
         filename="exported_data"
         sheetname="Sheet 1"
         data={sub}
       /> 
     </MenuItem>   
      </Menu>
    </div>
  );
}