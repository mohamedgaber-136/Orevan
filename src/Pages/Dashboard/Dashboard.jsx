import { useContext, useEffect, useState } from "react";
import BasicTable from "../../Components/BasicTable/BasicTable";
import { WeekEeventsCard } from "../../Components/WeekEventsCard/WeekEeventsCard";
import { FireBaseContext } from "../../Context/FireBase";
export const Dashboard = () => {
  const [WeeksInfo, setWeeksInfo] = useState([
    {
      times: 0,
      calen: "Today",
      color: "#FFc100",
    },
    {
      times: 0,
      calen: "Week",
      color: "#F1606B",
    },
    {
      times: 0,
      calen: "Month",
      color: "#0460a9",
    },
  ]);
  const { getData, currentUserRole, eventsQueryAccordingToUserRole } =
    useContext(FireBaseContext);
  const [data, setData] = useState([]);
  const [eventsAccordingToRole, setEventsAccordingToRole] = useState([]);
  useEffect(() => {
    if (currentUserRole) {
      getData(eventsQueryAccordingToUserRole(), setData);
    }
  }, [currentUserRole]);

  useEffect(() => {
    if (data.length !== 0) {
      setEventsAccordingToRole(data);
    }
  }, [data]);
  return (
    <div className="d-flex flex-column gap-4 align-items-start ">
      <div className="container-fluid container-md">
        <h2 className="my-3">
          {" Hi, "}
          {localStorage.getItem("User")
            ? JSON.parse(localStorage.getItem("User"))
                .Name?.split(" ")
                ?.map(
                  (part) =>
                    part[0]?.toUpperCase() + part?.substring(1).toLowerCase()
                )
                .join(" ")
            : ""}
        </h2>
        <div className="d-flex  justify-content-between align-item-center w-100">
          <div className="   d-flex flex-column gap-2  align-items-start DashboardTableParen w-100">
            <div className="d-flex align-items-center justify-content-start gap-2 w-100 flex-md-row flex-column ">
              {WeeksInfo.map((item, ind) => (
                <WeekEeventsCard
                  key={ind}
                  num={item.times}
                  calen={item.calen}
                  color={item.color}
                />
              ))}
            </div>
            <div className="w-100">
              <h2 className="mt-3 text-secondary">Events</h2>
              <BasicTable
                row={eventsAccordingToRole}
                WeeksInfo={WeeksInfo}
                setWeeksInfo={setWeeksInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
