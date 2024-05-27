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
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import swal from "sweetalert";
import { FireBaseContext } from "../../Context/FireBase";
import ExportDropDown from "../ExportDropDown/ExportDropDown";
import "./DataTable.css";
import { useNavigate } from "react-router-dom";
import {
  doc,
  serverTimestamp,
  getDoc,
  setDoc,
  writeBatch,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import SearchText from "../SearchText/SearchText";
import SearchFormik from "../SearchFormik/SearchFormik";
import TOVsDropDownReport from "../TOVsDropDownReport/TOVsDropDownReport";
export default function DataTable({ row }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { EventRefrence, EventsDeletedRef, database } =
    React.useContext(FireBaseContext);
  const navigate = useNavigate();
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
  React.useEffect(() => {
    setRows(row);
  }, [row]);
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
      label: "Name",
    },
    {
      id: "CostperDelegate",
      numeric: true,
      disablePadding: false,
      label: "Cost / Delegate	",
    },
    {
      id: "TransferOfValue",
      numeric: true,
      disablePadding: false,
      label: "Transfer of Value	",
    },
    {
      id: "EventCost",
      numeric: true,
      disablePadding: false,
      label: "Event Cost",
    },
    {
      id: "eventDate",
      numeric: true,
      disablePadding: false,
      label: "Start Date",
    },
    {
      id: "endDate",
      numeric: true,
      disablePadding: false,
      label: "end Date ",
    },
    {
      id: "CreatedAt",
      numeric: true,
      disablePadding: false,
      label: "Created At",
    },
    {
      id: "Status",
      numeric: true,
      disablePadding: false,
      label: "Status",
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
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "left" : "left"}
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
  const statusCase = (start, end) => {
    const currentDate = new Date();
    start = new Date(start);
    end = new Date(end);

    if (start > currentDate) {
      return { status: "Pending", color: "bg-warning" };
    } else if (start <= currentDate && end >= currentDate) {
      return { status: "Started", color: "bg-success" };
    } else {
      return { status: "Ended", color: "bg-danger" };
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
  //  Delet ----------------------------
  const batch = writeBatch(database);
  const DeleteField = (arr) => {
    swal({
      title: "Are you sure You want Delete this Event?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal({
          icon: "success",
        });

        Promise.all(
          arr.map(async (docID) => {
            const ref = doc(EventRefrence, docID);
            const info = await getDoc(ref);
            await setDoc(doc(EventsDeletedRef, docID), {
              ID: docID,
              timing: serverTimestamp(),
              ...info.data(),
            }).then(() => batch.delete(doc(EventRefrence, docID)));
            const notifyQuery = query(
              collection(database, "notifications"),
              where("NewEventID", "==", docID)
            );
            await getDocs(notifyQuery).then(async (snapshot) => {
              snapshot.docs.map(async (item) => {
                batch.delete(doc(database, "notifications", item.id));
                // await deleteDoc(doc(database, "notifications", item.id));
              });
            });
          })
        ).then(() => {
          console.log("hello after all");

          // Commit the batch
          batch
            .commit()
            .then(() => {
              console.log("Batch deletion successful");

              setSelected([]);
            })
            .catch((error) => {
              console.log("Error deleting documents in batch:", error);
              swal({
                title: "somthing wrong happend while deleting",
                icon: "warning",
              });
            });
        });
      }
    });
  };
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
            <Typography 
              sx={{ flex: "1 1 100%" }}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
            <Tooltip title="Delete">
              <IconButton onClick={() => DeleteField(selected)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Typography
            sx={{ flex: "0 1 100%" }}
            variant="h2"
            id="tableTitle"
            component="div"
          >
            {/* //// */}
            <SearchFormik rows={row} setRows={setRows} />
          </Typography>
        )}
      </Toolbar>
    );
  }
  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };
  console.log(rows, "rows");
  // body ----------------
  return (
    <Paper sx={{ width: "100%", mb: 0 }} className="BasicTableParent">
      <div className=" d-flex align-items-center gap-2 p-3 d-flex justify-content-end ">
        <span className="d-flex gap-2 align-items-center">
          <span className="fs-6 exportExcel">
            <ExportDropDown rows={rows} />
          </span>
          <span className="fs-6 exportExcel">
            <TOVsDropDownReport />
          </span>
        </span>
        <SearchText list={rows} setRows={setRows} row={row} />
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>

                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                    onClick={() =>
                      navigate(`/app/subscribers/${rowItem.Id}/${rowItem.ID}`)
                    }
                  >
                    {rowItem.Id}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      navigate(`/app/subscribers/${rowItem.Id}/${rowItem.ID}`)
                    }
                    align="left"
                  >
                    {rowItem.eventName}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      navigate(`/app/subscribers/${rowItem.Id}/${rowItem.ID}`)
                    }
                    align="left"
                  >
                    {rowItem.CostperDelegate}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      navigate(`/app/subscribers/${rowItem.Id}/${rowItem.ID}`)
                    }
                    align="left"
                    className="p-0"
                  >
                    {rowItem.TransferOfValue?.map((item, index) => (
                      <p className=" m-1 p-1 text-center" key={index}>
                        {item.types} : {item.value}
                      </p>
                    ))}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      navigate(`/app/subscribers/${rowItem.Id}/${rowItem.ID}`)
                    }
                    align="left"
                  >
                    {rowItem.EventCost}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      navigate(`/app/subscribers/${rowItem.Id}/${rowItem.ID}`)
                    }
                    align="left"
                  >
                    {rowItem.eventDate}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      navigate(`/app/subscribers/${rowItem.Id}/${rowItem.ID}`)
                    }
                    align="left"
                  >
                    {rowItem.endDate}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      navigate(`/app/subscribers/${rowItem.Id}/${rowItem.ID}`)
                    }
                    align="left"
                  >
                    {rowItem.CreatedAt}
                  </TableCell>
                  <TableCell
                    onClick={() =>
                      navigate(`/app/subscribers/${rowItem.Id}/${rowItem.ID}`)
                    }
                    align="left"
                  >
                    <span
                      className={`${
                        statusCase(rowItem.eventDate, rowItem.endDate).color
                      } text-white p-2 rounded `}
                    >
                      {statusCase(rowItem.eventDate, rowItem.endDate).status}
                    </span>
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
