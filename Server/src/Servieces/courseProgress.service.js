const CourseProgress = require('../Models/courseProgress.model');
const CourseModel = require('../Models/course.model');
const StudentCourses = require('../Models/studentCourse.model'); 
const { getCourseDetails } = require('./student.service');

// Mark current lecture as viewed
// Get current course progress
// reset course progress

const markCurrentLectureAsViewed = async(userId, courseId, lectureId) => {
    try {
        let progress = await CourseProgress.findOne({userId, courseId});
        if(!progress){
            // Add new lecture to progress
            progress = new CourseProgress({
                userId: userId,
                courseId: courseId,
                lecturesProgress: [{
                    lectureId: lectureId,
                    viewed: true,
                    viewedDate: new Date(),
                }],
            });
            await progress.save();
        }else{
            // update lecture
            let lectureProgress = progress.lecturesProgress.find(item => item.lectureId === lectureId);
            if(lectureProgress){
                lectureProgress.viewed = true;
                lectureProgress.viewedDate = new Date();
            }else{
                // Add new lecture in array
                progress.lecturesProgress.push({
                    lectureId: lectureId,
                    viewed: true,
                    viewedDate: new Date(),
                });
            }
            await progress.save();
        }
        // check for completion
        const course = await getCourseDetails(courseId);
        const courseLectures = course.curriculum;
        const progressLectures = progress.lecturesProgress;
        const isComplated = courseLectures.length === progressLectures.length &&
            progressLectures.every((lecture) => lecture.viewed);
        console.log(isComplated);
        
        if(isComplated){
            progress.completed = true,
            progress.completionDate = new Date();
            await progress.save();
        }
        return progress;
    } catch (error) {
        throw {error};
    }
}

const checkStudentEnrolledInCourse = async(studentId, courseId) => {
    try {
        const studentPurchasedCourses = await StudentCourses.findOne({userId: studentId});
        const isCurrentCourseIsPurchasedByStudent = 
            studentPurchasedCourses?.courses?.findIndex(course => course.courseId === courseId) > -1;
        
        return isCurrentCourseIsPurchasedByStudent;
    } catch (error) {
        throw {error};
    }
}

const getCurrentCourseProgress = async(studentId, courseId ) => {
    try {
        const currentStudentCourseProgress = await CourseProgress.findOne({userId: studentId, courseId: courseId});
        try {
            const course = await getCourseDetails(courseId);
            if(!currentStudentCourseProgress || currentStudentCourseProgress.lecturesProgress.length === 0){
                return {
                    data: course, 
                    message: 'Begin to Watch the course', 
                    progress: [], 
                    courseProgress: currentStudentCourseProgress
                };
            }else{
                return {
                    data: course, 
                    message: 'Continue watching your course', 
                    progress: currentStudentCourseProgress.lecturesProgress, 
                    courseProgress: currentStudentCourseProgress
                };
            }
        } catch (error) {
            throw {error};
        }

    } catch (error) {
        throw {error};
    }
}

const resetCurrentCourseProgress = async(userId, courseId) => {
    try {
        let progress = await CourseProgress.findOne({userId, courseId});
        if(!progress){
            throw new Error('Something went wrong');
        }

        progress.lecturesProgress = [];
        progress.completed = false,
        progress.completionDate = null;
        return await progress.save();
    } catch (error) {
        throw {error}
    }
}

module.exports = {
    markCurrentLectureAsViewed,
    getCurrentCourseProgress,
    resetCurrentCourseProgress,
    checkStudentEnrolledInCourse,
}