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
        const ref = doc(EventRefrence, item.CurrentEventID);
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

  // const exportToExcel = async () => {
  //   const finalDataToExport = [];
  //   // let workbook = new ExcelJS.Workbook();
  //   // let worksheet = workbook.addWorksheet();
  //   await Promise.all(
  //     data?.map(async (item) => {
  //       const ref = doc(EventRefrence, item.CurrentEventID);
  //       const infoCollection = collection(ref, "Subscribers");
  //       const handlerSubs = await getDocs(infoCollection).then((snapshot) => {
  //         // let row = worksheet.addRow({
  //         //   "Event ID": item.Id,
  //         //   "Event Name": item.EventName,
  //         //   "Franchise Name": item.Franchise?.toString(),
  //         //   City: item.City.map((city) => city.types).join(","),
  //         //   "Cost per Delegate": item.CostperDelegate,
  //         //   "Event Cost": item.EventCost?.toString(),
  //         //   PO: item.PO,
  //         //   P3: item.P3,
  //         //   "Start Date": item.StartDate,
  //         //   "End Date": item.StartDate,
  //         //   "Created At": item.StartDate,
  //         //   // Team: item.Team.map((info) => info),
  //         // });

  //         // row.fill = {
  //         //   type: "pattern",
  //         //   pattern: "darkVertical",
  //         //   fgColor: {
  //         //     argb: "FFFF0000",
  //         //   },
  //         // };

  //         finalDataToExport.push(
  //           {
  //             "Event ID": item.Id,
  //             "Event Name": item.EventName,
  //             "Franchise Name": item.Franchise?.toString(),
  //             City: item.City.map((city) => city.types).join(","),
  //             "Cost per Delegate": item.CostperDelegate,
  //             "Event Cost": item.EventCost?.toString(),
  //             PO: item.PO,
  //             P3: item.P3,
  //             "Start Date": item.StartDate,
  //             "End Date": item.StartDate,
  //             "Created At": item.StartDate,
  //             // Team: item.Team.map((info) => info),
  //           },
  //           ...snapshot.docs.map((ele) => {
  //             console.log(ele.data(), "ele data");

  //             const subItem = ele.data();
  //             return {
  //               Name: subItem.Name,
  //               Speciality: subItem.Speciality,
  //               "Subscriber ID": subItem.id,
  //               City: subItem.City,
  //               Email: subItem.Email,
  //               "License ID": subItem.LicenseID,
  //               "National ID": subItem.NationalID,
  //               Organization: subItem.Organization,
  //               "Phone Number": subItem.PhoneNumber,
  //               // "Sub ID": subItem.id,
  //               // "Sub Email": subItem.Email,
  //               // "Sub Name": subItem.Name,
  //               // "Sub Phone Number": subItem.PhoneNumber,
  //               // "Sub National ID": subItem.NationalID,
  //               // "License ID": subItem.LicenseID,
  //               // "Cost Per Delegate": subItem.CostPerDelegate,
  //               // City: subItem.City,
  //               // Organization: subItem.Organization,
  //               // Speciality: subItem.Speciality,
  //               // TransferOfValue
  //             };
  //           })
  //         );
  //       });

  //       console.log(handlerSubs, "handler");
  //     })
  //   );

  //   console.log(finalDataToExport, "finalDataToExport");

  //   // const ws = XLSX.utils.aoa_to_sheet(extractData);
  //   // const ws = XLSX.utils.json_to_sheet(extractData);
  //   const ws = XLSX.utils.json_to_sheet(finalDataToExport);
  //   // ws.fill = {
  //   //   type: "pattern",
  //   //   pattern: "solid",
  //   //   fgColor: { argb: "cccccc" },
  //   // };
  //   const wb = XLSX.utils.book_new();
  //   var wscols = [
  //     ...Array(20).fill({
  //       wch: 20,
  //       // s: {
  //       //   fill: {
  //       //     pattern: 'solid',
  //       //     fgColor: { rgb: "FFFF0000" },
  //       //     bgColor: { rgb: "FFFF0000" },
  //       //     color: { rgb: "FFFF0000" },
  //       //   },
  //       // },
  //     }),
  //     // { wch: 20 },
  //     // { wch: 20 },
  //     // { wch: 20 },
  //     // { wch: 20 },
  //     // { wch: 20 },
  //     // { wch: 20 },
  //     // { wch: 20 },
  //     // { wch: 20 },
  //     // { wch: 20 },
  //     // { wch: 20 },
  //     // { wch: 20 },
  //   ];
  //   ws["!cols"] = wscols;
  //   // ws.s = { fill: { fgColor: { rgb: "0000" } } };

  //   // ws["C1"] = {
  //   //   t: "n",
  //   //   f: "SUM(A1:A3*B1:B3)",
  //   //   F: "C1:C1",
  //   //   s: { fill: { fgColor: { rgb: "FFFF0000" } } },
  //   // };

  //   // Set the background color for the entire row (e.g., row 2)
  //   //  const rowIndex = 2;

  //   //  // Get the range of the worksheet
  //   //  const range = XLSX.utils.decode_range(ws['!ref']);

  //   //  // Iterate over the columns in the specified row
  //   //  for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
  //   //    // Construct the cell address
  //   //    const cellAddress = XLSX.utils.encode_cell({ r: 10, c: colIndex });

  //   //    // Set the style for each cell in the row
  //   //    if (!ws[cellAddress]) {
  //   //      ws[cellAddress] = {};
  //   //    }

  //   //    // Set the background color for the entire column
  //   //    ws['!cols'][colIndex] = { hidden: false, width: 20, style: { fill: { fgColor: { rgb: 'cccc' } } } };
  //   //  }

  //   XLSX.utils.book_append_sheet(wb, ws, sheetname);
  //   XLSX.writeFile(wb, `${filename}.xlsx`);
  // };

  return (
    <i className="fa-solid fa-download" onClick={handleExport}>
      <span className="fs-6 fw-light"> SFDA</span>{" "}
    </i>
  );
};

export default ExportSfda;
