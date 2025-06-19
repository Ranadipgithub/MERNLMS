import heroImage from "../../../assets/hero1.png"
import { useContext, useEffect } from "react"
import { StudentContext } from "@/context/student-context"
import { fetchStudentViewCoursesService } from "@/services"
import { Star, IndianRupee } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function StudentHomePage() {
  const { studentCourseList, setStudentCourseList } = useContext(StudentContext)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchAllCourses() {
      const response = await fetchStudentViewCoursesService()
      if (response.success) setStudentCourseList(response.data)
    }
    fetchAllCourses()
  }, [setStudentCourseList])

  const featuredCourses = studentCourseList.slice(0, 4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-cyan-100/70 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-4.5rem)] md:min-h-[calc(100vh-5rem)] flex items-center">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col-reverse lg:flex-row items-center w-full py-8 lg:py-0">
          <div className="lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Empower your future with the courses designed to{" "}
              <span className="text-indigo-600">fit your choice.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-700 max-w-lg mx-auto lg:mx-0">
              We bring together world-class instructors, interactive content, and a supportive community to help you
              achieve your personal and professional goals.
            </p>
          </div>

          <div className="lg:w-1/2 mb-6 sm:mb-8 lg:mb-0 flex justify-center lg:justify-end w-full">
            <img
              src={heroImage || "/placeholder.svg"}
              alt="Student learning on laptop"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto mix-blend-knockout"
            />
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl font-medium text-gray-800">Featured Courses</h2>
            <p className="text-sm md:text-base text-gray-500 mt-2">
              Hand-picked courses from our top instructors
            </p>
          </div>

          {/* Grid showing up to 4 courses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {featuredCourses.map((course) => (
              <Link
                to={`/course/details/${course._id}`}
                key={course._id}
                onClick={() => window.scrollTo(0, 0)}
                className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Constrain image height */}
                <div className="w-full h-40 overflow-hidden bg-gray-100">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Course details */}
                <div className="p-4 flex flex-col">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{course.instructorName}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    {/* Static rating example: 4.5 */}
                    <p className="text-sm font-semibold text-gray-900">4.5</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">(22)</p>
                  </div>
                  <div className="mt-auto">
                    <p className="text-base font-semibold text-gray-800 flex items-center">
                      <IndianRupee className="w-4 h-4 inline-block mr-1" />
                      {course.pricing}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Courses button */}
          <div className="text-center">
            <Button
              variant="outline"
              className="px-8 py-3 text-base font-medium border-gray-300 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate("/courses")}
            >
              View All Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

































{/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {studentCourseList.map((course) => (
              <Card
                key={course._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{course.title}</h3>

                    <p className="text-xs text-gray-600">{course.instructorName}</p>

                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-gray-900">4.5</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(125)</span>
                    </div>

                    <p className="font-bold text-gray-900">${course.pricing}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div> */}












// import { Card, CardContent } from "@/components/ui/card"
// import heroImage from "../../../assets/hero1.png"
// import { useContext, useEffect } from "react"
// import { StudentContext } from "@/context/student-context"
// import { fetchStudentViewCoursesService } from "@/services"
// import { Currency, IndianRupee, Star } from "lucide-react"
// import { Link } from "react-router-dom"

// export default function StudentHomePage() {
//   const { studentCourseList, setStudentCourseList } = useContext(StudentContext)

//   useEffect(() => {
//     async function fetchAllCourses() {
//       const response = await fetchStudentViewCoursesService()
//       if (response.success) setStudentCourseList(response.data)
//     }
//     fetchAllCourses()
//   }, [])

//   return (
//     <div className="flex flex-col">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-b from-cyan-100/70 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-4.5rem)] md:min-h-[calc(100vh-5rem)] flex items-center">
//         <div className="container mx-auto px-4 sm:px-6 md:px-8 flex flex-col-reverse lg:flex-row items-center w-full py-8 lg:py-0">
//           <div className="lg:w-1/2 space-y-4 sm:space-y-6 text-center lg:text-left">
//             <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
//               Empower your future with the courses designed to <span className="text-indigo-600">fit your choice.</span>
//             </h1>
//             <p className="text-base sm:text-lg text-gray-700 max-w-lg mx-auto lg:mx-0">
//               We bring together world-class instructors, interactive content, and a supportive community to help you
//               achieve your personal and professional goals.
//             </p>
//           </div>

//           <div className="lg:w-1/2 mb-6 sm:mb-8 lg:mb-0 flex justify-center lg:justify-end w-full">
//             <img
//               src={heroImage || "/placeholder.svg"}
//               alt="Student learning on laptop"
//               className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto mix-blend-knockout"
//             />
//           </div>
//         </div>
//       </section>

//       {/* Featured Courses Section */}
//       <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="container mx-auto">
//           <div className="mb-8 sm:mb-12">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Courses</h2>
//             <p className="text-base sm:text-lg text-gray-600">Hand-picked courses from our top instructors</p>
//           </div>


//           <div className="grid grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4">
//             {studentCourseList.map((course) => (
//               <Link to={`/courses/${course._id}`} key={course._id} onClick={() => window.scrollTo(0, 0)} className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg">
//                 <img
//                   src={course.image || "/placeholder.svg"}
//                   alt={course.title}
//                   className="w-full "
//                 />
//                 <div className="p-3 text-left">
//                   <h3 className="text-base font-semibold">{course.title}</h3>
//                   <p className="text-gray-500">{course.instructorName}</p>
//                   <div className="flex items-center space-x-2">
//                     <p>4.5</p>
//                     <div className="flex">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-3.5 h-3.5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
//                         />
//                       ))}
//                     </div>
//                     <p className="text-gray-500">22</p>
//                   </div>
//                   <p className="text-base font-semibold text-gray-800 flex items-center">
//                     <IndianRupee className="inline w-4 h-4 mr-1" />
//                     {course.pricing}
//                   </p>
//                 </div>
//               </Link>
//             ))}
//           </div>




//         </div>
//       </section>
//     </div>
//   )
// }