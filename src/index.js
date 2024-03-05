import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "@mui/material/styles";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { RootLayout } from "./Components/RootLayOut/RootLayout";
import { Dashboard } from "./Pages/Dashboard/Dashboard";
import { Events } from "./Pages/Events/Events";
import { Profile } from "./Pages/Profile/Profile";
import { Teams } from "./Pages/Teams/Teams";
import { MainContent } from "./Components/MainContent/MainContent";
import { Suspense, lazy, useContext } from "react";
import lazyImg from "./assets/LoadingLogo.png";
import SearchContextProvider from "./Context/SearchContext.js";
import { AddNewEvent } from "./Pages/AddNewEvent/AddNewEvent.jsx";
import FireBaseContextProvider, {
  FireBaseContext,
} from "./Context/FireBase.js";
import { Subscribers } from "./Pages/Subscriber/Subscribers.jsx";
import UpdateSubScriber from "./Pages/UpdateSubScriber/UpdateSubScriber.jsx";
import { DeletedData } from "./Pages/DeletedData/DeletedData.jsx";
import { Protected } from "./Components/ProtectedRouted/Protected.jsx";
import { MyEvents } from "./Pages/MyEvents/MyEvents.jsx";
import { DeletedSubscribers } from "./Pages/DeletedData/DeletedSubscribers/DeletedSubscribers.jsx";
import { DeletedEvents } from "./Pages/DeletedData/DeletedElements/DeletedEvents.jsx";
import { AllUsers } from "./Pages/AllUsers/AllUsers.jsx";
async function delayForDemo(promise) {
  return new Promise((resolve) => {
    setTimeout(resolve, 4000);
  }).then(() => promise);
}

let LoginLazy = lazy(() => delayForDemo(import("./Pages/Login/Login")));

const RouterStructure = () => {
  const { currentUserRole } = useContext(FireBaseContext);

  return (
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<App />}>
            <Route path="/" element={<LoginLazy />} />
            <Route
              path="/app"
              element={
                <Protected>
                  <RootLayout />
                </Protected>
              }
            >
              <Route path="/app" element={<MainContent />}>
                <Route index element={<Dashboard />} />
                <Route path="events" element={<Events />} />
                <Route path="subscribers/:id/:dbID">
                  <Route index={true} element={<Subscribers />} />
                  <Route
                    index={false}
                    path="UpdateSubscriber/:userId/:UserDbID"
                    element={<UpdateSubScriber />}
                  />
                </Route>
                <Route path="Profile" element={<Profile />} />
                <Route path="AddEvents" element={<AddNewEvent />} />

                {currentUserRole.admin && (
                  <>
                    <Route path="teams" element={<Teams />} />
                    <Route path="AllUsers" element={<AllUsers />} />
                    {/* <Route
                      path="Users"
                      element={
                        <Users />
                      }
                    /> */}
                  </>
                )}

                <Route path="MyEvents" element={<MyEvents />} />

                <Route path="DeletedData" element={<DeletedData />}>
                  <Route index element={<DeletedEvents />} />
                  <Route path="events" element={<DeletedEvents />} />
                  <Route path="Subscribers" element={<DeletedSubscribers />} />
                </Route>
              </Route>
            </Route>
            {/* )} */}
          </Route>
        )
      )}
    />
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <FireBaseContextProvider>
    <SearchContextProvider>
      <Suspense
        children={
          <div className="vh-100  w-100 d-flex justify-content-center align-items-center">
            <div className="lazy-loadingImg w-75">
              <img src={lazyImg} alt="LazyLoadingImg" width={"100%"} />
            </div>
          </div>
        }
        fallback={
          <div className="vh-100  w-100 d-flex justify-content-center align-items-center">
            <div className="lazy-loadingImg w-75">
              <img src={lazyImg} alt="LazyLoadingImg" width={"100%"} />
            </div>
          </div>
        }
      >
        <RouterStructure />
        {/* <RouterProvider router={router()} /> */}
      </Suspense>
    </SearchContextProvider>
  </FireBaseContextProvider>
);
reportWebVitals();
