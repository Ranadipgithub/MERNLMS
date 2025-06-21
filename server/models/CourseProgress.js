const mongoose = require('mongoose');

const LectureProgressSchema = new mongoose.Schema({
    lectureId: String,
    viewed: Boolean,
    dateViewed: {
        type: Date,
        default: Date.now
    }
});

const CourseProgressSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    
    completed: {
        type: Boolean,
        default: false
    },
    completionDate: Date,
    lectureProgress: [LectureProgressSchema],
});

module.exports = mongoose.model('Progress', CourseProgressSchema);