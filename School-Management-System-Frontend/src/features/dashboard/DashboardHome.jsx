import { Stack } from "@mui/material";

import PageTitle from "../../components/common/PageTitle";
import DashboardCards from "../../components/dashboard/DashboardCards";

export default function DashboardHome() {
  return (
    <Stack spacing={3}>
      <PageTitle
        title="Dashboard Overview"
        subtitle="Welcome to the School Management System"
      />

      <DashboardCards />
    </Stack>
  );
}