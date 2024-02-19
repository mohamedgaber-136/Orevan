import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { FireBaseContext } from '../../../Context/FireBase';
import {useState,useEffect,useContext} from 'react';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { deleteDoc, doc,setDoc ,getDoc,serverTimestamp, collection } from 'firebase/firestore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

export default function SubscriberDeletedTable() {
    const {SubscribersDeletedRef,getData,SubscribersRefrence,EventRefrence} = useContext(FireBaseContext)
    const [rows,setSubData]=useState([])
   useEffect(()=>{
   getData(SubscribersDeletedRef,setSubData)
 },[])
 const returnData = async (id,event)=>{
  const ref = doc(SubscribersDeletedRef,id)
  const item = await getDoc(ref)
  const eventRef =doc(EventRefrence,event)
  const subCollection = collection(eventRef,'Subscribers')
  await setDoc(doc(subCollection,id),{ID:id,...item.data()}) 
  await deleteDoc(ref)    
  } 
  const DeleteForever = async (id)=>{
    const ref = doc(SubscribersDeletedRef,id)
    await deleteDoc(ref)
  }
if(rows.length==0){
  return (
    <div className=' d-flex justify-content-center align-items-center'>
    <div className='w-25 rounded-3 py-5  shadow bg-white  d-flex justify-content-center align-items-center '>
    <h2>Empty</h2>
    </div>
      </div>
  )
}else{
  return (
    <div className="container ">

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="right">NationalID</TableCell>
            <TableCell align="right">Organization</TableCell>
            <TableCell align="right">PhoneNumber</TableCell>
            <TableCell align="right">Speciality</TableCell>
            <TableCell align="right">City</TableCell>
            <TableCell align="right">Signature</TableCell>
            <TableCell align="right">DeletedTiming</TableCell>
            <TableCell align="right">Restore</TableCell>
            <TableCell align="right">Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={`${row.id}-${row.Name}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
           <TableCell align='left'>
                {row.id}
              </TableCell>
              <TableCell align="right">{row.Name}</TableCell>
              <TableCell align="right">{row.NationalID}</TableCell>
              <TableCell align="right">{row.Organization}</TableCell>
              <TableCell align="right">{row.PhoneNumber}</TableCell>
              <TableCell align="right">{row.Speciality}</TableCell>
              <TableCell align="right">{row.City}</TableCell>
              <TableCell align="right subRowImg">{row.image?<img src={row.image} width='100%' />:'No Signature'}</TableCell>
              <TableCell align="right">{row.timing.toDate().toLocaleString()}</TableCell>
              <TableCell align="right"><KeyboardReturnIcon onClick={()=>returnData(row.ID,row.event)} className='bg-success text-white rounded-2'/></TableCell>
              <TableCell align="right"><DeleteForeverIcon className='text-danger' onClick={()=>DeleteForever(row.ID)}/> </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}
  
}