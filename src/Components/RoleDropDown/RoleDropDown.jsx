import { Field } from "formik";
export const RoleDropDown = () => {
  const options = [
    "Brand Manager",
    {
      label: "Franchise Manager",
      options: ["RetinaFranchise", "MedicalFranchise", "Immunology Franchise",'NeuroscienceFranchise','GTxFranchise','In Market BrandsFranchise','CardiovascularFranchise'],
    },
    "Franchise User",
  ];

  return (
    <div className="form-control d-flex flex-column align-items-start  w-100  justify-content-center ">
                          <b>Choose Role</b>

      <Field as="select" className=" w-100 border-0" id={"Role"} name={"Role"}>
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
  );
};
