import { Alert, Button, Snackbar, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import { examApi } from "../../api/services";

function ExamForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    examName: "",
    examDate: "",
    examType: ""
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
      const data = await examApi.getById(id);

      setFormData({
        examName: data?.examName || "",
        examDate: data?.examDate || "",
        examType: data?.examType || ""
      });
    } catch (error) {
      console.error("Error loading exam:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load exam details";

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
      examName: formData.examName,
      examDate: formData.examDate
    };

    try {
      const response = isEdit
        ? await examApi.update(id, payload)
        : await examApi.create(payload);

      const successMessage =
        response?.message ||
        response?.msg ||
        response?.data?.message ||
        (isEdit ? "Exam updated successfully" : "Exam added successfully");

      showPopup(successMessage, "success");

      setTimeout(() => {
        navigate("/dashboard/exams");
      }, 1000);
    } catch (error) {
      console.error("Error saving exam:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        (isEdit ? "Failed to update exam" : "Failed to add exam");

      showPopup(backendMessage, "error");
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title={isEdit ? "Edit Exam" : "Add Exam"}
          subtitle="Fill the form and save"
        />

        <FormCard onSubmit={handleSubmit}>
          <TextField
            label="Exam Name"
            value={formData.examName}
            onChange={(event) =>
              handleChange("examName", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Exam Date (DD-MM-YYYY)"
            value={formData.examDate}
            onChange={(event) =>
              handleChange("examDate", event.target.value)
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Exam Type"
            value={formData.examType}
            onChange={(event) =>
              handleChange("examType", event.target.value)
            }
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

export default ExamForm;