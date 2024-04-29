import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import swal from "sweetalert";
import { RoleDropDown } from "../RoleDropDown/RoleDropDown";
import { AdminAuth } from "../../Config/FirebaseAdminApp";
import { useNavigate } from "react-router-dom";
export const CreateUser = () => {
  const navigation = useNavigate();
  const { database } = useContext(FireBaseContext);
  const [error, setError] = useState(false);
  const [user, SetUser] = useState("");
  const [data, SetData] = useState(null);
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
    Role: "Brand Manager",
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

  // test on create user
  const onsubmit = async (values, props) => {
    await createUserWithEmailAndPassword(
      AdminAuth,
      values.Email,
      values.Password
    )
      .then((res) => {
        SetUser(res.user);
        const passwordDATA = res.user.reloadUserInfo.passwordHash;
        SetData({
          ...values,
          Password: passwordDATA,
          Role: {
            admin: values.Role.includes("Brand"),
            manager: values.Role.includes("Franchise Manager"),
            user: values.Role.includes("User"),
            franchiseType: values.Role.includes("Franchise Manager")
              ? values.Role.split("-")[1]
              : null,
          },
          Condition:{
            Blocked:false
          }
        });
        setError(false);
        swal({
          icon: "success",
          text: `${values.Email} Has been added succesfully`,
        }).then(() => navigation("/app/AllUsers"));
      })
      .catch((error) => setError(true));
  };

  useEffect(() => {
    if (user) {
      (async () => {await setDoc(doc(UsersRef, user.uid), {...data,ID:user.uid})
    }    
      )();
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
    <div className="border d-flex justify-content-center bg-white">
      <Formik
        initialValues={initialvalues}
        validationSchema={validation}
        onSubmit={onsubmit}
      >
        {(props) => (
          <>
            <Form className="d-flex py-3 px-2 bg-white  w-75 rounded  flex-column  gap-2 justify-content-between align-item-center NewSubScriberForm">
              <div className="w-100 row gap-4  justify-content-center  p-2">
                {NewSubScriberInputs.map((item, index) => (
                  <div
                    className="col-12 col-md-5 ErrorParent flex-fill "
                    key={`${item.label}-${index}`}
                  >
                    <div className="text-danger ps-5 align-self-start Error">
                      <ErrorMessage name={item.name}  />
                      {item.name === "Email" && showErrors()}
                    </div>
                    <Field
                      as={TextField}
                      label={item.label}
                      id={index}
                      focused
                      type={item.type}
                      className="w-100 "
                      name={item.name}
                    />
                  </div>
                ))}
                <div className=" d-flex col-10 flex-fill flex-column justify-content-center align-items-center border-0 ">
                  <div className="d-flex align-items-center gap-2  w-75  justify-content-between ">
                    <ErrorMessage name={"Role"} className="align-self-start" />
                  </div>
                  <RoleDropDown />
                </div>
                <div className="w-50   d-flex justify-content-center">
                  <button
                    type="submit"
                    className="w-75 p-1  rounded rounded-2 border-0 border text-white"
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
