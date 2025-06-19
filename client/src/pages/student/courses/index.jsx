import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { filterOptions, sortOptions } from "@/config";
import { StudentContext } from "@/context/student-context";
import { fetchStudentViewCoursesService } from "@/services";
import { ArrowUpDownIcon, IndianRupee, Star } from "lucide-react";
import { useContext, useEffect, useState } from "react";

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

export default function StudentCoursePage() {
  const { studentCourseList, setStudentCourseList } =
    useContext(StudentContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [filtersState, setFiltersState] = useState({});
  const [sortState, setSortState] = useState("");

  const parseSearchParams = () => {
    const newFilters = {};
    for (const keyItem of Object.keys(filterOptions)) {
      const param = searchParams.get(keyItem);
      if (param) {
        const arr = param
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s);
        if (arr.length > 0) {
          newFilters[keyItem] = arr;
        }
      }
    }
    const sortParam = searchParams.get("sortBy") || "";
    return { filters: newFilters, sort: sortParam };
  };

  useEffect(() => {
    const { filters, sort } = parseSearchParams();
    setFiltersState(filters);
    setSortState(sort);

    const queryString = searchParams.toString();
    async function fetchCourses() {
      setIsLoading(true);
      try {
        const response = await fetchStudentViewCoursesService(queryString);
        if (response?.success) {
          setStudentCourseList(response.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourses();
  }, [searchParams, setStudentCourseList]);

  const handleFilterOnChange = (sectionKey, optionId, checked) => {
    const params = new URLSearchParams(searchParams);

    const existing = searchParams.get(sectionKey);
    let arr = existing
      ? existing
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
      : [];

    if (checked) {
      if (!arr.includes(optionId)) {
        arr.push(optionId);
      }
    } else {
      arr = arr.filter((v) => v !== optionId);
    }

    if (arr.length > 0) {
      params.set(sectionKey, arr.join(","));
    } else {
      params.delete(sectionKey);
    }
    setSearchParams(params);
  };

  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("sortBy", value);
    } else {
      params.delete("sortBy");
    }
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <h2 className="text-3xl font-medium text-gray-800 text-center mb-6">
        All Courses
      </h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            {Object.keys(filterOptions).map((keyItem) => (
              <div key={keyItem} className="space-y-2">
                <h3 className="text-md font-semibold text-gray-700">
                  {keyItem.toUpperCase()}
                </h3>
                <div className="grid gap-2 mt-1">
                  {filterOptions[keyItem].map((option) => {
                    const checked =
                      !!filtersState[keyItem] &&
                      Array.isArray(filtersState[keyItem]) &&
                      filtersState[keyItem].includes(option.id);
                    return (
                      <Label
                        key={option.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(newChecked) =>
                            handleFilterOnChange(
                              keyItem,
                              option.id,
                              newChecked === true
                            )
                          }
                        />
                        {option.label}
                      </Label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 px-3 py-1.5"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span className="text-[16px] font-medium">Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuRadioGroup
                    value={sortState}
                    onValueChange={(value) => handleSortChange(value)}
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              {isLoading ? (
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              ) : (
                <span className="text-sm text-gray-700 font-medium">
                  {studentCourseList?.length ?? 0} results
                </span>
              )}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(8)].map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))
            ) : studentCourseList && studentCourseList.length > 0 ? (
              studentCourseList.map((course) => (
                <Link
                  to={`/course/details/${course._id}`}
                  key={course._id}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className=" bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="w-full h-40 overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={course.image || "/placeholder.svg"}
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
                            className={`w-4 h-4 ${
                              i < 4
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
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
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                No Course Found
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
