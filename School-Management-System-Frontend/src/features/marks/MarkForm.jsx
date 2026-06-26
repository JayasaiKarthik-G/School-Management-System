import { Alert, Button, Snackbar, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import { markApi } from "../../api/services";

function MarkForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    studentId: "",
    subjectId: "",
    examId: "",
    score: ""
  });

  const [popup, setPopup] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    if (isEdit) {
      loadItem();
    }
  }, [id]);

  const showPopup = (message, severity = "success") => {
    setPopup({
      open: true,
      message,
      severity
    });
  };

  const handleClosePopup = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setPopup((prev) => ({
      ...prev,
      open: false
    }));
  };

  const loadItem = async () => {
    try {
      const data = await markApi.getById(id);

      setFormData({
        studentId: data?.student?.studentId || data?.studentId || "",
        subjectId: data?.subject?.subjectId || data?.subjectId || "",
        examId: data?.exam?.examId || data?.examId || "",
        score: data?.score || ""
      });
    } catch (error) {
      console.error("Error loading mark:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load mark details";

      showPopup(backendMessage, "error");
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      studentId: Number(formData.studentId),
      subjectId: Number(formData.subjectId),
      examId: Number(formData.examId),
      score: Number(formData.score)
    };

    try {
      const response = isEdit
        ? await markApi.update(id, payload)
        : await markApi.create(payload);

      const successMessage =
        response?.message ||
        response?.msg ||
        response?.data?.message ||
        (isEdit ? "Mark updated successfully" : "Mark added successfully");

      showPopup(successMessage, "success");

      setTimeout(() => {
        navigate("/dashboard/marks");
      }, 1000);
    } catch (error) {
      console.error("Error saving mark:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        (isEdit ? "Failed to update mark" : "Failed to add mark");

      showPopup(backendMessage, "error");
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title={isEdit ? "Edit Mark" : "Add Mark"}
          subtitle="Fill the form and save"
        />

        <FormCard onSubmit={handleSubmit}>
          <TextField
            label="Student ID"
            type="number"
            value={formData.studentId}
            onChange={(event) => handleChange("studentId", event.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Subject ID"
            type="number"
            value={formData.subjectId}
            onChange={(event) => handleChange("subjectId", event.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Exam ID"
            type="number"
            value={formData.examId}
            onChange={(event) => handleChange("examId", event.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Score"
            type="number"
            value={formData.score}
            onChange={(event) => handleChange("score", event.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Status"
            value={formData.status}
            onChange={(event) => handleChange("status", event.target.value)}
            fullWidth
          />

          <Button type="submit" variant="contained">
            {isEdit ? "Update" : "Save"}
          </Button>
        </FormCard>
      </Stack>

      <Snackbar
        open={popup.open}
        autoHideDuration={3000}
        onClose={handleClosePopup}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClosePopup}
          severity={popup.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {popup.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MarkForm;