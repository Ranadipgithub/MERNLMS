import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

export default function StudentHomePage() {
  const { resetCredentials } = useContext(AuthContext);
  function handleLogout() {
    resetCredentials();
    sessionStorage.removeItem('accessToken');
  }
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl font-bold text-center mt-4">Welcome to the Student Dashboard</h1>
      <p className="text-center mt-2">Here you can find your courses, assignments, and more.</p>
      <Button onClick={handleLogout}>Logout</Button>
      {/* Add more content or components as needed */}
    </div>
  );
}