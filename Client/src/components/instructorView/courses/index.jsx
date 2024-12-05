import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/config'
import { InstructorContext } from '@/context/instructorContext'
import { Delete, Edit } from 'lucide-react'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

function InstructorCourses({listOfCourses}) {
    const navigate = useNavigate()
    const {
        setCurrentEditedCourseId, 
        setCourseLandingFormData,
        setCourseCurriculumFormData,
    } = useContext(InstructorContext);



    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-3xl font-extrabold">
                    All Courses
                </CardTitle>
                <Button className="p-5" onClick={()=> {
                    setCurrentEditedCourseId(null); 
                    navigate('/instructor/new-course');
                    // ###############################################################
                    setCourseCurriculumFormData(courseCurriculumInitialFormData);
                    setCourseLandingFormData(courseLandingInitialFormData);
                }}
                >
                    Create New Course
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">Course</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            listOfCourses && listOfCourses.length > 0 ? 
                            listOfCourses.map((course) => (
                                <TableRow key={course._id}>
                                    <TableCell className="font-medium">{course?.title}</TableCell>
                                    <TableCell>{course?.students.length}</TableCell>
                                    <TableCell>₹ {course?.students.length * course?.pricing}</TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => {navigate(`/instructor/edit-course/${course?._id}`)}}
                                        >
                                            <Edit className="h-6 w-6"/>
                                        </Button>
                                        <Button variant="ghost" size="sm">
                                            <Delete className="h-6 w-6"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) :
                            null
                        }
                        
                    </TableBody>
                </Table>

                </div>
            </CardContent>
        </Card>
    )
}

export default InstructorCourses