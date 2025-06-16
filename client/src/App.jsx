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

function App() {
  const { auth } = useContext(AuthContext);
  return (
    <Routes>
      <Route path='/auth' element={<RouteGuard element={<AuthPage />} authenticated={auth?.authenticate} user={auth?.user} />} />

      <Route path='/instructor' element={<RouteGuard element={<InstructorPage/>} authenticated={auth?.authenticate} user={auth?.user} />} />

      <Route path='/'
        element={
          <RouteGuard
            element={<StudentCommonLayout />}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path='' element={<StudentHomePage />} />
        <Route path='home' element={<StudentHomePage/>} />
        <Route path = '*' element = {<NotFoundPage/>} />
    
      </Route>
    </Routes>
  )
}

export default App