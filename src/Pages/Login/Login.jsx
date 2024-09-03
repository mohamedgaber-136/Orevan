import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormControl, FormLabel } from "@mui/material";
import loginBg from "../../assets/LoginBg.png";
import leftLogo from "../../assets/LoadingLogo.png";
import rightlogo from "../../assets/Orevan.png";
import center from "../../assets/Asset 1@4x.png";
import "./Login.css";

import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik, Form } from "formik";
import { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Login = () => {
  const navigation = useNavigate();
  const [error, setError] = useState(false);
  const [errorRegist, setErrorRegist] = useState(false);
  const [blockedErrorMsg, setBlockedErrorMsg] = useState(false);
  const [showSpinning, setShowSpinning] = useState(false);
  const { auth, database, currentUsr } = useContext(FireBaseContext);

  const UsersRef = collection(database, "Users");
  const formData = [
    {
      type: "text",
      label: "Email address",
    },
    {
      type: "password",
      label: "Password",
    },
  ];
  const LoginFunc = async (e) => {
    e.preventDefault();
    setShowSpinning(true); // Start the spinner
    setError(false); // Reset errors
    setErrorRegist(false);
    setBlockedErrorMsg(false);

    try {
      const acc = query(UsersRef, where("Email", "==", e.target[0].value));
      const res = await getDocs(acc);

      if (res.docs[0]) {
        const userId = res.docs[0].data();
        if (!userId.Condition.Blocked) {
          await signInWithEmailAndPassword(auth, e.target[0].value, e.target[2].value);
          setError(false); // Hide the error
          navigation(`/app`);
        } else {
          setBlockedErrorMsg(true);
        }
      } else {
        setErrorRegist(true);
      }
    } catch (error) {
      setError(true);
    } finally {
      setShowSpinning(false); // Stop the spinner
    }
  };

  useEffect(() => {
    if (currentUsr && currentUsr !== "init") {
      navigation(`/app`);
    }
  }, [currentUsr, navigation]);

  return (
    <div className="d-flex justify-content-around LoginParent  flex-column  align-items-center flex-column ">
      <div className=" d-flex justify-content-center pt-3 flex-column align-items-center   container">
        <div className="  d-flex justify-content-center align-items-center w-100 h-100 ">
          <div className="  LoginBorder   h-100  d-flex justify-content-center flex-column align-items-center ">
            <div className=" FormParent">
              <Formik className="w-100 ">
                {() => (
                  <Form onSubmit={LoginFunc} className="w-100  my-3 ">
                    <div className=" my-5 d-flex justify-content-center">
                      <div className="FormImage">
                        <img src={center} alt="" width={"100%"} style={{ objectFit: "contain" }} />
                      </div>
                    </div>
                    <div className="d-flex  flex-column  pt-2 gap-2  w-100">
                      <h2 className="LoginTitle fs-1 ">Login</h2>
                      <h6 className="text-secondary fs-6">
                        Please Enter your email and password to Connect.
                      </h6>
                    </div>
                    <FormControl className="w-100">
                      <span className="text-danger">
                        {error && "Invalid Email or Password"}
                        {errorRegist && "This Email Not Registered"}
                      </span>
                      {formData.map((item, indx) => (
                        <div className="d-flex flex-column gap-2 " key={indx}>
                          <FormLabel className="LoginTitle fw-bold">
                            {item.label}
                          </FormLabel>
                          <TextField
                            className="py-0 rounded rounded-1 w-100"
                            type={item.type}
                            placeholder={`Enter Your ${item.label}`}
                            InputProps={{
                              style: {
                                borderRadius: "8px",
                                fontFamily: "Arial, sans-serif",
                                fontSize: "14px",
                                border: "1px solid grey",
                              },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "#ccc",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#aaa",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#007bff",
                                },
                              },
                            }}
                          />
                        </div>
                      ))}
                      <div className="text-danger p-2">
                        {blockedErrorMsg && "This Account is Blocked from The System"}
                      </div>
                      <Button
                        type="submit"
                        className="w-100 LoginBtn d-flex gap-2 border"
                        disabled={showSpinning} // Disable button while loading
                      >
                        <span className="text-white">Login</span>
                        {showSpinning && (
                          <i className="gg-spinner-two-alt text-white "></i>
                        )}
                      </Button>
                    </FormControl>
                  </Form>
                )}
              </Formik>
              <a className="OrangeGradient " href="mailto:orevanevents@orevan.org">
                Contact us
              </a>
            </div>
          </div>
          <div className="loginImgParent px-2 h-100 d-flex justify-content-center align-items-center">
            <div className="container flex-column h-100 d-flex justify-content-center align-items-start">
              <img src={loginBg} alt="LoginBg" />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex gap-2 p-1 px-5 justify-content-between w-100 align-items-center LoginFooter">
        <div className="LeftLogo">
          <img src={leftLogo} alt="" />
        </div>
        <div className="RighLogo">
          <img src={rightlogo} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Login;
