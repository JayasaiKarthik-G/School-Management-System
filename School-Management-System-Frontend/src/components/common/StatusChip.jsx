import { Chip } from "@mui/material";

function StatusChip({ label }) {
  const isPass =
    String(label).toLowerCase() === "pass" ||
    String(label).toLowerCase() === "improving";

  return (
    <Chip
      label={label}
      color={isPass ? "success" : "error"}
      size="small"
    />
  );
}

export default StatusChip;