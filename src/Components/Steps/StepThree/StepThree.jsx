import "./StepThreeStyle.css";
import mobileImg from "../../../assets/mobile-frame-without-background-free-png.png";
import logo from "../../../assets/Novartis Logo RGB 2.png";
import TextField from "@mui/material/TextField";
import ColorPickers from "../../ColorPicker/ColorPicker";
import { FireBaseContext } from "../../../Context/FireBase";
import { useContext ,useState,useEffect} from "react";
export const StepThree = () => {
  const { newEvent, setNewEvent,EventRefrence,getData,setId,IdIncluded} = useContext(FireBaseContext);
  const[y,setY]=useState(false)
  const[checkId,setCheckId]= useState([])
  useEffect(() => {
    getData(EventRefrence,setCheckId)
  }, [])
        const setIdInfo = (e)=>{
         const inputId = e.target.value
         setNewEvent({ ...newEvent, Id: inputId})
        const x = checkId.find(({Id})=>Id==inputId)
        if(inputId==''){
          setId(true)
          setY(false)
        }else 
        if(x){
          setY(true)
          setId(true)
        }else{
          setY(false)
          setId(false)
         setNewEvent({ ...newEvent, Id: inputId})
        }
  }

 
  return (
    <div className="d-flex justify-content-center flex-column gap-4 align-items-center container mt-5">
      <div className="d-flex justify-content-between flex-wrap  w-100 gap-5 align-items-center">
        <div className=" border p-2 colorPickerParent rounded rounded-1">
          <h6 className="ColorPickerTitle">BackGround Color</h6>
          <ColorPickers type={"BackGroundColor"} />
        </div>
        <div className="border p-2 colorPickerParent rounded rounded-1">
          <h6 className="ColorPickerTitle">Font Color</h6>
          <ColorPickers type={"FontColor"} />
        </div>
        <div className="border p-2 colorPickerParent rounded rounded-1">
          <h6 className="ColorPickerTitle">Button Color</h6>
          <ColorPickers type={"ButtonColor"} />
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
            value={newEvent.Id}
            onChange={setIdInfo}
            type="number"
          />
          {y&&<span style={{color:newEvent.FontColor}}>This ID Allready used</span>}
          <button
            className="w-50 rounded rounded-2 border-0  py-1 text-white"
            style={{ backgroundColor: newEvent.ButtonColor }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
