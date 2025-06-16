import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const path = location.pathname;

  // 1. If not authenticated:
  if (!authenticated) {
    // Allow access if path is /auth or its subpaths
    if (path.startsWith("/auth")) {
      return <Fragment>{element}</Fragment>;
    }
    // Otherwise redirect to /auth
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // From here on: user is authenticated

  // 2. If authenticated user visits /auth, redirect to their home:
  if (path.startsWith("/auth")) {
    // Already logged in, so redirect away from login/register page
    if (user?.role === "instructor") {
      return <Navigate to="/instructor" replace state={{ from: location }} />;
    } else {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  }

  // 3. Role-based route enforcement:
  if (user?.role === "instructor") {
    // Instructor should only access /instructor routes
    if (!path.startsWith("/instructor")) {
      // Redirect to instructor home
      return <Navigate to="/instructor" replace state={{ from: location }} />;
    }
    // If path starts with /instructor, allow:
    return <Fragment>{element}</Fragment>;
  } else {
    // Non-instructor (e.g., student)
    // Prevent access to /instructor paths:
    if (path.startsWith("/instructor")) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
    // Otherwise allow:
    return <Fragment>{element}</Fragment>;
  }
}

export default RouteGuard;
