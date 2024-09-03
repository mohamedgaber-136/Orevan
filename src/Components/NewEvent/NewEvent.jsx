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
import {
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { SearchContext } from "../../Context/SearchContext";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
export default function NewEvent() {
  const [activeStep, setActiveStep] = useState(0);
  const navigation = useNavigate();
  const {
    TeamsRefrence,
    newEvent,
    EventRefrence,
    setNewEvent,
    setId,
    currentUsr,
    saveNotificationToFirebase,
    dateError,
    database,
    TransferOfValuesRef,
  } = useContext(FireBaseContext);
  const { setAccpetAll, AccpetAllTermss } = useContext(SearchContext);
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
        newEvent.eventName === "" ||
        newEvent.PO === "" ||
        newEvent.BeSure === "" ||
        newEvent.Franchise === "" ||
        newEvent.DateFromHours === "" ||
        newEvent.DateEndHours === "" ||
        newEvent.endDate === "" ||
        newEvent.eventDate === "" ||
        newEvent.EventCurrency === "" ||
        dateError == true ||
        newEvent.city.length === 0 ||
        newEvent.TransferOfValue.length === 0
      ) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [newEvent, dateError]);
  useEffect(() => {
    if (activeStep === 2) {
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
    const ref = doc(TeamsRefrence, newEvent.Franchise);
    const refCollec = collection(ref, "Events");
    const eventID = newEvent.Id.toString();
    swal({
      icon: "success",
      title: `Event ${eventID} added`,
    }).then(async () => {
      await addDoc(refCollec, {
        CreatedByID: currentUsr,
        ...newEvent,
      });
      // save transfer of values to collection
      newEvent.TransferOfValue.map(async (tov) => {
        const newObject = {
          eventID: eventID,
          value: tov.value,
          eventName: newEvent.eventName,
          eventDate: newEvent.eventDate,
        };
        const documentRef = doc(TransferOfValuesRef,tov.types);
        const docItem = await getDoc(documentRef);
        if (docItem.exists()) {
          const dataList = docItem.data().data ?? [];
          dataList.push(newObject);
          await updateDoc(documentRef, {
            data: [...dataList],
          });
        } else {
          await setDoc(documentRef, { data: [newObject] });
        }
      });
    });
    await setDoc(doc(EventRefrence, eventID), {
      ...newEvent,
      CreatedByID: currentUsr,
    }).then(async (snapshot) => {
   
      saveNotificationToFirebase({
        notifyID: newEvent.Id,
        message: "created a new event",
        eventDataObject: { ...newEvent }
      });
    });

    navigation("/app/events");
    setNewEvent({
      eventName: "",
      CostperDelegate: "",
      PO: "",
      Franchise: "",
      Id: "",
      city: [],
      BeSure: "",
      TransferOfValue: [],
      CreatedAt: new Date().toLocaleString(),
      eventDate: "",
      endDate: "",
      DateFromHours: "",
      DateEndHours: "",
      bgColor: "#fff",
      fontColor: "#000000",
      btnColor: "#0000ff",
      AccpetAllTermss: false,
      eventTerms:
        ' I explicitly declare that I have been informed of the obligation to disclose to the SFDA any financial support received from Novartis Saudi Ltd. I also consent the processing, saving and publication of my personal data including (Full name, National or Iqama ID, Medical License number, phone number and email address) in relation to any Transfer of Value as defined in the financial Transparency and Disclosure guideline of SFDA." I also, hereby declare that I have read and understood Novartis Privacy Notice and acknowledge my consent to the collection and processing of my data in accordance with the terms of this ',
    });
  };
  useEffect(() => {
    if (activeStep === 1) {
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
                    Please Insert All Data
                  </small>
                )}
                <Button
                  className={`text-white " bg-secondary" ${
                    open && activeStep === 1 && !newEvent.AccpetAllTermss
                      ? " bg-secondary"
                      : "btn-DarkBlue"
                  }`}
                  disabled={
                    (activeStep === 1 && !newEvent.AccpetAllTermss) || open
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
