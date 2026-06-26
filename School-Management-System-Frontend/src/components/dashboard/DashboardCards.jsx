import { Grid } from "@mui/material";
import { useEffect, useState } from "react";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";

import SummaryCard from "../common/SummaryCard";

import {
  studentApi,
  subjectApi,
  examApi,
  markApi
} from "../../api/services";

export default function DashboardCards() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    totalExams: 0,
    totalMarks: 0
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [students, subjects, exams, marks] =
          await Promise.all([
            studentApi.getAll(),
            subjectApi.getAll(),
            examApi.getAll(),
            markApi.getAll()
          ]);

        setStats({
          totalStudents: students.length || 0,
          totalSubjects: subjects.length || 0,
          totalExams: exams.length || 0,
          totalMarks: marks.length || 0
        });
      } catch (error) {
        console.error(error);
      }
    };

    load();
  }, []);

  const cards = [
    {
      title: "Students",
      value: stats.totalStudents,
      description: "Manage all student records",
      icon: (
        <SchoolRoundedIcon
          sx={{
            fontSize: 32,
            color: "#2563eb",
          }}
        />
      ),
      color: "#2563eb",
      path: "/dashboard/students"
    },

    {
      title: "Subjects",
      value: stats.totalSubjects,
      description: "Manage available subjects",
      icon: (
        <MenuBookRoundedIcon
          sx={{
            fontSize: 32,
            color: "#16a34a"
          }}
        />
      ),
      color: "#16a34a",
      path: "/dashboard/subjects"
    },

    {
      title: "Exams",
      value: stats.totalExams,
      description: "View and schedule exams",
      icon: (
        <QuizRoundedIcon
          sx={{
            fontSize: 32,
            color: "#d97706"
          }}
        />
      ),
      color: "#d97706",
      path: "/dashboard/exams"
    },

    {
      title: "Marks",
      value: stats.totalMarks,
      description: "Track student performance",
      icon: (
        <AssessmentRoundedIcon
          sx={{
            fontSize: 32,
            color: "#9333ea"
          }}
        />
      ),
      color: "#9333ea",
      path: "/dashboard/marks"
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{
            xs: 12,
            sm: 6,
            lg: 3
          }}
        >
          <SummaryCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}