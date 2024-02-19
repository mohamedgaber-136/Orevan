import React, { useContext, useState } from "react";
import CheckboxesGroup from "../../Checkbox/CheckboxesGroup";
import "./StepTwoStyle.css";
import { FireBaseContext } from "../../../Context/FireBase";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { SearchContext } from "../../../Context/SearchContext";
export const StepTwo = () => {
  const { newEvent, setNewEvent } = useContext(FireBaseContext);
  const { setAccpetAll, AccpetAllTermss } = useContext(SearchContext);
  const handleChangeSingle = (e) => {
    setAccpetAll(!AccpetAllTermss);
    setNewEvent({...newEvent,AccpetAllTermss:AccpetAllTermss})
  };
  const initialContent = ' I explicitly declare that I have been informed of the obligation to disclose to the SFDA any financial support received from Novartis Saudi Ltd. I also consent the processing, saving and publication of my personal data including (Full name, National or Iqama ID, Medical License number, phone number and email address) in relation to any Transfer of Value as defined in the financial Transparency and Disclosure guideline of SFDA." I also, hereby declare that I’ve read and understood Novartis Privacy Notice and acknowledge my consent to the collection and processing of my data in accordance with the terms of this '
  const [content, setContent] = useState(initialContent);
  const [editMode, setEditMode] = useState(false);

  const handleDoubleClick = () => {
    setEditMode(!editMode);
  };

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleBlur = () => {
    setEditMode(false);
  };

  return (
    <div className="px-4 d-flex flex-md-row flex-column justify-content-center gap-3 align-items-center StepTwoParent ">
      <div className="w-50">
        <CheckboxesGroup />
      </div>
      <div className="StepTwoContent mb-3 d-flex flex-column gap-4 align-items-start justify-content-between">
        <div>
          <h6>
            <b className="text-secondary">
              Due to the Financial Transparency and Disclosure guideline of{" "}
              <a
                href="https://www.sfda.gov.sa/sites/default/files/2019-10/Payment-disclosure-en.pdf"
                target="_blank"
              >
                SFDA
              </a>{" "}
            </b>
          </h6>
          <p className="text-secondary">
            Novartis Saudi Ltd. is obliged to document any Transfer of Value
            given to healthcare professionals and healthcare organizations and
            to publish them online.
          </p>
        </div>
        <div className='w-100' >
          <p>
            <b className="text-secondary">By accepting this,</b>
            {/* <input type='text' value=', I explicitly declare that I have been informed of the obligation to disclose to the SFDA any financial support received from Novartis Saudi Ltd. I also consent the processing, saving and publication of my personal data including (Full name, National or Iqama ID, Medical License number, phone number and email address) in relation to any Transfer of Value as defined in the financial Transparency and Disclosure guideline of SFDA." I also, hereby declare that I’ve read and understood Novartis Privacy Notice and acknowledge my consent to the collection and processing of my data in accordance with the terms of this ' readOnly={true} disabled={true} className="border-0 h-100 bg-transparent"/> */}
            <div onDoubleClick={handleDoubleClick}>
      {editMode ? (
        <textarea
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          className='w-100'
          autoFocus
        />
      ) : (
        <div>{content}</div>
      )}
    </div>
            
            <b><a href="https://firebasestorage.googleapis.com/v0/b/novartis-f3745.appspot.com/o/pdf%2FHCPS_%20KSA%20updated%20Privacy%20Notice_%20Template_%2031%20Jan%202024.pdf?alt=media&token=ab6c0442-18fb-4aa4-8fa2-96cfea05844a" target="_blank">Privacy Notice</a></b>.

          </p>
        </div>
        <div className="AccpetAllTerms  d-flex justify-content-between align-items-center gap-2">
          <FormControlLabel
            className="AccpetAllTermsBox"
            control={
              <Checkbox name="AcceptAllTerms" checked={newEvent.AccpetAllTermss}  onChange={handleChangeSingle} />
            }
            label="Accept All Terms"
          />
          {!newEvent.AccpetAllTermss && (
            <p className="m-0 text-danger fs-6">
              click accept to be able to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
