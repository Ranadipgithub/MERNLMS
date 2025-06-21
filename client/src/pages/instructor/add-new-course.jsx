import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSetting from "@/components/instructor-view/courses/add-new-course/course-setting";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { addNewCourseService, fetchCourseDetailByIdService, updateCourseByIdService } from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
function AddNewCoursePage() {
  const { courseLandingFormData, courseCurriculumFormData, setCourseLandingFormData, setCourseCurriculumFormData, currentEditedCourseId, setCurrentEditedCourseId} =
    useContext(InstructorContext);
    const {auth} = useContext(AuthContext);
    const navigate = useNavigate();
    const params = useParams();


  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) return false;
    }
    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      )
        return false;
      if (!item.freePreview) hasFreePreview = true;
    }
    return hasFreePreview;
  }

  async function handleCreateCourse() {
    // console.log(courseLandingFormData, courseCurriculumFormData);
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true
    };
    const response = currentEditedCourseId ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData) : await addNewCourseService(courseFinalFormData);
    if(response?.success){
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      setCurrentEditedCourseId(null);
      navigate(-1);
    }
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchCourseDetailByIdService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});

      console.log(setCourseFormData, response?.data, "setCourseFormData");
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }

    console.log(response, "response");
  }

  useEffect(() => {
    if(currentEditedCourseId) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if(params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-5">{currentEditedCourseId ? "Edit Course" : "Add New Course"}</h1>
        <Button
          onClick={handleCreateCourse}
          disabled={!validateFormData()}
          className={"text-sm tracking-wider font-bold px-8"}
        >
          Submit
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum" className={"cursor-pointer"}>
                  Curriculum
                </TabsTrigger>
                <TabsTrigger
                  value="course-landing-page"
                  className={"cursor-pointer"}
                >
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings" className={"cursor-pointer"}>
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSetting />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;