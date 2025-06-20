import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesByStudentIdService } from "@/services";
import { IndianRupee, Star } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CourseCardSkeleton() {
  return (
    <div className=" bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col animate-pulse">
      <div className="w-full h-40 bg-gray-200 flex-shrink-0"></div>
      <div className="p-4 flex flex-col flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex items-center space-x-2">
          <div className="h-3 bg-gray-200 rounded w-8"></div>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="mt-auto">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

const StudentCoursesPage = () => {
  const { studentBoughtCourses, setStudentBoughtCourses } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesByStudentIdService(
      auth.user.userId
    );
    console.log("response", response);
    if (response?.success) {
      setStudentBoughtCourses(response.data);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []);



  return (
    <div className="container mx-auto px-8 py-8">
      <h2 className="text-3xl font-medium text-gray-800 text-center mb-6">
        My Courses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(8)].map((_, index) => <CourseCardSkeleton key={index} />)
        ) : studentBoughtCourses && studentBoughtCourses.length > 0 ? (
          studentBoughtCourses.map((course) => (
            <Link
              to={`/course/details/${course._id}`}
              key={course._id}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className=" bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="w-full h-40 overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={course.courseImage || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {course.instructorName}
                </p>
                <div className="flex items-center space-x-2 mb-3">
                  <p className="text-sm font-semibold text-gray-900">4.5</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">(22)</p>
                </div>
                <div className="mt-auto"></div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No Course Found
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCoursesPage;
