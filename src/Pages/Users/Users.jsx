import { CreateUser } from "../../Components/CreatUser/CreateUser";
export const Users = () => {
  return (
    <div className="d-flex flex-column container gap-3 mt-2 EventsPageParent  ">
      <h2>Create New User</h2>
      <CreateUser />
    </div>
  );
};
