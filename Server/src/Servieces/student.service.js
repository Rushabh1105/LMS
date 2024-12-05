const StudentCourses = require('../Models/studentCourse.model');
const CourseModel = require('../Models/course.model');

const getAllCoursesForStudent = async(category, level, primaryLanguage, sortBy) => {
    try {

        let filters = {};
        if(category.length){
            filters.category = {$in: category.split(',')};
        }
        if(level.length){
            filters.level = {$in: level.split(',')};
        }
        if(primaryLanguage.length){
            filters.primaryLanguage = {$in: primaryLanguage.split(',')};
        }

        let sortParam = {};
        switch(sortBy){
            case 'price-lowtohigh':
                sortParam.pricing = 1;
                break;
            case 'price-hightolow':
                sortParam.pricing = -1;
                break;
            case 'title-atoz':
                sortParam.title = 1;
                break;
            case 'title-ztoa':
                sortParam.title = -1;
                break;
            default:
                sortParam.pricing = 1;
                break;
        }

        const courseList = await CourseModel.find(filters).sort(sortParam);
       
        return courseList;
    } catch (error) {
        throw {error}
    }
}

const getCourseDetails = async(id, user) => {
    try {
        const courseList = await CourseModel.findById({_id: id});
        if(!courseList){
            throw new Error('Courses not found')
        }
        
        return courseList;
    } catch (error) {
        throw {error};
    }
}


const checkCourseEnrollmentOfStudent = async(user, courseId) => {
    try {
        const studentEnrolledCourse = await StudentCourses.findOne({userId: user._id});
        const ifStudentEnrolledInCourse = studentEnrolledCourse.courses.findIndex(item => item.courseId === courseId) > -1;

        return ifStudentEnrolledInCourse;
    } catch (error) {
        throw {error}
    }
}

module.exports = {
    getAllCoursesForStudent,
    getCourseDetails,
    checkCourseEnrollmentOfStudent,
}

// "price-lowtohigh", label: "Price: Low to High" },
//   { id: "price-hightolow", label: "Price: High to Low" },
//   { id: "title-atoz", label: "Title: A to Z" },
//   { id: "title-ztoa",