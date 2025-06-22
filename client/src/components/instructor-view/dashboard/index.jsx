import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function InstructorDashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Instructor Dashboard</h1>
      <p className="mb-4">Welcome to the instructor dashboard!</p>
      <Button onClick={() => { navigate("/"); }} className={"text-[16px] md:text-[18px] font-medium cursor-pointer"}>Student Dashboard</Button>
    </div>
  );
}

export default InstructorDashboard;