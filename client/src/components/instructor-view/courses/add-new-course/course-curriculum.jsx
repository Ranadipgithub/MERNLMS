import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { mediaBulkUploadService, mediaDeleteService, mediaUploadService } from "@/services";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

function CourseCurriculum() {
  const { courseCurriculumFormData, setCourseCurriculumFormData } =
    useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  const {
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      { ...courseCurriculumInitialFormData[0] },
    ]);
  }

  function handleCourseTitleChange(e, index) {
    const updatedFormData = [...courseCurriculumFormData];
    updatedFormData[index].title = e.target.value;
    setCourseCurriculumFormData(updatedFormData);
  }

  function handleFreePreviewChange(value, index) {
    const updatedFormData = [...courseCurriculumFormData];
    updatedFormData[index].freePreview = value;
    setCourseCurriculumFormData(updatedFormData);
  }

  async function handleSingleLectureUpload(e, index) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let updatedFormData = [...courseCurriculumFormData];
          updatedFormData[index] = {
            ...updatedFormData[index],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(updatedFormData);
          setMediaUploadProgress(false);
        }
      } catch (err) {
        console.log(err);
        setMediaUploadProgress(false);
      }
    }
  }

  function IsCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item && typeof item === 'object' && item.title.trim() !== "" && item.videoUrl.trim() !== ""
      );
    });
  }

  async function handleReplaceVideo(index) {
    let updatedFormData = [...courseCurriculumFormData];
    const currentVdoPublicId = updatedFormData[index].public_id;
    try {
      const deleteCurrentMedia = await mediaDeleteService(currentVdoPublicId);
      if (deleteCurrentMedia.success) {
        updatedFormData[index] = {
          ...updatedFormData[index],
          videoUrl: "",
          public_id: "",
        };
        setCourseCurriculumFormData(updatedFormData);
      }
    } catch (err) {
      console.error("Error deleting media:", err);
    }
  }

  function handleOpenBulkUpload() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        const baseIndex = cpyCourseCurriculumFormdata.length;
        const newLectures = response.data.map((item, index) => ({
          videoUrl: item?.url,
          public_id: item?.public_id,
          title: `Lecture ${baseIndex + index + 1}`,
          freePreview: false,
        }));
        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...newLectures,
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  async function handleDeleteVideo(index) {
    let updatedFormData = [...courseCurriculumFormData];
    const currentVdoPublicId = updatedFormData[index].public_id;
    try {
      const deleteCurrentMedia = await mediaDeleteService(currentVdoPublicId);
      if (deleteCurrentMedia.success) {
        updatedFormData = updatedFormData.filter((item, idx) => idx !== index);
        setCourseCurriculumFormData(updatedFormData);
      }
    } catch (err) {
      console.error("Error deleting media:", err);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div className="flex items-center space-x-2 ">
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden "
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="flex items-center cursor-pointer"
            onClick={handleOpenBulkUpload}
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button
            onClick={handleNewLecture}
            disabled={!IsCourseCurriculumFormDataValid() || mediaUploadProgress}
            className="ml-2 cursor-pointer"
          >
            Add Lecture
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        {mediaUploadProgress && (
          <div className="mb-4">
            <MediaProgressbar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          </div>
        )}
        {courseCurriculumFormData.length === 0 ? (
          <p className="text-center text-muted py-10">
            No lectures added yet. Click "Add Lecture" or use "Bulk Upload".
          </p>
        ) : (
          <Accordion type="multiple" className="space-y-2">
            {courseCurriculumFormData.map((item, index) => (
              <AccordionItem key={index} value={`lecture-${index}`}>
                <AccordionTrigger className="flex justify-between items-center cursor-pointer">
                  <span className="font-semibold">
                    Lecture {index + 1}: {item.title || 'Untitled'}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="p-4 border rounded-lg">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div>
                        <Label htmlFor={`title-${index}`}>Title</Label>
                        <Input
                          id={`title-${index}`}
                          placeholder="Enter Lecture Title"
                          value={item.title}
                          onChange={(e) => handleCourseTitleChange(e, index)}
                        />
                      </div>
                      <div className="flex items-center">
                        <Switch
                          id={`freePreview-${index}`}
                          checked={item.freePreview}
                          onCheckedChange={(value) =>
                            handleFreePreviewChange(value, index)
                          }
                        />
                        <Label htmlFor={`freePreview-${index}`} className="ml-2">
                          Free Preview
                        </Label>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      {item.videoUrl ? (
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
                          <VideoPlayer
                            url={item.videoUrl}
                            width="500px"
                            height="300px"
                          />
                          <div className="mt-4 md:mt-0 flex space-x-2">
                            <Button
                              onClick={() => handleReplaceVideo(index)}
                              variant="outline"
                              className={'cursor-pointer'}
                            >
                              Replace
                            </Button>
                            <Button
                              onClick={() => handleDeleteVideo(index)}
                              variant="destructive"
                              className={'cursor-pointer'}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Label htmlFor={`upload-${index}`}>Upload Video</Label>
                          <Input
                            id={`upload-${index}`}
                            type="file"
                            accept="video/*"
                            className="mt-2"
                            onChange={(e) => handleSingleLectureUpload(e, index)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
