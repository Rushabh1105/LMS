import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AuthContext } from '@/context/authContext';
import { StudentContext } from '@/context/studentContext'
import { fetchStudentEnrolledCoursesService } from '@/services';
import { Book } from 'lucide-react';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function StudentCoursesPage() {
  const {studentEnrolledCourses, setStudentEnrolledCourses} = useContext(StudentContext);
  const {auth} = useContext(AuthContext);
  const navigate = useNavigate();

  async function fetchStudentEnrolledCourses() {
    const response = await fetchStudentEnrolledCoursesService(auth?.user?._id);
    // console.log(response)
    if(response?.success){
      setStudentEnrolledCourses(response?.data);
    }
  }
  useEffect(() => {
    fetchStudentEnrolledCourses();
  }, []);

    return (
      <div className='p-4'>
        <h1 className="text-3xl font-bold mb-8">My Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {
            studentEnrolledCourses && studentEnrolledCourses.length > 0 ?
              studentEnrolledCourses.map((course, index) => (
                <Card key={course.courseId} className="flex flex-col">
                  <CardContent className="p-4 flex-grow" >
                    <img 
                      src={course?.courseImage}
                      alt={course?.title}
                      className="h-52 w-full object-cover rounded-md mb-4"
                    />
                    <h3 className="font-bold mb-1">{course?.title}</h3>
                    <p className="text-sm text-grey-700 mb-2">{course?.instructorName}</p>
                  </CardContent>
                  <CardFooter >
                    <Button 
                      className="flex-1" 
                      onClick={() => navigate(`/student-courses/progress/${course?.courseId}`)}
                    >
                      <Book className="mr-2 h-4 w-4" />
                      Start Learning
                    </Button>
                  </CardFooter>
                </Card>
              )) :
              <h1 className="text-5xl font-bold">No Courses Enrolled</h1>
          }
        </div>
      </div>
    )
}

export default StudentCoursesPage