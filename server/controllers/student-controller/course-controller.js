const Course = require("../../models/Course");
const StudentCourses = require("../../models/StudentCourses")
const mongoose = require("mongoose");

const getAllStudentViewCourses = async (req, res) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    console.log(req.query, "req.query");

    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (level.length) {
      filters.level = { $in: level.split(",") };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage.split(",") };
    }

    let sortParam = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;

        break;
      case "price-hightolow":
        sortParam.pricing = -1;

        break;
      case "title-atoz":
        sortParam.title = 1;

        break;
      case "title-ztoa":
        sortParam.title = -1;

        break;

      default:
        sortParam.pricing = 1;
        break;
    }

    // Query MongoDB
    const courseList = await Course.find(filters).sort(sortParam);

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courseList,
    });
  } catch (err) {
    console.error("Error in getAllStudentViewCourses:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get student courses",
      error: err.message,
    });
  }
};

const getStudentCourseDetailById = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    // Validate that `id` is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID"
      });
    }
    // Optionally: if you have authentication middleware, you can get studentId from req.user._id 
    // instead of trusting a URL param. Example:
    // const studentId = req.user?.id;
    // That avoids passing studentId in URL and ensures one user cannot fetch another’s purchase status.

    console.log(`Fetching course detail for courseId=${id}, studentId=${studentId}`);

    // Fetch the course
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Fetch the StudentCourses document for this user
    let studentCourses = null;
    let isPurchased = false;
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      studentCourses = await StudentCourses.findOne({ userId: studentId });
    } else {
      console.warn(`Invalid studentId format: ${studentId}`);
    }

    if (studentCourses && Array.isArray(studentCourses.courses)) {
      // Compare as strings to avoid ObjectId mismatches
      isPurchased = studentCourses.courses.some(
        item => item.courseId.toString() === id
      );
    } else {
      // No StudentCourses doc exists for this user, so not purchased
      isPurchased = false;
      console.log(`No StudentCourses doc for user ${studentId}; isPurchased=false`);
    }

    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
      isCoursePurchased: isPurchased,
    });
  } catch (err) {
    console.error("Error in getStudentCourseDetailById:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to get course",
      error: err.message,
    });
  }
};

module.exports = {
  getAllStudentViewCourses,
  getStudentCourseDetailById,
};
