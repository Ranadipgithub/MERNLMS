import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import VideoPlayer from "@/components/video-player"
import { AuthContext } from "@/context/auth-context"
import { StudentContext } from "@/context/student-context"
import { getCurrentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from "@/services"
import { Check, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Play, BookOpen, List } from "lucide-react"
import { useContext, useEffect, useState, useCallback } from "react"
import Confetti from "react-confetti"
import { Link, useNavigate, useParams } from "react-router-dom"

function StudentViewCourseProgressPage() {
  const navigate = useNavigate()
  const { auth } = useContext(AuthContext)
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useContext(StudentContext)
  const [lockCourse, setLockCourse] = useState(false)
  const [currentLecture, setCurrentLecture] = useState(null)
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isSideBarOpen, setIsSideBarOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState(new Set())
  const { id } = useParams()

  // Fetch and set progress + currentLecture
  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?.userId, id)
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true)
      } else {
        const courseDetails = response.data.courseDetails
        const progress = response.data.progress || []
        setStudentCurrentCourseProgress({
          courseDetails,
          progress,
        })

        const curriculum = courseDetails?.curriculum || []

        if (response.data.completed) {
          setShowCourseCompleteDialog(true)
          setShowConfetti(true)
          setCurrentLecture(curriculum[0] || null)
          return
        }

        if (progress.length === 0) {
          setCurrentLecture(curriculum[0] || null)
        } else {
          const lastIndexOfViewedAsTrue = progress.reduceRight(
            (acc, obj, index) => (acc === -1 && obj.viewed ? index : acc),
            -1,
          )
          const nextIndex = lastIndexOfViewedAsTrue + 1
          if (nextIndex < curriculum.length) {
            setCurrentLecture(curriculum[nextIndex])
          } else {
            setShowCourseCompleteDialog(true)
            setShowConfetti(true)
            setCurrentLecture(null)
          }
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?.userId,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id,
      )

      if (response?.success) {
        fetchCurrentCourseProgress()
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?.userId,
      studentCurrentCourseProgress?.courseDetails?._id,
    )

    if (response?.success) {
      setCurrentLecture(null)
      setShowConfetti(false)
      setShowCourseCompleteDialog(false)
      fetchCurrentCourseProgress()
    }
  }

  const handleProgressUpdate = useCallback((progressInfo) => {
    setCurrentLecture((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        progressValue: progressInfo.progressValue ?? prev.progressValue,
        lastWatchedTime: progressInfo.currentTime ?? prev.lastWatchedTime,
      }
    })
  }, [])

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  // Group curriculum by sections (mock implementation)
  const groupedCurriculum =
    studentCurrentCourseProgress?.courseDetails?.curriculum?.reduce((acc, item, index) => {
      const sectionIndex = Math.floor(index / 4) // Group every 4 items
      const sectionName = `Section ${sectionIndex + 1}: ${item.title.split(" ").slice(0, 3).join(" ")}`

      if (!acc[sectionName]) {
        acc[sectionName] = []
      }
      acc[sectionName].push(item)
      return acc
    }, {}) || {}

  useEffect(() => {
    fetchCurrentCourseProgress()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (currentLecture?.progressValue === 1) {
      updateCourseProgress()
    }
  }, [currentLecture])

  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 15000)
      return () => clearTimeout(t)
    }
  }, [showConfetti])

  const completedLectures = studentCurrentCourseProgress?.progress?.filter((p) => p.viewed).length || 0
  const totalLectures = studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0
  const progressPercentage = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0

  return (
    <div className="flex flex-col h-screen bg-white">
      {showConfetti && <Confetti />}

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <Link to={'/'} className="text-2xl font-bold">
              <span className="text-[#8b5cf6]">E</span>
              <span className="text-gray-900">Learning</span>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-lg font-semibold text-gray-900 max-w-md truncate">
              {studentCurrentCourseProgress?.courseDetails?.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => navigate("/student-courses")}
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>
          <Button
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            {isSideBarOpen ? (
              <>
                <ChevronRight className="h-4 w-4 mr-2" />
                Hide Content
              </>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Show Content
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className={`flex-1 flex flex-col ${isSideBarOpen ? "mr-[400px]" : ""} transition-all duration-300`}>
          {/* Video Player */}
          <div className="bg-black">
            <VideoPlayer
              width="100%"
              height="500px"
              url={currentLecture?.videoUrl}
              onProgressUpdate={handleProgressUpdate}
              progressData={currentLecture}
            />
          </div>

          {/* Content Area */}
          
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-[73px] right-0 bottom-0 w-[400px] bg-white border-l border-gray-200 shadow-lg transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <List className="h-5 w-5 text-[#8b5cf6]" />
                <h2 className="font-semibold text-gray-900">Course Content</h2>
                <Badge variant="secondary" className="text-xs bg-[#8b5cf6] text-white">
                  {completedLectures}/{totalLectures}
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">{progressPercentage}% complete</span>
                <span>
                  {completedLectures} of {totalLectures}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#8b5cf6] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Course Content - Fixed Scrolling */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  {Object.entries(groupedCurriculum).map(([sectionName, lectures]) => (
                    <div key={sectionName} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(sectionName)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors bg-white"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{sectionName}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {
                              lectures.filter(
                                (lecture) =>
                                  studentCurrentCourseProgress?.progress?.find((p) => p.lectureId === lecture._id)
                                    ?.viewed,
                              ).length
                            }{" "}
                            / {lectures.length} | {lectures.length * 10}min
                          </p>
                        </div>
                        {expandedSections.has(sectionName) ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>

                      {expandedSections.has(sectionName) && (
                        <div className="border-t border-gray-200 bg-gray-50">
                          {lectures.map((lecture) => {
                            const isViewed = studentCurrentCourseProgress?.progress?.find(
                              (p) => p.lectureId === lecture._id,
                            )?.viewed
                            const isCurrent = currentLecture?._id === lecture._id

                            return (
                              <button
                                key={lecture._id}
                                onClick={() => setCurrentLecture(lecture)}
                                className={`w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-100 transition-colors ${
                                  isCurrent ? "bg-[#8b5cf6]/10 border-r-4 border-[#8b5cf6]" : "bg-white"
                                }`}
                              >
                                <div className="flex-shrink-0">
                                  {isViewed ? (
                                    <div className="w-6 h-6 bg-[#8b5cf6] rounded-full flex items-center justify-center">
                                      <Check className="h-3 w-3 text-white" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                      <Play className="h-3 w-3 text-gray-600" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm font-medium truncate ${
                                      isCurrent ? "text-[#8b5cf6]" : "text-gray-900"
                                    }`}
                                  >
                                    {lecture.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">10min</p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page</DialogTitle>
            <DialogDescription>Please purchase this course to get access</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student-courses")}>My Courses Page</Button>
                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StudentViewCourseProgressPage
