const express = require('express');
const { getStudentCurrentCourseProgress, updateCurrentLectureAsViewedStatus, resetStudentCurrentCourseProgress } = require('../../Controllers/courseProgress.controller');

const courseProgressRouter = express.Router();

courseProgressRouter.get('/get/:courseId', getStudentCurrentCourseProgress);
courseProgressRouter.post('/mark-lecture-viewed', updateCurrentLectureAsViewedStatus);
courseProgressRouter.put('/reset-course-progress', resetStudentCurrentCourseProgress);

module.exports = courseProgressRouter;