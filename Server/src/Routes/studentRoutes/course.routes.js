const express = require('express');
const { getAllStudentCourses, getStudentCourseDetails, checkCourseEnrollment } = require('../../Controllers/student.controller');

const studentCourseRouter = express.Router();

studentCourseRouter.get('/get', getAllStudentCourses);
studentCourseRouter.get('/get/details/:id', getStudentCourseDetails);
studentCourseRouter.get('/get/purchase-info/:id', checkCourseEnrollment);
module.exports = studentCourseRouter;