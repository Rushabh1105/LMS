

import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import StudentViewHeader from './header'

function StudentViewCommonLayout() {
  const location = useLocation();

  return (
    <div>
        {
          !location.pathname.includes('student-courses/progress')?
          <StudentViewHeader /> : 
          null
        }
        
        <Outlet />
    </div>
  )
}

export default StudentViewCommonLayout