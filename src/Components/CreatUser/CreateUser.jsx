import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import swal from "sweetalert";
import { RoleDropDown } from "../RoleDropDown/RoleDropDown";
// import admin from "firebase-admin";
export const CreateUser = () => {
  const { app, database } = useContext(FireBaseContext);
  const [error, setError] = useState(false);
  const auth = getAuth(app);
  const [user, SetUser] = useState("");
  const [data, SetData] = useState({});
  const NewSubScriberInputs = [
    {
      label: "Name",
      type: "text",
      name: "Name",
    },
    {
      label: "Email",
      type: "text",
      name: "Email",
    },
    {
      label: "Password",
      type: "password",
      name: "Password",
    },
    {
      label: "Phone Number",
      type: "number",
      name: "PhoneNumber",
    },
  ];

  const initialvalues = {
    Name: "",
    Email: "",
    Password: "",
    PhoneNumber: "",
    Role: "",
  };
  const validation = Yup.object().shape({
    Name: Yup.string().min(3, "too short").required("Required"),
    Email: Yup.string().email("Enter Valid Email").required("Required"),
    Password: Yup.string()
      .min(5, "password should be More Than 5 ")
      .required("Required"),
    PhoneNumber: Yup.number()
      .typeError("enter Valid phone Number")
      .required("Required"),
    Role: Yup.string().required("Required"),
  });
  const UsersRef = collection(database, "Users");
  const onsubmit = async (values, props) => {
    await createUserWithEmailAndPassword(auth, values.Email, values.Password)
      .then((res) => {
        SetUser(res.user);
        const passwordDATA = res.user.reloadUserInfo.passwordHash;
        SetData({ ...values, Password: passwordDATA });
        auth.setCustomUserClaims(res.user.uid, { admin: true });
        setError(false);
        swal({
          icon: "success",
          text: `${values.Email} Has been added succesfully`,
        });
      })
      .catch((error) => setError(true));
  };
  useEffect(() => {
    if (user) {
      (async () => await setDoc(doc(UsersRef, user.uid), data))();
    }
  }, [user]);
  const showErrors = () => {
    if (error) {
      return (
        <small className="text-danger">This Email already Registerd</small>
      );
    }
  };
  return (
    <div>
      <Formik
        initialValues={initialvalues}
        validationSchema={validation}
        onSubmit={onsubmit}
      >
        {(props) => (
          <>
            <Form className="d-flex p-3 bg-white rounded shadow flex-column  gap-2 justify-content-between align-item-center NewSubScriberForm">
              <div className="w-100  d-flex flex-wrap ">
                {NewSubScriberInputs.map((item, index) => (
                  <div
                    className="w-50  flex-column align-items-center    d-flex justify-content-center"
                    key={`${item.label}-${index}`}
                  >
                    <div className="text-danger ps-5 align-self-start">
                      <ErrorMessage name={item.name} />
                      {item.name == "Email" && showErrors()}
                    </div>
                    <Field
                      as={TextField}
                      label={item.label}
                      id={index}
                      sx={{ m: 1, width: "25ch" }}
                      focused
                      type={item.type}
                      className="w-75 "
                      name={item.name}
                    />
                  </div>
                ))}
                <div className=" d-flex w-50 flex-column justify-content-center align-items-center border-0 ">
                  <div className="d-flex align-items-center gap-2  w-75  justify-content-between ">
                    <small>Choose Role</small>
                    <ErrorMessage name={"Role"} className="align-self-start" />
                  </div>
                  <RoleDropDown />
                </div>
                <div className="w-50   d-flex justify-content-center">
                  <button
                    type="submit"
                    className="w-75 p-1 m-2 rounded rounded-2 border-0 border text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};
