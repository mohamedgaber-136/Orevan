import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FireBaseContext } from "../../../Context/FireBase";
import { useState, useEffect, useContext } from "react";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { deleteDoc, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function EventsDeletedTable() {
  const {
    EventsDeletedRef,
    getData,
    EventRefrence,
    saveNotificationToFirebase,
  } = useContext(FireBaseContext);
  const [rows, seteventData] = useState([]);
  useEffect(() => {
    getData(EventsDeletedRef, seteventData);
  }, []);
  const returnData = async (id) => {
    const ref = doc(EventsDeletedRef, id);
    const item = await getDoc(ref);
    const keyToDelete = "timing";
    const keyToDeleteTwo = "ID";
    const data = item.data();
    if (data && data.hasOwnProperty(keyToDelete)) {
      // Remove the key from the copy
      delete data[keyToDelete];
      delete data[keyToDeleteTwo];
      await setDoc(doc(EventRefrence, id), data);
      saveNotificationToFirebase(id);
      await deleteDoc(ref);
    } else {
      console.log(`Key '${keyToDelete}' does not exist in the document.`);
    }
  };

  const DeleteForever = async (id) => {
    const ref = doc(EventsDeletedRef, id);
    await deleteDoc(ref);
  };
  if (rows.length == 0) {
    return (
      <div className=" d-flex justify-content-center align-items-center">
        <div className="w-25 rounded-3 py-5  shadow bg-white  d-flex justify-content-center align-items-center ">
          <h2>Empty</h2>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="right">EventName</TableCell>
                <TableCell align="right">Franchise</TableCell>
                <TableCell align="right">CreatedAt</TableCell>
                <TableCell align="right">EndDate</TableCell>
                <TableCell align="right">DeletedTiming</TableCell>
                <TableCell align="right">Restore</TableCell>
                <TableCell align="right">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.Id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left">{row.Id}</TableCell>
                  <TableCell align="right">{row.EventName}</TableCell>
                  <TableCell align="right">{row.Franchise}</TableCell>
                  <TableCell align="right">{row.CreatedAt}</TableCell>
                  <TableCell align="right">{row.EndDate}</TableCell>
                  <TableCell align="right">
                    {row.timing.toDate().toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <KeyboardReturnIcon
                      onClick={() => returnData(row.ID)}
                      className="bg-success text-white rounded-2"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <DeleteForeverIcon
                      className="text-danger"
                      onClick={() => DeleteForever(row.ID)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
