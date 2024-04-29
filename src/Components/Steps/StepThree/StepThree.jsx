import "./StepThreeStyle.css";
import mobileImg from "../../../assets/mobile-frame-without-background-free-png.png";
import logo from "../../../assets/Novartis Logo RGB 2.png";
import TextField from "@mui/material/TextField";
import { FireBaseContext } from "../../../Context/FireBase";
import { useContext, useEffect } from "react";
import ColorPickerInput from "../../ColorPickerInput/ColorPickerInput";
export const StepThree = () => {
  const { newEvent, setNewEvent } = useContext(FireBaseContext);
  function randomXToY(minVal, maxVal) {
    let randVal = minVal + Math.random() * (maxVal - minVal);
    return Math.round(randVal);
  }
  useEffect(() => {
    setNewEvent({ ...newEvent, Id: randomXToY(1, 100000) });
  }, []);
  return (
    <div className="d-flex justify-content-center flex-column gap-4 align-items-center container mt-5">
      <div className="row w-100 gap-md-1 gap-3">
        <div className=" border p-2 colorPickerParent rounded rounded-1 col-5 col-md-3">
          <h6 className="ColorPickerTitle">BackGround Color</h6>
          <ColorPickerInput type={"bgColor"} />
        </div>
        <div className="border p-2 colorPickerParent rounded col-5 col-md-3 rounded-1">
          <h6 className="ColorPickerTitle">Font Color</h6>
          <ColorPickerInput type={"fontColor"} />
        </div>
        <div className="border p-2 colorPickerParent rounded col-3 col-md-3 rounded-1">
          <h6 className="ColorPickerTitle">Button Color</h6>
          <ColorPickerInput type={"btnColor"} />
        </div>
      </div>

      <div className=" StepThreeBg d-flex justify-content-center   ">
        <img
          src={mobileImg}
          alt="mobileLogo"
         
          style={{ backgroundColor: newEvent.bgColor }}
        />
        <div className="StepThreeContent row flex-column align-items-center justify-content-center gap-2 ">
         <img src={logo} alt="novartisLogo" />
          <p className="m-0 text-center ">
            <b
              className="text-center"
              style={{ color: newEvent.fontColor }}
            >
              Welcome To Please Insert The Event ID
            </b>
          </p>
          <TextField
            className="px-md-5 py-0 rounded rounded-1"
            disabled
            type="number"
          />
          <button
            className="w-50 rounded rounded-2 border-0  py-1 text-white"
            style={{ backgroundColor: newEvent.btnColor }}
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
