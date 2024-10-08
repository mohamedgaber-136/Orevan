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
import TOVsDropDownReport from "../TOVsDropDownReport/TOVsDropDownReport";
import { TextField } from "@mui/material";
export default function DataTable({ row }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState(""); // Search query state

  const { EventRefrence, EventsDeletedRef, database } =
    React.useContext(FireBaseContext);
  const navigate = useNavigate();
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
      numeric: false,
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
      label: "End Date ",
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
      <TableHead >
        <TableRow >
          <TableCell padding="checkbox" style={{
                backgroundColor:'lightGray',

              }}>
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
          {headCells.map((headCell,index) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "center" : "left"}
              padding={headCell.disablePadding ? "none" : "none"}
              sortDirection={orderBy === headCell.id ? order : false}
               style={{
              backgroundColor: 'lightGray',
            }}
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
  const parseDate = (dateString) => {
    const [month, day, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
  };
  
  const statusCase = (start, end) => {
    const currentDate = new Date();
  
    // Parse the start and end dates
    start = parseDate(start);
    end = parseDate(end);
  
 
    // Compare dates and return status accordingly
    if (currentDate < start) {
      return { status: "Pending", color: "bg-warning" };
    } else if (currentDate >= start && currentDate <= end) {
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




    const filteredRows = React.useMemo(() => {
      return rows.filter((row) => {
        const checkValue = (value) => {
          if (value === undefined || value === null) {
            return false; // Skip undefined or null values
          }
          if (typeof value === "object") {
            return Object.values(value).some(checkValue);
          }
          return value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        };
        return Object.values(row).some(checkValue);
      });
    }, [rows, searchQuery]);



    const visibleRows = React.useMemo(
      () =>
        stableSort(filteredRows, getComparator(order, orderBy)).slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        ),
      [order, orderBy, page, rowsPerPage, filteredRows]
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
              });
            });
          })
        ).then(() => {

          // Commit the batch
          batch
            .commit()
            .then(() => {

              setSelected([]);
            })
            .catch((error) => {
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
          marginBottom:'25px !important',
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
          </Typography>
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
        <span className="d-flex gap-2 align-items-center">
          <span className="fs-6 exportExcel">
            <ExportDropDown rows={rows} />
          </span>
          <span className="fs-6 exportExcel">
            <TOVsDropDownReport />
          </span>
        </span>
        <div className="p-3 d-flex justify-content-between">
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          className='border-2 border  rounded-3'

          onChange={(e) => setSearchQuery(e.target.value)}
          
        />
      </div>      </div>
      {
        selected.length?<EnhancedTableToolbar numSelected={selected.length} />:''
      }
      
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
            {
              visibleRows.length? visibleRows.map((rowItem, indexItem) => {
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
                      <div className=" TovParent">
                        {rowItem.TransferOfValue?.map((item, index) => (
                          <p className=" m-1 p-1 text-center " key={index}>
                            {item.types} : {item.value}
                          </p>
                        ))}
                      </div>
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
              }):
              <TableRow>
              <TableCell colSpan={9} align="center">
               ......
              </TableCell>
            </TableRow>
            }
           
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
