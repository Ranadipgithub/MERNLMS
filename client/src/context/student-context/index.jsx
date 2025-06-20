import React, { useState } from "react";

export const StudentContext = React.createContext(null);

export default function StudentContextProvider({ children }) {

    const [studentCourseList, setStudentCourseList] = useState([]);
    const [StudentCourseDetails, setStudentCourseDetails] = useState(null);
    const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null);
    const [loadingState, setLoadingState] = useState(true);
    const [studentBoughtCourses, setStudentBoughtCourses] = useState([]);

    return <StudentContext.Provider value={{ studentCourseList, setStudentCourseList, StudentCourseDetails, setStudentCourseDetails, currentCourseDetailsId, setCurrentCourseDetailsId, loadingState, setLoadingState, studentBoughtCourses, setStudentBoughtCourses }}>
        {children}
    </StudentContext.Provider>;
}