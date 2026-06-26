import axiosInstance from "./axiosInstance";
import { getApiData } from "../utils/response";

export const studentApi = {
  getAll: async () => getApiData(await axiosInstance.get("/students")),
  getById: async (id) => getApiData(await axiosInstance.get(`/students/${id}`)),
  create: async (payload) => getApiData(await axiosInstance.post("/students", payload)),
  update: async (id, payload) => getApiData(await axiosInstance.put(`/students/${id}`, payload)),
  remove: async (id) => getApiData(await axiosInstance.delete(`/students/${id}`))
};

export const subjectApi = {
  getAll: async () => getApiData(await axiosInstance.get("/subjects")),
  getById: async (id) => getApiData(await axiosInstance.get(`/subjects/${id}`)),
  create: async (payload) => getApiData(await axiosInstance.post("/subjects", payload)),
  update: async (id, payload) => getApiData(await axiosInstance.put(`/subjects/${id}`, payload)),
  remove: async (id) => getApiData(await axiosInstance.delete(`/subjects/${id}`))
};

export const examApi = {
  getAll: async () => getApiData(await axiosInstance.get("/exams")),
  getById: async (id) => getApiData(await axiosInstance.get(`/exams/${id}`)),
  create: async (payload) => getApiData(await axiosInstance.post("/exams", payload)),
  update: async (id, payload) => getApiData(await axiosInstance.put(`/exams/${id}`, payload)),
  remove: async (id) => getApiData(await axiosInstance.delete(`/exams/${id}`))
};

export const markApi = {
  getAll: async (params={}) => getApiData(await axiosInstance.get("/marks", { params })),
  getById: async (id) => getApiData(await axiosInstance.get(`/marks/${id}`)),
  create: async (payload) => getApiData(await axiosInstance.post("/marks", payload)),
  update: async (id, payload) => getApiData(await axiosInstance.put(`/marks/${id}`, payload)),
  remove: async (id) => getApiData(await axiosInstance.delete(`/marks/${id}`))
};

export const performanceApi = {
  student: async (studentId) => getApiData(await axiosInstance.get(`/performance/students/${studentId}`)),
  studentExam: async (studentId, examId) => getApiData(await axiosInstance.get(`/performance/students/${studentId}/exams/${examId}`)),
  subjectAverages: async () => getApiData(await axiosInstance.get("/performance/subjects/averages")),
  topPerformers: async (params = {}) => getApiData(await axiosInstance.get("/performance/top-performers", {params})),
  passFail: async ({ examId, passThreshold = 80 }) => getApiData(await axiosInstance.get(`/performance/exams/${examId}/pass-fail`, { params: { passThreshold }}))
};

export const reportApi = {
  examLeaderboard: async (examId) => getApiData(await axiosInstance.get(`/reports/exams/${examId}/leaderboard`)),
  examSummary: async (minTotalScore=0) => getApiData(await axiosInstance.get("/reports/exams/summary", { params: { minTotalScore } })),
  studentCompare: async (studentIdA, studentIdB, examId="") => getApiData(await axiosInstance.get("/reports/students/compare", { params: { studentIdA, studentIdB, examId: examId || undefined } })),
  studentTrend: async (studentId, subjectId="") => getApiData(await axiosInstance.get(`/reports/students/${studentId}/trend`, { params: { subjectId: subjectId || undefined } }))
};
