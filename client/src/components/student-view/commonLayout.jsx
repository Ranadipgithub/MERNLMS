import { Outlet, useLocation } from "react-router-dom";
import Header from "./header";

function StudentCommonLayout() {
  const location = useLocation();
  return (
    <div className="flex flex-col h-screen">
      {
        !location.pathname.includes("course-progress") && (
          <Header />
        )
      }
      <main className="flex-1 flex flex-col ">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentCommonLayout;