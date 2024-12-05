const { addNewCourseToDatabase, getAllCoursesByUser, getCourseById, updateCourseById } = require("../Servieces/instructor.service");


const addNewCourse = async(req, res, next) => {
    try {
        const response = await addNewCourseToDatabase(req.body);
        return res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: response,
            error: null,
        })        
    } catch (error) {
        next(error);
    }
}

const getAllCourses = async(req, res, next) => {
    try {
        const response = await getAllCoursesByUser(req.user._id);
        return res.status(200).json({
            success: true, 
            message: 'Get courses by instructor',
            data: response,
            error: null
        })
        
    } catch (error) {
        next(error)
    }
}

const getCourse = async(req, res, next) => {
    try {
        const id = req.params.id;
        if(!id){
            return res.status(400).json({
                success: false,
                message: 'Assets id is missing',
                data: null,
                error: null
            });
        }

        const response = await getCourseById(id);

        if(response === 'Not found'){
            return res.status(404).json({
                success: false,
                message: 'Resource not found',
                data: null,
                error: null
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Fetched the course',
            data: response,
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

const updateCourse = async(req, res, next) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        const response = await updateCourseById(id, updateData);

        return res.status(200).json({
            success: true,
            message: 'updated the course',
            data: response,
            error: null,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addNewCourse,
    getAllCourses,
    getCourse,
    updateCourse,
}