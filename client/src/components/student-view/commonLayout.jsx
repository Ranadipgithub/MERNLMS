import { Outlet } from "react-router-dom";
import Header from "./header";

function StudentCommonLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 flex flex-col ">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentCommonLayout;