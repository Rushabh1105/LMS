const express = require('express');
const { addNewCourse, getAllCourses, updateCourse, getCourse } = require('../../Controllers/instructor.controller');

const instructorRouter = express.Router();

instructorRouter.post('/add', addNewCourse);
instructorRouter.put('/update/:id', updateCourse);
instructorRouter.get('/get/details/:id', getCourse);
instructorRouter.get('/get', getAllCourses);
module.exports = instructorRouter;