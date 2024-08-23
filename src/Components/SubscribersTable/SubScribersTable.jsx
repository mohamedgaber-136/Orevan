import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import UploadBtn from "../UploadBtn/UploadBtn";
import Modal from "../Modal/Modal";
import ImportExcel from "../ImportExcel/ImportExcel";
import ChangeEventModal from "../ChangeEventModal/ChangeEventModal";
import ExportToExcelButton from "../ExportBtn/ExportToExcelButton";
import SettingsBtn from "../SettingsBtn/SettingsBtn";
import { TextField } from "@mui/material";
export default function SubScribersTable({ row, refCollection }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [rows, setrows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState('');

  function descendingComparator(a, b, orderBy) {
    if (typeof a[orderBy] == "string" && typeof b[orderBy]) {
      return b[orderBy]?.toLowerCase() < a[orderBy]?.toLowerCase() ? -1 : 1;
    } else {
      return b[orderBy] < a[orderBy] ? -1 : 1;
    }
  
  }
  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  function stableSort(array, comparator) {
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis?.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
  }
  React.useEffect(() => {
    setrows(row);
  }, [row]);
  // HeadTitles
  const headCells = [
    {
      id: "id",
      numeric: true,
      disablePadding: false,
      label: "",
    },
    {
      id: "name",
      numeric: true,
      disablePadding: false,
      label: "FirstName",
    },
    {
      id: "email",
      numeric: true,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "tel",
      numeric: true,
      disablePadding: false,
      label: "Phone Number",
    },
    {
      id: "organization",
      numeric: true,
      disablePadding: false,
      label: "Organization",
    },
    {
      id: "speciality",
      numeric: true,
      disablePadding: false,
      label: "Speciality",
    },
    {
      id: "nationalId",
      numeric: true,
      disablePadding: false,
      label: "National ID",
    },
    {
      id: "city",
      numeric: true,
      disablePadding: false,
      label: "City",
    },
    {
      id: "sign64data",
      numeric: true,
      disablePadding: false,
      label: "Signature",
    },
    {
      id: "Actions",
      numeric: true,
      disablePadding: false,
      label: "Actions",
    },
  ];

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    EnhancedTableToolbar.propTypes = {
      numSelected: PropTypes.number.isRequired,
    };
    return (
      <TableHead>
        <TableRow  style={{
                backgroundColor:'lightGray',

              }}>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "center" : "center"}
              padding={headCell.disablePadding ? "normal" : "normal"}
              sortDirection={orderBy === headCell.d ? order : false}
              className=" p-0"
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    return (
      <Toolbar
        className=" d-flex justify-content-end"
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
    
        {numSelected > 0 && (
          <Typography
            sx={{ width:'auto !important' }}
            color="blue"
            variant="subtitle1"
            component="div"
          >
            {selected.length} selected
          </Typography>
        )}
        <Tooltip title={numSelected <= 0 ? "select subscriber" : "change"}>
          <IconButton>
            <ChangeEventModal
              numSelected={numSelected <= 0}
              newSelected={selected}
              setSelected={setSelected}
            />
          </IconButton>
        </Tooltip>
        <div
          className="d-flex  gap-2 align-items-center
"
        >
          <ExportToExcelButton
            filename="exported_data"
            sheetname="Sheet 1"
            data={rows}
          />
          <ImportExcel />
          <div className="p-3 d-flex justify-content-between">
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          className='border-2 border  rounded-3'

          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </div>        </div>
        <Tooltip title="AddNew">
          <IconButton>
            <Modal />
          </IconButton>
        </Tooltip>
      </Toolbar>
    );
  }
  const isSelected = (id) => selected.indexOf(id) !== -1;
  const filteredRows = rows.filter((row) =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    const visibleRows = React.useMemo(
      () =>
        stableSort(filteredRows, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        ),
      [order, orderBy, page, rowsPerPage, filteredRows]
    );

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  return (
    <Box sx={{ width: "100%" }} >
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
   
        <TableContainer>
          <Table 
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
            />
            {rows.length !== 0 && (
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      onClick={(event) => handleClick(event, row.id)}

                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.email}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                      className="align-items-center"
                    >
               
               <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                      <TableCell align="center">{row.name}</TableCell>
                      <TableCell align="center">{row.email}</TableCell>
                      <TableCell align="center">{row.tel}</TableCell>
                      <TableCell align="center">{row.organization}</TableCell>
                      <TableCell align="center">{row.specialty}</TableCell>
                      <TableCell align="center">{row.nationalId}</TableCell>
                      <TableCell align="center">{row.city}</TableCell>
                      <TableCell
                        align="center"
                        className="subRowImg  d-flex justify-content-center gap-1 align-items-center "
                      >
                        <UploadBtn id={row.id} info={row.sign64data && "d-none"} element={row}/>  
                        {row.sign64data && (
                          <img src={row.sign64data} alt="signature" width={"75px"} style={{objectFit:'contain'}}  />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <SettingsBtn
                          row={row}
                          rowId={row.id}
                          refCollection={refCollection}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
