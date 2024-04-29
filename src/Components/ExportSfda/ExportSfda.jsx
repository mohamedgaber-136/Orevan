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
              "Event Name": item.eventName,
              "Franchise Name": item.Franchise?.toString(),
              "Event City": item.city.map((city) => city.types).join(","),
              "Cost per Delegate": item.CostperDelegate,
              "Event Cost": item.EventCost?.toString(),
              PO: item.PO,
              BeSure: item.BeSure,
              "Start Date": item.eventDate,
              "End Date": item.endDate,
              "Created At": item.CreatedAt,
            },
            ...snapshot.docs.map((ele) => {
              const subItem = ele.data();
              return {
                "Event ID": item.Id,
                'Title/اللقب':'Dr',
                'FirstName/الاسم الاول': subItem.FirstName,
                'LastName/الاسم الاخير': subItem.LastName,
                Specialitzation: subItem.Speciality,
                'Other Specialitzation (optional)': '',
                'Professional Classification Number':subItem.MedicalLicense,
                "National/Resident ID": subItem.NationalID,
                "Mobile Number / رقم الجوال": subItem.PhoneNumber,
                'Email/الايميل': subItem.Email,
                'Form Of Payment ': 'cash or cash equalivant',
                "Total Grant": subItem.CostPerDelegate,
                "Grant purpose":subItem.TransferOfValue.map((item)=>`${item.types} = ${item.value}`).join(','),
                'Payment Amount':'',
                'Date of Payment':item.StartDate,
                Signature: subItem.image,
                // "Subscriber City": subItem.City,
                // "License ID": subItem.LicenseID,
                // Organization: subItem.Organization,
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
      "BeSure",
      "Start Date",
      "End Date",
      "Created At",
      "Event ID",



      "Event ID",
      'Title/اللقب',
      'FirstName/الاسم الاول',
      'LastName/الاسم الاخير',
      'Specialitzation',
      'Other Specialitzation (optional)',
      'Professional Classification Number',
      "National/Resident ID",
      "Mobile Number / رقم الجوال",
      'Email/الايميل',
      'Form Of Payment ',
      "Total Grant",
      "Grant purpose",
      'Payment Amount',
      'Date of Payment',
      'Signature',
    ];
    worksheet.addRow([...headersList]);

    // Set the background color for the entire row (e.g., row 1)
    const rowIndex = 1;
    const row = worksheet.getRow(rowIndex);
    row.eachCell({ includeEmpty: true }, (cell, index) => {
      if (index > 11) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "80FFFF00" }, // ARGB format for light red color
        };
        cell.font = { size: 12 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else if (index === 11) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "80009900" }, // ARGB format for light red color
        };
        cell.font = { size: 12 };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else {
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
        if (typeof cell.value === "number") {
          cell.numFmt = "0"; // Display as integer, you can customize this format
        }
      });
    });
    finalDataToExport.map((item, ind) => {
      const data = item["Signature"];
      if (data) {
        worksheet.getCell(`AA${ind + 2}`).value = {
          text: "Signature",
          hyperlink: data,
        };
      }
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

  return (
    <i className="fa-solid fa-download" onClick={handleExport}>
      <span className="fs-6 fw-light"> SFDA</span>
    </i>
  );
};

export default ExportSfda;
