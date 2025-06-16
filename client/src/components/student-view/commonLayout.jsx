import { Outlet } from "react-router-dom";

function StudentCommonLayout() {
  return (
    <div className="flex flex-col h-screen">
      Common Content
      <Outlet/>
    </div>
  );
}

export default StudentCommonLayout;