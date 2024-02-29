import React, { useContext, useEffect } from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import Button from '@mui/material/Button';
import { useParams } from "react-router-dom";
import { FireBaseContext } from "../../Context/FireBase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
 const ImportExcel = () => {
  const { dbID } = useParams();
  const { EventRefrence, getData, database } = useContext(FireBaseContext);
  const [data, setData] = useState([]);
  const [filterdData,setFilterd]=useState([])
  const ref = doc(EventRefrence, dbID);
  const subscriberCollection = collection(ref, "Subscribers");
  const SubCollection = collection(database, "Subscribers")
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
  
  function randomXToY(minVal, maxVal) {
    let randVal = minVal + Math.random() * (maxVal - minVal);
    return Math.round(randVal);
  }
  const SendDataFireBase = async()=>{
    const eventRef = await getDoc(ref);
    const eventData = eventRef.data();
    const finalres = filterdData.map((item)=>{
      return {...item,CostPerDelegate:eventData['CostperDelegate']}
    })
    console.log(finalres)
    finalres.map(async (item)=>{
      await addDoc(subscriberCollection, item);
      await addDoc(SubCollection, item);

    })
  }

  useEffect(()=>{
    const arrayOfObjects = data?.slice(1).map((values) => {
      return data[0].reduce((obj, key, index) => {
        obj[key] = values[index];
        return obj;
      }, {});
    });
    setFilterd([...arrayOfObjects])
    // SendDataFireBase()
  },[data])
  // console.log(filterdData);
  return (
  
  <Button   id="fade-button" className="d-flex flex-column "   >
    <label htmlFor="importFile"  className="d-flex ">
      <i className="fa-solid fa-file-arrow-up fs-4 darkBlue"></i>   
      <span>Import</span>
       </label>
      <input type="file" id='importFile' className="d-none"  accept=".xlsx" onChange={handleFileChange} />
  </Button>
  );
};
export default ImportExcel;