import { Field } from "formik";
export const FranchiseType = () => {
  const options = [
   
        "Retina",
        "Medical",
        "Immunology ",
        "Neuroscience",
        "GTx",
        "In Market Brands",
        "Cardiovascular",
        "Value & Access ",

  ];

  return (
    <>
      <b className=" w-100">FranchiseType</b>
      <div className="form-control d-flex flex-column align-items-start  w-100  justify-content-center ">
        <Field
          as="select"
          className=" w-100 border-0"
          id={"franchiseType"}
          name={"franchiseType"}
        >
          {options.map((option) =>
            typeof option == "object" ? (
              <optgroup label={option.label}>
                {option.options.map((item, index) => (
                  <option key={index} value={`${option.label}-${item}`}>
                    {item}
                  </option>
                ))}
              </optgroup>
            ) : (
              <option key={option} value={option}>
                {option}
              </option>
            )
          )}
        </Field>
      </div>
    </>
  );
};
