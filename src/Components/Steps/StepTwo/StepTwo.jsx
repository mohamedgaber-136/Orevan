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
    setNewEvent({ ...newEvent, AccpetAllTermss: AccpetAllTermss });
  };
  const [editMode, setEditMode] = useState(false);

  const handleDoubleClick = () => {
    setEditMode(!editMode);
  };

  const handleChange = (event) => {
    // setContent(event.target.value);
    setNewEvent({ ...newEvent, eventTerms: event.target.value });
  };

  const handleBlur = () => {
    setEditMode(false);
  };
  const openPDF = () => {
    const pdfWindow = window.open("test");
    const title = "Privacy Policy";
    const URI = "Privacy Policy";
    const html = `
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body style="margin:0">
          <embed width="100%" height="100%" src="https://firebasestorage.googleapis.com/v0/b/novartis-f3745.appspot.com/o/pdf%2FHCPS_%20KSA%20updated%20Privacy%20Notice_%20Template_%2031%20Jan%202024.pdf?alt=media&token=ab6c0442-18fb-4aa4-8fa2-96cfea05844a" type="application/pdf">
        </body>
      </html>
    `;
    pdfWindow.document.write(html);
    pdfWindow.document.close();
    pdfWindow.history.pushState(null, null, URI);
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
              Due to the Financial Transparency and Disclosure guideline of -
               <a
                href="https://www.sfda.gov.sa/sites/default/files/2019-10/Payment-disclosure-en.pdf"
                target="_blank"
                rel="noreferrer"
              >
                 SFDA
              </a>
            </b>
          </h6>
          <p className="text-secondary">
            Novartis Saudi Ltd. is obliged to document any Transfer of Value
            given to healthcare professionals and healthcare organizations and
            to publish them online.
          </p>
        </div>
        <div className="w-100">
          <p>
            <b className="text-secondary">By accepting this,</b>
            <div onDoubleClick={handleDoubleClick}>
              {editMode ? (
                <textarea
                  value={newEvent.eventTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-100"
                  autoFocus
                />
              ) : (
                <div>{newEvent.eventTerms}</div>
              )}
            </div>
            <b>
              <button
                style={{
                  border: "none",
                  backgroundColor: "white",
                  color: "blue",
                  fontWeight: "600",
                  textAlign: "start",
                  textDecoration: "underline",
                }}
                onClick={openPDF}
              >
                Privacy Notice
              </button>
            </b>
            .
          </p>
        </div>
        <div className="AccpetAllTerms mt-2 flex-column flex-md-row d-flex justify-content-between align-items-center gap-2 w-100">
          <FormControlLabel
            className="AccpetAllTermsBox"
            control={
              <Checkbox
                name="AcceptAllTerms"
                checked={newEvent.AccpetAllTermss}
                onChange={handleChangeSingle}
              />
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
