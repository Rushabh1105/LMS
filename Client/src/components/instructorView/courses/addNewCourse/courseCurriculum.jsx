import MediaProgressBar from '@/components/mediaProgressBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import VideoPlayer from '@/components/videoPlayer';
import { courseCurriculumInitialFormData } from '@/config';
import { InstructorContext } from '@/context/instructorContext'
import { mediaBulkUploadService, mediaDeleteService, mediaUploadService } from '@/services';
import { Upload } from 'lucide-react';

import React, { useContext, useRef } from 'react'

function CourseCurriculum() {
  const {
    courseCurriculumFormData, 
    setCourseCurriculumFormData, 
    mediaUploadProgress, 
    setMediaUploadProgress,
    mediaUploadProgressPercentage, 
    setMediaUploadProgressPercentage
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture(){
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0]
      }
    ])
  }

  function handleCourseTitleChange(e, currentIndex){
    let copyCourseCurriculumFormData = [...courseCurriculumFormData];
    copyCourseCurriculumFormData[currentIndex] = {
      ...copyCourseCurriculumFormData[currentIndex],
      title: e.target.value,
    }

    setCourseCurriculumFormData(copyCourseCurriculumFormData);
  }

  function handleFreePreview(currentValue, currentIndex){
    let copyCourseCurriculumFormData = [...courseCurriculumFormData];
    copyCourseCurriculumFormData[currentIndex] = {
      ...copyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    }

    setCourseCurriculumFormData(copyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(e, currentIndex){
    const selectedFile = e.target.files[0];
    if(selectedFile){
      const videoFormData = new FormData();
      videoFormData.append('file', selectedFile);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(videoFormData, setMediaUploadProgressPercentage);
        // console.log(mediaUploadProgressPercentage);
        if(response.success){
          let copyCourseCurriculumFormData = [...courseCurriculumFormData];
          copyCourseCurriculumFormData[currentIndex] = {
            ...copyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          }
          setCourseCurriculumFormData(copyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  function isCourseCurriculumFormDataValid(){
    
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }
  
  async function handleReplaceVideo(currentIndex) {
    try {
      let copyCourseCurriculumFormData = [...courseCurriculumFormData];
      const getCurrentVideoPublicId = copyCourseCurriculumFormData[currentIndex].public_id;
      const deleteCurrentMedia = await mediaDeleteService(getCurrentVideoPublicId);
      // console.log(deleteCurrentMedia);
      if(deleteCurrentMedia?.success){
        copyCourseCurriculumFormData[currentIndex] = {
          ...copyCourseCurriculumFormData[currentIndex],
          videoUrl: '',
          public_id: ''
        }
        setCourseCurriculumFormData(copyCourseCurriculumFormData);
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  function handleOpenBulkUploadDialogue(){
    bulkUploadInputRef.current?.click();
  }

  function areAllObjectsCourseCurriculumFormDataEmpty(arr){
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    
    const bulkFormData = new FormData();
    console.log(bulkFormData);

    selectedFiles.forEach((fileItem) => bulkFormData.append('files', fileItem));
    
    try {
      setMediaUploadProgress(true);

      const response = await mediaBulkUploadService(bulkFormData, setMediaUploadProgressPercentage);
      // console.log(response);

      if(response?.success){
        let copyCourseCurriculumFormData = areAllObjectsCourseCurriculumFormDataEmpty(courseCurriculumFormData) ?
          [] : 
          [...courseCurriculumFormData];
        ;

        copyCourseCurriculumFormData = [
          ...copyCourseCurriculumFormData,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${copyCourseCurriculumFormData.length + index +1}`,
            freePreview: false
          }))
        ];

        setCourseCurriculumFormData(copyCourseCurriculumFormData);
        setMediaUploadProgress(false);

      }

    } catch (error) {
      console.log(error);
    }
  }


  async function handleDeleteLecture(currentIndex) {
    let copyCourseCurriculumFormData = [...courseCurriculumFormData];
    const videoLecturePublicId = copyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(videoLecturePublicId);
    
    if(response?.success){
      copyCourseCurriculumFormData = copyCourseCurriculumFormData.filter((data, index) => index !== currentIndex);
      setCourseCurriculumFormData(copyCourseCurriculumFormData);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Course Curriculum</CardTitle>
        <div>
          <Input 
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulkMediaUpload"
            onChange={(e) => handleMediaBulkUpload(e)}
          />
          <Button
            as="label"
            htmlFor="bulkMediaUpload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialogue}
          >
            <Upload className='w-4 h-4 mr-2' />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button  
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture} 
        >
          Add Lecture
        </Button>
        {
          mediaUploadProgress ? 
          <MediaProgressBar isMediaUploading={mediaUploadProgress}  progress={mediaUploadProgressPercentage}/>:
          null
        }
        <div className="mt-4 space-y-4">
          {
            courseCurriculumFormData.map((curriculumItem, index) => (
              <div className="border p-5 rounded-md" key={index}>
                <div className="flex gap-5 items-center">
                  <h3 className="font-semibold">Lecture {index+1}</h3>
                  <Input 
                    name={`title-${index+1}`}
                    placeholder="Enter lecture title"
                    className="max-w-96"
                    onChange={(e) => handleCourseTitleChange(e, index)}
                    value={courseCurriculumFormData[index]?.title}
                  />
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={courseCurriculumFormData[index]?.freePreview}
                      id={`freePreview-${index+1}`}
                      onCheckedChange={(value) => handleFreePreview(value, index)}
                    />
                    <Label htmlFor={`freePreview-${index+1}`}>Free Preview</Label>
                  </div>
                </div>
                <div className="mt-6">
                  {
                    curriculumItem?. videoUrl ? 
                    <div className="flex gap-3">
                      <VideoPlayer url={curriculumItem?.videoUrl} width="450px" height="200px"/>
                      <Button onClick={() => handleReplaceVideo(index)}>Replace Video</Button>
                      <Button className="bg-red-900" onClick={()=> handleDeleteLecture(index)}>Delete Lecture</Button>
                    </div> :
                    <Input 
                    type="file"
                      accept="video/*"
                      className="mb-4"
                      onChange={(e) => handleSingleLectureUpload(e, index)}
                    />
                  }
                  
                </div>
              </div>
            ))
          }
        </div>
      </CardContent>
    </Card>
  )
}

export default CourseCurriculum