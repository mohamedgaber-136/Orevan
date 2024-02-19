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
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import FilterBtn from "../FilterBtn/FilterBtn";
import { SearchContext } from "../../Context/SearchContext";
import { FireBaseContext } from "../../Context/FireBase";
import ExportToExcelButton from "../ExportBtn/ExportToExcelButton";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc } from "firebase/firestore";
import SearchText from "../SearchText/SearchText";
export default function TeamsTable({ row }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { EventRefrence } = React.useContext(FireBaseContext);
  const [rows, setRows] = React.useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    setRows(row);
  }, [row]);
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
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

  // HeadTitles ----------------------------------------------
  const headCells = [
    {
      id: "Name",
      numeric: false,
      disablePadding: false,
      label: "Name",
    },
    {
      id: "NumberOfEvents",
      numeric: true,
      disablePadding: false,
      label: "Number of Events",
    },
    {
      id: "GoToEvents",
      numeric: true,
      disablePadding: false,
      label: "Go To Events",
    },
  ];
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
              align={headCell.numeric ? "left" : "left"}
              padding={"normal"}
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
    console.log(id);
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
    [order, orderBy, page, rowsPerPage]
  );
  //  Delet ----------------------------
  const DeleteField = (arr) => {
    arr.map(async (item) => {
      const ref = doc(EventRefrence, item);
      await deleteDoc(ref);
    });
  };
  //  /-----------ToolBar
  // function EnhancedTableToolbar(props) {
  //   const { numSelected } = props;

  //   return (
  //     <Toolbar
  //       sx={{
  //         pl: { sm: 2 },
  //         pr: { xs: 1, sm: 1 },
  //         ...(numSelected > 0 && {
  //           bgcolor: (theme) =>
  //             alpha(
  //               theme.palette.primary.main,
  //               theme.palette.action.activatedOpacity
  //             ),
  //         }),
  //       }}
  //     >
  //       {numSelected > 0 ? (
  //         <Typography
  //           sx={{ flex: "1 1 100%" }}
  //           color="inherit"
  //           variant="subtitle1"
  //           component="div"
  //         >
  //           {numSelected} selected
  //         </Typography>
  //       ) : (
  //         <Typography
  //           sx={{ flex: "0 1 100%" }}
  //           variant="h2"
  //           id="tableTitle"
  //           component="div"
  //         >
  //           <div className="  d-flex gap-3 gap-md-5 fs-6 text-primary dateTableTitle">
  //             <span className="d-flex gap-2 align-items-center">
  //               <i className="fa-solid fa-pause"></i>
  //               <span className="fs-6">Start Date</span>
  //             </span>
  //             <span className="d-flex gap-2 align-items-center">
  //               <i className="fa-solid fa-arrow-down-wide-short"></i>
  //               <span className="fs-6">Filters</span>
  //             </span>
  //             <span className="d-flex gap-2 align-items-center">
  //               <i className="fa-solid fa-bars"></i>
  //               <span className="fs-6">EndDate</span>
  //             </span>
  //             <span className="d-flex gap-2 align-items-center">
  //               <span className="fs-6 exportExcel">
  //                 <ExportToExcelButton
  //                   filename="exported_data"
  //                   sheetname="Sheet 1"
  //                   data={rows}
  //                 />{" "}
  //               </span>
  //             </span>
  //           </div>
  //         </Typography>
  //       )}

  //       {numSelected > 0 && (
  //         <Tooltip title="Delete">
  //           <IconButton onClick={() => DeleteField(selected)}>
  //             <DeleteIcon />
  //           </IconButton>
  //         </Tooltip>
  //       )}
  //     </Toolbar>
  //   );
  // }
  // EnhancedTableToolbar.propTypes = {
  //   numSelected: PropTypes.number.isRequired,
  // };
  // body ----------------
  return (
    <Paper sx={{ width: "100%", mb: 0 }} className="BasicTableParent">
      <div className=" p-3 d-flex justify-content-end">
      </div>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected?.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows?.length}
          />
          <TableBody>
            {visibleRows?.map((row, index) => {
              const isItemSelected = isSelected(row.ID);
              const labelId = `enhanced-table-checkbox-${index}`;
              if (row.data.length) {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={`${row.ID}-${index}`}
                    selected={isItemSelected}
                    className="two"
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell align="left" className="TabelCoulmTeams">
                      {row.name}
                    </TableCell>
                    <TableCell align="left" className="TabelCoulmTeams">
                      {row.data.length}
                    </TableCell>
                    <TableCell align="left" className="TabelCoulmTeams">
                      <button
                        className="btn btn-outline-primary p-2 rounded rounded-2"
                        onClick={() =>
                          navigate("/app/MyEvents", { state: row })
                        }
                      >
                        GO TO MY EVENTS
                      </button>
                    </TableCell>
                  </TableRow>
                );
              }
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
