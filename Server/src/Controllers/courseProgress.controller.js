const { getCurrentCourseProgress, checkStudentEnrolledInCourse, markCurrentLectureAsViewed, resetCurrentCourseProgress } = require("../Servieces/courseProgress.service");


const getStudentCurrentCourseProgress = async(req, res, next) => {
    try {
        const studentId = req.user._id;
        const {courseId} = req.params;
        
        const checkEnrollment = await checkStudentEnrolledInCourse(studentId, courseId);
        
        if(!checkEnrollment){
            next(new Error('Student is not enrolled'));
        }else{
            const {data, message, progress, courseProgress} = await getCurrentCourseProgress(studentId, courseId);

            return res.status(200).json({
                success: true,
                message: message,
                data: data,
                isEnrolled: checkEnrollment,
                progress: progress,
                courseProgress: courseProgress,
                error: null,
            });
        }
    } catch (error) {
        next(error);
    }
}

const updateCurrentLectureAsViewedStatus = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const {lectureId, courseId} = req.body;
        const response = await markCurrentLectureAsViewed(userId, courseId, lectureId);
        return res.status(200).json({
            success: true,
            message: 'Updated the lecture status',
            data: response,
            error: null
        })
    } catch (error) {
        next(error)
    }
}

const resetStudentCurrentCourseProgress = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const {courseId} = req.body;
        const response = await resetCurrentCourseProgress(userId, courseId);
        return res.status(200).json({
            success: true,
            message: 'Updated the course status',
            data: response,
            error: null
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getStudentCurrentCourseProgress,
    updateCurrentLectureAsViewedStatus,
    resetStudentCurrentCourseProgress,
}