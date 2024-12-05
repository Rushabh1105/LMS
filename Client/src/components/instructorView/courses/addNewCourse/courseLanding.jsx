import FormControls from '@/components/commonForm/formControl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { courseLandingPageFormControls } from '@/config'
import { InstructorContext } from '@/context/instructorContext'
import React, { useContext } from 'react'

function CourseLanding() {
    const {courseLandingFormData, setCourseLandingFormData} = useContext(InstructorContext);
    // console.log(courseLandingFormData);
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Course Landing Page
                </CardTitle>
            </CardHeader>
            <CardContent>
                <FormControls 
                    formControls={courseLandingPageFormControls}
                    formData={courseLandingFormData}
                    setFormData={setCourseLandingFormData}
                />
            </CardContent>
        </Card>
    )
}

export default CourseLanding