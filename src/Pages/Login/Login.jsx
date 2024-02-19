import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormControl, FormLabel } from "@mui/material";
import loginBg from "../../assets/LoginBg.png";
import leftLogo from "../../assets/LoadingLogo.png";
import rightlogo from "../../assets/Logo2.png";
import "./Login.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Formik, Form } from "formik";
import { useContext, useEffect, useState } from "react";
import { FireBaseContext } from "../../Context/FireBase";
import { collection, doc, getDoc } from "firebase/firestore";
const Login = () => {
  const navigation = useNavigate();
  const [error, setError] = useState(false);
  const { auth } = useContext(FireBaseContext);
  const [ShowSpinning, setShowSpinning] = useState(false);
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
  let navigateTime;
  const LoginFunc = async (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, e.target[0].value, e.target[2].value)
      .then(async (res) => {
        // const currentUser = auth().currentUser;
        // console.log(currentUser,'current');
        // currentUser.getIdTokenResult().then(idTokenResult => {
        //   currentUser.superAdmin = idTokenResult.claims.superAdmin;

        //   if (!currentUser.superAdmin) {
        //     console.log('is not admin');
        //     // firebase.logout();
        //   }
        // });

        setError(false);
        setShowSpinning(true);
        navigateTime = setTimeout(() => navigation(`/app`), 2000);
      })
      .catch((error) => setError(true));
  };
  useEffect(() => {
    return clearTimeout(navigateTime);
  }, []);
  return (
    <div className="d-flex justify-content-around vh-100 flex-column align-items-center flex-column ">
      <div className=" d-flex justify-content-center pt-3 flex-column align-items-center   container">
        <div className="  d-flex justify-content-center align-items-center w-100 h-100 ">
          <div className="  LoginBorder  h-100  d-flex justify-content-center flex-column align-items-center ">
            <div className="d-flex flex-column pt-2 gap-2">
              <h2 className="LoginTitle fs-1 ">Login</h2>
              <h6 className="text-secondary fs-6">
                Please Enter your email to Connect
              </h6>
            </div>
            <Formik>
              {() => (
                <Form onSubmit={LoginFunc}>
                  <FormControl className="p-3  ">
                    <span className="text-danger">
                      {error && "Invalid Email or Password"}
                    </span>
                    {formData.map((item, indx) => (
                      <div className="d-flex flex-column gap-2 mb-4" key={indx}>
                        <FormLabel className="LoginTitle fw-bold">
                          {item.label}
                        </FormLabel>
                        <TextField
                          className="px-5 py-0 rounded rounded-1 w-100"
                          type={`${item.type}`}
                        />
                      </div>
                    ))}
                    <div className="d-flex justify-content-between align-items-center">
                      <FormControlLabel
                        className="RememberMeLabel"
                        control={<Checkbox defaultChecked />}
                        label="Remember me"
                      />
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <span className=" fw-semibold ForgotContent">
                          Forgot password?
                        </span>
                        <span className="OrangeGradient">Contact us</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-100 LoginBtn d-flex gap-2 border"
                    >
                      <span className="text-white">Login</span>{" "}
                      {ShowSpinning && (
                        <i className="gg-spinner-two-alt text-white "></i>
                      )}
                    </Button>
                  </FormControl>
                </Form>
              )}
            </Formik>
          </div>
          <div className=" loginImgParent px-2  h-100 d-flex justify-content-center align-items-center ">
            <div className="container flex-column  h-100 d-flex justify-content-center align-items-start">
              <img src={loginBg} alt="LoginBg" />
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex px-3 justify-content-between w-100 align-items-center LoginFooter">
        <div className="LeftLogo w-25 ">
          <img src={leftLogo} alt="" />
        </div>
        <div className="RighLogo ">
          <img src={rightlogo} alt="" />
        </div>
      </div>
    </div>
  );
};
export default Login;
