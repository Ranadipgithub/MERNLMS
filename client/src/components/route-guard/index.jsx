import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const path = location.pathname;

  // 1. If not authenticated, allow only public routes:
  if (!authenticated) {
    // Adjust this list as needed for public pages:
    if (
      path.startsWith("/auth") ||
      path === "/" ||
      path.startsWith("/courses")
      // you could add other public paths here, e.g. "/about", "/contact"
    ) {
      return <Fragment>{element}</Fragment>;
    }
    // Otherwise redirect to login
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // 2. If authenticated, block access to /auth pages:
  if (path.startsWith("/auth")) {
    // Redirect authenticated users away from auth page, based on role:
    if (user?.role === "instructor") {
      return <Navigate to="/instructor" replace state={{ from: location }} />;
    } else {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  }

  // 3. Now authenticated users:
  if (user?.role === "instructor") {
    // Instructors may access "/" and "/instructor/*"
    if (path === "/" || path.startsWith("/instructor")) {
      return <Fragment>{element}</Fragment>;
    }
    // Any other route: redirect them (here, to "/")
    return <Navigate to="/" replace state={{ from: location }} />;
  } else {
    // Non-instructors: block any /instructor routes
    if (path.startsWith("/instructor")) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
    // Otherwise allow access
    return <Fragment>{element}</Fragment>;
  }
}

export default RouteGuard;
