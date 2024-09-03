import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useContext, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import { collection, doc, setDoc } from "firebase/firestore";
import swal from "sweetalert";
import { RoleDropDown } from "../RoleDropDown/RoleDropDown";
import { AdminAuth } from "../../Config/FirebaseAdminApp";
import { useNavigate } from "react-router-dom";
import { FranchiseType } from "../FranchiseType/FranchiseType";
import emailjs from "@emailjs/browser";

export const CreateUser = () => {
  const navigate = useNavigate();
  const { database, UsersData, UserRef } = useContext(FireBaseContext);
  const [error, setError] = useState(false);
  const [roleType, setRoleType] = useState("Admin");

  const NewSubScriberInputs = [
    { label: "Name", type: "text", name: "Name" },
    { label: "Email", type: "text", name: "Email" },
    { label: "Password", type: "password", name: "Password" },
  ];

  const initialvalues = {
    Name: "",
    Email: "",
    Password: "",
    Role: "admin",
    franchiseType: "",
  };

  const validation = Yup.object().shape({
    Name: Yup.string().min(3, "Too short").required("Required"),
    Email: Yup.string().email("Enter Valid Email").required("Required"),
    Password: Yup.string()
      .min(5, "Password should be more than 5 characters")
      .required("Required"),
    Role: Yup.string().required("Required"),
   
  });

  const UsersRef = collection(database, "Users");

  const sendEmail = (values) => {
    const emailParams = {
      from_name: 'Orevan Group',
      from_email: 'Events@orevan-prox.com',
      to_email: values.Email,
      to_name: values.Name,
      message: `\nEmail: ${values.Email}\nPassword: ${values.Password}`,
    };

    emailjs.send('service_mzn99q7', 'template_4owcf7m', emailParams, '6z5D34K7serfxYLXR')
      .then((response) => {
        console.log("Email sent successfully");
      }, (error) => {
        console.error("Failed to send email:", error);
      });
  };

  const validEmails = [];
  const invalidEmails = [];
  const onsubmit = async (values, props) => {
    try {
      const res = await createUserWithEmailAndPassword(
        AdminAuth,
        values.Email,
        values.Password
      );
console.log(values,'ssssssssss')
      const passwordDATA = res.user.reloadUserInfo.passwordHash;
      const userData = {
        ...values,
        Password: passwordDATA,
        Role: {
          admin: values.Role === 'admin',
          franchiseType: values.franchiseType,
          manager: values.Role === 'manager',
          user: values.Role === 'user',
        },
        Condition: {
          Blocked: values.Blocked ? values.Blocked !== 'Blocked' : false,
        },
      };

      // Update the Firestore collection
      await setDoc(doc(UserRef, res.user.uid), userData);
      sendEmail(values);
      setError(false);
      validEmails.push(values.Email);

      swal({
        icon: "success",
        text: `${values.Email} has been added successfully`,
      });
    } catch (error) {
      setError(true);
      console.error("Error creating user:", error);
      invalidEmails.push(values.Email);
    }

    const message = `
      Valid Emails: ${validEmails.length ? validEmails.join(", ") : 'empty'}
      Invalid Emails: ${invalidEmails.length ? invalidEmails.join(", ") : 'empty'}
      Total Emails: ${validEmails.length + invalidEmails.length}
      Valid (No): ${validEmails.length}
      Invalid (No): ${invalidEmails.length}
    `;

    swal({
      icon: "info",
      title: "Processing Results",
      text: message,
      button: "OK",
    }).then(() => {
      navigate("/app/AllUsers")
    });
  };

  const addUsersDataToFirebase = async () => {
    const options = [
      "Retina",
      "Medical",
      "Immunology",
      "Neuroscience",
      "GTx",
      "In Market Brands",
      "Cardiovascular",
      "Value & Access",
    ];
    const Roles = ['admin', 'user', 'manager'];

    if (UsersData.length) {
      for (const userItem of UsersData) {
        const userRole = Object.keys(userItem.Role || {})[0];
        const isValidRole = Roles.includes(userRole);
        const isValidFranchiseType = options.includes(userItem.franchiseType);

        if (isValidRole && isValidFranchiseType) {
          await onsubmit(userItem);
        } else {
          invalidEmails.push(userItem.Email);
        }
      }
    }
  };

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
                    className="border-2 border rounded-3 w-100"
                    name={item.name}
                  />
                  <div className="text-danger ps-5 align-self-start Error">
                    <ErrorMessage name={item.name} />
                  </div>
                </div>
              ))}
              <div className="d-flex col-12 col-md-5 flex-fill flex-column justify-content-center align-items-center">
                <div className="d-flex align-items-center gap-2 w-75 justify-content-between">
                  <ErrorMessage name="Role" className="align-self-start" />
                </div>
                <RoleDropDown setRoleType={setRoleType} />
              </div>
              <div
                className={`${
                  roleType === "admin" ? "d-none" : "d-flex"
                } col-12 col-md-5 flex-fill flex-column justify-content-center align-items-center`}
              >
                <div className="d-flex align-items-center gap-2 w-100 justify-content-between">
                  <ErrorMessage
                    name="franchiseType"
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
            {UsersData.length ? (
              <div className="d-flex justify-content-center">
                <button
                  onClick={addUsersDataToFirebase}
                  className="btn btn-primary"
                  type="button"
                >
                  Add Users
                </button>
              </div>
            ) : null}
          </Form>
        )}
      </Formik>
    </div>
  );
};
