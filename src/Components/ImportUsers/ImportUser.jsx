import React, { useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Button from "@mui/material/Button";
import { FireBaseContext } from "../../Context/FireBase";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ImportUser = () => {
  const { setUsersData } = useContext(FireBaseContext);
  const [data, setData] = useState([]);
  const [isDownloadingTemp, setIsDownloadingTemp] = useState(true);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleExcelFile(file);
    }
  };

  const handleExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      let Finaledata = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
  
      // Filter out empty rows
      Finaledata = Finaledata.filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));
  
      setData(Finaledata);
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    const keysValues = {
      "Name": "michael",
      "Email": "michael@email.com",
      "Password": "123abc456",
      "franchiseType": "Franchise",
      "Condition": "Blocked - Active",
      "Role": "(admin - user - manager)",
    };
  
    const arrayOfObjects = data?.slice(1).map((values) => {
      return data[0].reduce((obj, key, index) => {
        let value = values[index];
        if (key === "Role") {
          // Convert Role to an object with the value as the key and true
          obj[key] = { [value]: true };
        } else if (key === "Condition") {
          // Convert Condition to an object with Blocked or Active as the key
          obj[key] = {
            Blocked: value === "Blocked",
          };
        } else if (keysValues.hasOwnProperty(key)) {
          obj[key] = value;
        }
        return obj;
      }, {});
    });
  
    setUsersData([...arrayOfObjects]);
  }, [data]);

  const downloadBasicFile = async () => {
    const sheetname = "basic_templet";
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetname);
    const initialValues = {
      "Name": "michael",
      "Email": "michael@email.com",
      "Password": "123abc456",
      "franchiseType": "Franchise",
      "Role": "(admin - user - manager)",
      "Condition": "Blocked - Active",

    };

    worksheet.addRow([...Object.entries(initialValues).map((item) => item[0])]);
    worksheet.addRow([...Object.entries(initialValues).map((item) => item[1])]);

    const rowIndex = 1;
    const row = worksheet.getRow(rowIndex);

    [1, 2].map((rowIndex) =>
      worksheet.getRow(rowIndex).eachCell({ includeEmpty: true }, (cell, index) => {
        if (rowIndex === 1) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "80FFFF00" },
          };
        }
        cell.font = { size: 12 };
        cell.alignment = { horizontal: "center", vertical: "middle" };

        if (typeof cell.value === "number") {
          cell.numFmt = "0";
        }
      })
    );

    worksheet.columns.forEach((column, colIndex) => {
      let maxLength = 0;
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        const cellValue = row.getCell(colIndex + 1).text;
        maxLength = Math.max(maxLength, cellValue ? cellValue.length : 0);
      });
      column.width = maxLength + 5;
    });

    worksheet.getRow(1).height = 20;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, sheetname);
    setIsDownloadingTemp(false);
  };

  return isDownloadingTemp ? (
    <Button id="fade-button-download" className="d-flex flex-column" onClick={downloadBasicFile}>
      <div className="d-flex">
        <i className="fa-solid fa-file-arrow-down fs-4 darkBlue"></i>
        <span>import</span>
      </div>
    </Button>
  ) : (
    <Button id="fade-button-upload" className="d-flex flex-column">
      <label htmlFor="importFile" className="d-flex">
        <i className="fa-solid fa-file-arrow-up fs-4 darkBlue"></i>
        <span>insert</span>
      </label>
      <input
        type="file"
        id="importFile"
        className="d-none"
        accept=".xlsx"
        onChange={handleFileChange}
      />
    </Button>
  );
};

export default ImportUser;
