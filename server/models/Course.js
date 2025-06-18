const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
    title: String,
    videoUrl: String,
    freePreview: { type: Boolean, default: false },
    public_id: String
})

const CourseSchema = new mongoose.Schema({
    instructorId: String,
    instructorName: String,
    date: Date,
    title: String,
    category: String,
    level: String,
    primaryLanguage: String,
    subtitle: String,
    description: String,
    welcomeMessage: String,
    image: String,
    // isPublished: { type: Boolean, default: false },
    // isFree: { type: Boolean, default: true },
    pricing: Number,
    objectives: String,
    students: [
        {
            studentId: String,
            studentName: String,
            studentEmail: String
        }
    ],
    curriculum: [LectureSchema],
    isPublished: { type: Boolean, default: false },
});

module.exports = mongoose.model("Course", CourseSchema);