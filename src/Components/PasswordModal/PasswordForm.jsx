import React, { useContext, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import swal from "sweetalert";

const PasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [CurrentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(FireBaseContext);

  const checkpassword = () => {
    return newPassword === '' || CurrentPassword === '' || confirmPassword === '';
  };

  const handleChangePassword = async () => {
    if (confirmPassword !== newPassword) {
      setError("Passwords do not match");
      return;
    }

    const cred = EmailAuthProvider.credential(user.email, CurrentPassword);

    try {
      // Reauthenticate the user
      await reauthenticateWithCredential(user, cred);

      // Update the password
      await updatePassword(user, newPassword);

      swal({
        icon: "success",
        title: "Password Changed Successfully",
      }).then(() => {
        setConfirmPassword("");
        setCurrentPassword("");
        setNewPassword("");
        setError(""); // Clear error on success
      });
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setError("Current password is incorrect");
      } else {
        console.error("Error updating password:", error.message);
        setError("Error updating password. Please try again.");
      }
    }
  };

  return (
    <div>
      <h5 className="text-center m-0 mb-4">Change Password</h5>
      <div className="row flex-column gap-2 align-items-center justify-content-center flex-wrap">
        <div className="row justify-content-between flex-wrap">
          <div className="col-5">
            <label>Current Password:</label>
          </div>
          <div className="col-5 flex-fill">
            <input
              type="password"
              value={CurrentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border border-2 rounded"
            />
          </div>
        </div>
        <div className="row justify-content-between flex-wrap">
          <div className="col-5">
            <label>New Password:</label>
          </div>
          <div className="col-5 flex-fill">
            <input
              type="password"
              value={newPassword}              className="border border-2 rounded"

              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="row justify-content-between flex-wrap">
          <div className="col-5">
            <label>Confirm Password:</label>
          </div>
          <div className="col-5 flex-fill">
            <input
                          className="border border-2 rounded"

              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="w-100 d-flex justify-content-center align-items-center my-2 gap-2">
        <span className={`text-danger ${checkpassword() ? 'd-block' : 'd-none'}`}>Please fill in all fields</span>

        <button
          className="border-0 bg-primary text-white rounded align-self-end"
          disabled={checkpassword()}
          onClick={handleChangePassword}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default PasswordForm;
