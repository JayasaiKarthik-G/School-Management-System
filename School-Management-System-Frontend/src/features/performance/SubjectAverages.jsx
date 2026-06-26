import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import { useEffect, useState } from "react";

import PageTitle from "../../components/common/PageTitle";
import FormCard from "../../components/forms/FormCard";
import LoaderBox from "../../components/common/LoaderBox";
import { performanceApi } from "../../api/services";

function SubjectAverages() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  const [popup, setPopup] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    loadData();
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

  const loadData = async () => {
    setLoading(true);

    try {
      const result = await performanceApi.subjectAverages();

      let finalData = [];

      if (Array.isArray(result)) {
        finalData = result;
      } else if (Array.isArray(result?.data)) {
        finalData = result.data;
      } else if (Array.isArray(result?.data?.data)) {
        finalData = result.data.data;
      }

      setItems(finalData);
      setFilteredItems(finalData);
    } catch (error) {
      console.error("Error loading subject averages:", error);
      setItems([]);
      setFilteredItems([]);
      showPopup("Failed to load subject averages", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGetResults = () => {
    const value = searchInput.trim().toLowerCase();

    if (!value) {
      setFilteredItems(items);
      showPopup("Showing all subject averages", "info");
      return;
    }

    const matchedItems = items.filter((item) => {
      const subjectId = String(item.subjectId ?? "").toLowerCase();
      const subjectName = String(item.subjectName ?? "").toLowerCase();

      return subjectId.includes(value) || subjectName.includes(value);
    });

    setFilteredItems(matchedItems);

    if (matchedItems.length === 0) {
      showPopup("No subject average found", "warning");
    } else {
      showPopup(`${matchedItems.length} subject average(s) found`, "success");
    }
  };

  return (
    <>
      <Stack spacing={3}>
        <PageTitle
          title="Subject Averages"
          subtitle="Average marks by subject"
        />

        <FormCard
          onSubmit={(event) => {
            event.preventDefault();
            handleGetResults();
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="stretch"
            sx={{ width: "100%" }}
          >
            <TextField
              label="Search by Subject ID or Subject Name"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              fullWidth
              sx={{ flex: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                minWidth: { xs: "100%", sm: "180px" },
                height: { xs: "44px", sm: "56px" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                whiteSpace: "nowrap",
                boxShadow: "none",
                backgroundColor: "#2563eb",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                  boxShadow: "none"
                }
              }}
            >
              Get Results
            </Button>
          </Stack>
        </FormCard>

        {loading ? (
          <LoaderBox />
        ) : filteredItems.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 3
            }}
          >
            <Typography sx={{ color: "#cbd5e1" }}>
              No subject averages found
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)"
              },
              gap: 3
            }}
          >
            {filteredItems.map((item) => (
              <Paper
                key={item.subjectId}
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 3
                }}
              >
                <Stack spacing={2}>
                  {/* Subject Header */}
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <MenuBookOutlinedIcon sx={{ color: "#60a5fa" }} />
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#f8fafc",
                          fontWeight: 700
                        }}
                      >
                        {item.subjectName || "Subject Name"}
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        color: "#94a3b8",
                        fontSize: "0.95rem"
                      }}
                    >
                      Subject ID: {item.subjectId ?? "-"}
                    </Typography>
                  </Stack>

                  {/* Top summary chips */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    flexWrap="wrap"
                  >
                    <Chip
                      icon={
                        <TrendingUpOutlinedIcon
                          sx={{ color: "#ffffff !important" }}
                        />
                      }
                      label={`Average: ${Number(item.averageScore ?? 0).toFixed(2)}`}
                      sx={{
                        backgroundColor: "#1d4ed8",
                        color: "#ffffff",
                        fontSize: "0.75rem",
                        fontWeight: 600
                      }}
                    />

                    <Chip
                      icon={
                        <NumbersOutlinedIcon
                          sx={{ color: "#f8fafc !important" }}
                        />
                      }
                      label={`Marks Recorded: ${item.totalMarksRecorded ?? 0}`}
                      sx={{
                        backgroundColor: "#1e293b",
                        color: "#f8fafc",
                        fontSize: "0.75rem",
                        fontWeight: 600
                      }}
                    />
                  </Stack>

                  {/* Details boxes */}
                  <Stack spacing={1.5}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#111827",
                        border: "1px solid #1f2937"
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <ArrowUpwardOutlinedIcon sx={{ color: "#22c55e" }} />
                        <Box>
                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.85rem"
                            }}
                          >
                            Highest Score
                          </Typography>
                          <Typography
                            sx={{
                              color: "#f8fafc",
                              fontWeight: 700,
                              fontSize: "1.05rem"
                            }}
                          >
                            {item.highestScore ?? "-"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#111827",
                        border: "1px solid #1f2937"
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <ArrowDownwardOutlinedIcon sx={{ color: "#f87171" }} />
                        <Box>
                          <Typography
                            sx={{
                              color: "#94a3b8",
                              fontSize: "0.85rem"
                            }}
                          >
                            Lowest Score
                          </Typography>
                          <Typography
                            sx={{
                              color: "#f8fafc",
                              fontWeight: 700,
                              fontSize: "1.05rem"
                            }}
                          >
                            {item.lowestScore ?? "-"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Box>
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

export default SubjectAverages;