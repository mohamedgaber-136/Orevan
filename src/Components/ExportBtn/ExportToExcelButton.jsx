import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const ExportToExcelButton = ({ data, filename, sheetname }) => {
  const extractData = data.map((item) => ({
    "Title/اللقب": "Dr",
    "FirstName/الاسم الاول": item.FirstName,
    "LastName/الاسم الاخير": item.LastName,
    Specialitzation: item.Speciality,
    "Other Specialitzation (optional)": "",
    "Professional Classification Number": item.MedicalLicense,
    "National/Resident ID": item.NationalID,
    "Mobile Number / رقم الجوال": item.PhoneNumber,
    "Email/الايميل": item.Email,
    "Form Of Payment ": "cash or cash equalivant",
    "Total Grant": item.CostPerDelegate,
    "Grant purpose": item.TransferOfValue.map(
      (item) => `${item.types} = ${item.value}`
    ).join(","),
    "Payment Amount": "",
    Signature: item.image,
  }));
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetname);
    const headersList = [
      "Title/اللقب",
      "FirstName/الاسم الاول",
      "LastName/الاسم الاخير",
      "Specialitzation",
      "Other Specialitzation (optional)",
      "Professional Classification Number",
      "National/Resident ID",
      "Mobile Number / رقم الجوال",
      "Email/الايميل",
      "Form Of Payment ",
      "Total Grant",
      "Grant purpose",
      "Payment Amount",
      "Signature",
    ];
    worksheet.addRow([...headersList]);
    // Set the background color for the entire row (e.g., row 1)
    const rowIndex = 1;
    const row = worksheet.getRow(rowIndex);
    row.eachCell({ includeEmpty: true }, (cell, index) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "80FFFF00" }, // ARGB format for light red color
      };
      cell.font = { size: 12 };
      cell.alignment = { horizontal: "center", vertical: "middle" };

      if (typeof cell.value === "number") {
        cell.numFmt = "0"; // Display as integer, you can customize this format
      }
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
        if (typeof cell.value === "number") {
          cell.numFmt = "0"; // Display as integer, you can customize this format
        }
      });
    });
    extractData.map((item, ind) => {
      const data = item["Signature"];
      if (data) {
        worksheet.getCell(`N${ind + 2}`).value = {
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
    //   const largeNumberColumn = worksheet.getColumn('K');
    // largeNumberColumn.numFmt = '0';
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, filename);
  };

  return (
    <button onClick={exportToExcel} className="bg-transparent d-flex border-0">
      <i className="fa-solid fa-file-arrow-down fs-4 darkBlue"></i>
      <span className="fs-6 fw-light"> excel</span>
    </button>
  );
};

export default ExportToExcelButton;
