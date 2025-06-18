import { Route, Routes } from 'react-router-dom'
import './App.css'
import AuthPage from './pages/auth'
import RouteGuard from './components/route-guard'
import { useContext } from 'react'
import { AuthContext } from './context/auth-context'
import InstructorPage from './pages/instructor'
import StudentCommonLayout from './components/student-view/commonLayout'
import StudentHomePage from './pages/student/home'
import NotFoundPage from './pages/not-found'
import VerifyEmailPage from './pages/verify-email'
import AddNewCoursePage from './pages/instructor/add-new-course'

function App() {
  const { auth } = useContext(AuthContext);
  return (
    <Routes>
      {/* Verify Email route */}
      <Route
        path="/auth/verify-email"
        element={
          <RouteGuard
            element={<VerifyEmailPage />}
            authenticated={auth.authenticate}
            user={auth.user}
          />
        }
      />

      {/* Auth (login/register) */}
      <Route
        path="/auth/*"
        element={
          <RouteGuard
            element={<AuthPage />}
            authenticated={auth.authenticate}
            user={auth.user}
          />
        }
      />

      {/* Instructor */}
      <Route
        path="/instructor"
        element={
          <RouteGuard
            element={<InstructorPage />}
            authenticated={auth.authenticate}
            user={auth.user}
          />
        }
      />
      <Route
        path="/instructor/create-new-course"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth.authenticate}
            user={auth.user}
          />
        }
      />
      <Route
        path="/instructor/edit-course/:courseId"
        element={
          <RouteGuard
            element={<AddNewCoursePage />}
            authenticated={auth.authenticate}
            user={auth.user}
          />
        }
      />

      {/* Student */}
      <Route
        path="/*"
        element={
          <RouteGuard
            element={<StudentCommonLayout />}
            authenticated={auth.authenticate}
            user={auth.user}
          />
        }
      >
        <Route index element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App