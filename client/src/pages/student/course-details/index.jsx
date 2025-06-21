import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import VideoPlayer from "@/components/video-player";
import { StudentContext } from "@/context/student-context";
import { createPaymentService, fetchStudentCourseDetailByIdService } from "@/services";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Lock,
  PlayCircle,
  Star,
  Clock,
  BookOpen,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { AuthContext } from "@/context/auth-context";
import Spinner from "@/components/loader";



function StudentCourseDetails() {
  const {
    setStudentCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
    StudentCourseDetails,
  } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [showDialog, setShowDialog] = useState(false);

  // approvalUrl state: once set to a non-empty string, triggers redirect.
  const [approvalUrl, setApprovalUrl] = useState("");
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [isCoursePurchased, setIsCoursePurchased] = useState(false);

  // Redirect effect: when approvalUrl is truthy, redirect once.
  useEffect(() => {
    if (approvalUrl) {
      console.log("Redirecting to PayPal approval URL:", approvalUrl);
      window.location.href = approvalUrl;
      // If you want new tab: window.open(approvalUrl, "_blank");
    }
  }, [approvalUrl]);

  // Handle clicking "Enroll Now"
  async function handleCreatePayment() {
    if (!auth?.user) {
      console.error("User not authenticated.");
      return;
    }
    if (!StudentCourseDetails) {
      console.error("No course details available.");
      return;
    }

    setIsCreatingPayment(true);
    try {
      const paymentPayload = {
        userId: auth.user.userId,
        userName: auth.user.userName,
        userEmail: auth.user.userEmail,
        orderStatus: "pending",
        paymentMethod: "paypal",
        paymentStatus: "initiated",
        orderDate: new Date(),
        paymentId: "",
        payerId: "",
        instructorId: StudentCourseDetails.instructorId,
        instructorName: StudentCourseDetails.instructorName,
        courseImage: StudentCourseDetails.image || "/placeholder.svg",
        courseTitle: StudentCourseDetails.title,
        courseId: StudentCourseDetails._id,
        coursePricing: StudentCourseDetails.pricing,
      };

      console.log("Calling createPaymentService with payload:", paymentPayload);
      const response = await createPaymentService(paymentPayload);
      console.log("createPaymentService response:", response);

      if (response.success && response.data) {
        // Try both possible fields:
        const urlFromApproval = response.data.approvalUrl || response.data.approveUrl;
        if (urlFromApproval) {
          if (response.data.orderId) {
            sessionStorage.setItem("orderId", JSON.stringify(response.data.orderId));
          }
          setApprovalUrl(urlFromApproval);
          return;
        }
      }
      console.error("Payment creation failed or no approvalUrl in response:", response);
      // Optionally show user-facing error message here.

    } catch (err) {
      console.error("Error in handleCreatePayment:", err);
      // Optionally show error UI.
    } finally {
      setIsCreatingPayment(false);
    }
  }

  // Progress simulation when id changes
  useEffect(() => {
    setProgress(0);
    const t1 = setTimeout(() => setProgress(50), 300);
    const t2 = setTimeout(() => setProgress(100), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [id]);

  // Update context id and reset local/context state when id param changes
  useEffect(() => {
    if (id) {
      setCurrentCourseDetailsId(id);
      setStudentCourseDetails(null);
      setSelectedVideoUrl(null);
      setExpandedSections({});
      setApprovalUrl("");  // reset previous approvalUrl
    }
  }, [id, setCurrentCourseDetailsId, setStudentCourseDetails]);

  // Fetch course details when currentCourseDetailsId changes
  useEffect(() => {
    if (!currentCourseDetailsId) return;
    let cancelled = false;
    async function fetchDetail() {
      setLoadingState(true);
      try {
        const response = await fetchStudentCourseDetailByIdService(currentCourseDetailsId, auth.user.userId);
        if (cancelled) return;
        console.log(response);
        if (response.success) {
          setStudentCourseDetails(response.data);
          setLoadingState(false);
          setIsCoursePurchased(response?.isCoursePurchased)
        } else {
          setStudentCourseDetails(null);
          setIsCoursePurchased(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (!cancelled) {
          setStudentCourseDetails(null);
        }
      } finally {
        if (!cancelled) setLoadingState(false);
      }
    }
    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [currentCourseDetailsId, setLoadingState, setStudentCourseDetails]);

  const handleVideoClick = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    setShowDialog(true);
  };

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };



  if (loadingState) {
    
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-cyan-100/70 to-white">
        <div className="w-full max-w-md px-4">
          <Spinner />;
          {/* <p className="text-center mt-4 text-gray-600">Loading course details...</p> */}
        </div>
      </div>
    );
  }

  if (!StudentCourseDetails) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-8">
        Course not found
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-cyan-100/70 to-white">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <div className="flex-1 max-w-4xl">
              {/* Course Header */}
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {StudentCourseDetails.title}
                </h1>
                <p className="text-lg text-gray-700 mb-4">
                  {StudentCourseDetails.subtitle}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-gray-900">4</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-blue-600">(5 ratings)</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {StudentCourseDetails.students.length} students
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Course by{" "}
                  <span className="text-blue-600 underline cursor-pointer">
                    {StudentCourseDetails.instructorName}
                  </span>
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <span>Created on {StudentCourseDetails.date.split("T")[0]}</span>
                  <Globe className="ml-4 mr-1 h-4 w-4" />
                  <span>{StudentCourseDetails.primaryLanguage.toUpperCase()}</span>
                </div>
              </div>
              {/* Course Structure */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Structure</h2>
                <div className="space-y-2">
                  {StudentCourseDetails.curriculum.map((curriculumItem, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg bg-white">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleSection(index)}
                      >
                        <div className="flex items-center gap-3">
                          {expandedSections[index] ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="font-medium text-gray-900">{curriculumItem.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {curriculumItem.lecturesCount || "N/A"} lectures -{" "}
                          {curriculumItem.duration || "N/A"}
                        </span>
                      </div>
                      {expandedSections[index] && (
                        <div className="border-t border-gray-200 p-4">
                          <div
                            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                              curriculumItem.freePreview ? "text-blue-600" : "text-gray-400"
                            }`}
                            onClick={() =>
                              curriculumItem.freePreview && handleVideoClick(curriculumItem.videoUrl)
                            }
                          >
                            {curriculumItem.freePreview ? (
                              <PlayCircle className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                            <span className="text-sm">{curriculumItem.title}</span>
                            {curriculumItem.freePreview && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                Preview
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Course Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Description</h2>
                <h3 className="text-xl font-semibold text-gray-800">Deep Dive into Python Programming</h3>
                <p className="text-gray-700 mt-2">{StudentCourseDetails.description}</p>
              </div>
            </div>
            {/* Right Sidebar */}
            <div className="lg:w-96">
              <Card className="sticky top-4">
                <CardContent>
                  <div className="aspect-video mb-6 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={StudentCourseDetails.image || "/placeholder.svg"}
                      alt={StudentCourseDetails.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600 font-medium">
                      5 days left at this price!
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">
                        <IndianRupee className="inline h-6 w-6 font-semibold" />
                        {StudentCourseDetails.pricing}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        <IndianRupee className="inline h-4 w-4 font-semibold" />
                        7999
                      </span>
                      <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded">
                        15% off
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                      <span>4</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>57 hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>4 lessons</span>
                    </div>
                  </div>
                  {isCoursePurchased ? (
                    <Button
                      onClick={() => navigate(`/course-progress/${StudentCourseDetails._id}`)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 mb-6 cursor-pointer"
                    >
                      Go to Course
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCreatePayment}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mb-6 cursor-pointer"
                      disabled={isCreatingPayment}
                    >
                      {isCreatingPayment ? "Processing..." : "Enroll Now"}
                    </Button>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">What's in the course?</h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Lifetime access with free updates.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Step-by-step, hands-on project guidance.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Downloadable resources and source code.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Quizzes to test your knowledge.</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for video preview using shadcn dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl w-full mx-4">
          <DialogHeader>
            <DialogTitle>Preview Video</DialogTitle>
            <DialogClose asChild>
              <Button size="icon" variant="ghost" className="absolute top-2 right-2">
                {/* e.g. <X className="w-5 h-5 text-gray-600" /> */}
              </Button>
            </DialogClose>
          </DialogHeader>
          <div className="aspect-video bg-black">
            {selectedVideoUrl && (
              <VideoPlayer url={selectedVideoUrl} width="100%" height="100%" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StudentCourseDetails;
