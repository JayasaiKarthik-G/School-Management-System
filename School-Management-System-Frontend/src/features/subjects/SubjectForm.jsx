import { Alert, Autocomplete, Button, Snackbar, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import { subjectApi } from "../../api/services";

function SubjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    description: ""
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
      const data = await subjectApi.getById(id);

      setFormData({
        subjectName: data?.subjectName || "",
        subjectCode: data?.subjectCode || "",
        description: data?.description || ""
      });
    } catch (error) {
      console.error("Error loading subject:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        "Failed to load subject details";

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
      subjectName: formData.subjectName,
      subjectCode: formData.subjectCode,
      description: formData.description
    };

    try {
      const response = isEdit
        ? await subjectApi.update(id, payload)
        : await subjectApi.create(payload);

      const successMessage =
        response?.message ||
        response?.msg ||
        response?.data?.message ||
        (isEdit
          ? "Subject updated successfully"
          : "Subject added successfully");

      showPopup(successMessage, "success");

      setTimeout(() => {
        navigate("/dashboard/subjects");
      }, 1000);
    } catch (error) {
      console.error("Error saving subject:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        (isEdit
          ? "Failed to update subject"
          : "Failed to add subject");

      showPopup(backendMessage, "error");
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title={isEdit ? "Edit Subject" : "Add Subject"}
          subtitle="Fill the form and save"
        />

        <FormCard onSubmit={handleSubmit}>
          <Autocomplete
            freeSolo
            options={[
              "Mathematics",
              "Physics",
              "Chemistry",
              "Biology",
              "Botany",
              "Zoology"
            ]}
            value={formData.subjectName}
            onInputChange={(_, value) => handleChange("subjectName", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Subject Name"
                fullWidth
              />
            )}
          />

          <TextField
            label="Subject Code"
            value={formData.subjectCode}
            onChange={(event) => handleChange("subjectCode", event.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(event) => handleChange("description", event.target.value)}
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

export default SubjectForm;