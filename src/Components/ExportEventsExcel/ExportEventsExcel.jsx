import { useState } from 'react';
import * as XLSX from 'xlsx';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const ExportEventsExcel = ({ data, filename, sheetname }) => {
  const extractData = data.map((item)=>({
    'Event Name':item.EventName,
    "Franchise":item.Franchise.toString(),
    "Event ID":item.Id,
    "City":item.City.map((city) => city.types).join(","),
    "Cost per Delegate":item.CostperDelegate,
    "Event Cost":item.EventCost.toString(),
    "PO":item.PO,
    "P3":item.P3,
    "Start Date":item.StartDate,
    "End Date":item.StartDate,
    "Created At":item.StartDate,
   }))

  // const exportToExcel = () => {
  //   const ws = XLSX.utils.json_to_sheet(extractData);
  //   const wb = XLSX.utils.book_new();
  //   var wscols = [
  //     {wch:20},
  //     {wch:20},
  //     {wch:20},
  //     {wch:20},
  //     {wch:20},
  //     {wch:20},
  //     {wch:20},
  //     {wch:20},
  //     {wch:20}, 
  //     {wch:20},
  //     {wch:20}, 
  // ];
  // ws['!cols'] = wscols;
  //   XLSX.utils.book_append_sheet(wb, ws, sheetname);
  //   XLSX.writeFile(wb, `${filename}.xlsx`);
  // };
  const exportToExcel  = async ()=>{
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetname);
    const headersList = [
      "Event ID",
      "Event Name",
      "Franchise",
      "City",
      "Cost per Delegate",
      "Event Cost",
      "PO",
      "P3",
      "Start Date",
      "End Date",
      "Created At",
  
     
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


  return (
   <i className="fa-solid fa-download" onClick={exportToExcel} ><span className='fs-6 fw-light'> excel</span> </i >
  );
};

export default ExportEventsExcel;