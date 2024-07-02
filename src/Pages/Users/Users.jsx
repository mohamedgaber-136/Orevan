import { CreateUser } from "../../Components/CreatUser/CreateUser";
import ImportUser from "../../Components/ImportUsers/ImportUser";
export const Users = () => {
  return (
    <div className="d-flex flex-column container-fluid container-md gap-3 mt-2 EventsPageParent  ">
      <h2>Create New User</h2>
      <div className="d-flex justify-content-end">
        <ImportUser />
      </div>
      <CreateUser />
    </div>
  );
};
