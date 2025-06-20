const StudentCourses = require("../../models/StudentCourses");

const getCoursesByStudentId = async (req, res) => {
  try {
    const {studentId} = req.params;
    console.log('Fetching courses for studentId:', studentId);
    const courses = await StudentCourses.findOne({ userId: studentId });
    // if (!courses) {
    //   return res.status(404).json({ message: 'No courses found for this student' });
    // }
    res.status(200).json({
        success: true,
        message: 'Courses fetched successfully',
        data: courses ? courses.courses : []
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getCoursesByStudentId,
};