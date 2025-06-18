import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext, useRef } from "react";

function CourseSetting() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const fileInputRef = useRef(null);

  async function handleImageUploadChange(e) {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let updatedFormData = { ...courseLandingFormData };
          updatedFormData.image = response?.data?.url;
          setCourseLandingFormData(updatedFormData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  }

  function handleRemoveImage() {
    const updatedFormData = { ...courseLandingFormData };
    delete updatedFormData.image;
    setCourseLandingFormData(updatedFormData);
  }

  function handleOpenFilePicker() {
    fileInputRef.current?.click();
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="flex flex-col space-y-4">
          {mediaUploadProgress && (
            <MediaProgressbar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          )}
          <div className="flex flex-col items-center">
            {courseLandingFormData?.image ? (
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={courseLandingFormData.image}
                  alt="Course Thumbnail"
                  className="w-48 h-48 object-cover rounded-lg shadow-md"
                />
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleOpenFilePicker} className={'cursor-pointer'}>
                    Change Thumbnail
                  </Button>
                  <Button variant="destructive" onClick={handleRemoveImage} className={'cursor-pointer'}>
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-500">No Thumbnail</span>
                </div>
                <Button onClick={handleOpenFilePicker} variant="outline">
                  Upload Thumbnail
                </Button>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageUploadChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseSetting;
