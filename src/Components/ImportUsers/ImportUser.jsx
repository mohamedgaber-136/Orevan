import React, { useContext, useEffect } from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
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
      const Finaledata = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      setData(Finaledata);
      console.log(Finaledata,'finale')
    };
    reader.readAsBinaryString(file);

  };
  function randomXToY(minVal, maxVal) {
    let randVal = minVal + Math.random() * (maxVal - minVal);
    return Math.round(randVal);
  }
//   const SendDataFireBase = async (arrayOfData) => {
//     const eventRef = await getDoc(ref);
//     const eventData = eventRef.data();
//     const finalres = arrayOfData.map((item) => {
//       return { ...item, CostPerDelegate: eventData["CostperDelegate"],id: randomXToY(1, 1000)};
//     });
//     await Promise.all(
//       finalres.map(async (item) => {
//         await addDoc(SubCollection, item);
//         await addDoc(subscriberCollection, item);
//       })
//     );

//     setIsDownloadingTemp(true);
//   };

  useEffect(() => {
    const keysValues = {
    "Name": "michael",
      "Email": "michael@email.com",
      "Password": "123abc456",
      "Franchise Type": "Franchise",
      "Role":"(Admin - Associate - Franchise Manager)",
    };

    const arrayOfObjects = data?.slice(1).map((values) => {
      return data[0].reduce((obj, key, index) => {
        if (keysValues.hasOwnProperty(key)) {
          obj[key] = values[index];
        }
        return obj;
      }, {});
    });
    setUsersData([...arrayOfObjects])
  }, [data]);

  const downloadBasicFile = async () => {
    const sheetname = "basic_templet";
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetname);
    const initialValues = {
      "Name": "michael",
      "Email": "michael@email.com",
      "Password": "123abc456",
      "Franchise Type": "Franchise",
      "Role":"(Admin - Associate - Franchise Manager)",
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
    <Button id="fade-button" className="d-flex flex-column " onClick={downloadBasicFile}>
      <div className="d-flex ">
        <i className="fa-solid fa-file-arrow-down fs-4 darkBlue"></i>
        <span>import</span>
      </div>
    </Button>
  ) : (
    <Button id="fade-button" className="d-flex flex-column ">
      <label htmlFor="importFile" className="d-flex ">
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
