const express = require('express');
const { getAllStudentEnrolledCourses } = require('../../Controllers/studentCourses.controller');
const studentCoursesRouter = express.Router();

studentCoursesRouter.get('/get/:studentId', getAllStudentEnrolledCourses)


module.exports = studentCoursesRouter;