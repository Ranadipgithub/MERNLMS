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
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InstructorCourses() {

  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-2xl font-bold">All Courses</CardTitle>
        <Button onClick={() => navigate('/instructor/create-new-course')} className='p-6 cursor-pointer'>Create New Course</Button>
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
              <TableRow>
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
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;