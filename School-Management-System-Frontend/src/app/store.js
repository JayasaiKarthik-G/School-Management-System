import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import studentReducer from "../features/students/studentSlice";
import subjectReducer from "../features/subjects/subjectSlice";
import examReducer from "../features/exams/examSlice";
import markReducer from "../features/marks/markSlice";
import performanceReducer from "../features/performance/performanceSlice";
import reportReducer from "../features/reports/reportSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    students: studentReducer,
    subjects: subjectReducer,
    exams: examReducer,
    marks: markReducer,
    performance: performanceReducer,
    reports: reportReducer
  }
});
