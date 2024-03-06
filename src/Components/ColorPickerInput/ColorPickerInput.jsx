import React, { useContext, useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { FireBaseContext } from "../../Context/FireBase";

const ColorPickerInput = ({ type }) => {
  const [showPicker, setShowPicker] = useState(false);
  const { newEvent, setNewEvent } = useContext(FireBaseContext);
  const [selectedColor, setSelectedColor] = useState(newEvent[type]);

  const boxRef = useRef(null);

  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
    setNewEvent({ ...newEvent, [type]: color.hex });
  };

  const handleClick = () => {
    setShowPicker(!showPicker);
  };

  const handleOutsideClick = (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
      setShowPicker(false);
    }
  };
console.log(selectedColor)
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  return (
    <div ref={boxRef} className="d-flex align-items-center   gap-2">
      <div
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: selectedColor,
          cursor: "pointer",
          borderRadius: "5px",
        }}
        onClick={handleClick}
      ></div>
      {showPicker && (
        <ChromePicker color={selectedColor} onChange={handleColorChange} />
      )}
      <p className="m-0 p-2"> {selectedColor}</p>
    </div>
  );
};

export default ColorPickerInput;
