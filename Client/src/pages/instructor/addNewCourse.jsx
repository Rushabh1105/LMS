import CourseCurriculum from '@/components/instructorView/courses/addNewCourse/CourseCurriculum'
import CourseLanding from '@/components/instructorView/courses/addNewCourse/courseLanding'
import CourseSettings from '@/components/instructorView/courses/addNewCourse/courseSettings'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from '@/config'
import { AuthContext } from '@/context/authContext'
import { InstructorContext } from '@/context/instructorContext'
import { addNewCourseByInstructorService, fetchInstructorSingleCourseService, updateInstructorCouseService } from '@/services'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function AddNewCoursePage() {
    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();
    // console.log(params);
    
    const {
        courseLandingFormData, 
        courseCurriculumFormData,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        currentEditedCourseId, 
        setCurrentEditedCourseId
    } = useContext(InstructorContext);

    function isEmpty(value){
        if(Array.isArray(value)){
            return value.length === 0
        }
        return value === "" || value === null || value == undefined;
    }

    function validateFormData(){
        for(const key in courseLandingFormData){
            if(isEmpty(courseLandingFormData[key])){
                return false;
            }
        }

        let hasFreePreview = false;
        for(const item of courseCurriculumFormData){
            if(isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)){
                return false;
            }
            if(item.freePreview){
                hasFreePreview = true;
            }
        }
        
        return hasFreePreview;
    }

    async function handleCreateCourse(){
        try {
            const courseData = {
                instructorId: auth?.user?._id,
                instructorName: auth?.user?.userName,
                date: new Date(),
                ...courseLandingFormData,
                students: [],
                curriculum: courseCurriculumFormData,
                isPublished: true
            }

            let response;
            if(currentEditedCourseId !== null){
                response = await updateInstructorCouseService(currentEditedCourseId, courseData);
            }else{
                response = await addNewCourseByInstructorService(courseData);
            }

            if(response?.success){
                setCourseLandingFormData(courseLandingInitialFormData);
                setCourseCurriculumFormData(courseCurriculumInitialFormData);
                navigate(-1);
                setCurrentEditedCourseId(null);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(params?.id){
            setCurrentEditedCourseId(params?.id);
        }
    }, [params?.id]);

    async function fetchCurrentCourseDetails(id) {
        const responese = await fetchInstructorSingleCourseService(id);
        // console.log(responese);

        if(responese?.success){
            const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
                acc[key] = responese?.data[key] || courseLandingInitialFormData[key]
                return acc
            }, {});
            // console.log(setCourseFormData);
            setCourseLandingFormData(setCourseFormData);
            setCourseCurriculumFormData(responese?.data?.curriculum);
        }
    }

    useEffect(() => {
        // console.log(currentEditedCourseId);
        if(currentEditedCourseId !== null){
            fetchCurrentCourseDetails(currentEditedCourseId);
        }
        
    }, [currentEditedCourseId])

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold mb-5">Create New Course</h1>
                <Button 
                    className="text-sm tracking-wider font-bold px-8"
                    disabled={!validateFormData()}
                    onClick={handleCreateCourse}
                >
                    SUBMIT
                </Button>
            </div>
            <Card>
                <CardContent>
                    <div className="container mx-auto p-4">
                        <Tabs defaultValue="curriculum" className="space-y-4">
                            <TabsList >
                                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                                <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>
                            <TabsContent value="curriculum">
                                <CourseCurriculum />
                            </TabsContent>
                            <TabsContent value="course-landing-page">
                                <CourseLanding />
                            </TabsContent>
                            <TabsContent value="settings">
                                <CourseSettings />
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddNewCoursePage