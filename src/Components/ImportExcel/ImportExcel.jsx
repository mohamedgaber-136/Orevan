import React, { useContext, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
import {  collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import swal from "sweetalert";
import { setDoc } from "firebase/firestore";

const ImportExcel = () => {
  const { dbID } = useParams();
  const { EventRefrence, SubscribersRefrence } = useContext(FireBaseContext);
  const [data, setData] = useState([]);
  const [isDownloadingTemp, setIsDownloadingTemp] = useState(true);

  const ref = doc(EventRefrence, dbID);
  const subscriberCollection = collection(ref, "Subscribers");

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
    };
    reader.readAsBinaryString(file);
  };
  function randomXToY(minVal, maxVal) {
    let randVal = minVal + Math.random() * (maxVal - minVal);
    return Math.round(randVal);
  }

  const validateData = async (data) => {
    const errors = [];
    const requiredFields = ['name', 'LastName', 'email', 'nationalId', 'tel'];
    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    }
  
    const nameRegex = /^[^\d]+$/;
    if (data.FirstName && !nameRegex.test(data.FirstName)) {
      errors.push("FirstName should not contain numbers");
    }
    if (data.LastName && !nameRegex.test(data.LastName)) {
      errors.push("LastName should not contain numbers");
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push("Invalid email format");
    }
  
    if (data.nationalId && data.nationalId.length > 14) {
      errors.push("National ID should not exceed 14 characters");
    }
  
    if (data.tel) {
      if (!data.tel.toString().includes("966")) {
        errors.push("Phone number should include country code +966");
      }
      if (data.tel.length > 11) {
        errors.push("Phone number should not exceed 11 characters");
      }
    }
  
    const emailQuery = query(SubscribersRefrence, where("eventID", "==", dbID), where("email", "==", data.email));
    const nationalIdQuery = query(SubscribersRefrence, where("eventID", "==", dbID), where("nationalId", "==", data.nationalId));
  
    const [emailDocs, nationalIdDocs] = await Promise.all([
      getDocs(emailQuery),
      getDocs(nationalIdQuery)
    ]);
  
    if (!emailDocs.empty) {
      errors.push(`Email ${data.email} is already taken`);
    }
    if (!nationalIdDocs.empty) {
      errors.push(`National ID ${data.nationalId} is already taken`);
    }
  
    return errors;
  };

  const modifyCity = (city) => {
    let arr = [];
    if (city) {
      if (city.includes(",")) {
        arr = city.split(",");
      } else {
        arr.push(city);
      }
    }
  
    return arr;
  };

  
  const SendDataFireBase = async (arrayOfData) => {
    const eventRef = await getDoc(ref);
    const eventData = eventRef.data();
    const validEmails = [];
    const invalidEmails = [];
  
    const finalres = arrayOfData.map((item) => ({
      ...item,
      city: modifyCity(item.city), // Handle both city and citytwo fields
      CostPerDelegate: eventData["CostperDelegate"],
      eventID: eventData["Id"].toString(),
      TransferOfValue: eventData["TransferOfValue"],
      id: randomXToY(1, 1000).toString(), // Randomly generate id
    }));
  
    await Promise.all(
      finalres.map(async (item) => {
        const errors = await validateData(item);
        if (errors.length > 0) {
          console.error(`Validation failed for row: ${JSON.stringify(item)}`);
          console.error(`Errors: ${errors.join(", ")}`);
          if (item.email) {
            invalidEmails.push(item.email);
          }
          return null; // Skip invalid row
        }
        if (item.email) {
          // Use setDoc to set the document ID as item.id
          const subscriberDocRef = doc(SubscribersRefrence, item.id.toString());
          const eventSubscriberDocRef = doc(subscriberCollection, item.id.toString());
          await setDoc(subscriberDocRef, item);
          await setDoc(eventSubscriberDocRef, item);
  
          validEmails.push(item.email);
        }
      })
    );
  
    const successMessage = validEmails.length > 0 
      ? `Successfully added emails: ${validEmails.join(', ')}`
      : 'No valid emails were added.';
      
    const errorMessage = invalidEmails.length > 0 
      ? `Failed to add emails: ${invalidEmails.join(', ')}`
      : '';
      
    swal({
      title: 'Import Results',
      text: `${successMessage}\n${errorMessage}`,
      icon: 'info',
      confirmButtonText: 'OK'
    });
  
    setIsDownloadingTemp(true);
  };

  useEffect(() => {
    const keysValues = {
      "FirstName/الاسم الاول": "name",
      "LastName/الاسم الاخير": "LastName",
      Specialitzation: "specialty",
      "Professional Classification Number": "licenceId",
      "National/Resident ID": "nationalId",
      "Mobile Number / رقم الجوال": "tel",
      "Email/الايميل": "email",
      Signature: "sign64data",
      "city": "city", // Updated key to match the exact key from Excel
      "License ID": "LicenseID",
      Organization: "organization",
    };
  
    console.log(data, 'dataaaaaaaaaaa');
    
    const arrayOfObjects = data
      ?.slice(1)
      .map((values) => {
        const obj = data[0].reduce((acc, key, index) => {
          if (keysValues.hasOwnProperty(key)) {
            acc[keysValues[key]] = values[index];
          }
          return acc;
        }, {});
        
        console.log(obj, 'mapped object'); // Check if city is now included
  
        const isFilled = Object.values(obj).some(
          (value) => value !== undefined && value !== null && value !== ""
        );
        return isFilled ? obj : null;
      })
      .filter(Boolean);
  
    console.log(arrayOfObjects, 'arrayOfObjects two ');
    
    if (arrayOfObjects && arrayOfObjects.length > 0) {
      SendDataFireBase(arrayOfObjects);
    }
  }, [data]);
  
  

  const downloadBasicFile = async () => {
    const sheetname = "basic_templet";
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetname);
    const initialValues = {
      "Title/اللقب": "Mr",
      "FirstName/الاسم الاول": "First Name",
      "LastName/الاسم الاخير": "Last Name",
      Specialitzation: "specialty",
      "Other Specialitzation (optional)": "",
      "Professional Classification Number": "number (max length 15)",
      "National/Resident ID": "number (max length 14)",
      "Medical License ID": "dfhs9889sdjsdk (max length 11)",
      "Mobile Number / رقم الجوال": "phone number (max length 11)",
      "Email/الايميل": "Email@mail.com (must be valid email)",
      "Form Of Payment ": "",
      "Total Grant": "number",
      "Grant purpose": "",
      "Payment Amount": "number",
      "event cities": "city",
    };

    worksheet.addRow([...Object.entries(initialValues).map((item) => item[0])]);
    worksheet.addRow([...Object.entries(initialValues).map((item) => item[1])]);

    worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
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
      });
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        const cellValue = row.getCell(column.number).text;
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
    <Button id="fade-button" className="d-flex flex-column" onClick={downloadBasicFile}>
      <i className="fa fa-cloud-download"></i>
       Template
    </Button>
  ) : (
    <input
      className="form-control form-control-lg"
      type="file"
      name="upload"
      id="upload"
      accept=".xlsx, .xls"
      onChange={handleFileChange}
    />
  );
};

export default ImportExcel;
