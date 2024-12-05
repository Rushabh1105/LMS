
const StudentCourses = require('../Models/studentCourse.model');

const fetchStudentCourseByStudentId = async(id) => {
    try {
        const studentEnrolledCourse = await StudentCourses.findOne({userId: id});
        if(!studentEnrolledCourse){
            throw new Error("No Courses Found");
        }
        return studentEnrolledCourse.courses;
    } catch (error) {
        throw {error};
    }
}

module.exports = {
    fetchStudentCourseByStudentId,

}