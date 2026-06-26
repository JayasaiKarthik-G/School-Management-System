import { Alert, Button, Snackbar, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import { studentApi } from "../../api/services";

function StudentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    enrollmentYear: ""
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
      const data = await studentApi.getById(id);

      setFormData({
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        enrollmentYear: data?.enrollmentYear || ""
      });
    } catch (error) {
      console.error("Error loading student:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load student details";

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
      firstName: formData.firstName,
      lastName: formData.lastName,
      enrollmentYear: Number(formData.enrollmentYear)
    };

    try {
      const response = isEdit
        ? await studentApi.update(id, payload)
        : await studentApi.create(payload);

      const successMessage =
        response?.message ||
        response?.msg ||
        response?.data?.message ||
        (isEdit
          ? "Student updated successfully"
          : "Student added successfully");

      showPopup(successMessage, "success");

      setTimeout(() => {
        navigate("/dashboard/students");
      }, 1000);
    } catch (error) {
      console.error("Error saving student:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        (isEdit
          ? "Failed to update student"
          : "Failed to add student");

      showPopup(backendMessage, "error");
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title={isEdit ? "Edit Student" : "Add Student"}
          subtitle="Fill the form and save"
        />

        <FormCard onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={(event) =>
              handleChange("firstName", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={(event) =>
              handleChange("lastName", event.target.value)
            }
            fullWidth
          />

          <TextField
            label="Enrollment Year"
            type="number"
            value={formData.enrollmentYear}
            onChange={(event) =>
              handleChange("enrollmentYear", event.target.value)
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

export default StudentForm;