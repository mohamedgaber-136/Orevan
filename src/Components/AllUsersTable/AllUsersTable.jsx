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
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import ChangeEventModal from "../ChangeEventModal/ChangeEventModal";
import UsersSettings from "../UsersSettings/UsersSettings";

export default function AllUsersTable({ row }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("Name");
  const [selected, setSelected] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    setRows(row);
  }, [row]);

  function descendingComparator(a, b, orderBy) {
    if (typeof a[orderBy] === "string" && typeof b[orderBy] === "string") {
      return b[orderBy]?.toLowerCase().localeCompare(a[orderBy]?.toLowerCase());
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
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    { id: "Name", numeric: false, disablePadding: false, label: "Name" },
    { id: "Email", numeric: false, disablePadding: false, label: "Email" },
    { id: "Role", numeric: false, disablePadding: false, label: "Role" },
    { id: "franchiseType", numeric: false, disablePadding: false, label: "Franchise" },
    { id: "Status", numeric: false, disablePadding: false, label: "Status" },
    { id: "Settings", numeric: false, disablePadding: false, label: "" },
  ];

  function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow  style={{
                backgroundColor:'lightGray',

              }}>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "center" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    onRequestSort: PropTypes.func.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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
        className="d-flex justify-content-end"
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        {numSelected > 0 && (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="blue"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        )}
        {numSelected > 0 && (
          <Tooltip title="AddNew">
            <IconButton>
              <ChangeEventModal
                newSelected={selected}
                setSelected={setSelected}
              />
            </IconButton>
          </Tooltip>
        )}
   
      </Toolbar>
    );
  }
  const findTrueKey = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
      if (value === true) {
        return key;
      }
    }
    return null; // or handle the case where no true value is found
  };
  const isSelected = (id) => selected.indexOf(id) !== -1;

  const filteredRows = rows.filter((row) =>
    row.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
      <div className="p-3  d-flex justify-content-between">
          <TextField
            label="Search"
            variant="outlined"                   className='border-2 border  rounded-3'

            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}            fullWidth
          />
        </div>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            {rows.length !== 0 && (
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.ID);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.ID}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                      className="align-items-center"
                    >
                      <TableCell align="left">{row.Name}</TableCell>
                      <TableCell align="left">{row.Email}</TableCell>
                      <TableCell align="left">{findTrueKey(row.Role)}</TableCell>
                      <TableCell align="left">{row.franchiseType?row.franchiseType:'---'}</TableCell>
                      <TableCell align="left">
                        {row?.Condition?.Blocked ? (
                          <b className="text-danger">Blocked</b>
                        ) : (
                          <b className="text-success">Active</b>
                        )}
                      </TableCell>
                      <TableCell align="left">
                        <UsersSettings row={row} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Handle empty rows */}
                {rowsPerPage - filteredRows.length > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * (rowsPerPage - filteredRows.length),
                    }}
                  >
                    <TableCell colSpan={headCells.length} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
