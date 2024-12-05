import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPlayer from '@/components/videoPlayer';
import { AuthContext } from '@/context/authContext';
import { StudentContext } from '@/context/studentContext'
import { checkStudentCourseEnrollmentService, createPaymentService, fetchStudentSingleCourseService } from '@/services';
import { CheckCircle, CopyIcon, Globe, Lock, PlayCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';


function StudentViewCourseDetails() {
    const {auth} = useContext(AuthContext);
    const {
        studentViewCourseDetails, 
        setStudentViewCourseDetails, 
        currentCourseDetailsId, 
        setCurrentCourseDetailsId,
        loadingState, 
        setLoadingState,
    } = useContext(StudentContext);

    const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] = useState(null);
    const [showFreePreviewDialogue, setShowFreePreviewDialogue] = useState(false);
    const [approvalUrl, setApprovalUrl] = useState('');
    const navigate = useNavigate();

    const {id} = useParams();
    // console.log(id);
    const location = useLocation();

    async function fetchStudentCourseDetails() {
        const checkCourseEnrollemntStatus = await checkStudentCourseEnrollmentService(currentCourseDetailsId);
        if(checkCourseEnrollemntStatus?.success && checkCourseEnrollemntStatus?.data){
            navigate(`/student-courses/progress/${currentCourseDetailsId}`);
            return;
        }

        const response = await fetchStudentSingleCourseService(currentCourseDetailsId);
        // console.log(response);
        if(response?.success){
            setStudentViewCourseDetails(response?.data);
            setLoadingState(false)
        }else{
            setStudentViewCourseDetails(null);
            setLoadingState(false)
        }
    }

    function getUrlOfFreePreviewVideo(){
        if(studentViewCourseDetails !== null){
            const freePreviewIndex = studentViewCourseDetails?.curriculum?.findIndex(item => item.freePreview);
            return studentViewCourseDetails?.curriculum[freePreviewIndex].videoUrl;
        }
        return null;
    }

    function handleSetFreePreview(curretnVideoInfo){
        setDisplayCurrentVideoFreePreview(curretnVideoInfo?.videoUrl)
    }

    async function handleCreatePayment() {
        
        
        const paymentPayload = {
            userId: auth?.user?._id, 
            userName: auth?.user?.userName, 
            userEmail: auth?.user?.userEmail, 
            OrderStatus: 'pending', 
            paymentMethod: 'paypal', 
            paymentStatus: 'initiated', 
            orderDate: new Date(), 
            paymentId: '', 
            payerId: '',
            instructorId: studentViewCourseDetails?.instructorId, 
            instructorName: studentViewCourseDetails?.instructorName, 
            courseImage: studentViewCourseDetails?.image, 
            courseTitle: studentViewCourseDetails?.title, 
            courseId: studentViewCourseDetails?._id, 
            coursePricing: studentViewCourseDetails?.pricing,
        } 

        // console.log(paymentPayload);
        const response = await createPaymentService(paymentPayload);
        if(response.success){
            console.log(response);
            sessionStorage.setItem('currentOrderId', JSON.stringify(response?.data?.orderId));
            setApprovalUrl(response?.data?.approvalUrl);
        }
    }

    useEffect(() => {
        if(displayCurrentVideoFreePreview !== null){
            setShowFreePreviewDialogue(true);
        }
    }, [displayCurrentVideoFreePreview]);
    
    useEffect(() => {
        if(id){
            setCurrentCourseDetailsId(id)
        }

    }, [id]);

    useEffect(() => {
        if(currentCourseDetailsId !== null){
            fetchStudentCourseDetails();
        }
    }, [currentCourseDetailsId]);

    useEffect(() => {
        if(!location.pathname.includes('course/details')){
            setStudentViewCourseDetails(null);
            setCurrentCourseDetailsId(null);
        }
    }, [location.pathname]);

    if(loadingState){
        return (<Skeleton />);
    }

    if(approvalUrl !== ''){
        window.location.href = approvalUrl;
    }

    return (
        <div className=' mx-auto p-4'>
            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <h1 className="text-3xl font-bold mb-4">{studentViewCourseDetails?.title}</h1>
                <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
                <div className='flex items-center space-x-4 mt-2 text-sm'>
                    <span>Created By : {studentViewCourseDetails?.instructorName}</span>
                    <span>Created On : {studentViewCourseDetails?.date.split('T')[0]}</span>
                    <span className='flex items-center'>
                        <Globe className='mr-1 w-4 h-4'/>
                        {studentViewCourseDetails?.primaryLanguage}
                    </span>
                    <span>{`${studentViewCourseDetails?.students.length} ${studentViewCourseDetails?.students.length > 1 ? 'Students': 'Student'}`}</span>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                What you'll learn
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {
                                    studentViewCourseDetails?.objectives.split(',').map((objective, idx) => (
                                        <li className="flex items-start" key={idx}>
                                            <CheckCircle className='mr-2 h-5 w-5 text-green-500 flex-shrink-0'/>
                                            <span>{objective}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                Course Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {
                                studentViewCourseDetails?.description
                            }
                        </CardContent>
                    </Card>
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                Course Curriculum
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {
                                    studentViewCourseDetails?.curriculum?.map((lecture, idx) => (
                                        <li 
                                            className={`${lecture?.freePreview ? 'cursor-pointer' : 'cursor-not-allowed'} flex items-center mb-4`} 
                                            key={idx}
                                            onClick={lecture?.freePreview ? () => handleSetFreePreview(lecture) : null}
                                        >
                                            {
                                                lecture?.freePreview ?
                                                <PlayCircle className='mr-2 h-4 w-4 '/> :
                                                <Lock className='mr-2 h-4 w-4 '/>
                                            }
                                            <span>{lecture?.title}</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </CardContent>
                    </Card>
                </main>
                <aside className="w-full md:w-[500px]">
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                                {
                                    getUrlOfFreePreviewVideo() !== null ? 
                                    <VideoPlayer url={getUrlOfFreePreviewVideo()} width='450px' height='200px'/> :
                                    null
                                }
                            </div>
                            <div className="mb-4">
                                <span className="text-3xl font-bold">
                                    {`₹: ${studentViewCourseDetails?.pricing}`}
                                </span>
                            </div>
                            <Button 
                                className="w-full"
                                onClick={handleCreatePayment}
                            >
                                Buy Now
                            </Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
            <Dialog open={showFreePreviewDialogue} onOpenChange={() => {
                    setShowFreePreviewDialogue(false);
                    setDisplayCurrentVideoFreePreview(null);
                }}
            >
                <DialogContent className="w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Course Preview</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                        {
                            getUrlOfFreePreviewVideo() !== null ? 
                            <VideoPlayer url={displayCurrentVideoFreePreview} width='450px' height='200px'/> :
                            null
                        }
                    </div>
                    <div className=""></div>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentViewCourseDetails