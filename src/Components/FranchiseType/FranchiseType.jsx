import { Field } from "formik";

export const FranchiseType = () => {
  const options = [
    "Retina",
    "Medical",
    "Immunology",
    "Neuroscience",
    "GTx",
    "In Market Brands",
    "Cardiovascular",
    "Value & Access",
    "Oncology",
  ];

  return (
    <>
      <b className="w-100">Franchise Type</b>
      <div className="form-control d-flex flex-column align-items-start w-100 justify-content-center">
        <Field
          as="select"
          className="w-100 border-0"
          id="franchiseType"
          name="franchiseType"
        >
          <option value="">Select Franchise Type</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Field>
      </div>
    </>
  );
};
