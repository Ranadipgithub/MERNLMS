const Course = require("../../models/Course");

const addNewCourse = async(req, res) => {
    try {
        const course = await Course.create(req.body);
        return res.status(200).json({
            success: true,
            message: "Course added successfully",
            data: course,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to add course",
            error: error.message,
        });
    }
}

const getAllCourses = async(req, res) => {
    try {
        const courses = await Course.find({});
        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch courses",
            error: error.message,
        });
    }
}

const getCourseDetailById = async(req, res) => {
    try {
        const {id} = req.params;
        const course = await Course.findById(id);
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Course fetched successfully",
            data: course,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course",
            error: error.message,
        });
    }
}

const updateCourseById = async(req, res) => {
    try {
        const {id} = req.params;
        const updatedCourseData = req.body;
        const course = await Course.findByIdAndUpdate(id, updatedCourseData, {new: true});
        if(!course){
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update course",
            error: error.message,
        });
    }
}

module.exports = {addNewCourse, getAllCourses, getCourseDetailById, updateCourseById};