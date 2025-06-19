const express = require("express");
const { getAllStudentViewCourses, getStudentCourseDetailById } = require("../../controllers/student-controller/course-controller");

const router = express.Router();

router.get('/get', getAllStudentViewCourses);
router.get('/get/details/:id', getStudentCourseDetailById);

module.exports = router;