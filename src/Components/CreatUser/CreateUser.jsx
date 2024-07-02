import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import swal from "sweetalert";
import { RoleDropDown } from "../RoleDropDown/RoleDropDown";
import { AdminAuth } from "../../Config/FirebaseAdminApp";
import { useNavigate } from "react-router-dom";
import { FranchiseType } from "../FranchiseType/FranchiseType";
import emailjs from "@emailjs/browser";

export const CreateUser = () => {
  const navigation = useNavigate();
  const { database, UsersData, TeamsRefrence } = useContext(FireBaseContext);
  const [error, setError] = useState(false);
  const [roleType, setRoleType] = useState("Admin");
  const [user, setUser] = useState("");
  const [data, setData] = useState(null);

  const NewSubScriberInputs = [
    { label: "Name", type: "text", name: "Name" },
    { label: "Email", type: "text", name: "Email" },
    { label: "Password", type: "password", name: "Password" },
  ];

  const initialvalues = {
    Name: "",
    Email: "",
    Password: "",
    Role: "Admin",
    franchiseType: "",
  };

  const validation = Yup.object().shape({
    Name: Yup.string().min(3, "too short").required("Required"),
    Email: Yup.string().email("Enter Valid Email").required("Required"),
    Password: Yup.string()
      .min(5, "password should be More Than 5 ")
      .required("Required"),
    Role: Yup.string().required("Required"),
  });

  const UsersRef = collection(database, "Users");

  const sendEmail = (values) => {
    emailjs.send(
      'service_mzn99q7',
      'template_4owcf7m',
      {
        to_email: values.Email,
        to_name: values.Name,
        message: `\nEmail: ${values.Email}\nPassword: ${values.Password}`
      },
      '6z5D34K7serfxYLXR'
    )
    .then((response) => {
      console.log('Email sent successfully!', response.status, response.text);
    }, (error) => {
      console.error('Failed to send email.', error);
    });
    emailjs
      .send(
        "service_zsp243h",
        "template_4owcf7m",
        {
          to_email: values.Email,
          to_name: values.Name,
          message: `\nEmail: ${values.Email}\nPassword: ${values.Password}`,
        },
        "6z5D34K7serfxYLXR"
      )
      .then(
        (response) => {
          console.log(
            "Email sent successfully!",
            response.status,
            response.text
          );
        },
        (error) => {
          console.error("Failed to send email.", error);
        }
      );
>>>>>>> b9280361aad7b9426146c89d15b3fee45e5ec005
  };

  const onsubmit = async (values, props) => {
    console.log(values, "values");
    try {
      const res = await createUserWithEmailAndPassword(
        AdminAuth,
        values.Email,
        values.Password
      );
      setUser(res.user);
      const passwordDATA = res.user.reloadUserInfo.passwordHash;
      setData({
        ...values,
        Password: passwordDATA,
        Role: {
          admin: values.Role.includes("Admin"),
          manager: values.Role.includes("Franchise Manager"),
          user: values.Role.includes("Associate"),
          franchiseType: values.franchiseType,
        },
        Condition: {
          Blocked: false,
        },
      });
      sendEmail(values);
      setError(false);
      swal({
        icon: "success",
        text: `${values.Email} Has been added successfully`,
      }).then(() => navigation("/app/AllUsers"));
    } catch (error) {
      setError(true);
      console.error("Error creating user:", error);
      swal({
        icon: "error",
        text: `Error creating user: ${error.message}`,
      });
    }
  };

  useEffect(() => {
    if (user) {
      (async () => {
        try {
          await setDoc(doc(UsersRef, user.uid), { ...data, ID: user.uid });
        } catch (error) {
          console.error("Error saving user data to Firestore:", error);
        }
      })();
    }
  }, [user]);

  const showErrors = () => {
    if (error) {
      return (
        <small className="text-danger">This Email is already registered</small>
      );
    }
  };

  async function getFranchiseIds() {
    try {
      const data = await getDocs(TeamsRefrence);
      return data.docs.map(({ id }) => id);
    } catch (error) {
      console.error("Error fetching franchise IDs:", error);
      return [];
    }
  }

  const addUsersDataToFirebase = async () => {
    if (UsersData.length) {
      try {
        const result = await getFranchiseIds();
        console.log(result, "teams");
        for (const userItem of UsersData) {
          console.log(userItem, "item");
          const rolesList = ["Admin", "Franchise Manager", "Associate"];
          let isValidUser = false;

          console.log(
            "check if any value not exist:",
            Object.values(userItem).some((val) => !val)
          );
          if (userItem.Role == "Admin") {
            delete user.franchiseType;
          } else if (userItem.Role == "Franchise Manager") {
            isValidUser = result.includes(userItem.franchiseType);
          }
          if (
            Object.values(userItem).some((val) => !val) ||
            !rolesList.includes(userItem.Role)
          ) {
            isValidUser = false;
          } else {
            isValidUser = true;
            console.log("Success in data validation for item:", userItem);
            await onsubmit(userItem);
          }
          console.log(isValidUser, "check");

          if (!isValidUser) {
            console.log("Error in data validation for item:", userItem);
          }
        }
      } catch (error) {
        console.error("Error adding user data to Firebase:", error);
      }
    }
  };

  useEffect(() => {
    if (UsersData.length) {
      addUsersDataToFirebase();
    }
  }, [UsersData]);

  return (
    <div className="border d-flex justify-content-center bg-white p-3">
      <Formik
        initialValues={initialvalues}
        validationSchema={validation}
        onSubmit={onsubmit}
      >
        {(props) => (
          <Form className="d-flex py-3 px-2 bg-white w-75 rounded flex-column gap-2 justify-content-between align-item-center NewSubScriberForm">
            <div className="w-100 row gap-4 justify-content-center p-2">
              {NewSubScriberInputs.map((item, index) => (
                <div
                  className="col-12 col-md-5 d-flex flex-column align-items-center justify-content-center ErrorParent flex-fill"
                  key={`${item.label}-${index}`}
                >
                  <Field
                    as={TextField}
                    label={item.label}
                    id={index}
                    focused
                    type={item.type}
                    className="w-100"
                    name={item.name}
                  />
                  <div className="text-danger ps-5 align-self-start Error">
                    <ErrorMessage name={item.name} />
                    {item.name === "Email" && showErrors()}
                  </div>
                </div>
              ))}
              <div className="d-flex col-12 col-md-5 flex-fill flex-column justify-content-center align-items-center">
                <div className="d-flex align-items-center gap-2 w-75 justify-content-between">
                  <ErrorMessage name={"Role"} className="align-self-start" />
                </div>
                <RoleDropDown setRoleType={setRoleType} />
              </div>
              <div
                className={`${
                  roleType === "Admin" ? "d-none" : "d-flex"
                } col-12 col-md-5 flex-fill flex-column justify-content-center align-items-center`}
              >
                <div className="d-flex align-items-center gap-2 w-100 justify-content-between">
                  <ErrorMessage
                    name={"franchiseType"}
                    className="align-self-start"
                  />
                </div>
                <FranchiseType />
              </div>
              <div className="w-100 d-flex justify-content-center">
                <button
                  type="submit"
                  className="w-75 p-1 rounded rounded-2 border-0 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
