const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    title: String,
    videoUrl: String,
    public_id: String,
    freePreview: Boolean,
})

const courseSchmea = new mongoose.Schema({
    instructorId: {
        type: String,
        required: true,
    },
    instructorName: {
        type: String,
    },
    date: {
        type: Date,
    },
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    level: String,
    primaryLanguage: String,
    subtitle: String,
    description: String,
    image: String,
    welcomeMessage: String,
    pricing : Number,
    objectives: String,
    students: [
        {
            studentId: String,
            studentName: String,
            studentEmail: String,
            paidAmount: String,
        }
    ],
    curriculum: [
        lectureSchema
    ],
    isPublished: Boolean
});

const CourseModel = mongoose.model('Course', courseSchmea);
module.exports = CourseModel;