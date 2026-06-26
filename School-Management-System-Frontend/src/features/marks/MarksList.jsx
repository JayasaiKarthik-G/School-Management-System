import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PageTitle from "../../components/common/PageTitle";
import SearchBar from "../../components/common/SearchBar";
import MarksGrid from "../../components/cards/MarksGrid";
import LoaderBox from "../../components/common/LoaderBox";
import FormCard from "../../components/forms/FormCard";
import { markApi } from "../../api/services";

function MarksList() {
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
      const response = await markApi.getAll();

      let marks = [];

      if (Array.isArray(response)) {
        marks = response;
      } else if (Array.isArray(response?.data)) {
        marks = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        marks = response.data.data;
      }

      setItems(marks);
    } catch (error) {
      console.error("Error loading marks:", error);
      setItems([]);
      showPopup("Failed to load marks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGetMarks = () => {
    const value = searchInput.trim().toLowerCase();
    setSearch(value);

    if (!value) {
      showPopup("Showing all marks", "info");
      return;
    }

    const matchedMarks = items.filter((item) => {
      const markId = String(item.markId || item.id || "").toLowerCase();
      const studentName = String(item.student?.fullName || "").toLowerCase();
      const subjectName = String(item.subject?.subjectName || "").toLowerCase();
      const examName = String(item.exam?.examName || "").toLowerCase();
      const score = String(item.score || "").toLowerCase();

      return (
        markId.includes(value) ||
        studentName.includes(value) ||
        subjectName.includes(value) ||
        examName.includes(value) ||
        score.includes(value)
      );
    });

    if (matchedMarks.length === 0) {
      showPopup("No mark found", "warning");
    } else {
      showPopup(`${matchedMarks.length} mark(s) found`, "success");
    }
  };

  const filteredItems = items.filter((item) => {
    if (!search) {
      return true;
    }

    const markId = String(item.markId || item.id || "").toLowerCase();
    const studentName = String(item.student?.fullName || "").toLowerCase();
    const subjectName = String(item.subject?.subjectName || "").toLowerCase();
    const examName = String(item.exam?.examName || "").toLowerCase();
    const score = String(item.score || "").toLowerCase();

    return (
      markId.includes(search) ||
      studentName.includes(search) ||
      subjectName.includes(search) ||
      examName.includes(search) ||
      score.includes(search)
    );
  });

  const handleDelete = async (id) => {
    try {
      const response = await markApi.remove(id);

      const successMessage =
        response?.message ||
        response?.msg ||
        response?.data?.message ||
        "Mark deleted successfully";

      showPopup(successMessage, "success");
      fetchItems();
    } catch (error) {
      console.error("Error deleting mark:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        responseData?.data ||
        "Unable to delete mark";

      showPopup(
        typeof backendMessage === "string"
          ? backendMessage
          : "Unable to delete mark",
        "error"
      );
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageTitle title="Marks" subtitle="Manage marks" />

        {/* Same dark form background pattern */}
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
              placeholder="Search by mark ID, student, subject, exam or score"
              sx={{ flex: 1 }}
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
                onClick={handleGetMarks}
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
                Get Marks
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/marks/add")}
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
                Add Mark
              </Button>
            </Stack>
          </Stack>
        </FormCard>

        {loading ? (
          <LoaderBox />
        ) : (
          <MarksGrid
            rows={filteredItems}
            onView={(id) => navigate(`/dashboard/marks/view/${id}`)}
            onEdit={(id) => navigate(`/dashboard/marks/edit/${id}`)}
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

export default MarksList;