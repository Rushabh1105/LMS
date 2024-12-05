const CourseModel = require('../Models/course.model');

const addNewCourseToDatabase = async(courseData) => {
    try {
        // Apply data validations
        const response = new CourseModel(courseData);
        return await response.save();
    } catch (error) {
        throw {error}
    }
}


const getAllCoursesByUser = async(userId) => {
    try {
        console.log(userId);
        const response = await CourseModel.find({instructorId: userId});
        return response;
    } catch (error) {
        throw {error}
    }
}


const getCourseById = async(courseId) => {
    try {
        const response = await CourseModel.findById(courseId);
        if(response){
            return response;
        }else{
            return 'Not found';
        }
    } catch (error) {
        throw {error}
    }
}


const updateCourseById = async(courseId, updatedData) => {
    try {
        const course = await getCourseById(courseId);
        if(course === 'Not found'){
            return new Error('Course not found')
        }

        const response = await CourseModel.findByIdAndUpdate(courseId, updatedData, {new: true});
        return response;
    } catch (error) {
        throw {error}
    }
}

// ###### Add student to course functionality
module.exports = {
    addNewCourseToDatabase,
    getAllCoursesByUser,
    getCourseById,
    updateCourseById
}