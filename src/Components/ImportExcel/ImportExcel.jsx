import React from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import Button from '@mui/material/Button';
 const ImportExcel = () => {
  const [data, setData] = useState(null);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle the Excel file here
      handleExcelFile(file);
    }
  };
  const handleExcelFile = (file) => {
    // Use xlsx library to parse the Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      // Process the workbook data (e.g., extract sheets, data, etc.)
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const Finaledata = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      setData(Finaledata)
    };

    reader.readAsBinaryString(file);
   
  };
console.log(data)
  return (
  
  <Button   id="fade-button" className="d-flex flex-column "   >
    <label htmlFor="importFile"  className="d-flex flex-column">
      <i className="fa-solid fa-file-arrow-up fs-4 darkBlue"></i>   
      <span>Import</span>
       </label>
      <input type="file" id='importFile' className="d-none"  accept=".xlsx" onChange={handleFileChange} />
  </Button>
  );
};
export default ImportExcel;