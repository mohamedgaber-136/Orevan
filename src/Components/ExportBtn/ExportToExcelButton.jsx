// import * as XLSX from 'xlsx';
// import Button from '@mui/material/Button';

// const ExportToExcelButton = ({ data, filename, sheetname }) => {
//   const extractData = data.map((item)=>({
//     FirstName:item.FirstName,
//     LastName:item.LastName,
//     Speciality:item.Speciality,
//     id:item.id,
//     City:item.City,
//     Email:item.Email,
//     LicenseID:item.LicenseID,
//     NationalID:item.NationalID,
//     Organization:item.Organization,
//     PhoneNumber:item.PhoneNumber,
//    }))

//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(extractData);
//     const wb = XLSX.utils.book_new();
//     var wscols = [
//       {wch:20,s: { font: { bold: true, color: { rgb: "FF0000" }} }},
//       {wch:20,s: { font: { bold: true, color: { rgb: "FF0000" }} }},
//       {wch:20,s: { font: { bold: true, color: { rgb: "FF0000" }} }},
//       {wch:20,s: { font: { bold: true, color: { rgb: "FF0000" }} }},
//       {wch:20,s: { font: { bold: true, color: { rgb: "FF0000" }} }},
//       {wch:20,s: { font: { bold: true, color: { rgb: "FF0000" }} }},
//       {wch:20,s: { font: { bold: true, color: { rgb: "FF0000" }} }},
//       {wch:20,s: { font: { bold: true, color: { rgb: "FF0000" }} }},
//       {wch:20,s: { font: { bold: true, color: { rgb: "FF0000" }} }},
//       {wch:20,s: { font: { bold: true, color: { rgb: "FF0000" }} }}, 
//   ];
//   ws['!cols'] = wscols;
//     XLSX.utils.book_append_sheet(wb, ws, sheetname);
//     XLSX.writeFile(wb, `${filename}.xlsx`);
//   };

//   return (

//       <Button   id="fade-button" className="d-flex flex-column "  onClick={exportToExcel}  >
//         <i className="fa-solid fa-file-arrow-up fs-4 darkBlue"></i>   
//         <span>export</span>
//     </Button>
//   );
// };

// export default ExportToExcelButton;
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const ExportToExcelButton = ({ data, filename, sheetname }) => {
  const extractData = data.map((item)=>({
        FirstName:item.FirstName,
        LastName:item.LastName,
        Speciality:item.Speciality,
        id:item.id,
        City:item.City,
        Email:item.Email,
        LicenseID:item.LicenseID,
        NationalID:item.NationalID,
        Organization:item.Organization,
        PhoneNumber:item.PhoneNumber,
       }))


  const exportToExcel  = async ()=>{
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetname);
    const headersList = [
      "FirstName",
      "LastName",
      "Speciality",
      "id",
      "City",
      "Email",
      "LicenseID",
      "NationalID",
      "Organization",
      "PhoneNumber",
  
     
    ];
    worksheet.addRow([...headersList]);
    // Set the background color for the entire row (e.g., row 1)
    const rowIndex = 1;
    const row = worksheet.getRow(rowIndex);
    row.eachCell({ includeEmpty: true }, (cell,index) => {   
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "80FFFF00" }, // ARGB format for light red color

        };
        cell.font = { size: 12 };
        cell.alignment = { horizontal: "center", vertical: "middle" };      
    });
  
    // Add data rows
    extractData.map((rowItem, index) => {
      const holder = [
        ...headersList.map((head) => {
          const convertItem = isNaN(Number(rowItem[head]))
            ? rowItem[head]
            : Number(rowItem[head]);
          return rowItem[head] ? convertItem : "";
        }),
      ];
      worksheet.addRow([...holder]);
  
      const rowIndex = index + 2;
      const row = worksheet.getRow(rowIndex);
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = rowItem.hasOwnProperty("Event Name") && {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFADD8E6" }, // ARGB format for light blue color
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });
    // Set column widths to fit the content
    worksheet.columns.forEach((column, colIndex) => {
      let maxLength = 0;
  
      // Find the maximum content length in the column
      worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
        const cellValue = row.getCell(colIndex + 1).text;
        maxLength = Math.max(maxLength, cellValue ? cellValue.length : 0);
      });
  
      // Set the column width based on the maximum content length
      column.width = maxLength + 5; // Add some extra padding
    });
    worksheet.getRow(1).height = 20;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, filename);
  }


  return (<button onClick={exportToExcel} className='bg-transparent border-0'>
    <i className="fa-solid fa-file-arrow-down fs-4 darkBlue"></i>
   <span className='fs-6 fw-light'> excel</span> 
  </button>
  );
};

export default ExportToExcelButton;