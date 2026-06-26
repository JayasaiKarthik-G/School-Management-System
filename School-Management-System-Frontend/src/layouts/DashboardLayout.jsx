import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GradeIcon from "@mui/icons-material/Grade";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BarChartIcon from "@mui/icons-material/BarChart";
import SummarizeIcon from "@mui/icons-material/Summarize";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const drawerWidth = 270;

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Students", path: "/dashboard/students", icon: <PeopleIcon /> },
  { label: "Subjects", path: "/dashboard/subjects", icon: <MenuBookIcon /> },
  { label: "Exams", path: "/dashboard/exams", icon: <AssignmentIcon /> },
  { label: "Marks", path: "/dashboard/marks", icon: <GradeIcon /> },
  {
    label: "Student Performance",
    path: "/dashboard/performance/student",
    icon: <TrendingUpIcon />
  },
  {
    label: "Student Exam Performance",
    path: "/dashboard/performance/student-exam",
    icon: <BarChartIcon />
  },
  {
    label: "Subject Averages",
    path: "/dashboard/performance/subject-averages",
    icon: <QueryStatsIcon />
  },
  {
    label: "Top Performers",
    path: "/dashboard/performance/top-performers",
    icon: <EmojiEventsIcon />
  },
  {
    label: "Pass / Fail",
    path: "/dashboard/performance/pass-fail",
    icon: <BarChartIcon />
  },
  {
    label: "Exam Leaderboard",
    path: "/dashboard/reports/exam-leaderboard",
    icon: <EmojiEventsIcon />
  },
  {
    label: "Exam Summary",
    path: "/dashboard/reports/exam-summary",
    icon: <SummarizeIcon />
  },
  {
    label: "Student Compare",
    path: "/dashboard/reports/student-compare",
    icon: <CompareArrowsIcon />
  },
  {
    label: "Student Trend",
    path: "/dashboard/reports/student-trend",
    icon: <ShowChartIcon />
  }
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        overflowY: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#334155 #0f172a",
        "&::-webkit-scrollbar": {
          width: "8px"
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#0f172a"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#334155",
          borderRadius: "10px"
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#475569"
        }
      }}
    >
      <Toolbar>
        <SchoolIcon
          sx={{
            color: "#60a5fa",
            fontSize: { xs: 24, sm: 26, md: 28 },
            mr: 1
          }}
        />
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" } }}
        >
          School Admin
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: "#334155" }} />

      <List sx={{ px: 1.5, py: 1,}}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              onClick={() => handleMenuClick(item.path)}
              sx={{
                mb: 1,
                borderRadius: 2,
                px: 1.5,
                py: 1,
                backgroundColor: active ? "#1e293b" : "transparent",
                "&:hover": {
                  backgroundColor: "#1e293b"
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 35,
                  color: active ? "#60a5fa" : "#cbd5e1"
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                      fontWeight: active ? 700 : 500,
                      color: "#f8fafc"
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "#0f172a",
          borderBottom: "1px solid #1e293b"
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { md: "none" }
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" }
              }}
            >
              School Management System
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              color: "#f8fafc",
              borderColor: "#334155",
              minWidth: { xs: "auto", sm: "120px" },
              px: { xs: 1.2, sm: 2 },
              "&:hover": {
                borderColor: "#475569",
                backgroundColor: "#1e293b"
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 }
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #1e293b"
            }
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #1e293b",
              backgroundColor: "#0f172a"
            }
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          p: { xs: 2, sm: 3 },
          mt: 8
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}