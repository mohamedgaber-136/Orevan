import React, { useContext, useState } from 'react';
import { FireBaseContext } from '../../Context/FireBase';
import {  updatePassword ,reauthenticateWithCredential ,EmailAuthProvider } from "firebase/auth"
import swal from "sweetalert";

const PasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [CurrentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { user} = useContext(FireBaseContext); 
const credentials = user.providerData;
// console.log(credentials)
const handleChangePassword = async () => {
  if(confirmPassword!==newPassword){
    setError('Password Not Matcing')
    return;
  }
    const cred = EmailAuthProvider.credential(user.email, CurrentPassword);
    console.log(cred)
   await reauthenticateWithCredential(user,cred);
//   // Update the password
  try {
    await updatePassword(user, newPassword);
    swal({
      icon: "success",
      title: `Password Changed`,
    }).then(()=>{
      setConfirmPassword('')
      setCurrentPassword('')
      setNewPassword('')
    })
  } catch (error) {
    console.error('Error updating password:', error.message);
  }
};

  return (
    <div className=' d-flex flex-column align-items-start gap-2'>
      <h2>Change Password</h2>   
      <div className='d-flex justify-content-between  w-100'>
        <label>Current Password:</label>
        <input
          type="password"
          value={CurrentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className='d-flex justify-content-between  w-100'>
        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className='d-flex justify-content-between w-100'>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button className='border-0 bg-primary text-white rounded align-self-end' onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default PasswordForm;
