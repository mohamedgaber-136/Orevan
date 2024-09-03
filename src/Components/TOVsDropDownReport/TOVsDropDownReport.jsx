import * as React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Formik, Form, Field, ErrorMessage } from "formik";
import InputAdornment from "@mui/material/InputAdornment";
import { FormControl, InputLabel, MenuItem, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import { doc, getDoc } from "firebase/firestore";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
const TOVsDropDownReport = ({ data, filename, sheetname }) => {
  const tovOptions = [
    { types: "Accommodation" },
    { types: "CME Hours" },
    { types: "Flights" },
    { types: "Immunology"},
    { types: "Meals" },
    { types: "Registration Fees" },
    { types: "Medical Utilities" },
    { types: "Transportation" },
    { types: "Visa" },
  ];

  const [selectedTov, setSelectedTov] = useState("");
  const { TransferOfValuesRef } = useContext(FireBaseContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    const index = parseInt(event.currentTarget.getAttribute('data-value'), 10);
    if (index >= 0 && index < tovOptions.length) {
      setSelectedTov(tovOptions[index].types);
    }
    setAnchorEl(null);
  };

  useEffect(() => {
    if (selectedTov) {
      getFirebaseDocument();
    }
  }, [selectedTov]);

  const getFirebaseDocument = async () => {
    const targetDoc = await getDoc(doc(TransferOfValuesRef, selectedTov));
    const dataList = targetDoc.exists() ? targetDoc.data().data : [];
    let totalCost = 0;
    const extractData = dataList.map((item) => {
      totalCost += Number(item.value);
      return {
        "Event Name": item.eventName,
        "Event Date": item.eventDate,
        Value: item.value,
      };
    });
    await exportToExcel(extractData, totalCost);
  };

  const exportToExcel = async (extractData, totalCost) => {
    const filename = `${selectedTov} Report`;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("tov sheet");
    const headersList = ["Event Name", "Event Date", "Value"];
    worksheet.addRow([...headersList]);

    const row = worksheet.getRow(1);
    row.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "80FFFF00" },
      };
      cell.font = { size: 12 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

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
      if (index + 1 === extractData.length) {
        worksheet.addRow([...Array(2).fill(""), totalCost]);
        const row = worksheet.getRow(extractData.length + 2);
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFADD8E6" },
          };
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      }
      const rowIndex = index + 2;
      const row = worksheet.getRow(rowIndex);
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

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
    saveAs(blob, filename);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        className="d-flex flex-column "
      >
        <i className="fa-solid fa-file-arrow-down fs-4 darkBlue"></i>
        <span>Tov Report</span>
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {tovOptions.map((tov, index) => (
          <MenuItem
            key={tov.types}
            data-value={index}
            onClick={handleClose}
          >
            {tov.types}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default TOVsDropDownReport;