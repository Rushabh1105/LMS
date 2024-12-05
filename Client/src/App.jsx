import {Route, Routes} from 'react-router-dom';
import AuthPage from './pages/auth';
import RouteGuard from './components/routeGuard';
import { useContext } from 'react';
import { AuthContext } from './context/authContext';
import InstructorDashboardPage from './pages/instructor';
import StudentViewCommonLayout from './components/studentView/commonLayout';
import StudentHomePage from './pages/student/home';
import NotFoundPage from './pages/notFound';
import AddNewCoursePage from './pages/instructor/addNewCourse';
import StudentViewCoursesPage from './pages/student/courses';
import StudentViewCourseDetails from './pages/student/courseDetails';
import PaypalPaymentReturnPage from './pages/student/paymentReturn';
import StudentCoursesPage from './pages/student/studentCourses';
import StudentViewCourseProgressPage from './pages/student/courseProgress';

function App() {
    const {auth} = useContext(AuthContext);

    return (
      <Routes>
        <Route 
          path='/auth' 
          element={<RouteGuard element={<AuthPage />} authenticated={auth?.authenticate} user={auth?.user} />}
        />

        <Route 
          path='/instructor'
          element={<RouteGuard element={<InstructorDashboardPage />} authenticated={auth?.authenticate} user={auth?.user}/>}
        />

        <Route 
          path='/instructor/new-course'
          element={<RouteGuard element={<AddNewCoursePage />} authenticated={auth?.authenticate} user={auth?.user}/>}
        />

        <Route 
          path='/'
          element={<RouteGuard element={<StudentViewCommonLayout />} authenticated={auth?.authenticate} user={auth?.user}/>}
        >
          <Route path='/home' element={<StudentHomePage />} />
          <Route path='/courses' element={<StudentViewCoursesPage />} />
          <Route path='/course/details/:id' element={<StudentViewCourseDetails />} />
          <Route path='/payment-return' element={<PaypalPaymentReturnPage />} />
          <Route path='/student-courses' element={<StudentCoursesPage />}  />
          <Route path='/student-courses/progress/:courseId' element={<StudentViewCourseProgressPage />} />
        </Route>

        <Route 
          path='/instructor/edit-course/:id'
          element={<RouteGuard element={<AddNewCoursePage />} authenticated={auth?.authenticate} user={auth?.user}/>}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    )
}

export default App
