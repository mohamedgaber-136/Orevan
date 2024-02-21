import { useContext } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import { doc, collection, getDocs } from "firebase/firestore";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ExportSfda = ({ data, filename, sheetname }) => {
  const { EventRefrence } = useContext(FireBaseContext);
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetname);
    const finalDataToExport = [];
    await Promise.all(
      data?.map(async (item) => {
        const ref = doc(EventRefrence, item.ID);
        const infoCollection = collection(ref, "Subscribers");
        const handlerSubs = await getDocs(infoCollection).then((snapshot) => {
          finalDataToExport.push(
            {
              "Event ID": item.Id,
              "Event Name": item.EventName,
              "Franchise Name": item.Franchise?.toString(),
              "Event City": item.City.map((city) => city.types).join(","),
              "Cost per Delegate": item.CostperDelegate,
              "Event Cost": item.EventCost?.toString(),
              PO: item.PO,
              P3: item.P3,
              "Start Date": item.StartDate,
              "End Date": item.StartDate,
              "Created At": item.StartDate,
            },
            ...snapshot.docs.map((ele) => {
              const subItem = ele.data();
              return {
                Name: subItem.Name,
                Speciality: subItem.Speciality,
                "Subscriber ID": subItem.id,
                "Subscriber City": subItem.City,
                Email: subItem.Email,
                "License ID": subItem.LicenseID,
                "National ID": subItem.NationalID,
                Organization: subItem.Organization,
                "Phone Number": subItem.PhoneNumber,
                "Event ID": item.Id,
                "Signature":subItem.image
              };
            })
          );
        });
      })
    );

    // Add headers
    const headersList = [
      "Event Name",
      "Franchise Name",
      "Event City",
      "Cost per Delegate",
      "Event Cost",
      "PO",
      "P3",
      "Start Date",
      "End Date",
      "Created At",
      "Event ID",

      "Name",
      "Email",
      "Phone Number",
      "National ID",
      "License ID",
      "Speciality",
      "Organization",
      "Subscriber City",
      "Subscriber ID",
      "Signature"
    ];
    worksheet.addRow([...headersList]);

    // Set the background color for the entire row (e.g., row 1)
    const rowIndex = 1;
    const row = worksheet.getRow(rowIndex);
    row.eachCell({ includeEmpty: true }, (cell,index) => {
      if(index>11){
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "80FFFF00" }, // ARGB format for light red color
        };
        cell.font = { size: 12 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else if(index===11){
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "80009900" }, // ARGB format for light red color
        };
        cell.font = { size: 12 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      }
        else{
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "AAFF0000" }, // ARGB format for light red color
        };
        cell.font = { size: 12 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      }
     
    });

    // Add data rows
    finalDataToExport.map((rowItem, index) => {
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
    finalDataToExport.map((item,ind)=>{
  const data = item["Signature"] 
  if(data){
    worksheet.getCell(`U${ind+2}`).value = {
      text: 'Signature',
      hyperlink: data,
    }
  };

    })
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
    // worksheet.getRow(1).width = 30;

    // Save the workbook as a file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, filename);
    // const fileName = "excel-with-row-color.xlsx";
  };

 
  return (
    <i className="fa-solid fa-download" onClick={handleExport}>
      <span className="fs-6 fw-light"> SFDA</span>{" "}
    </i>
  );
};

export default ExportSfda;
