import { Field, Form, Formik } from "formik";
import EditIcon from "@mui/icons-material/Edit";
import ProfileReport from "../../Components/ProfileReport/ProfileReport";
import { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { FireBaseContext } from "../../Context/FireBase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
export const Profile = () => {
  const [disabledValue, setDisabled] = useState(true);
  const { currentUsr, UserRef } = useContext(FireBaseContext);
  const [Current, setCurrent] = useState(null);
  const InputsDataColOne = [
    {
      label: "Name",
      type: "text",
    },
    {
      label: "Telephone",
      type: "text",
    },
  ];
  const InputsDataColTwo = [
    {
      label: "Email",
      type: "text",
    },
  ];
  const intialValues={
    Name:Current?.Name,
    Telephone: Current?.PhoneNumber,
    Email:Current?.Email

  }
  const docRef = doc(UserRef, currentUsr);
  const handleSubmit = async (values) => {
     await  updateDoc(docRef,values)
    setDisabled(true)
    window.location.reload();
  };
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getDoc(docRef);
      setCurrent(user.data());
    };

    fetchUser();
  }, [currentUsr]);
  if (Current) {
    return (
      <div className="  d-flex flex-column container gap-3 EventsPageParent ">
        <div className="">
          <h5 className="mb-3">Personal Data</h5>
       
          <Formik onSubmit={handleSubmit} initialValues={intialValues}>
            {() => (
              <Form
                // onSubmit={handleSubmit}
                className="FormDataParent  bg-white container   rounded rounded-2  "
              >
                <div className="row w-100 gap-3">
                  <div className="d-flex gap-3 flex-column col-12  ">
                    {InputsDataColOne.map((item, indx) => (
                      <Field
                        as={TextField}
                        key={indx}
                        name={item.label}
                        label={item.label}
                        focused
                        disabled={disabledValue}
                      />
                    ))}
                  </div>
                  <div className="d-flex gap-3 flex-column col-12">
                    {InputsDataColTwo.map((item, indx) => (
                        <Field
                       as={TextField}
                        key={indx}
                        name={item.label}
                        label={item.label}
                        focused
                        disabled={disabledValue}
                      />
                    ))}
                  </div>
                </div>
                <div className="EditPen">

                <EditIcon
                  title="edit"
                  onClick={() => setDisabled(!disabledValue)}
                  className="text-primary  "
                  />
                  </div>
            
                <button
                  className={`SaveBtn wrappingItems border-0 ${disabledValue && "d-none"} m-2 `}
                  type="submit"
                >
                  Save
                </button>

                {/* <ProfileReport />  */}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-100 d-flex justify-content-center">
        <div className="dot-spinner">
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
        </div>
      </div>
    );
  }
};
