import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VideoPlayer from '@/components/videoPlayer';
import { StudentContext } from '@/context/studentContext';
import { getStudentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from '@/services';
import { Check, ChevronLeft, ChevronRight, Flower2, LockIcon, Play } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import Confetti from 'react-confetti';
import { useNavigate, useParams } from 'react-router-dom'

function StudentViewCourseProgressPage() {
    const [lockCourse, setLockCourse] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);

    const navigate = useNavigate();

    const {currentStudentCourseProgress, setCurrentStudentCourseProgress,
        studentCurrentCourseId, setStudentCurrentCourseId,
    } = useContext(StudentContext);
    const {courseId} = useParams();

    async function fetchCurrrentCourseProgress() {
        setLockCourse(true)
        const response = await getStudentCourseProgressService(studentCurrentCourseId);
        // console.log(response);
        if(response?.success){
            if(!response?.isEnrolled){
                setLockCourse(true);
            }else{
                setLockCourse(false);
                setCurrentStudentCourseProgress({
                    courseDetails: response?.data,
                    progress: response?.progress
                });
                if(response?.courseProgress?.completed){
                    setCurrentLecture(response?.data?.curriculum[0]);
                    setShowCourseCompleteDialog(true);
                    setShowConfetti(true);
                    return;
                }
                if(response?.progress?.length === 0){
                    setCurrentLecture(response?.data?.curriculum[0]);
                }else{
                    // setCurrentLecture(response?.progress?.slice(-1));
                    const lastLectureViewedIndex = response?.progress.reduceRight((acc, curr, index) => {
                        return acc === -1 && curr.viewed === true ? index : acc
                    }, -1);
                    setCurrentLecture(response?.data?.curriculum[lastLectureViewedIndex + 1]); 
                }
            }
        } 
    }

    async function updateCourseProgress() {
        if(currentLecture){
            const responese = await markLectureAsViewedService(studentCurrentCourseId, currentLecture._id);

            if(responese?.success){
                await fetchCurrrentCourseProgress()
            }
        }
    }

    async function handleRewatchCourse() {
        const response = await resetCourseProgressService(studentCurrentCourseId);
        if(response?.success){
            setCurrentLecture(null);
            setShowConfetti(false);
            setShowCourseCompleteDialog(false);
            fetchCurrrentCourseProgress();
        }
    }

    useEffect(() => {
        if(courseId){
            setStudentCurrentCourseId(courseId);
        }
    }, [courseId]);

    useEffect(() => {
        if(studentCurrentCourseId !== null){
            fetchCurrrentCourseProgress();
        }
    }, [studentCurrentCourseId]);

    useEffect(() => {
        if(currentLecture?.progressValue === 1){
            updateCourseProgress()
        }
    }, [currentLecture]);

    // console.log(currentLecture);
    
    return (
        <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
            {
                showConfetti && <Confetti />
            }
            <div className='flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700'>
                <div className="flex items-center space-x-4 z-1">
                    <Button className="text-black" variant="ghost" size="sm" onClick={() => navigate('/student-courses')}>
                        <ChevronLeft className='h-4 w-4 mr-2'/>
                        Back To My Courses Page
                    </Button>
                    <h1 className="text-lg font-bold hidden md:block">
                        {currentStudentCourseProgress?.courseDetails?.title}
                    </h1>
                </div>
                <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
                    {
                        isSideBarOpen ? 
                        <ChevronRight className='h-5 w-5'/> : 
                        <ChevronLeft className='h-5 w-5'/>
                    }
                </Button>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className={`flex-1 ${isSideBarOpen ? 'mr-[400px]': ''} transition-all duration-300`}>
                    <VideoPlayer 
                        width="100%"
                        height='500px'
                        url={currentLecture?.videoUrl}
                        onProgressUpdate={setCurrentLecture}
                        progressData={currentLecture}
                    />
                    <div className="p-6 bg-[#1c1d1f]">
                        <h2 className="text-2xl font-bold mb-2">
                            {currentLecture?.title}
                        </h2>
                        
                    </div>
                </div>
                <div className={`fixed top-[70px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${isSideBarOpen ? 'translate-x-0': 'translate-x-full'}`}>
                    <Tabs defaultValue='content' className='h-full flex flex-col'>
                        <TabsList className="grid w-full grid-cols-2 p-0 h-14 bg-[#1c1d1f]">
                            <TabsTrigger value="content" className="text-black rounded-none h-full">
                                Course Content
                            </TabsTrigger>
                            <TabsTrigger value="overview" className="text-black rounded-none h-full">
                                Overview
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="content">
                            <ScrollArea className="h-full ">
                                <div className="p-4 space-y-4">
                                    {
                                        currentStudentCourseProgress?.courseDetails?.curriculum.map((curr) => (
                                            <div className='flex items-center space-x-2 text-sm text-white font-bold cursor-pointer' key={curr._id}>
                                                {
                                                    currentStudentCourseProgress?.progress.find(lecture => lecture.lectureId === curr._id)?.viewed ?
                                                    <Check className='h-4 w-4 text-green-500' /> :
                                                    <Play className='h-4 w-4'/>
                                                }
                                                <span>{curr.title}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent className="flex-1 overflow-hidden" value="overview">
                            <ScrollArea className="h-full">
                                <div className="p-4 space-y-4">
                                    <h2 className="text-xl font-bold mb-4">About this course</h2>
                                    <p className="text-gray-400">
                                        {currentStudentCourseProgress?.courseDetails?.description}
                                    </p>
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Dialog open={lockCourse}>
                <DialogContent className='sm:w-[420px] '>
                    <DialogHeader>
                        <DialogTitle>
                            <LockIcon />
                            You Cant View This Page
                        </DialogTitle>
                        <DialogDescription>
                            Please Purchase this course to get access
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={showCourseCompleteDialog}>
                <DialogContent className='sm:w-[420px] '>
                    <DialogHeader>
                        <DialogTitle>
                            <Flower2 />
                            Congratulations!!!!
                        </DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You have compleed this course...</Label>
                            <div className="flex flex-row gap-3">
                                <Button onClick={() => navigate('/student-courses')}>My Courses Page</Button>
                                <Button onClick={handleRewatchCourse}>Rewatch this course</Button>    
                            </div>   
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentViewCourseProgressPage

// student-courses/progress