import { Navigate, Route, Routes } from "react-router-dom";
import Login from "../features/auth/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import DashboardHome from "../features/dashboard/DashboardHome";
import StudentsList from "../features/students/StudentsList";
import StudentForm from "../features/students/StudentForm";
import StudentView from "../features/students/StudentView";
import SubjectsList from "../features/subjects/SubjectsList";
import SubjectForm from "../features/subjects/SubjectForm";
import SubjectView from "../features/subjects/SubjectView";
import ExamsList from "../features/exams/ExamsList";
import ExamForm from "../features/exams/ExamForm";
import ExamView from "../features/exams/ExamView";
import MarksList from "../features/marks/MarksList";
import MarkForm from "../features/marks/MarkForm";
import MarkView from "../features/marks/MarkView";
import StudentPerformance from "../features/performance/StudentPerformance";
import StudentExamPerformance from "../features/performance/StudentExamPerformance";
import SubjectAverages from "../features/performance/SubjectAverages";
import TopPerformers from "../features/performance/TopPerformers";
import PassFailReport from "../features/performance/PassFailReport";
import ExamLeaderboard from "../features/reports/ExamLeaderboard";
import ExamSummary from "../features/reports/ExamSummary";
import StudentCompare from "../features/reports/StudentCompare";
import StudentTrend from "../features/reports/StudentTrend";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />

        <Route path="students" element={<StudentsList />} />
        <Route path="students/add" element={<StudentForm />} />
        <Route path="students/edit/:id" element={<StudentForm />} />
        <Route path="students/view/:id" element={<StudentView />} />

        <Route path="subjects" element={<SubjectsList />} />
        <Route path="subjects/add" element={<SubjectForm />} />
        <Route path="subjects/edit/:id" element={<SubjectForm />} />
        <Route path="subjects/view/:id" element={<SubjectView />} />

        <Route path="exams" element={<ExamsList />} />
        <Route path="exams/add" element={<ExamForm />} />
        <Route path="exams/edit/:id" element={<ExamForm />} />
        <Route path="exams/view/:id" element={<ExamView />} />

        <Route path="marks" element={<MarksList />} />
        <Route path="marks/add" element={<MarkForm />} />
        <Route path="marks/edit/:id" element={<MarkForm />} />
        <Route path="marks/view/:id" element={<MarkView />} />

        <Route path="performance/student" element={<StudentPerformance />} />
        <Route path="performance/student-exam" element={<StudentExamPerformance />} />
        <Route path="performance/subject-averages" element={<SubjectAverages />} />
        <Route path="performance/top-performers" element={<TopPerformers />} />
        <Route path="performance/pass-fail" element={<PassFailReport />} />

        <Route path="reports/exam-leaderboard" element={<ExamLeaderboard />} />
        <Route path="reports/exam-summary" element={<ExamSummary />} />
        <Route path="reports/student-compare" element={<StudentCompare />} />
        <Route path="reports/student-trend" element={<StudentTrend />} />
      </Route>
    </Routes>
  );
}
