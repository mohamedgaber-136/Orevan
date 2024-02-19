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
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import Checkbox from "@mui/material/Checkbox";
import swal from "sweetalert";
import { SearchContext } from "../../Context/SearchContext";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { FireBaseContext } from "../../Context/FireBase";
import Typography from "@mui/material/Typography";
import UpdateSubModel from '../UpdateSubModel/UpdateSubModel'
import {
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import UploadBtn from "../UploadBtn/UploadBtn";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Modal from "../Modal/Modal";
import ImportExcel from "../ImportExcel/ImportExcel";
import ChangeEventModal from "../ChangeEventModal/ChangeEventModal";
import ExportToExcelButton from "../ExportBtn/ExportToExcelButton";
import SettingsBtn from "../SettingsBtn/SettingsBtn";
import SearchText from "../SearchText/SearchText";
export default function SubScribersTable({ rows, refCollection }) {
  const {
    setUpdateUser,
    database,
    SubscribersRefrence,
    setTriggerNum,
    triggerNum,
    SubscribersDeletedRef,
  } = React.useContext(FireBaseContext);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const { dbID } = useParams();
  const navigate = useNavigate();
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const { setShowAddNeWSub, setShowUpdate } = React.useContext(SearchContext);
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
  const removeSubscriber = async (id) => {
    const ref = doc(refCollection, id);
    const item = await getDoc(ref);
    swal({
      title: "Are you sure You want Delete this subscriber?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        swal({
          icon: "success",
        });
        await deleteDoc(ref);
        await setDoc(doc(SubscribersDeletedRef, id), {
          event: dbID,
          ID: id,
          timing: serverTimestamp(),
          ...item.data(),
        });
      }
    });
  };
// Settings Options 
  // HeadTitles
  const headCells = [
    {
      id: "id",
      numeric: false,
      disablePadding: true,
      label: "ID",
    },
    {
      id: "Name",
      numeric: true,
      disablePadding: false,
      label: "Name",
    },
    {
      id: "Email",
      numeric: true,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "PhoneNumber",
      numeric: true,
      disablePadding: false,
      label: "Phone Number",
    },
    {
      id: "Organization",
      numeric: true,
      disablePadding: false,
      label: "Organization",
    },
    {
      id: "Speciality",
      numeric: true,
      disablePadding: false,
      label: "Speciality",
    },
    {
      id: "NationalID",
      numeric: true,
      disablePadding: false,
      label: "National ID",
    },
    {
      id: "City",
      numeric: true,
      disablePadding: false,
      label: "City",
    },
    {
      id: "Signature",
      numeric: true,
      disablePadding: false,
      label: "Signature",
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
        <TableRow>
        <TableCell align="right"></TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "normal" : "normal"}
              sortDirection={orderBy === headCell.d ? order : false}
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
  console.log(selected,'selected')
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
          sx={{ flex: "1 1 100%" }}
          color="blue"
          variant="subtitle1"
          component="div"
        >
          {selected.length} selected
        </Typography>
    )}
        {numSelected > 0 &&
        <Tooltip title="AddNew">
           <IconButton>
            <ChangeEventModal newSelected={selected} setSelected={setSelected}/>
          </IconButton>
        </Tooltip>
        }
        <div className='d-flex gap-2 align-items-center
'>
   <ExportToExcelButton
              filename="exported_data"
              sheetname="Sheet 1"
              data={rows}
            />
{" "}
<ImportExcel />
{/* <SearchText list={rows}/> */}
</div>
  <Tooltip title="AddNew">
  <IconButton>
    <Modal />
  </IconButton>
</Tooltip>

        </Toolbar>
 
    );
  }
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

  const updateSup = (row) => {
    setShowUpdate(true);
    setUpdateUser(row);
  };
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
    <Box sx={{ width: "100%"}}>
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
                  const isItemSelected = isSelected(row.ID);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.ID}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(event) => handleClick(event, row.ID)}
                      >
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
                        padding="normal"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.Name}</TableCell>
                      <TableCell align="center">{row.Email}</TableCell>
                      <TableCell align="right">{row.PhoneNumber}</TableCell>
                      <TableCell align="right">{row.Organization}</TableCell>
                      <TableCell align="right">{row.Speciality}</TableCell>
                      <TableCell align="right">{row.NationalID}</TableCell>
                      <TableCell align="right">{row.City}</TableCell>
                      <TableCell
                        align="right"
                        className="subRowImg d-flex ps-4 pe-0 gap-1 align-items-center"
                      >
                        <UploadBtn id={row.ID} info={row.image && "d-none"} />
                        {row.image && (
                          <img src={row.image} alt="signature" width={"100%"} />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <SettingsBtn row={row} rowId={row.ID} refCollection={refCollection}/>
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
