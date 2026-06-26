import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import SearchBar from "../../components/common/SearchBar";
import ExamsGrid from "../../components/cards/ExamsGrid";
import LoaderBox from "../../components/common/LoaderBox";
import FormCard from "../../components/forms/FormCard";
import { examApi } from "../../api/services";

function ExamsList() {
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
      const response = await examApi.getAll();

      let exams = [];

      if (Array.isArray(response)) {
        exams = response;
      } else if (Array.isArray(response?.data)) {
        exams = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        exams = response.data.data;
      }

      setItems(exams);
    } catch (error) {
      console.error("Error loading exams:", error);
      setItems([]);
      showPopup("Failed to load exams", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGetExam = () => {
    const value = searchInput.trim().toLowerCase();
    setSearch(value);

    if (!value) {
      showPopup("Showing all exams", "info");
      return;
    }

    const matchedExams = items.filter((item) => {
      const examId = String(item.examId || item.id || "").toLowerCase();
      const examName = String(item.examName || "").toLowerCase();

      return examId.includes(value) || examName.includes(value);
    });

    if (matchedExams.length === 0) {
      showPopup("No exam found", "warning");
    } else {
      showPopup(`${matchedExams.length} exam(s) found`, "success");
    }
  };

  const filteredItems = items.filter((item) => {
    if (!search) {
      return true;
    }

    const examId = String(item.examId || item.id || "").toLowerCase();
    const examName = String(item.examName || "").toLowerCase();

    return examId.includes(search) || examName.includes(search);
  });

  const handleDelete = async (id) => {
    try {
      const response = await examApi.remove(id);

      const successMessage =
        response?.message ||
        response?.msg ||
        response?.data?.message ||
        "Exam deleted successfully";

      showPopup(successMessage, "success");
      fetchItems();
    } catch (error) {
      console.error("Error deleting exam:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        responseData?.data ||
        "Unable to delete exam";

      showPopup(
        typeof backendMessage === "string"
          ? backendMessage
          : "Unable to delete exam",
        "error"
      );
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title="Exams"
          subtitle="Manage exams"
        />

        <FormCard>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{ width: "100%" }}
          >
            <SearchBar
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by exam ID or exam name"
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
                onClick={handleGetExam}
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
                Get Exam
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/exams/add")}
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
                Add Exam
              </Button>
            </Stack>
          </Stack>
        </FormCard>

        {loading ? (
          <LoaderBox />
        ) : (
          <ExamsGrid
            rows={filteredItems}
            onView={(id) => navigate(`/dashboard/exams/view/${id}`)}
            onEdit={(id) => navigate(`/dashboard/exams/edit/${id}`)}
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

export default ExamsList;