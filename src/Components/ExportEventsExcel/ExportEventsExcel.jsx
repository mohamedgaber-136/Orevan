import { useState } from 'react';
import * as XLSX from 'xlsx';
const ExportEventsExcel = ({ data, filename, sheetname }) => {
  const extractData = data.map((item)=>({
    'Event Name':item.EventName,
    "Franchise Name":item.Franchise.toString(),
    id:item.Id,
    City:item.City.map((city) => city.types).join(","),
    "Cost per Delegate":item.CostperDelegate,
    "Event Cost":item.EventCost.toString(),
    PO:item.PO,
    P3:item.P3,
    "Start Date":item.StartDate,
    "End Date":item.StartDate,
    "Created At":item.StartDate,
   }))

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(extractData);
    const wb = XLSX.utils.book_new();
    var wscols = [
      {wch:20},
      {wch:20},
      {wch:20},
      {wch:20},
      {wch:20},
      {wch:20},
      {wch:20},
      {wch:20},
      {wch:20}, 
      {wch:20},
      {wch:20}, 
  ];
  ws['!cols'] = wscols;
    XLSX.utils.book_append_sheet(wb, ws, sheetname);
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  return (
   <i className="fa-solid fa-download" onClick={exportToExcel} ><span className='fs-6 fw-light'> excel</span> </i >
  );
};

export default ExportEventsExcel;