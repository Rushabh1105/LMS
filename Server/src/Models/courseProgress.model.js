const mongoose = require('mongoose');

const lecturesProgressSchema = new mongoose.Schema({
    lectureId: {
        type: String,
        unique: true,
    },
    viewed: Boolean,
    viewedDate: Date,
});


const courseProgressSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
    },
    completionDate: Date,
    lecturesProgress: [lecturesProgressSchema],

});

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema);
module.exports = CourseProgress;