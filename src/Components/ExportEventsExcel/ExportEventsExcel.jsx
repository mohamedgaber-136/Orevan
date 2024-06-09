import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const ExportEventsExcel = ({ data, filename, sheetname }) => {
  const extractData = data.map((item) => ({
    "Event Name": item.eventName,
    Franchise: item.Franchise.toString(),
    "Event ID": item.Id,
    City: item.city.map((city) => city.types).join(","),
    "Cost per Delegate": item.CostperDelegate,
    "Event Cost": item.EventCost.toString(),
    PO: item.PO,
    BeSure: item.BeSure,
    "Start Date": item.eventDate,
    "End Date": item.endDate,
    "Created At": item.CreatedAt,
    "Created By": item.CreatedByName,
  }));

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetname);
    console.log(data, "extractData");
    const headersList = [
      "Event ID",
      "Event Name",
      "Franchise",
      "City",
      "Cost per Delegate",
      "Event Cost",
      "PO",
      "BeSure",
      "Start Date",
      "End Date",
      "Created At",
      "Created By",
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
  };

  return (
    <i className="fa-solid fa-download" onClick={exportToExcel}>
      <span className="fs-6 fw-light"> Orevan</span>
    </i>
  );
};

export default ExportEventsExcel;
