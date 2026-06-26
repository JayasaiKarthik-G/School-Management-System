import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import SearchBar from "../../components/common/SearchBar";
import SubjectsGrid from "../../components/cards/SubjectsGrid";
import { subjectApi } from "../../api/services";
import LoaderBox from "../../components/common/LoaderBox";
import FormCard from "../../components/forms/FormCard";

function SubjectsList() {
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
      const response = await subjectApi.getAll();

      console.log("Subjects API response:", response);

      let subjects = [];

      if (Array.isArray(response)) {
        subjects = response;
      } else if (Array.isArray(response?.data)) {
        subjects = response.data;
      } else if (Array.isArray(response?.data?.data)) {
        subjects = response.data.data;
      }

      setItems(subjects);
    } catch (error) {
      console.error("Error loading subjects:", error);
      setItems([]);
      showPopup("Failed to load subjects", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGetSubject = () => {
    const value = searchInput.trim().toLowerCase();
    setSearch(value);

    if (!value) {
      showPopup("Showing all subjects", "info");
      return;
    }

    const matchedSubjects = items.filter((item) => {
      const subjectId = String(item.subjectId || item.id || "").toLowerCase();
      const subjectName = String(item.subjectName || "").toLowerCase();

      return (
        subjectId.includes(value) ||
        subjectName.includes(value)
      );
    });

    if (matchedSubjects.length === 0) {
      showPopup("No subject found", "warning");
    } else {
      showPopup(`${matchedSubjects.length} subject(s) found`, "success");
    }
  };

  const filteredItems = items.filter((item) => {
    if (!search) {
      return true;
    }

    const subjectId = String(item.subjectId || item.id || "").toLowerCase();
    const subjectName = String(item.subjectName || "").toLowerCase();

    return (
      subjectId.includes(search) ||
      subjectName.includes(search)
    );
  });

  const handleDelete = async (id) => {
    try {
      const response = await subjectApi.remove(id);
      console.log("Delete subject response:", response);

      fetchItems();

      const successMessage =
        response?.message ||
        response?.msg ||
        response?.data?.message ||
        "Subject deleted successfully";

      showPopup(successMessage, "success");
    } catch (error) {
      console.error("Error deleting subject:", error);

      const responseData = error?.response?.data;

      const backendMessage =
        responseData?.message ||
        responseData?.msg ||
        responseData?.error ||
        responseData?.details ||
        responseData?.data ||
        "Unable to delete subject";

      showPopup(
        typeof backendMessage === "string"
          ? backendMessage
          : "Unable to delete subject",
        "error"
      );
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageTitle title="Subjects" subtitle="Manage subjects" />

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
              placeholder="Search by subject ID or name"
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
                onClick={handleGetSubject}
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
                Get Subject
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/dashboard/subjects/add")}
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
                Add Subject
              </Button>
            </Stack>
          </Stack>
        </FormCard>

        {loading ? (
          <LoaderBox />
        ) : (
          <SubjectsGrid
            rows={filteredItems}
            onView={(id) => navigate(`/dashboard/subjects/view/${id}`)}
            onEdit={(id) => navigate(`/dashboard/subjects/edit/${id}`)}
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

export default SubjectsList;