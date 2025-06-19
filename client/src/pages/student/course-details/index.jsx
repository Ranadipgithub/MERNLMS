import { Progress } from "@/components/ui/progress";
import { StudentContext } from "@/context/student-context";
import { fetchStudentCourseDetailByIdService } from "@/services";
import { ChevronDown, Star } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

function StudentCourseDetails() {
  const {
    setStudentCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
    StudentCourseDetails,
  } = useContext(StudentContext);
  const { id } = useParams();
  console.log(id);
  const [progress, setProgress] = React.useState(13);
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  async function fetchStudentCourseDetail() {
    const response = await fetchStudentCourseDetailByIdService(
      currentCourseDetailsId
    );
    console.log("Response from fetchStudentCourseDetailByIdService:", response);
    setLoadingState(true);
    if (response.success) {
      setStudentCourseDetails(response.data);
      setLoadingState(false);
      console.log("Course details fetched successfully:", response.data);
    } else {
      setStudentCourseDetails(null);
      setLoadingState(false);
      console.error("Failed to fetch course details:", response.message);
    }
  }

  useEffect(() => {
    if (currentCourseDetailsId) {
      fetchStudentCourseDetail();
    }
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  if (loadingState) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-cyan-100/70 to-white">
        <div className="w-full max-w-md px-4">
          <Progress value={progress} className="w-full" />
          <p className="text-center mt-4 text-gray-600">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-gradient-to-b from-cyan-100/70 to-white"></div>

      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-24 px-8 md:pt-20 pt-10 text-left">
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:36px text-3xl font-semibold text-gray-800">
            {StudentCourseDetails.title}
          </h1>
          <p className="pt-4 md:text-base test-sm">
            {StudentCourseDetails.description}
          </p>
          <div className="flex items-center space-x-2 mb-3">
            {/* Static rating example: 4.5 */}
            <p className="text-sm font-semibold text-gray-900">4.5</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">(22)</p>
            <p>
              {StudentCourseDetails.students.length}{" "}
              {StudentCourseDetails.students.legnth > 1
                ? "students"
                : "student"}
            </p>
          </div>
          <p className="text-sm">
            Course by{" "}
            <span className="text-blue-600 underline">
              {StudentCourseDetails.instructorName}
            </span>
          </p>

          <div className="pt-8 text-gray-800">
            <h2 className="text-sl font-semibold">Course Structure</h2>

            <div className="pt-5">
              {StudentCourseDetails.curriculum &&
              StudentCourseDetails.curriculum.length > 0
                ? StudentCourseDetails.curriculum.map((chapter, index) => (
                    <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                      <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                        <div className="flex items-center gap-2">
                          <ChevronDown className="ml-1 h-4 w-4" />
                          <p className="font-medium md:text-base text-sm">{chapter.title}</p>
                          <p className="text-sm md:text-default">1 lectures - 2 Hours</p>
                        </div>
                        <div>
                            <ul>
                                
                            </ul>
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default StudentCourseDetails;
