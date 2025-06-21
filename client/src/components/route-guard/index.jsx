import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();
  const path = location.pathname;

  if (!authenticated) {
    if (path.startsWith("/auth")) {
      return <Fragment>{element}</Fragment>;
    }
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  if (path.startsWith("/auth")) {
    if (user?.role === "instructor") {
      return <Navigate to="/instructor" replace state={{ from: location }} />;
    } else {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  }

  if (user?.role === "instructor") {
    if (!path.startsWith("/instructor")) {
      return <Navigate to="/instructor" replace state={{ from: location }} />;
    }
    return <Fragment>{element}</Fragment>;
  } else {
    if (path.startsWith("/instructor")) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
    return <Fragment>{element}</Fragment>;
  }
}

export default RouteGuard;
