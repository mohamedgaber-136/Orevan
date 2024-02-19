import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useState } from "react";
import { StepOne } from "../Steps/StepOne/StepOne";
import { StepTwo } from "../Steps/StepTwo/StepTwo";
import { StepThree } from "../Steps/StepThree/StepThree";
import { StepFour } from "../Steps/StepFour/StepFour";
import { FireBaseContext } from "../../Context/FireBase";
import { addDoc, setDoc, collection, doc, getDoc } from "firebase/firestore";
import { SearchContext } from "../../Context/SearchContext";
import { useNavigate } from "react-router-dom";
export default function NewEvent() {
  const [activeStep, setActiveStep] = useState(0);
  const navigation = useNavigate();
  const {
    TeamsRefrence,
    setTriggerNum,
    triggerNum,
    newEvent,
    EventRefrence,
    setNewEvent,
    IdIncluded,
    setId,
    currentUsr,
    database,
    saveNotificationToFirebase
  } = useContext(FireBaseContext);
  const { setAccpetAll, AccpetAllTermss, } = useContext(SearchContext);
  const [skipped, setSkipped] = useState(new Set());
  const [open, setOpen] = useState(true);
  const steps = [
    { stepTitle: "Event Details", stepComp: <StepOne /> },
    { stepTitle: "Modules", stepComp: <StepTwo /> },
    { stepTitle: "Theme", stepComp: <StepOne /> },
    { stepTitle: "Preview", stepComp: <StepOne /> },
  ];
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };
  useEffect(() => {
    if (!activeStep) {
      if (
        newEvent.EventName == "" ||
        newEvent.PO == "" ||
        newEvent.CostperDelegate == "" ||
        newEvent.P3 == "" ||
        newEvent.Franchise == "" ||
        newEvent.DateFromHours == "" ||
        newEvent.DateEndHours == "" ||
        newEvent.EndDate == "" ||
        newEvent.StartDate == "" ||
        newEvent.City.length == 0 ||
        newEvent.TransferOfValue.length == 0
      ) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [newEvent]);
  useEffect(() => {
    if (activeStep == 2) {
      if (newEvent.Id) {
        setId(false);
      } else {
        setId(true);
      }
    } else {
      setId(false);
    }
  }, [activeStep]);

  const step = (num) => {
    switch (num) {
      case 0:
        return <StepOne />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;
      case 3:
        return <StepFour />;
      default:
        break;
    }
  };
  const SendDataToFireBase = async () => {
    const ref= doc(TeamsRefrence,newEvent.Franchise)
    const refCollec = collection(ref,'Events')
    await addDoc(refCollec, {
      // ID: item,
      CreatedByID: currentUsr,
      ...newEvent,
    });
    await addDoc(EventRefrence, { ...newEvent, CreatedByID: currentUsr }).then(
      async (snapshot) => {
     

       saveNotificationToFirebase(snapshot.id,)
      }
    );

    // add notification for this event
    console.log(ref)
    
    // const FranchiseRef = doc(TeamsRefrence,newEvent.Franchise);
    // console.log(FranchiseRef)
    // const collRef = collection(FranchiseRef, "Events");
    // await addDoc(ref, { ...newEvent, UserID: currentUsr });
    setNewEvent({
      EventName: "",
      CostperDelegate: "",
      PO: "",
      Franchise: "",
      Id: "",
      City: [],
      P3: "",
      TransferOfValue: [],
      CreatedAt: new Date().toLocaleString(),
      StartDate: "",
      EndDate: "",
      DateFromHours: "",
      DateEndHours: "",
      BackGroundColor: "#FFF",
      FontColor: "#000",
      ButtonColor: "#00F",
      AccpetAllTermss: false,
    });
    // setTriggerNum(triggerNum + 1);
    navigation("/app/events");
  };
  useEffect(() => {
    if (activeStep == 1) {
      return setAccpetAll(true);
    }
    return setAccpetAll(false);
  }, [activeStep]);
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} className="mb-4">
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={`${label}-${index}`} {...stepProps}>
              <StepLabel {...labelProps}> {label.stepTitle}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        // LastStep --------------------------
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </>
      ) : (
        <>
          {/* StepContent  */}
          <div>{step(activeStep)}</div>
          <Box></Box>

          {/* End  */}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            {activeStep === steps.length - 1 ? (
              <Button
                className="btn-DarkBlue text-white"
                onClick={SendDataToFireBase}
              >
                submit
              </Button>
            ) : (
              <div>
                {open && (
                  <small className="text-danger px-2 m-0">
                    Please Insert All Data{" "}
                  </small>
                )}
                {IdIncluded && (
                  <small className="text-danger px-2 m-0">
                    Please Insert valid Id{" "}
                  </small>
                )}
                <Button
                  className={`text-white " bg-secondary" ${
                    open ||
                    IdIncluded ||
                    (activeStep == 1 && !newEvent.AccpetAllTermss)
                      ? " bg-secondary"
                      : "btn-DarkBlue"
                  }`}
                  disabled={
                    (activeStep == 1 && !newEvent.AccpetAllTermss) ||
                    open ||
                    IdIncluded
                  }
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
