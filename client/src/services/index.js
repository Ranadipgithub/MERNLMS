import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);
  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");
  return data;
}

export async function verifyOtpService({userEmail, otp}) {
  const { data } = await axiosInstance.post("/auth/verify-otp", { userEmail, otp });
  return data;
}

export async function resendOtpService({userEmail}) {
  const { data } = await axiosInstance.post("/auth/resend-otp", { userEmail });
  return data;
}

export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function mediaDeleteService( public_id ) {
  if (!public_id) {
    throw new Error("public_id is required for media deletion");
  }
  const { data } = await axiosInstance.delete(`/media/delete/${public_id}`);
  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post("instructor/course/add", formData);
  return data;
}

export const fetchInstructorCoursesService = async () => {
  const { data } = await axiosInstance.get(`/instructor/course/get`);
  return data;
};

export async function fetchCourseDetailByIdService(id) {
  const { data } = await axiosInstance.get(`/instructor/course/get/detail/${id}`);
  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(`/instructor/course/update/${id}`, formData);
  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}