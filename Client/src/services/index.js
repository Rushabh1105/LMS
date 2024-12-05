import axiosInstance from "@/api/axiosInstance";



export async function registerService(formData){
    const {data} = await axiosInstance.post('/auth/register', {
        ...formData,
        role: 'user',
    });
    return data;
}


export async function loginService(formData) {
    const {data} = await axiosInstance.post('/auth/login', formData);

    return data;
}


export async function checkAuthService(){
    const {data} = await axiosInstance.get('/auth/check-auth');

    return data;
}

export async function mediaUploadService(formData, onProgressCallback){
    const {data} = await axiosInstance.post('/media/upload', formData, {
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgressCallback(percentCompleted);
        }
    });
    return data;
}


export async function mediaDeleteService(id) {
    const {data} = await axiosInstance.delete(`/media/delete/${id}`);
    return data;
}

export async function fetchInstructorCoursesService(){
    const {data} = await axiosInstance.get('/instructor/course/get');

    return data;
}


export async function addNewCourseByInstructorService(courseData) {
    const {data} = await axiosInstance.post('/instructor/course/add', courseData);

    return data;
}

export async function fetchInstructorSingleCourseService(id) {
    const {data} = await axiosInstance.get(`/instructor/course/get/details/${id}`);

    return data;
}

export async function updateInstructorCouseService(id, courseData) {
    const {data} = await axiosInstance.put(`/instructor/course/update/${id}`, courseData);

    return data;
}


export async function mediaBulkUploadService(formData, onProgressCallback){
    const {data} = await axiosInstance.post('/media/bulk-upload', formData, {
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgressCallback(percentCompleted);
        }
    });
    return data;
}

export async function fetchStudentViewCourseListService(query) {
    const {data} = await axiosInstance.get(`/student/course/get?${query}`);

    return data;
}

export async function fetchStudentSingleCourseService(id) {
    const {data} = await axiosInstance.get(`/student/course/get/details/${id}`);

    return data;
}

export async function createPaymentService(formData) {
    const {data} = await axiosInstance.post('/student/order/create', formData)

    return data;
}

export async function captureFinalizePaymentService(paymentId, payerId, orderId) {
    const {data} = await axiosInstance.post('/student/order/finalize', {paymentId, payerId, orderId});
    
    return data;
}

export async function fetchStudentEnrolledCoursesService(studentId) {
    const {data} = await axiosInstance.get(`/student/enrolled-courses/get/${studentId}`);
    return data;
}

export async function checkStudentCourseEnrollmentService(courseId){
    const {data} = await axiosInstance.get(`/student/course/get/purchase-info/${courseId}`);

    return data;
}

export async function getStudentCourseProgressService(courseId){
    const {data} = await axiosInstance.get(`/student/course-progress/get/${courseId}`);

    return data;
}


export async function markLectureAsViewedService(courseId, lectureId){
    const {data} = await axiosInstance.post(`/student/course-progress/mark-lecture-viewed/`, {courseId, lectureId});

    return data;
}

export async function resetCourseProgressService(courseId){
    const {data} = await axiosInstance.put(`/student/course-progress/reset-course-progress`, {courseId});

    return data;
}