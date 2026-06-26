package com.spring_boot.dto.response;

public class MarkResponse {

    private Integer markId;
    private StudentRef student;
    private SubjectRef subject;
    private ExamRef exam;
    private Integer score;

    // No-args constructor
    public MarkResponse() {
    }

    // All-args constructor
    public MarkResponse(Integer markId, StudentRef student,
                        SubjectRef subject, ExamRef exam, Integer score) {
        this.markId = markId;
        this.student = student;
        this.subject = subject;
        this.exam = exam;
        this.score = score;
    }

    // Getters and Setters

    public Integer getMarkId() {
        return markId;
    }

    public void setMarkId(Integer markId) {
        this.markId = markId;
    }

    public StudentRef getStudent() {
        return student;
    }

    public void setStudent(StudentRef student) {
        this.student = student;
    }

    public SubjectRef getSubject() {
        return subject;
    }

    public void setSubject(SubjectRef subject) {
        this.subject = subject;
    }

    public ExamRef getExam() {
        return exam;
    }

    public void setExam(ExamRef exam) {
        this.exam = exam;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    // -------------------------------------------------------
    // Nested Classes
    // -------------------------------------------------------

    public static class StudentRef {

        private Integer studentId;
        private String fullName;

        public StudentRef() {
        }

        public StudentRef(Integer studentId, String fullName) {
            this.studentId = studentId;
            this.fullName = fullName;
        }

        public Integer getStudentId() {
            return studentId;
        }

        public void setStudentId(Integer studentId) {
            this.studentId = studentId;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }
    }

    public static class SubjectRef {

        private Integer subjectId;
        private String subjectName;

        public SubjectRef() {
        }

        public SubjectRef(Integer subjectId, String subjectName) {
            this.subjectId = subjectId;
            this.subjectName = subjectName;
        }

        public Integer getSubjectId() {
            return subjectId;
        }

        public void setSubjectId(Integer subjectId) {
            this.subjectId = subjectId;
        }

        public String getSubjectName() {
            return subjectName;
        }

        public void setSubjectName(String subjectName) {
            this.subjectName = subjectName;
        }
    }

    public static class ExamRef {

        private Integer examId;
        private String examName;

        public ExamRef() {
        }

        public ExamRef(Integer examId, String examName) {
            this.examId = examId;
            this.examName = examName;
        }

        public Integer getExamId() {
            return examId;
        }

        public void setExamId(Integer examId) {
            this.examId = examId;
        }

        public String getExamName() {
            return examName;
        }

        public void setExamName(String examName) {
            this.examName = examName;
        }
    }
}