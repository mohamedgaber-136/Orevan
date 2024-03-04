import "./StepThreeStyle.css";
import mobileImg from "../../../assets/mobile-frame-without-background-free-png.png";
import logo from "../../../assets/Novartis Logo RGB 2.png";
import TextField from "@mui/material/TextField";
import { FireBaseContext } from "../../../Context/FireBase";
import { useContext ,useEffect} from "react";
import ColorPickerInput from "../../ColorPickerInput/ColorPickerInput";
export const StepThree = () => {
  const { newEvent, setNewEvent} = useContext(FireBaseContext);
  function randomXToY(minVal, maxVal) {
    let randVal = minVal + Math.random() * (maxVal - minVal);
    return Math.round(randVal);
  }
  useEffect(() => {
    setNewEvent({ ...newEvent, Id:   randomXToY(1, 100000)     })
  }, [])
  console.log(newEvent,'newEvent')
  return (
    <div className="d-flex justify-content-center flex-column gap-4 align-items-center container mt-5">
      <div className="d-flex justify-content-between flex-wrap  w-100 gap-5 align-items-center">
        <div className=" border p-2 colorPickerParent rounded rounded-1">
          <h6 className="ColorPickerTitle">BackGround Color</h6>
          <ColorPickerInput type={"BackGroundColor"}/>

        </div>
        <div className="border p-2 colorPickerParent rounded rounded-1">
          <h6 className="ColorPickerTitle">Font Color</h6>
          <ColorPickerInput type={"FontColor"}/>

        </div>
        <div className="border p-2 colorPickerParent rounded rounded-1">
          <h6 className="ColorPickerTitle">Button Color</h6>
          <ColorPickerInput type={"ButtonColor"} />

        </div>
      </div>

      <div className=" StepThreeBg  overflow-hidden  ">
        <img
          src={mobileImg}
          alt="mobileLogo"
          width={"100%"}
          style={{ backgroundColor: newEvent.BackGroundColor }}
        />
        <div className="StepThreeContent   gap-1 d-flex justify-content-center flex-column align-items-center">
          <img src={logo} alt="novartisLogo" />
          <p className="m-0 text-center ">
            <b
              className="fs-6 text-center"
              style={{ color: newEvent.FontColor }}
            >
              Welcome To Please Insert The Event ID
            </b>
          </p>
          <TextField
            className="px-5 py-0 rounded rounded-1"
            disabled
            type="number"
          />
          <button
            className="w-50 rounded rounded-2 border-0  py-1 text-white"
            style={{ backgroundColor: newEvent.ButtonColor }}
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
