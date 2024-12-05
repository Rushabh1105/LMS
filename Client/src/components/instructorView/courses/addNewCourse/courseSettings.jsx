import MediaProgressBar from '@/components/mediaProgressBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { InstructorContext } from '@/context/instructorContext'
import { mediaUploadService } from '@/services'
import React, { useContext } from 'react'

function CourseSettings() {
  const {
    courseLandingFormData, 
    setCourseLandingFormData,
    mediaUploadProgress, 
    setMediaUploadProgress,
    mediaUploadProgressPercentage, 
    setMediaUploadProgressPercentage
  } = useContext(InstructorContext);

  async function handleImageUploadChange(e){
    const selectedImage = e.target.files[0];
    if(selectedImage){
      const imageFormData = new FormData();
      imageFormData.append('file', selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage);
        // console.log(response);  

        if(response.success){
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response?.data?.url
          });
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Course Settings
        </CardTitle>
      </CardHeader>
      <div className='p-4'>
        {
          mediaUploadProgress ? 
          <MediaProgressBar isMediaUploading={mediaUploadProgress}  progress={mediaUploadProgressPercentage}/>:
          null
        }
      </div>
      <CardContent>
        {
          courseLandingFormData?.image ? 
          <img src={courseLandingFormData.image} /> :
          <div className="flex flex-col gap-3">
            <Label>
              Upload Course Image
            </Label>
            <Input 
              type="file"
              accept="image/*"
              className="mb-4"
              onChange={(e) => handleImageUploadChange(e)}
            />
          </div>
        }
        
      </CardContent>
    </Card>
  )
}

export default CourseSettings