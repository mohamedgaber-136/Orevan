import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { FireBaseContext } from "../../Context/FireBase";
import SearchText from "../SearchText/SearchText";
import SettingsDeleted from "../SettingDeleted/SettingDeleted";
export default function EventsDeletedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const {
    EventsDeletedRef,
    getData,
    EventRefrence,
    saveNotificationToFirebase,
  } = React.useContext(FireBaseContext);
  const [rows, seteventData] = React.useState([]);
  React.useEffect(() => {
    getData(EventsDeletedRef, seteventData);
  }, []);
  function descendingComparator(a, b, orderBy) {
    if (typeof a[orderBy] == "string" && typeof b[orderBy]) {
      return b[orderBy]?.toLowerCase() < a[orderBy]?.toLowerCase() ? -1 : 1;
    } else {
      return b[orderBy] < a[orderBy] ? -1 : 1;
    }
    // if (b[orderBy] < a[orderBy]) {
    //   return -1;
    // }
    // if (b[orderBy] > a[orderBy]) {
    //   return 1;
    // }
    // return 0;
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
  //
  // HeadTitles ----------------------------------------------
  const headCells = [
    {
      id: "Id",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "eventName",
      numeric: true,
      disablePadding: false,
      label: "EventName",
    },
    {
      id: "Franchise",
      numeric: true,
      disablePadding: false,
      label: "Franchis",
    },
    {
      id: "CreatedAt",
      numeric: true,
      disablePadding: false,
      label: "Created At",
    },
    {
      id: "endDate",
      numeric: true,
      disablePadding: false,
      label: "End Date ",
    },
    {
      id: "DeletedTiming",
      numeric: true,
      disablePadding: false,
      label: "Deleted Timing ",
    },
    {
      id: "Actions",
      numeric: true,
      disablePadding: false,
      label: "Actions ",
    },
  ];
  // eventCost

  // Sorting---Head /--------------------------------
  function EnhancedTableHead(props) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
         <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "center" : "center"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            
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
    rowCount: PropTypes.number.isRequired,
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const statusCase = (status) => {
    if (status === "Completed") {
      return "bg-danger";
    } else if (status === "Started") {
      return "darkBlue";
    } else {
      return "bg-warning";
    }
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.ID);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    let newSelected = [];
    const selectedIndex = selected.indexOf(id);
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
    // In ChecKbOX /--------------------------------------------------------------------
    //
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    console.log(""),
    [order, orderBy, page, rowsPerPage, rows]
  );

  //  /-----------ToolBar
  function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <>
           
          </>
        ) : (
         <></>
        )}
      </Toolbar>
    );
  }
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  // body ----------------
  return (
    <Paper sx={{ width: "100%", mb: 0 }} className="BasicTableParent">
      <div className=" d-flex align-items-center gap-2 p-3 d-flex justify-content-end ">
        <SearchText list={rows} setRows={seteventData} row={rows} />
      </div>
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {visibleRows.map((rowItem, indexItem) => {
              const isItemSelected = isSelected(rowItem.ID);
              const labelId = `enhanced-table-checkbox-${indexItem}`;
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, rowItem.ID)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={`${rowItem.ID}-${indexItem}`}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell align="center">{rowItem.Id}</TableCell>
                  <TableCell align="center">{rowItem.eventName}</TableCell>
                  <TableCell align="center">{rowItem.Franchise}</TableCell>
                  <TableCell align="center">{rowItem.CreatedAt}</TableCell>
                  <TableCell align="center">{rowItem.endDate}</TableCell>
                  <TableCell align="center">
                    {rowItem.timing.toDate().toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <SettingsDeleted rowId={rowItem.ID} />
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
