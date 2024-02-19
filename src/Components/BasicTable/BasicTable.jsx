import {useState,useEffect} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import "./Table.css";
import { SelectComponent } from "../SelectComponent/SelectComponent";
export default function BasicTable({ row ,setDays,setMonths,setWeeks}) {
  const [rows,setRows] =useState([])
  const [date, setdate] = useState('This Day')
  const areDatesInSameWeek = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
    return diffDays <= 6 && date1.getDay() >= date2.getDay();
  };
  useEffect(()=>{
    const dates = new Date()
    const date1 = new Date(dates.toLocaleString()); // replace with your first date
    setRows(row)
    setDays((row.filter(({CreatedAt})=>new Date(new Date(CreatedAt).toLocaleDateString()).getTime()===new Date(dates.toLocaleDateString()).getTime() )).length)
    setMonths((row.filter(({CreatedAt})=>new Date(CreatedAt).getMonth()===dates.getMonth())).length)
    setWeeks((row.filter(({CreatedAt})=>areDatesInSameWeek(date1, new Date(new Date(CreatedAt).toLocaleDateString()))).length))
  },[row])
  useEffect(()=>{
    const dates = new Date()
switch(date){
  case'This Day' :
  const days =  row.filter(({CreatedAt})=>new Date(new Date(CreatedAt).toLocaleDateString()).getTime()===new Date(dates.toLocaleDateString()).getTime() )
  setRows(days)
  break;
  case'This Month':
  const Months = row.filter(({CreatedAt})=>new Date(CreatedAt).getMonth()===dates.getMonth())
  setRows(Months)
break;
case'This Week':
const date1 = new Date(dates.toLocaleString()); // replace with your first date
const weeks = row.filter(({CreatedAt})=>areDatesInSameWeek(date1, new Date(new Date(CreatedAt).toLocaleDateString()))
)
setRows(weeks)
break;
  default:

}

  },[date])
  return (
    <TableContainer
      component={Paper}
      className="BasicTableParent basicTableHeight"
    >
      <Toolbar className="text-end  d-flex justify-content-end w-100">
        <SelectComponent date={date} setdate={setdate} />
      </Toolbar>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Event Name</TableCell>
            <TableCell>Franchise</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>End Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, indx) => (
            <TableRow
              key={`${row.EventName}-${indx}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{row.Id}</TableCell>
              <TableCell>{row.EventName}</TableCell>

              <TableCell>{row.Franchise}</TableCell>
              <TableCell>{row.CreatedAt}</TableCell>
              <TableCell>{row.EndDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
