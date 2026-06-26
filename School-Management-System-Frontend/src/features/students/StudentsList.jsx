import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import SearchBar from "../../components/common/SearchBar";
import StudentsGrid from "../../components/cards/StudentsGrid";
import { studentApi } from "../../api/services";
import LoaderBox from "../../components/common/LoaderBox";
import FormCard from "../../components/forms/FormCard";

function StudentsList() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [popup, setPopup] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    fetchItems();
  }, []);

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

  const fetchItems = async () => {
    setLoading(true);

    try {
      const response = await studentApi.getAll();

      console.log("Students API response:", response);

      let students = [];

      if (Array.isArray(response)) {
        students = response;
      } else if (Array.isArray(response?.data)) {
        students = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        students = response.data.data;
      }

      setItems(students);
    } catch (error) {
      console.error("Error loading students:", error);
      setItems([]);
      showPopup("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGetStudent = () => {
    const value = searchInput.trim().toLowerCase();
    setSearch(value);

    if (!value) {
      showPopup("Showing all students", "info");
      return;
    }

    const matchedStudents = items.filter((item) => {
      const studentId = String(item.studentId || item.id || "").toLowerCase();
      const firstName = String(item.firstName || "").toLowerCase();
      const lastName = String(item.lastName || "").toLowerCase();
      const fullName = String(item.fullName || "").toLowerCase();

      return (
        studentId.includes(value) ||
        firstName.includes(value) ||
        lastName.includes(value) ||
        fullName.includes(value)
      );
    });

    if (matchedStudents.length === 0) {
      showPopup("No student found", "warning");
    } else {
      showPopup(`${matchedStudents.length} student(s) found`, "success");
    }
  };

  const filteredItems = items.filter((item) => {
    if (!search) {
      return true;
    }

    const studentId = String(item.studentId || item.id || "").toLowerCase();
    const firstName = String(item.firstName || "").toLowerCase();
    const lastName = String(item.lastName || "").toLowerCase();
    const fullName = String(item.fullName || "").toLowerCase();

    return (
      studentId.includes(search) ||
      firstName.includes(search) ||
      lastName.includes(search) ||
      fullName.includes(search)
    );
  });

  const handleDelete = async (id) => {
    try {
      const response = await studentApi.remove(id);
      console.log("Delete student response:", response);

      fetchItems();

      const successMessage =
        response?.message ||
        response?.msg ||
        response?.data?.message ||
        "Student deleted successfully";

      showPopup(successMessage, "success");
    } catch (error) {
      console.error("Error deleting student:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        responseData?.data ||
        "Unable to delete student";

      showPopup(
        typeof backendMessage === "string"
          ? backendMessage
          : "Unable to delete student",
        "error"
      );
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageTitle title="Students" subtitle="Manage students" />

        <FormCard>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
          >
            <SearchBar
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by student ID or name"
              sx={{
                flex: 1
              }}
            />

            <Stack
              direction="row"
              spacing={2}
              sx={{
                width: { xs: "100%", sm: "auto" }
              }}
            >
              <Button
                variant="outlined"
                onClick={handleGetStudent}
                sx={{
                  flex: { xs: 1, sm: "unset" },
                  minWidth: { xs: 0, sm: "150px" },
                  height: { xs: "44px", sm: "56px" },
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  color: "#f8fafc",
                  borderColor: "#334155",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    borderColor: "#475569",
                    backgroundColor: "#1e293b"
                  }
                }}
              >
                Get Student
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/students/add")}
                sx={{
                  flex: { xs: 1, sm: "unset" },
                  minWidth: { xs: 0, sm: "170px" },
                  height: { xs: "44px", sm: "56px" },
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 2,
                  backgroundColor: "#2563eb",
                  boxShadow: "none",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    backgroundColor: "#1d4ed8",
                    boxShadow: "none"
                  }
                }}
              >
                Add Student
              </Button>
            </Stack>
          </Stack>
        </FormCard>

        {loading ? (
          <LoaderBox />
        ) : (
          <StudentsGrid
            rows={filteredItems}
            onView={(id) => navigate(`/dashboard/students/view/${id}`)}
            onEdit={(id) => navigate(`/dashboard/students/edit/${id}`)}
            onDelete={handleDelete}
          />
        )}
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

export default StudentsList;