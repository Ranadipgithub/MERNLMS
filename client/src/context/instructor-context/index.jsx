import { courseLandingInitialFormData } from "@/config";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

export default function InstructorContextProvider({ children }) {

    const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData);

    return <InstructorContext.Provider value={{ courseLandingFormData, setCourseLandingFormData }}>{children}</InstructorContext.Provider>;
}