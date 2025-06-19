// controllers/studentCourseController.js (or wherever you keep it)

const Course = require("../../models/Course");

const getAllStudentViewCourses = async (req, res) => {
  try {
    // Extract raw query params
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
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      data: course,
    });
  } catch (err) {
    console.error("Error in getStudentCourseDetailById:", err);
    res.status(500).json({
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
