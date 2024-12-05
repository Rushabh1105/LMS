const { getAllCoursesForStudent, getCourseDetails, checkCourseEnrollmentOfStudent } = require("../Servieces/student.service");



const getAllStudentCourses = async(req, res, next) => {
    try {
        const {category=[], level=[], primaryLanguage=[], sortBy="price-lowtohigh"} = req.query;
        // const user = req.user;
        const response = await getAllCoursesForStudent(category, level, primaryLanguage, sortBy);

        return res.status(200).json({
            success: true,
            message: "courses Fetched",
            data: response,
            error: null
        })

    } catch (error) {
        next(error);
    }
} 

const getStudentCourseDetails = async(req, res, next) => {
    try {
        const {id} = req.params;
        const user = req.user;
        const response = await getCourseDetails(id, user);

        return res.status(200).json({
            success: true,
            message: "Required course Fetched",
            data: response,
            error: null
        })
    } catch (error) {
        next(error);
    }
}


const checkCourseEnrollment = async(req, res, next) => {
    try {
        const user = req.user;
        const {id} = req.params;
        const response = await checkCourseEnrollmentOfStudent(user, id);

        return res.status(200).json({
            success: true,
            message: `Student ${response ? '': 'not'} purchased the course `,
            data: response,
            error: null
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    getAllStudentCourses,
    getStudentCourseDetails,
    checkCourseEnrollment,
}