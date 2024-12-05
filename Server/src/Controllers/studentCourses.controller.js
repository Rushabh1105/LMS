const { fetchStudentCourseByStudentId } = require("../Servieces/studentCourses.service");


const getAllStudentEnrolledCourses = async(req, res, next) => {
    try {
        const {studentId} = req.params;
        const response = await fetchStudentCourseByStudentId(studentId);
        return res.status(200).json({
            success: true,
            message: 'Fetched all student courses',
            data: response,
            error: null
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllStudentEnrolledCourses,

}