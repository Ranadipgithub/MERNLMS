const express = require("express");
const { addNewCourse, getAllCourses, getCourseDetailById, updateCourseById } = require("../../controllers/instructor-controller/course-controller");

const router = express.Router();

router.post("/add", addNewCourse);
router.get("/get", getAllCourses);
router.get("/get/detail/:id", getCourseDetailById);
router.put("/update/:id", updateCourseById);

module.exports = router;