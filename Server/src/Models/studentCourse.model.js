const mongoose = require('mongoose');

const studentCoursesSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    courses: [
        {
            courseId: {
                type: String,
                required: true,
            },
            title: String,
            instructorId: String,
            instructorName: String,
            dateOfPurchase: Date,
            courseImage: String,
        }
    ]
})

const StudentCourses = mongoose.model('StudentCourses', studentCoursesSchema);
module.exports = StudentCourses;