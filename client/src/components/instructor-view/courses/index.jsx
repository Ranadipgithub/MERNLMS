import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({listOfCourses}) {

  const navigate = useNavigate();

  const {currentEditedCourseId, setCurrentEditedCourseId, setCourseLandingFormData, setCourseCurriculumFormData} = useContext(InstructorContext);

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-2xl font-bold">All Courses</CardTitle>
        <Button onClick={() =>{
          setCurrentEditedCourseId(null);
          navigate('/instructor/create-new-course');
          setCourseCurriculumFormData(courseCurriculumInitialFormData);
          setCourseLandingFormData(courseLandingInitialFormData);
        }} className='p-6 cursor-pointer'>Create New Course</Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                listOfCourses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.students.length}</TableCell>
                    <TableCell>{course.pricing }</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={() => navigate(`/instructor/edit-course/${course._id}`)} variant={'ghost'} size={'sm'} className={'cursor-pointer'}>
                        <Edit className="h-4 w-4 " />
                      </Button>
                      <Button variant={'ghost'} size={'sm'} className={'cursor-pointer'}>
                        <Delete className="h-4 w-4 " />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              }
              {/* <TableRow>
                <TableCell className="font-medium">React full course 2025</TableCell>
                <TableCell>100</TableCell>
                <TableCell>$100</TableCell>
                <TableCell className="text-right">
                  <Button variant={'ghost'} size={'sm'} className={'cursor-pointer'}>
                    <Edit className="h-4 w-4 " />
                  </Button>
                  <Button variant={'ghost'} size={'sm'} className={'cursor-pointer'}>
                    <Delete className="h-4 w-4 " />
                  </Button>
                </TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;